const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const insightSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    albums: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Album'
        }
    ]
}, {
    timestamps: { createdAt: 'created_date', updatedAt: 'modified_date' }
});

insightSchema.index({ user_id: 1, date: 1 }, { unique: true });

const Insight = mongoose.model('Insight', insightSchema);
module.exports = Insight;
