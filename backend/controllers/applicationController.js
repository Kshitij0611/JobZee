import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Application } from "../models/applicationSchema.js";
import { Job } from "../models/jobSchema.js";
import cloudinary from "cloudinary";

export const postApplication = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Employer") {
    return next(
      new ErrorHandler("Employer not allowed to access this resource.", 400)
    );
  }

  /*
      req.files:
      {
       "resume": {
         "name": "resume.pdf",
         "data": "<binary data>",
         "mimetype": "application/pdf",
         "tempFilePath": "/tmp/uploadedfile"
      }
    }
  */

  // Agar req.files exist nahi karta ya empty hai, toh yeh error show karta hai ke "Resume File Required!"
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Resume File Required!", 400));
  }
  
  /*
    resume ko req.files se nikalta hai.
    Allowed formats ki list banata hai.
    Agar resume ka format allowed formats mein nahi hai, toh error show karta hai ke "Invalid file type."
  */

  const { resume } = req.files;
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(resume.mimetype)) {
    return next(
      new ErrorHandler("Invalid file type. Please upload your resume in a PNG, JPG or WEBP format.", 400)
    );
  }

  // cloudinary.uploader.upload use karta hai resume ko upload karne ke liye.
  const cloudinaryResponse = await cloudinary.uploader.upload(
    resume.tempFilePath
  );

  /* Agar upload successful nahi hota ya error aati hai, toh error show karta hai ke 
     "Failed to upload Resume to Cloudinary."
  */
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      "Cloudinary Error:",
      cloudinaryResponse.error || "Unknown Cloudinary error"
    );
    return next(new ErrorHandler("Failed to upload Resume to Cloudinary", 500));
  }

  /*
    * req.body se user ke details nikalta hai: name, email, coverLetter, phone, address, aur jobId.
    * Applicant ID set karta hai req.user._id aur role "Job Seeker" ke saath.
    * Agar jobId nahi hai, toh error show karta hai ke "Job not found!"
    * Job details ko Job.findById(jobId) se find karta hai.
    * Agar job details nahi milti, toh error show karta hai ke "Job not found!"
  */
  
  const { name, email, coverLetter, phone, address, jobId } = req.body;
  const applicantID = {
    user: req.user._id,
    role: "Job Seeker",
  };
  if (!jobId) {
    return next(new ErrorHandler("Job not found!", 404));
  }
  const jobDetails = await Job.findById(jobId);
  if (!jobDetails) {
    return next(new ErrorHandler("Job not found!", 404));
  }

  /*
    Employer ID set karta hai job details ke postedBy aur role "Employer" ke saath.
    Agar koi field missing hai (name, email, coverLetter, phone, address, applicantID, employerID, resume), 
    toh error show karta hai ke "Please fill all fields."
  */
  const employerID = {
    user: jobDetails.postedBy,
    role: "Employer",
  };
  if (
    !name ||
    !email ||
    !coverLetter ||
    !phone ||
    !address ||
    !applicantID ||
    !employerID ||
    !resume
  ) {
    return next(new ErrorHandler("Please fill all fields.", 400));
  }
  
  /*
    Nayi application create karta hai Application.create se user ke details ke saath.
    Resume ke liye Cloudinary se public_id aur secure_url set karta hai.
    Agar sab kuch theek hota hai, response send karta hai success message ke saath aur application details.
  */

  const application = await Application.create({
    name,
    email,
    coverLetter,
    phone,
    address,
    applicantID,
    employerID,
    resume: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });
  res.status(200).json({
    success: true,
    message: "Application Submitted!",
    application,
  });
});

export const employerGetAllApplications = catchAsyncErrors(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "Job Seeker") {
      return next(
        new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
      );
    }

    /*
      In this code, `employerID.user`: _id ka matlab hai ki aap `Application` collection se saare applications 
      fetch kar rahe hain jahan `employerID.user` field ki value current user ke ID (`_id`) ke barabar hai.

      "employerID.user" field mein user ka ID store hota hai jo job post karta hai. Jab koi employer job post karta hai, to us employer ka ID application 
      record ke "employerID.user" field mein save ho jata hai. Is tarah, jab aap req.user._id (jo current logged-in user ka ID hota hai) aur employerID.user 
      ko compare karte hain, to aap un saare applications ko filter kar paate hain jo us specific employer ne post kiye hain.
    */

    const { _id } = req.user;
    const applications = await Application.find({ "employerID.user": _id });
    res.status(200).json({
      success: true,
      applications,
    });
  }
);

export const jobseekerGetAllApplications = catchAsyncErrors(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "Employer") {
      return next(
        new ErrorHandler("Employer not allowed to access this resource.", 400)
      );
    }

    /*
      In this code, `applicantID.user`: _id ka matlab hai ki aap `Application` collection se saare applications 
      fetch kar rahe hain jahan `applicantID.user` field ki value current user ke ID (`_id`) ke barabar hai.

    "applicantID.user" field mein user ka ID store hota hai jo job search karta hai. Jab koi jobseeker job search karta hai, to us applicant ka ID application 
    record ke "applicantID.user" field mein save ho jata hai. Is tarah, jab aap req.user._id (jo current logged-in user ka ID hota hai) aur applicantID.user 
    ko compare karte hain, to aap un saare applications ko filter kar paate hain jo us specific applicant ne search kiye hain.

    */

    const { _id } = req.user;
    const applications = await Application.find({ "applicantID.user": _id });
    res.status(200).json({
      success: true,
      applications,
    });
  }
);

export const jobseekerDeleteApplication = catchAsyncErrors(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "Employer") {
      return next(
        new ErrorHandler("Employer not allowed to access this resource.", 400)
      );
    }
    const { id } = req.params;
    const application = await Application.findById(id);
    if (!application) {
      return next(new ErrorHandler("Application not found!", 404));
    }
    await application.deleteOne();
    res.status(200).json({
      success: true,
      message: "Application Deleted!",
    });
  }
);
