const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    price: { type: Number, required: true },
    amenities: { type: [String], default: [] }, // Array of strings
    availability: { type: Boolean, default: true },
    photos: { type: [String], default: [] }, // Array of image URLs
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Room", RoomSchema);
