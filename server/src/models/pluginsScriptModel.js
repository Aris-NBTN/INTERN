import mongoose from 'mongoose';

const pluginsScriptSchema = new mongoose.Schema({
    scripts: [{
        type: String,
    }],
    styles: [{
        type: String,
    }],
}, { timestamps: true }
);

export default mongoose.model('pluginsScript', pluginsScriptSchema);
