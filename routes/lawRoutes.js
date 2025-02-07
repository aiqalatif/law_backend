const express = require('express');
const router = express.Router();
const lawController = require('../controllers/lawController');

// Routes
         // Add a new law
router.get('/get-laws', lawController.getAllLaws);       // Get all laws
router.get('/get-law/:id', lawController.getLawById);    // Get law by ID
router.put('/update-law/:id', lawController.updateLaw);  // Update law
router.delete('/delete-law/:id', lawController.deleteLaw); // Delete law

router.post('/add-criminal-law', lawController.addCriminalLaw);      
router.post('/add-family-law', lawController.addFamilyLaw);          

router.post('/add-labor-law', lawController.addLaborLaw);            

router.post('/add-property-law', lawController.addPropertyLaw);  
module.exports = router;