import mongoose from 'mongoose';

const cssSchema = new mongoose.Schema({
    link: {
        type: String,
        required: true,
    },
}, { timestamps: true }
);

export default mongoose.model('Css', cssSchema);
