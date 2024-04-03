const { default: mongoose } = require("mongoose");
const Mongoose = require("mongoose");
const { Schema } = mongoose;

function ref(name) {
    return { type: Schema.Types.ObjectId, ref: name };
}

const messageSchema = new Schema(
    {
        sender: ref("User"),
        recipient: ref("User"),
        text: String,
    }, { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);