const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;

// Configure Multer to handle file uploads
const storage = multer.diskStorage({
    destination: './uploads', // set your upload directory
    filename: (req, file, callback) => {
        callback(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

const singleFileUpload = multer({ storage: storage }).single('image');
const multiFileUpload = multer({ storage: storage }).array('images');

// Serve uploaded files statically (optional)
app.use('/uploads', express.static('uploads'));

// Define a route for handling single image upload
app.post('/upload', (req, res) => {
    singleFileUpload(req, res, (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        // Image uploaded successfully
        const imagePath = `http://localhost:${port}/uploads/${req.file.filename}`;
        res.json({ imagePath });
    });
});

// Define a route for handling multiple images upload
app.post('/uploads', (req, res) => {
    multiFileUpload(req, res, (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        if (req.files && req.files.length > 0) {
            // Images uploaded successfully
            const imagePaths = req.files.map(file => `http://localhost:${port}/uploads/${file.filename}`);
            res.json({ imagePaths });
        } else {
            // No files provided
            res.status(400).json({ error: 'No files uploaded' });
        }
    });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
