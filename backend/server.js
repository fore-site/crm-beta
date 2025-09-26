const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Database connection
const MONGODB_URI = process.env.DB_CONNECTION_STRING;

mongoose
    .connect(MONGODB_URI)
    .then(() => console.log('MongoDB connected successfully.'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Mongoose Schema Definitions
const communicationHistorySchema = new mongoose.Schema({
    type: { type: String, required: true, enum: ['email', 'sms', 'note'] },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now },
});

const clientSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phone: { type: String, default: '' },
        industry: { type: String, default: '' },
        notes: { type: String, default: '' },
        leadStatus: { type: String, default: 'New Lead' },
        communicationHistory: [communicationHistorySchema],
        lastContacted: { type: Date },
    },
    { timestamps: true }
);

const campaignSchema = new mongoose.Schema(
    {
        campaignName: { type: String, required: true },
        advertTitle: { type: String, required: true },
        message: { type: String, required: true },
        imageUrl: { type: String, default: '' },
        status: { type: String, default: 'draft' },
        sentAt: { type: Date },
    },
    { timestamps: true }
);

// Mongoose Models
const Client = mongoose.model('Client', clientSchema);
const Campaign = mongoose.model('Campaign', campaignSchema);

// API Endpoints
app.get('/api/clients', async (req, res) => {
    try {
        const clients = await Client.find({});
        res.json(clients);
    } catch (err) {
        res.status(500).json({
            message: 'Failed to fetch clients.',
            error: err.message,
        });
    }
});

app.post('/api/clients', async (req, res) => {
    const client = new Client(req.body);
    try {
        const newClient = await client.save();
        res.status(201).json(newClient);
    } catch (err) {
        res.status(400).json({
            message: 'Failed to add client. Check the provided data.',
            error: err.message,
        });
    }
});

app.put('/api/clients/:id', async (req, res) => {
    try {
        const updatedClient = await Client.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedClient)
            return res.status(404).json({ message: 'Client not found.' });
        res.json(updatedClient);
    } catch (err) {
        res.status(400).json({
            message: 'Failed to update client. Check the provided data.',
            error: err.message,
        });
    }
});

app.delete('/api/clients/:id', async (req, res) => {
    try {
        const client = await Client.findByIdAndDelete(req.params.id);
        if (!client)
            return res.status(404).json({ message: 'Client not found.' });
        res.json({ message: 'Client deleted successfully.' });
    } catch (err) {
        res.status(500).json({
            message: 'Failed to delete client.',
            error: err.message,
        });
    }
});

app.get('/api/campaigns', async (req, res) => {
    try {
        const campaigns = await Campaign.find({});
        res.json(campaigns);
    } catch (err) {
        res.status(500).json({
            message: 'Failed to fetch campaigns.',
            error: err.message,
        });
    }
});

app.post('/api/campaigns', async (req, res) => {
    const campaign = new Campaign(req.body);
    try {
        const newCampaign = await campaign.save();
        res.status(201).json(newCampaign);
    } catch (err) {
        res.status(400).json({
            message: 'Failed to create campaign. Check the provided data.',
            error: err.message,
        });
    }
});

app.put('/api/campaigns/:id', async (req, res) => {
    try {
        const updatedCampaign = await Campaign.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedCampaign)
            return res.status(404).json({ message: 'Campaign not found.' });
        res.json(updatedCampaign);
    } catch (err) {
        res.status(400).json({
            message: 'Failed to update campaign. Check the provided data.',
            error: err.message,
        });
    }
});

app.delete('/api/campaigns/:id', async (req, res) => {
    try {
        const campaign = await Campaign.findByIdAndDelete(req.params.id);
        if (!campaign)
            return res.status(404).json({ message: 'Campaign not found.' });
        res.json({ message: 'Campaign deleted successfully.' });
    } catch (err) {
        res.status(500).json({
            message: 'Failed to delete campaign.',
            error: err.message,
        });
    }
});

// New endpoint to send an ad campaign and update client history
app.post('/api/send/ad', async (req, res) => {
    try {
        const { campaignId, advertTitle, message } = req.body;

        const clients = await Client.find({});
        if (clients.length === 0) {
            return res
                .status(404)
                .json({ message: 'No clients found to send to.' });
        }

        // Update each client's communication history
        for (const client of clients) {
            client.communicationHistory.push({
                type: 'email',
                message: `Sent campaign: "${advertTitle}" - ${message}`,
                date: new Date(),
            });
            client.lastContacted = new Date();
            await client.save();
        }

        // Update the campaign status
        const campaign = await Campaign.findByIdAndUpdate(
            campaignId,
            {
                status: 'sent',
                sentAt: new Date(),
            },
            { new: true }
        );

        if (!campaign)
            return res.status(404).json({ message: 'Campaign not found.' });

        res.json({
            message: 'Campaign sent and client history updated successfully.',
            campaign,
            clients: clients.length,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to send campaign.',
            error: error.message,
        });
    }
});

// Sales Pipeline Endpoints
app.get('/api/sales-pipeline', async (req, res) => {
    try {
        const clients = await Client.find({});
        const pipeline = {
            'New Lead': [],
            Contacted: [],
            'Proposal Sent': [],
            Won: [],
            Lost: [],
        };
        clients.forEach((client) => {
            const status = client.leadStatus || 'New Lead';
            if (pipeline[status]) {
                pipeline[status].push({
                    id: client._id,
                    name: client.name,
                    email: client.email,
                    leadStatus: client.leadStatus,
                });
            }
        });
        res.json(pipeline);
    } catch (err) {
        res.status(500).json({
            message: 'Failed to get sales pipeline data.',
            error: err.message,
        });
    }
});

app.post('/api/sales-pipeline/update', async (req, res) => {
    try {
        const { clientId, toStatus } = req.body;
        const client = await Client.findByIdAndUpdate(
            clientId,
            { leadStatus: toStatus },
            { new: true }
        );
        if (!client)
            return res.status(404).json({ message: 'Client not found.' });
        res.json({ message: 'Pipeline updated successfully.', client });
    } catch (err) {
        res.status(500).json({
            message: 'Failed to update pipeline status.',
            error: err.message,
        });
    }
});

// Analytics Endpoint
app.get('/api/analytics', async (req, res) => {
    try {
        const totalClients = await Client.countDocuments();
        const totalCampaigns = await Campaign.countDocuments();
        const sentCampaigns = await Campaign.countDocuments({ status: 'sent' });
        res.json({ totalClients, totalCampaigns, sentCampaigns });
    } catch (err) {
        res.status(500).json({
            message: 'Failed to fetch analytics.',
            error: err.message,
        });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
