import mongoose from 'mongoose';

const categoryCourseSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
    },
}, { timestamps: true }
);

export default mongoose.model('CategoryCourse', categoryCourseSchema);
