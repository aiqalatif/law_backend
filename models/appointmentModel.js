const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  lawyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lawyer', 
    required: true,
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client', 
    required: true,
  },
  appointmentDate: {
    type: Date,
    required: true,
  },
  issueDescription: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'pending', 
    enum: ['pending', 'confirmed', 'completed', 'canceled'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
