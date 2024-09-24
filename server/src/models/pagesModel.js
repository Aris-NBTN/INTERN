import mongoose from 'mongoose';

const pageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
    },
    path: {
        type: String,
        required: true,
    },
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    keywords: [{
        type: String,
    }],
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
    },
    content: {
        html: {
            type: String,
        },
        css: {
            type: String,
        },
        js: {
            type: String,
        }
    },
    edit: {
        type: Object,
    }
}, { timestamps: true }
);

export default mongoose.model('pages', pageSchema);
