const Law = require('../models/law');

// (1) Add a New Law
exports.addLaw = async (req, res) => {
  try {
    const { lawType, categories } = req.body;

    // Validate required fields
    if (!lawType || !categories || categories.length === 0) {
      return res.status(400).json({ message: 'Law type and at least one category are required' });
    }

    // Create new law in the database
    const newLaw = new Law({
      lawType,
      categories,
    });

    await newLaw.save();

    res.status(201).json({ message: 'Law added successfully', law: newLaw });
  } catch (error) {
    console.error('Error adding law:', error);
    res.status(500).json({ message: 'Error adding law', error: error.message });
  }
};

// (2) Get All Laws
exports.getAllLaws = async (req, res) => {
  try {
    const laws = await Law.find();
    res.status(200).json({ message: 'Laws retrieved successfully', laws });
  } catch (error) {
    console.error('Error retrieving laws:', error);
    res.status(500).json({ message: 'Error retrieving laws', error: error.message });
  }
};

// (3) Get Law by ID
exports.getLawById = async (req, res) => {
  try {
    const lawId = req.params.id;
    const law = await Law.findById(lawId);

    if (!law) {
      return res.status(404).json({ message: 'Law not found' });
    }

    res.status(200).json({ message: 'Law retrieved successfully', law });
  } catch (error) {
    console.error('Error retrieving law:', error);
    res.status(500).json({ message: 'Error retrieving law', error: error.message });
  }
};

// (4) Update Law
exports.updateLaw = async (req, res) => {
  try {
    const lawId = req.params.id;
    const { lawType, categories } = req.body;

    // Validate required fields
    if (!lawType || !categories || categories.length === 0) {
      return res.status(400).json({ message: 'Law type and at least one category are required' });
    }

    const updatedLaw = await Law.findByIdAndUpdate(
      lawId,
      { lawType, categories },
      { new: true }
    );

    if (!updatedLaw) {
      return res.status(404).json({ message: 'Law not found' });
    }

    res.status(200).json({ message: 'Law updated successfully', law: updatedLaw });
  } catch (error) {
    console.error('Error updating law:', error);
    res.status(500).json({ message: 'Error updating law', error: error.message });
  }
};

// (5) Delete Law
exports.deleteLaw = async (req, res) => {
  try {
    const lawId = req.params.id;
    const deletedLaw = await Law.findByIdAndDelete(lawId);

    if (!deletedLaw) {
      return res.status(404).json({ message: 'Law not found' });
    }

    res.status(200).json({ message: 'Law deleted successfully', law: deletedLaw });
  } catch (error) {
    console.error('Error deleting law:', error);
    res.status(500).json({ message: 'Error deleting law', error: error.message });
  }
};