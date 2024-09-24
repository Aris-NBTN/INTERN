import mongoose from 'mongoose';

const coursesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CategoryCourse',
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    sale: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    img: {
        type: String,
    },
    imgDetail: {
        type: String,
    },
    benefit: [{
        type: String,
    }],
    customer: [{
        type: String,
    }],
    output: [{
        type: String,
    }],
    prerequisite: [{
        type: String,
    }],
    star: {
        type: String,
    },
    seo: {
        type: Object
    },
    module: [
        {
            title: {
                type: String,
            },
            children: [
                {
                    title: {
                        type: String,
                    },
                    src: {
                        type: String,
                    },
                    poster: {
                        type: String,
                    },
                    thumbnailTracks: {
                        type: String,
                    },
                    textTracks: [
                        {
                            src: {
                                type: String,
                            },
                            label: {
                                type: String,
                            },
                            language: {
                                type: String,
                            },
                            kind: {
                                type: String,
                                enum: ['subtitles', 'chapters'],
                            },
                            default: {
                                type: Boolean,
                                default: false
                            }
                        }
                    ],
                }
            ]
        }
    ]
}, { timestamps: true }
);

export default mongoose.model('Courses', coursesSchema);
