import mongoose from 'mongoose';

const jsSchema = new mongoose.Schema({
    link: {
        type: String,
        required: true,
    },
}, { timestamps: true }
);

export default mongoose.model('Js', jsSchema);
