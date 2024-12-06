import mongoose from "mongoose";
const Schema = mongoose.Schema;

const roomSchema = new Schema({
  number: {
    type: Number,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
  },
  available: {
    type: Boolean,
    default: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  images: [
    {
      public_id: String,
      secure_url: String,
    },
  ],
  description: {
    type: String,
    required: true,
  },
  people: {
    type: Number,
    required: true,
  },
});

const Room = mongoose.model("Room", roomSchema);

export default Room;
