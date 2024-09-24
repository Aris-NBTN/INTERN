import mongoose from 'mongoose';

const layoutSchema = new mongoose.Schema({
    header: {
        type: String,
        required: true,
    },
    footer: {
        type: String,
        required: true,
    },
    css: {
        type: String,
        required: true,
    },
    edit: {
        type: Object,
        required: true,
    }
}, { timestamps: true }
);

export default mongoose.model('layout', layoutSchema);
