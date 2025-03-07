const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    subjectName: { type: String, required: true },
    semester: { type: String, required: true },
    year: { type: String, required: true },
    course: { type: String, required: true },
    title: { type: String, required: true },
    file: { 
        data: Buffer,
        contentType: String,
        originalName: String,
     },
   
});

module.exports = mongoose.model('Note', noteSchema);