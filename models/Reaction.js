const { Schema, Types } = require('mongoose');
const formatDate = require('../utils/helpers');

const reactionSchema = new Schema(
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId(),
        },
        reactionBody: {
            type: String,
            required: true,
            maxlength: 280,
        },
        username: {
            type: String,
            ref: 'user',
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: formatDate
        }
    },
     {
        toJSON: {
            getters: true,
        },
        id: false,
     }
);


module.exports = reactionSchema;