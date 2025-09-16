const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const mongoURI = process.env.DB_CONNECTION_STRING;

// Connect to MongoDB Atlas
mongoose
    .connect(mongoURI)
    .then(() => console.log('Successfully connected to MongoDB Atlas!'))
    .catch((err) => console.error('Connection error', err));

// Define Mongoose Schemas
const communicationHistorySchema = new mongoose.Schema({
    type: { type: String, required: true },
    campaignName: { type: String },
    date: { type: Date, required: true },
    message: { type: String, required: true },
});

const clientSchema = new mongoose.Schema({
    _id: { type: String, default: uuidv4 },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    industry: { type: String },
    notes: { type: String },
    createdAt: { type: Date, default: Date.now },
    communicationHistory: [communicationHistorySchema],
    leadStatus: { type: String, default: 'New Lead' },
});

const campaignSchema = new mongoose.Schema({
    _id: { type: String, default: uuidv4 },
    campaignName: { type: String, required: true },
    advertTitle: { type: String, required: true },
    message: { type: String, required: true },
    imageUrl: { type: String },
    status: { type: String, default: 'draft' },
    createdAt: { type: Date, default: Date.now },
    sentAt: { type: Date },
});

const projectSchema = new mongoose.Schema({
    _id: { type: String, default: uuidv4 },
    projectName: { type: String, required: true },
    projectDescription: { type: String },
    tasks: [String],
    createdAt: { type: Date, default: Date.now },
});

// A simple schema for the sales pipeline with hardcoded statuses.
const salesPipelineSchema = new mongoose.Schema({
    _id: { type: String, default: 'pipeline-document' },
    'New Lead': [Object],
    Contacted: [Object],
    'Proposal Sent': [Object],
    Won: [Object],
    Lost: [Object],
});

// Define Mongoose Models
const Client = mongoose.model('Client', clientSchema);
const Campaign = mongoose.model('Campaign', campaignSchema);
const Project = mongoose.model('Project', projectSchema);
const SalesPipeline = mongoose.model('SalesPipeline', salesPipelineSchema);

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Initialize the sales pipeline document if it doesn't exist
const initializePipeline = async () => {
    const pipelineDoc = await SalesPipeline.findById('pipeline-document');
    if (!pipelineDoc) {
        await new SalesPipeline({ _id: 'pipeline-document' }).save();
        console.log('Sales pipeline document initialized.');
    }
};

// Client Endpoints
app.get('/api/clients', async (req, res) => {
    try {
        const clients = await Client.find().sort({ createdAt: -1 });
        res.json(clients);
    } catch (err) {
        res.status(500).json({
            message: 'Error retrieving clients',
            error: err.message,
        });
    }
});

app.post('/api/clients', async (req, res) => {
    try {
        const newClient = new Client(req.body);
        await newClient.save();

        // Update sales pipeline with the new client
        await SalesPipeline.findByIdAndUpdate('pipeline-document', {
            $push: {
                'New Lead': {
                    id: newClient._id,
                    name: newClient.name,
                    email: newClient.email,
                },
            },
        });

        res.status(201).json(newClient);
    } catch (err) {
        res.status(400).json({
            message: 'Error adding client',
            error: err.message,
        });
    }
});

app.put('/api/clients/:id', async (req, res) => {
    try {
        const updatedClient = await Client.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedClient) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.json(updatedClient);
    } catch (err) {
        res.status(500).json({
            message: 'Error updating client',
            error: err.message,
        });
    }
});

app.delete('/api/clients/:id', async (req, res) => {
    try {
        const deletedClient = await Client.findByIdAndDelete(req.params.id);
        if (!deletedClient) {
            return res.status(404).json({ message: 'Client not found' });
        }

        // Remove from sales pipeline as well
        const pipeline = await SalesPipeline.findById('pipeline-document');
        if (pipeline) {
            for (const status in pipeline._doc) {
                if (status !== '_id' && status !== '__v') {
                    pipeline[status] = pipeline[status].filter(
                        (c) => c.id !== req.params.id
                    );
                }
            }
            await pipeline.save();
        }

        res.status(200).json({ message: 'Client deleted' });
    } catch (err) {
        res.status(500).json({
            message: 'Error deleting client',
            error: err.message,
        });
    }
});

// Campaign Endpoints
app.get('/api/campaigns', async (req, res) => {
    try {
        const campaigns = await Campaign.find().sort({ createdAt: -1 });
        res.json(campaigns);
    } catch (err) {
        res.status(500).json({
            message: 'Error retrieving campaigns',
            error: err.message,
        });
    }
});

app.post('/api/campaigns', async (req, res) => {
    try {
        const newCampaign = new Campaign(req.body);
        await newCampaign.save();
        res.status(201).json(newCampaign);
    } catch (err) {
        res.status(400).json({
            message: 'Error creating campaign',
            error: err.message,
        });
    }
});

app.put('/api/campaigns/:id', async (req, res) => {
    try {
        const updatedCampaign = await Campaign.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedCampaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }
        res.json(updatedCampaign);
    } catch (err) {
        res.status(500).json({
            message: 'Error updating campaign',
            error: err.message,
        });
    }
});

app.delete('/api/campaigns/:id', async (req, res) => {
    try {
        const deletedCampaign = await Campaign.findByIdAndDelete(req.params.id);
        if (!deletedCampaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }
        res.status(200).json({ message: 'Campaign deleted' });
    } catch (err) {
        res.status(500).json({
            message: 'Error deleting campaign',
            error: err.message,
        });
    }
});

app.post('/api/send/ad', async (req, res) => {
    try {
        const { campaignId } = req.body;
        const campaign = await Campaign.findById(campaignId);

        if (!campaign || campaign.status === 'sent') {
            return res
                .status(400)
                .json({ message: 'Campaign not found or already sent' });
        }

        const clients = await Client.find();

        for (const client of clients) {
            const personalizedMessage = campaign.message
                .replace(/\[client\.name\]/g, client.name)
                .replace(/\[client\.email\]/g, client.email);

            console.log(
                `--- Sending Ad: "${campaign.campaignName}" to ${client.name} ---`
            );
            console.log(`Subject: ${campaign.advertTitle}`);
            console.log(`Body: ${personalizedMessage}`);
            console.log('--- End Ad ---');

            // Record this interaction in the client's communication history
            if (client.communicationHistory) {
                client.communicationHistory.push({
                    type: 'Campaign Sent',
                    campaignName: campaign.campaignName,
                    date: new Date(),
                    message: personalizedMessage,
                });
            }
            await client.save();
        }

        // Update campaign status and save
        campaign.status = 'sent';
        campaign.sentAt = new Date();
        await campaign.save();

        res.json({ message: 'Campaign sent successfully', campaign });
    } catch (err) {
        res.status(500).json({
            message: 'Error sending campaign',
            error: err.message,
        });
    }
});

// Sales Pipeline Endpoints
app.get('/api/sales-pipeline', async (req, res) => {
    try {
        const pipeline = await SalesPipeline.findById('pipeline-document');
        res.json(pipeline);
    } catch (err) {
        res.status(500).json({
            message: 'Error retrieving pipeline',
            error: err.message,
        });
    }
});

app.post('/api/sales-pipeline/update', async (req, res) => {
    try {
        const { clientId, fromStatus, toStatus } = req.body;
        const pipeline = await SalesPipeline.findById('pipeline-document');

        if (!pipeline || !pipeline[fromStatus] || !pipeline[toStatus]) {
            return res
                .status(404)
                .json({ message: 'Client or status not found' });
        }

        const clientToMove = pipeline[fromStatus].find(
            (c) => c.id === clientId
        );
        if (!clientToMove) {
            return res
                .status(404)
                .json({ message: 'Client not found in source status' });
        }

        // Remove from old status array and add to new
        const pullFrom = {};
        pullFrom[fromStatus] = { id: clientId };
        const pushTo = {};
        pushTo[toStatus] = clientToMove;

        await SalesPipeline.findByIdAndUpdate('pipeline-document', {
            $pull: pullFrom,
            $push: pushTo,
        });

        // Update the client's leadStatus in the Client collection
        await Client.findByIdAndUpdate(clientId, { leadStatus: toStatus });

        const updatedPipeline = await SalesPipeline.findById(
            'pipeline-document'
        );
        res.json({
            message: 'Pipeline updated successfully',
            pipeline: updatedPipeline,
        });
    } catch (err) {
        res.status(500).json({
            message: 'Error updating pipeline',
            error: err.message,
        });
    }
});

// Projects Endpoints
app.get('/api/projects', async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 });
        res.json(projects);
    } catch (err) {
        res.status(500).json({
            message: 'Error retrieving projects',
            error: err.message,
        });
    }
});

app.post('/api/projects', async (req, res) => {
    try {
        const newProject = new Project(req.body);
        await newProject.save();
        res.status(201).json(newProject);
    } catch (err) {
        res.status(400).json({
            message: 'Error creating project',
            error: err.message,
        });
    }
});

app.put('/api/projects/:id', async (req, res) => {
    try {
        const updatedProject = await Project.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedProject) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json(updatedProject);
    } catch (err) {
        res.status(500).json({
            message: 'Error updating project',
            error: err.message,
        });
    }
});

app.delete('/api/projects/:id', async (req, res) => {
    try {
        const deletedProject = await Project.findByIdAndDelete(req.params.id);
        if (!deletedProject) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(200).json({ message: 'Project deleted' });
    } catch (err) {
        res.status(500).json({
            message: 'Error deleting project',
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
        const salesPipeline = await SalesPipeline.findById('pipeline-document');

        const leadStatusCounts = {};
        if (salesPipeline) {
            for (const status in salesPipeline._doc) {
                if (status !== '_id' && status !== '__v') {
                    leadStatusCounts[status] = salesPipeline[status].length;
                }
            }
        }

        res.json({
            totalClients,
            totalCampaigns,
            sentCampaigns,
            leadStatusCounts,
        });
    } catch (err) {
        res.status(500).json({
            message: 'Error fetching analytics',
            error: err.message,
        });
    }
});

app.listen(PORT, async () => {
    await initializePipeline();
    console.log(`Backend server running on http://localhost:${PORT}`);
    console.log('Remember to run the React frontend as well.');
});
