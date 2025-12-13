import mongoose from 'mongoose';

const ideaSchema = new mongoose.Schema({
    heading: { type: String, required: true, minlength: 3, error: "Heading must be at least 3 characters long." },
    content: { type: String, required: true, error: "Content is required." },
    category: { type: String, required: true, error: "Category is required." },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true, error: "Author ID is required." },
    visibility: { type: String, enum: ['public', 'private'], default: 'private', error: "Visibility must be either 'public' or 'private'." },
}, { timestamps: true , versionKey: false});

export const ideaModel = mongoose.model('ideas', ideaSchema);