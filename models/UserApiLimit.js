const mongoose = require("mongoose");

const userApiLimitSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    count: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }
}, { timestamps: true });

userApiLimitSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const UserApiLimit = mongoose.model('userApiLimit', userApiLimitSchema);

module.exports = UserApiLimit;