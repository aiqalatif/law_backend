const Law = require('../models/law');
// Import the Law model

// (1) Add Criminal Law
exports.addCriminalLaw = async (req, res) => {
    try {
      const { categories } = req.body;
  
      if (!categories || categories.length === 0) {
        return res.status(400).json({ message: 'At least one category is required for Criminal Law' });
      }
  
      const newLaw = new Law({
        lawType: 'Criminal Law',
        categories,
      });
  
      await newLaw.save();
  
      res.status(201).json({ message: 'Criminal law added successfully', law: newLaw });
    } catch (error) {
      console.error('Error adding criminal law:', error);
      res.status(500).json({ message: 'Error adding criminal law', error: error.message });
    }
  };

// (2) Add Family Law
exports.addFamilyLaw = async (req, res) => {
  try {
    const { categories } = req.body;

    if (!categories || categories.length === 0) {
      return res.status(400).json({ message: 'At least one category is required for Family Law' });
    }

    const newLaw = new Law({
      lawType: 'Family Law',
      categories,
    });

    await newLaw.save();

    res.status(201).json({ message: 'Family law added successfully', law: newLaw });
  } catch (error) {
    console.error('Error adding family law:', error);
    res.status(500).json({ message: 'Error adding family law', error: error.message });
  }
};

// (3) Add Labor Law
exports.addLaborLaw = async (req, res) => {
  try {
    const { categories } = req.body;

    if (!categories || categories.length === 0) {
      return res.status(400).json({ message: 'At least one category is required for Labor Law' });
    }

    const newLaw = new Law({
      lawType: 'Labor Law',
      categories,
    });

    await newLaw.save();

    res.status(201).json({ message: 'Labor law added successfully', law: newLaw });
  } catch (error) {
    console.error('Error adding labor law:', error);
    res.status(500).json({ message: 'Error adding labor law', error: error.message });
  }
};

// (4) Add Property Law
exports.addPropertyLaw = async (req, res) => {
  try {
    const { categories } = req.body;

    if (!categories || categories.length === 0) {
      return res.status(400).json({ message: 'At least one category is required for Property Law' });
    }

    const newLaw = new Law({
      lawType: 'Property Law',
      categories,
    });

    await newLaw.save();

    res.status(201).json({ message: 'Property law added successfully', law: newLaw });
  } catch (error) {
    console.error('Error adding property law:', error);
    res.status(500).json({ message: 'Error adding property law', error: error.message });
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