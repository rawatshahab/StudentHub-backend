


const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const Note = require('./models/notes.js');
require('dotenv').config();
const app = express();
app.use(express.urlencoded({ extended: false }));
const port = process.env.PORT || 3000;
const multer = require('multer');
const storage = multer.memoryStorage({
  destination: function (req, file, cb) {
    return cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});
const upload = multer({ storage: storage });
app.use('/uploads', express.static('uploads'));

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
const dbURI = process.env.REACT_APP_DATABASE_URL;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection lost:', err);
});

// Create a new note
app.post('/api/notes', upload.single("fileUrl"), async (req, res) => {
  try {
    console.log("m data hu", req.file);
    const { userId, subjectName, semester, year, course, title } = req.body;

    const newNote = new Note({
      title,
      subjectName,
      semester,
      year,
      course,
      userId,
      file: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
        originalName: req.file.filename,
      },
    });
    await newNote.save();
    res.status(201).json({ message: 'Note saved successfully', note: newNote });
  } catch (err) {
    console.log("error saving note", err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Fetch all notes
app.get('/api/notes', async (req, res) => {
  try {
    console.log('Fetching notes...', req.body);
    const notes = await Note.find({});
    res.status(200).json(notes);
  } catch (error) {
    console.log('Fetching notes...', req.body);
    console.error('Error fetching notes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
