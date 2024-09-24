import mongoose from 'mongoose';

const pluginsSchema = new mongoose.Schema({
    id: {
        type: String,
    },
    description: {
        type: String,
    },
    status: {
        type: Boolean,
        default: true,
    },
    expiry: {
        type: Date,
    },
    src: {
        type: String,
        required: true,
    },
}, { timestamps: true }
);

export default mongoose.model('Plugins', pluginsSchema);
