const Lawyer = require('../models/laywerModel');

class LawyerController{

async CreateProfile(req,res){
const { name,phone,licenseNumber,licenseIssuingAuthority,
    licenseExpiryDate,experienceYears,specialties,
    officeAddress,workingHours,languagesSpoken,profilePicture,
    barCouncilIDCard,cnic,isEmailVerified,isApproved,
    caseSuccessRate,email,licenseIssuingDate,
}=req.body;
try{
    console.log("req.body ",req.body);

    const newUser= new  Lawyer({
      email,  name,phone,licenseNumber,licenseIssuingAuthority,
        licenseExpiryDate,experienceYears,specialties,
        officeAddress,workingHours,languagesSpoken,profilePicture,
        barCouncilIDCard,cnic,isEmailVerified,isApproved,
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
      const pendingLawyers = await Lawyer.find({ isApproved: false });
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
    const { id } = req.params; // ✅ Use params instead of body
    try {
      const lawyer = await Lawyer.findByIdAndUpdate(
        id,
        { isApproved: true },
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
      const approvedLawyers = await Lawyer.find({ isApproved: true });
  
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

  

}
module.exports = new LawyerController();