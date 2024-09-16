import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { Job } from "../models/jobSchema.js";
import ErrorHandler from "../middlewares/error.js";

export const getAllJobs = catchAsyncErrors(async (req, res, next) => {
  // 'Job' collection se saare jobs fetch kar raha hai jinke 'expired' field false hai (matlab jo expire nahi hue hain)
  const jobs = await Job.find({ expired: false });
  // response status 200 ke sath JSON format mein response bhej raha hai
  // response mein success true set kar raha hai aur saare jobs ki list 'jobs' key ke sath bhej raha hai
  res.status(200).json({
    success: true,
    jobs,
  });
});


export const postJob = catchAsyncErrors(async (req,res,next) => {
  // 'req.user' se user ka role le raha hai
  const { role } = req.user;
  
  // agar role 'Job Seeker' hai toh error throw kar raha hai ki Job Seeker ko access allow nahi hai
  if (role === "Job Seeker") {
    return next(
      new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
    );
  }
  
  // 'req.body' se job ke details le raha hai
  const {
    title,
    description,
    category,
    country,
    city,
    location,
    fixedSalary,
    salaryFrom,
    salaryTo,
  } = req.body;

  // agar required fields missing hain toh error throw kar raha hai ki poori details provide karo
  if (!title || !description || !category || !country || !city || !location) {
    return next(new ErrorHandler("Please provide full job details.", 400));
  }

  // agar 'salaryFrom' aur 'salaryTo' missing hain aur 'fixedSalary' bhi missing hai toh error throw kar raha hai ki salary provide karo
  if ((!salaryFrom || !salaryTo) && !fixedSalary) {
    return next(
      new ErrorHandler(
        "Please either provide fixed salary or ranged salary.", 400)
    );
  }

  // agar 'salaryFrom', 'salaryTo' aur 'fixedSalary' tino provided hain toh error throw kar raha hai ki ek sath fixed aur ranged salary nahi daal sakte
  if (salaryFrom && salaryTo && fixedSalary) {
    return next(
      new ErrorHandler("Cannot Enter Fixed and Ranged Salary together.", 400)
    );
  }

  // job post karne wale user ka ID le raha hai
  const postedBy = req.user._id;

  // Job collection mein naya job create kar raha hai
  const job = await Job.create({
    title,
    description,
    category,
    country,
    city,
    location,
    fixedSalary,
    salaryFrom,
    salaryTo,
    postedBy,
  });

  // response status 200 ke sath JSON format mein response bhej raha hai
  // response mein success true set kar raha hai, success message bhej raha hai aur naya job object bhej raha hai
  res.status(200).json({
    success: true,
    message: "Job Posted Successfully!",
    job,
  });
});

  
export const getMyJobs = catchAsyncErrors(async (req, res, next) => {
  // 'req.user' se user ka role le raha hai
  const { role } = req.user;
  
  // agar role 'Job Seeker' hai toh error throw kar raha hai ki Job Seeker ko access allow nahi hai
  if (role === "Job Seeker") {
    return next(
      new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
    );
  }
  
  // 'Job' collection se saare jobs fetch kar raha hai jo current user (req.user._id) ne post kiye hain
  const myJobs = await Job.find({ postedBy: req.user._id });
  
  res.status(200).json({
    success: true,
    myJobs,
  });
});

export const updateJob = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Job Seeker") {
    return next(
      new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
    );
  }
  
  /* 1) `req.user._id` user ke request karne wale ka ID hota hai. Ye un operations ke liye useful hai jahan aapko current user 
         ke basis par data filter karna hota hai, jaise ki user-specific data fetch ya manage karna.

     2) `req.params.id`, dusri taraf, ye specify karta hai ki kaunsa specific job (ya resource) update kiya ja raha hai. 
         Yahan ID job ko represent karti hai jo aap modify karna chahte hain, na ki user ko.
  */

  const { id } = req.params;
  let job = await Job.findById(id);
  if (!job) {
    return next(new ErrorHandler("OOPS! Job not found.", 404));
  }

  // agar job milta hai toh us job ko update kar raha hai 'req.body' mein di gayi details ke sath
  
  // 'new: true' option ensure karta hai ki function updated job document return kare. Agar yeh true nahi hota, to yeh purana document return karta.
  // 'runValidators: true' option ensure karta hai ki update operation ke dauran validators run karein. Yeh validators data ki correctness verify karte hain.
  // 'useFindAndModify: false' matlab findOneAndUpdate method ko use karega findAndModify
  job = await Job.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    job,
    message: "Job Updated!",
  });
});

export const deleteJob = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Job Seeker") {
    return next(
      new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
    );
  }
  const { id } = req.params;
  const job = await Job.findById(id);
  if (!job) {
    return next(new ErrorHandler("OOPS! Job not found.", 404));
  }
  
  await job.deleteOne();

  res.status(200).json({
    success: true,
    message: "Job Deleted!",
  });
});

export const getSingleJob = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  try {
    const job = await Job.findById(id);
    if (!job) {
      return next(new ErrorHandler("Job not found.", 404));
    }
    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    return next(new ErrorHandler(`Invalid ID / CastError`, 404));
  }
});
