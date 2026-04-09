const express = require('express');
const app = express();
const dbconnect = require("./mongo.js"); // Assuming this file handles MongoDB connection
const Item = require('./item.js');

const bodyParser = require('body-parser');

// Middleware to parse JSON bodies
app.use(express.urlencoded({extended:false}))
app.use(bodyParser.json());

// Sample MongoDB schema and model

// Route to get all items
app.get('/items', async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/insert', async (req, res) => {
    try {  
        // Check for required fields
        if (!req.body.name) {
            return res.status(400).json({ message: 'Name is required' });
        }
        if (!req.body.description) {
            return res.status(400).json({ message: 'Description is required' });
        }

        // Create a new item only if both fields are present
        const newItem = await Item.create({
            name: req.body.name,
            description: req.body.description,
            // Add other fields as needed
        });

        return res.status(200).json({ msg: 'success' });
    } catch (err) {
        // Handle any other errors
        res.status(400).json({ message: err.message });
    }
});

  

// Route to update an existing item
app.put('/items/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Update the item properties
        item.name = req.body.name || item.name;
        item.description = req.body.description || item.description;
        // Update other fields as needed

        const updatedItem = await item.save();
        res.json(updatedItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Connect to MongoDB and start server
dbconnect().then(() => {
    app.listen(3000, () => {
        console.log('Server started on port 3000');
    });
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});
