const express = require("express");
const Room = require("../models/roomModel");
const router = express.Router();
const multer= require('multer')

const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.array("photos", 4), async (req, res) => {
  try {
    // Ensure required fields are present
    const {
      title,
      description,
      location,
      latitude,
      longitude,
      price,
      amenities,
      owner,
    } = req.body;

    if (
      !title ||
      !description ||
      !location ||
      !latitude ||
      !longitude ||
      !price ||
      !owner
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message: "All required fields must be filled.",
        });
    }

    // Convert amenities from string to array
    const amenitiesArray = amenities
      ? amenities.split(",").map((a) => a.trim())
      : [];

    const newRoom = new Room({
      title,
      description,
      location,
      latitude,
      longitude,
      price,
      amenities: amenitiesArray,
      owner,
      photos: req.files.map((file) => file.buffer.toString("base64")), // Storing images as base64 (consider using cloud storage)
    });

    await newRoom.save();
    res.status(201).json({ success: true, room: newRoom });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get nearby rooms based on user's location
router.get("/", async (req, res) => {
  try {
    let query = {};

    // Filtering by price
    if (req.query.minPrice && req.query.maxPrice) {
      query.price = { $gte: req.query.minPrice, $lte: req.query.maxPrice };
    }

    // Filtering by amenities
    if (req.query.amenities) {
      query.amenities = { $all: req.query.amenities.split(",") };
    }

    // Filtering by location (lat, long & radius in km)
    if (req.query.latitude && req.query.longitude) {
      const radius = req.query.radius || 10; // 
      const earthRadius = 6371; // Earth’s radius in km

      query.latitude = {
        $gte: parseFloat(req.query.latitude) - radius / earthRadius,
        $lte: parseFloat(req.query.latitude) + radius / earthRadius,
      };
      query.longitude = {
        $gte: parseFloat(req.query.longitude) - radius / earthRadius,
        $lte: parseFloat(req.query.longitude) + radius / earthRadius,
      };
    }

    const rooms = await Room.find(query);
    res.json({ success: true, rooms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });

    res.json({ success: true, room });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedRoom)
      return res.status(404).json({ message: "Room not found" });

    res.json({ success: true, room: updatedRoom });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedRoom = await Room.findByIdAndDelete(req.params.id);
    if (!deletedRoom)
      return res.status(404).json({ message: "Room not found" });

    res.json({ success: true, message: "Room deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
