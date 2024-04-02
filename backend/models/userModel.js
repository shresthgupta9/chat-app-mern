const mongoose = require("mongoose");
const { Schema } = mongoose;

function ref(name) {
    return { type: Schema.Types.ObjectId, ref: name };
}

const userSchema = new Schema(
    {
        name: String,
        email: { type: String, unique: true },
        password: String,
        isAdmin: { type: Boolean, default: false },

    }, { timestamps: true }
)

module.exports = mongoose.model("User", userSchema);