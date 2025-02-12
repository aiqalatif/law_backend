const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const lawyerController = require('../controllers/lawyerController');


 router.post("/lawyerProfile",lawyerController.CreateProfile);

 router.get('/pendingLawyers',authMiddleware, lawyerController.getPendingLawyers);

 router.get('/approved',authMiddleware, lawyerController.getApprovedLawyers);

// Approve lawyer route
router.put('/approve/:id',authMiddleware, lawyerController.approveLawyer);

 module.exports =  router;