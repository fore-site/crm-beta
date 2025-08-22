// File: server.js
// This is the main server file. It sets up the Express server and API endpoints.
// Save this as `server.js` in the same directory.

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

// Import messaging libraries
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const TelegramBot = require('node-telegram-bot-api');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// MongoDB connection
const dbConnectionString = process.env.DB_CONNECTION_STRING;

mongoose
    .connect(dbConnectionString)
    .then(() => console.log('MongoDB connected successfully'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Define Schemas and Models
const clientSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    createdAt: { type: Date, default: Date.now },
});

const Client = mongoose.model('Client', clientSchema);

const campaignSchema = new mongoose.Schema({
    campaignName: String,
    advertTitle: String,
    message: String,
    imageUrl: String,
    status: { type: String, default: 'draft' },
    createdAt: { type: Date, default: Date.now },
    sentAt: Date,
});

const Campaign = mongoose.model('Campaign', campaignSchema);

// --- API Routes for Clients ---
app.get('/api/clients', async (req, res) => {
    try {
        const clients = await Client.find({});
        res.json(clients);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/clients', async (req, res) => {
    const client = new Client({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
    });
    try {
        const newClient = await client.save();
        res.status(201).json(newClient);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// NEW: Update a client by ID
app.put('/api/clients/:id', async (req, res) => {
    try {
        const updatedClient = await Client.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedClient)
            return res.status(404).json({ message: 'Client not found' });
        res.json(updatedClient);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// NEW: Delete a client by ID
app.delete('/api/clients/:id', async (req, res) => {
    try {
        const deletedClient = await Client.findByIdAndDelete(req.params.id);
        if (!deletedClient)
            return res.status(404).json({ message: 'Client not found' });
        res.json({ message: 'Client deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- API Routes for Campaigns ---
app.get('/api/campaigns', async (req, res) => {
    try {
        const campaigns = await Campaign.find({});
        res.json(campaigns);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/campaigns', async (req, res) => {
    const campaign = new Campaign({
        campaignName: req.body.campaignName,
        advertTitle: req.body.advertTitle,
        message: req.body.message,
        imageUrl: req.body.imageUrl,
        status: 'draft',
    });
    try {
        const newCampaign = await campaign.save();
        res.status(201).json(newCampaign);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.put('/api/campaigns/:id', async (req, res) => {
    try {
        const updatedCampaign = await Campaign.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedCampaign)
            return res.status(404).json({ message: 'Campaign not found' });
        res.json(updatedCampaign);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.delete('/api/campaigns/:id', async (req, res) => {
    try {
        const deletedCampaign = await Campaign.findByIdAndDelete(req.params.id);
        if (!deletedCampaign)
            return res.status(404).json({ message: 'Campaign not found' });
        res.json({ message: 'Campaign deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- NEW API Routes for Sending Adverts ---

// Email transporter setup (using Nodemailer)
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE_PROVIDER,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

// SMS client setup (using Twilio)
const twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

// Telegram bot setup
const telegramBot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
    polling: false,
});

app.post('/api/send/ad', async (req, res) => {
    const { campaignId } = req.body;

    try {
        // Fetch campaign and all clients
        const campaign = await Campaign.findById(campaignId);
        const clients = await Client.find({});

        if (!campaign || !clients.length) {
            return res
                .status(404)
                .json({
                    message: 'Campaign not found or no clients to send to.',
                });
        }

        // Process each client
        for (const client of clients) {
            // 1. Send Email
            try {
                const emailOptions = {
                    from: process.env.EMAIL_USER,
                    to: client.email,
                    subject: campaign.advertTitle,
                    // Use a public URL for the image
                    html: `
            <h3>${campaign.advertTitle}</h3>
            <img src="${
                campaign.imageUrl ||
                'https://placehold.co/600x400/94A3B8/FFF?text=Image+Placeholder'
            }" alt="Advert Image" style="width:100%; max-width:600px; display:block; margin-bottom: 20px;" />
            <p>${campaign.message}</p>
          `,
                };
                await transporter.sendMail(emailOptions);
            } catch (emailErr) {
                console.error(
                    `Error sending email to ${client.email}:`,
                    emailErr
                );
            }

            // 2. Send SMS (Twilio)
            // This part is now wrapped in a try-catch block
            try {
                // Note: SMS doesn't support images or rich formatting.
                await twilioClient.messages.create({
                    body: `${campaign.advertTitle}\n\n${campaign.message}`,
                    from: process.env.TWILIO_PHONE_NUMBER,
                    to: client.phone,
                });
            } catch (smsErr) {
                // Log the error and continue to the next client/message type
                console.error(
                    `Error sending SMS to ${client.phone}:`,
                    smsErr.message
                );
                // The loop continues, fulfilling the user's request
            }

            // 3. Send Telegram message
            try {
                // Note: This sends to a predefined chat ID, not per client. You can iterate
                // over client phone numbers if you have a way to map them to Telegram IDs.
                const telegramMessage = `${campaign.advertTitle}\n\n${campaign.message}`;
                if (campaign.imageUrl) {
                    await telegramBot.sendPhoto(
                        process.env.TELEGRAM_CHAT_ID,
                        campaign.imageUrl,
                        {
                            caption: telegramMessage,
                        }
                    );
                } else {
                    await telegramBot.sendMessage(
                        process.env.TELEGRAM_CHAT_ID,
                        telegramMessage
                    );
                }
            } catch (telegramErr) {
                console.error(
                    `Error sending Telegram message for campaign ${campaign.campaignName}:`,
                    telegramErr
                );
            }
        }

        // Update campaign status
        const updatedCampaign = await Campaign.findByIdAndUpdate(
            campaignId,
            { status: 'sent', sentAt: new Date() },
            { new: true }
        );

        res.json({
            message: 'Campaign sent successfully!',
            campaign: updatedCampaign,
        });
    } catch (err) {
        console.error('Error sending campaign:', err);
        res.status(500).json({
            message: 'Failed to send campaign.',
            error: err.message,
        });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
