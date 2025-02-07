const mongoose = require('mongoose');

// Subsection Schema
const subsectionSchema = new mongoose.Schema({
  subsectionNumber: { type: String, required: true }, // Subsection number (e.g., "Subsection 392-A")
  title: { type: String, required: true }, // Title of the subsection
  description: { type: String, required: true }, // Description of the subsection
  punishment: { type: String, required: true }, // Punishment details
});

// Subcategory Schema
const subcategorySchema = new mongoose.Schema({
  sectionNumber: { type: String, required: true }, // Section number (e.g., "Section 392")
  title: { type: String, required: true }, // Title of the section
  description: { type: String, required: true }, // Description of the section
  punishment: { type: String, required: true }, // Punishment for the section
  subsections: [subsectionSchema], // Array of subsections
});

// Category Schema
const categorySchema = new mongoose.Schema({
  categoryName: { type: String, required: true }, // Category name (e.g., "Offences Against Property")
  subcategories: [subcategorySchema], // Array of subcategories
});

// Main Law Schema
const lawSchema = new mongoose.Schema({
  lawType: { type: String, required: true }, // Type of law (e.g., "Criminal Law")
  categories: [categorySchema], // Array of categories
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Law', lawSchema);