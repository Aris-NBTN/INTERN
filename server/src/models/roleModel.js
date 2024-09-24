import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
    nameRole: {
        type: String,
        required: true,
    },
    role: [{
        type: String,
    }]
}, { timestamps: true }
);

export default mongoose.model('Role', roleSchema);
