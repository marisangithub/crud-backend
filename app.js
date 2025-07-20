// Import modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Initialize express app
const app = express();
app.use(express.json());
app.use(cors());

// Port configuration
const port = process.env.PORT || 4000;

// MongoDB connection
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => console.error('❌ MongoDB connection failed:', err));

// Schema
const crudSchema = new mongoose.Schema({
    fname: String,
    lname: String,
    email: String,
    phone: String,
});

// Model
const CrudModel = mongoose.model('Crud', crudSchema);

// Routes

// Create
app.post('/crud', async (req, res) => {
    const { fname, lname, email, phone } = req.body;
    try {
        const newCrud = new CrudModel({ fname, lname, email, phone });
        await newCrud.save();
        res.status(201).json(newCrud);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Read
app.get('/crud', async (req, res) => {
    try {
        const details = await CrudModel.find();
        res.json(details);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update
app.put('/crud/:id', async (req, res) => {
    const { fname, lname, email, phone } = req.body;
    const { id } = req.params;
    try {
        const updatedCrud = await CrudModel.findByIdAndUpdate(
            id,
            { fname, lname, email, phone },
            { new: true }
        );
        if (!updatedCrud) {
            return res.status(404).json({ error: 'Not Found' });
        }
        res.json(updatedCrud);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete
app.delete('/crud/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await CrudModel.findByIdAndDelete(id);
        res.status(204).end();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Default route for health check
app.get('/', (req, res) => {
    res.send('CRUD API is running.');
});

// Listen
app.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
});
