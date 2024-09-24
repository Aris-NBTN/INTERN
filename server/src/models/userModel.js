import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    userType: {
        // type: mongoose.Schema.Types.ObjectId,
        // ref: 'Role',
        type: String,
        required: true,
    },
    gender: String,
    activeStatus: Boolean,
    picture: String,
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
    },
    address: {
        type: String,
    },
    courses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Courses',
        },
    ],
}, { timestamps: true }
);

export default mongoose.model('users', userSchema);
