const Lawyer = require('../models/laywerModel');
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER, // Use environment variable
    pass: process.env.EMAIL_PASS  // Use environment variable
  }
});


async function sendEmail(to, subject, text) {
  try {
      const mailOptions = {
          from: process.env.EMAIL_USER, // Sender email
          to,                           // Receiver email
          subject,                      // Email subject
          text                          // Email body
      };

      const result = await transporter.sendMail(mailOptions);
      console.log('Email sent:', result);
  } catch (error) {
      console.error('Error sending email:', error);
  }
}


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
    const { status } = req.body;

    try {
        // Validate status
        if (!['pending', 'verified', 'rejected', 'formIncomplete'].includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status provided." });
        }

        // Update lawyer's status in the database
        const updatedLawyer = await Lawyer.findByIdAndUpdate(
            id,
            { approvalStatus: status }, // Update the approvalStatus field
            { new: true }
        );

        if (!updatedLawyer) {
            return res.status(404).json({ success: false, message: "Lawyer not found" });
        }

        // Send email based on status
        let emailSubject, emailBody;
        if (status === 'verified') {
            emailSubject = "Your Application has been Approved!";
            emailBody = `
Dear ${updatedLawyer.name},

We are pleased to inform you that your application has been reviewed and approved. After carefully reviewing your profile details, including your license information, experience, and other credentials, we have determined that you meet all the requirements for approval.

You can now access your account and start using our services. If you have any questions or need further assistance, feel free to contact our support team.

Thank you for choosing us!

Best regards,
SkyByte Solution  
`;
        } else if (status === 'rejected') {
            emailSubject = "Your Application has been Rejected";
            emailBody = `
Dear ${updatedLawyer.name},

We regret to inform you that your application has been reviewed and rejected. After carefully reviewing your profile details, including your license information, experience, and other credentials, we found some issues that need to be addressed.

Please contact our support team for further details or clarification regarding the rejection.

Thank you for your interest in our services.

Best regards,
SkyByte Solution
`;
        }

        // Send email to the lawyer
        await sendEmail(updatedLawyer.email, emailSubject, emailBody);

        res.status(200).json({
            success: true,
            message: "Lawyer status updated successfully",
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: 'Error approving/rejecting lawyer',
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