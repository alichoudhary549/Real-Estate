import asyncHandler from "express-async-handler";
import Residency from "../models/Residency.js";
import User from "../models/User.js";

export const createResidency = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    price,
    address,
    country,
    city,
    facilities,
    image,
    userEmail,
  } = req.body.data;

  console.log(req.body.data);
  
  // Validate required fields
  if (!title || !address || !userEmail) {
    res.status(400)
    throw new Error('Title, address, and user email are required');
  }

  if (!price || price < 0) {
    res.status(400)
    throw new Error('Valid price is required');
  }

  try {
    // Find owner by email
    const owner = await User.findOne({ email: userEmail });
    if (!owner) {
      res.status(404)
      throw new Error('User not found. Please ensure you are logged in.');
    }

    const residency = await Residency.create({
      title,
      description,
      price,
      address,
      country,
      city,
      facilities,
      image,
      owner: owner._id,
    });

    res.status(201).send({ message: "Property created successfully", residency });
  } catch (err) {
    if (err.code === 11000) {
      res.status(400)
      throw new Error("A property with this address already exists");
    }
    throw new Error(err.message);
  }
});

// function to get all the documents/residencies
// Only show approved properties to regular users (admin can see all via admin route)
export const getAllResidencies = asyncHandler(async (req, res) => {
  const residencies = await Residency.find({ status: 'approved' }).populate('owner').sort({ createdAt: -1 });
  res.send(residencies);
});

// (DB status implemented below with Mongoose)

// function to get a specific document/residency
export const getResidency = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const residency = await Residency.findById(id).populate('owner');
    if (!residency) {
      res.status(404)
      throw new Error('Property not found');
    }
    res.send(residency);
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(400)
      throw new Error('Invalid property ID');
    }
    throw new Error(err.message);
  }
});

// Search properties by title and/or city
// GET /api/residency/search?title=house&city=lahore
export const searchProperties = asyncHandler(async (req, res) => {
  try {
    const { title, city } = req.query;

    // Build search query - only approved properties
    const searchQuery = { status: 'approved' };

    // Add title search if provided (case-insensitive regex)
    if (title && title.trim()) {
      searchQuery.title = { $regex: title.trim(), $options: 'i' };
    }

    // Add city search if provided (case-insensitive regex)
    if (city && city.trim()) {
      searchQuery.city = { $regex: city.trim(), $options: 'i' };
    }

    // If no search parameters provided, return empty array
    // (frontend should use getAllResidencies for all properties)
    if (!title && !city) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: []
      });
    }

    // Execute search query
    const properties = await Residency.find(searchQuery)
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: properties.length,
      data: properties
    });
  } catch (error) {
    res.status(500);
    throw new Error(`Search failed: ${error.message}`);
  }
});

// DB status
export const getDBStatus = asyncHandler(async (req, res) => {
  const usersCount = await User.countDocuments();
  const residenciesCount = await Residency.countDocuments();
  res.send({ usersCount, residenciesCount });
});