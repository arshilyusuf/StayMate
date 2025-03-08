const express = require("express");
const Room = require("../models/roomModel");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});

const upload = multer({ storage: storage });

router.post("/", upload.array("photos", 4), async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      latitude,
      longitude,
      price,
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
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled.",
      });
    }

   
    const photoPaths = req.files.map((file) => `uploads/${file.filename}`);

    const newRoom = new Room({
      title,
      description,
      location,
      latitude,
      longitude,
      price,
      owner,
      photos: photoPaths, 
    });

    await newRoom.save();
    res.status(201).json({ success: true, room: newRoom });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    let query = {};

    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 5; 
    const skip = (page - 1) * limit;

    if (req.query.minPrice && req.query.maxPrice) {
      query.price = {
        $gte: parseFloat(req.query.minPrice),
        $lte: parseFloat(req.query.maxPrice),
      };
    }

    

    if (req.query.latitude && req.query.longitude) {
      const radius = parseFloat(req.query.radius) || 10; 
      const earthRadius = 6371; 

      query.latitude = {
        $gte: parseFloat(req.query.latitude) - radius / earthRadius,
        $lte: parseFloat(req.query.latitude) + radius / earthRadius,
      };
      query.longitude = {
        $gte: parseFloat(req.query.longitude) - radius / earthRadius,
        $lte: parseFloat(req.query.longitude) + radius / earthRadius,
      };
    }

    const rooms = await Room.find(query)
      .populate("owner", "phone email") 
      .skip(skip)
      .limit(limit);

    const totalRooms = await Room.countDocuments(query);

    res.json({
      success: true,
      rooms,
      totalPages: Math.ceil(totalRooms / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate(
      "owner",
      "phone email"
    );
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
