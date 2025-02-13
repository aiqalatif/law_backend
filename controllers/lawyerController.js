const Lawyer = require('../models/laywerModel');

class LawyerController{

async CreateProfile(req,res){
const { name,phone,licenseNumber,licenseIssuingAuthority,
    licenseExpiryDate,experienceYears,specialties,
    officeAddress,workingHours,languagesSpoken,profilePicture,
    barCouncilIDCard,cnic,isEmailVerified,approvalStatus,
    caseSuccessRate,email,licenseIssuingDate,
}=req.body;
try{
    console.log("req.body ",req.body);

    const newUser= new  Lawyer({
      email,  name,phone,licenseNumber,licenseIssuingAuthority,
        licenseExpiryDate,experienceYears,specialties,
        officeAddress,workingHours,languagesSpoken,profilePicture,
        barCouncilIDCard,cnic,isEmailVerified,approvalStatus,
        caseSuccessRate,licenseIssuingDate,
    });
      await   newUser.save();
      res.status(201).json({
        message:"Profile Created Sucessfull"
      })
}catch(e){
   console.log("print the error",e);
  res.status(500).json({
    message:'Eror in profile creation', error: e.message
  })
}
}
async getPendingLawyers(req, res) {
  try {
    const pendingLawyers = await Lawyer.find({ approvalStatus: 'pending' }); // Use 'pending' as a string
    res.status(200).json({
      success: true,
      lawyers: pendingLawyers
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: 'Error fetching pending lawyers',
      error: e.message
    });
  }
  }
  async approveLawyer(req, res) {
    const { id } = req.params; 
    try {
      const lawyer = await Lawyer.findByIdAndUpdate(
        id,
        { approvalStatus: 'verified' },
        { new: true }
      );
      if (!lawyer) {
        return res.status(404).json({ success: false, message: "Lawyer not found" });
      }
      res.status(200).json({
        success: true,
        message: "Lawyer approved successfully",
        lawyer
      });
    } catch (e) {
      res.status(500).json({
        success: false,
        message: 'Error approving lawyer',
        error: e.message
      });
    }
}

  
  async getApprovedLawyers(req, res) {
    try {
      const approvedLawyers = await Lawyer.find({ approvalStatus: 'verified' });
  
      res.status(200).json({
        success: true,
        lawyers: approvedLawyers
      });
  
    } catch (e) {
      res.status(500).json({
        success: false,
        message: "Error fetching approved lawyers",
        error: e.message
      });
    }
}
async  lawyerprofile(req, res) {
  const { email } = req.params; // Extract email from path parameters
  console.log("Fetching lawyer with email:", email);

  try {
    // Fetch the lawyer's profile from the database
    const lawyer = await Lawyer.findOne({ email });

    if (!lawyer) {
      return res.status(404).json({ success: false, error: 'Lawyer not found.' });
    }

    // Return the lawyer's profile details
    res.status(200).json({
      success: true,
      profile: {
        name: lawyer.name,
        email: lawyer.email,
        phone: lawyer.phone,
        licenseNumber: lawyer.licenseNumber,
        licenseIssuingAuthority: lawyer.licenseIssuingAuthority,
        licenseIssuingDate: lawyer.licenseIssuingDate,
        licenseExpiryDate: lawyer.licenseExpiryDate,
        experienceYears: lawyer.experienceYears,
        specialties: lawyer.specialties,
        officeAddress: lawyer.officeAddress,
        workingHours: lawyer.workingHours,
        languagesSpoken: lawyer.languagesSpoken,
        profilePicture: lawyer.profilePicture,
        barCouncilIDCard: lawyer.barCouncilIDCard,
        cnic: lawyer.cnic,
        isEmailVerified: lawyer.isEmailVerified,
        approvalStatus: lawyer.approvalStatus,
        caseSuccessRate: lawyer.caseSuccessRate,
        status: lawyer.status, // Include the approval status
      },
    });
  } catch (error) {
    console.error('Error fetching lawyer profile:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch profile.' });
  }
}
}
module.exports = new LawyerController();