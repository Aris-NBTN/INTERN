import mongoose from 'mongoose';

const imgSchema = new mongoose.Schema({
    imgSrc: {
        type: String,
        required: true,
    },
    width: {
        type: Number,
        required: true,
    },
    aspectRatio: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        default: '',
    },
});

const masonrySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
    },
    img: [imgSchema],
}, { timestamps: true });

export default mongoose.model('masonry', masonrySchema);
