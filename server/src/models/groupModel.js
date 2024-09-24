import mongoose from 'mongoose';

const groupPageSchema = new mongoose.Schema({
    group: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
    },
}, { timestamps: true }
);

export default mongoose.model('GroupPage', groupPageSchema);
