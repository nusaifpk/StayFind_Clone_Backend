import users from '../Model/userSchema.js'
import { joiUserSchema, joiReviewSchema } from '../Model/validationSchema.js'
import bcrypt from "bcrypt"
import { sendOTP } from "./Verify_OTP.js"
import jwt from 'jsonwebtoken'
import properties from '../Model/propertySchema.js'
import reviews from "../Model/reviewSchema.js"
import Razorpay from "razorpay";
import nodemailer from "nodemailer"
import userModel from '../Model/userSchema.js'
import bookings from '../Model/bookingShema.js'
import mongoose from 'mongoose'

//Profile Image Multer
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from "fs";
import path from 'path';
import cloudinary from 'cloudinary';
import multer from 'multer';

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uploadDirectory = path.resolve(__dirname, "upload");
const storage = multer.diskStorage({
    destination: uploadDirectory,
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
    }
});

const upload = multer({ storage });






//--------------------------------------------------REGISTER & LOGIN SECTION --------------------------------------------------//
export const userRegister = async (req, res) => {
  try {
    const { value, error } = joiUserSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: "error",
        message: error.details[0].message,
      });
    }

    const { name, email, phone, username, password } = value;
    const existingUser = await userModel.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        status: "error",
        message: "Username already taken!",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({
      name,
      email,
      phone,
      username,
      password: hashedPassword,
    });
    await newUser.save();

    newUser.otpStatus = "sent";
    await newUser.save();

    return res.status(201).json({
      status: "success",
      message: "User registered successfully",
      userId: newUser._id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const completeRegistration = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }


    user.otpStatus = "verified";
    await user.save();

    return res.status(200).json({
      status: "success",
      message: "Registration completed successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await users.findOne({ username });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "Invalid username...",
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({
        status: "error",
        message: "Your account has been blocked...!"
      })
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        status: "error",
        message: "Invalid password...",
      });
    }

    const token = jwt.sign({ username },
      process.env.USER_ACCESS_TOKEN_SECRET,
      {expiresIn:"1h"}
    );

    return res.status(200).json({
      status: "success",
      message: "User login successful",
      token: token,
      user: {
        userId: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "An unexpected error occurred",
      error: error.message
    });
  }
}


//--------------------------------------------------PROPERTY SECTION --------------------------------------------------//
export const viewProperty = async (req, res) => {
  try {
    const { category, location } = req.query;

    let query = {};

    if (category) {
      query.category = category;
    }

    if (location) {
      query.location = location;
    }

    const allProducts = await properties.find(query);

    if (!allProducts || allProducts.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No properties found for the given criteria",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Fetched properties successfully",
      data: allProducts,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "An unexpected error occurred",
      error: error.message,
    });
  }
};

export const viewPropertyById = async (req, res) => {
  const propertyId = req.params.id
  const property = await properties.findById(propertyId)

  if (!property) {
    return res.status(404).json({
      status: "error",
      message: "property not found...!"
    })
  }

  return res.status(200).json({
    status: "success",
    message: "fetched property by id",
    data: property
  })
}


//--------------------------------------------------WISHLIST SECTION --------------------------------------------------//
export const addToWishlist = async (req, res) => {
  try {
    const userId = req.params.id;
    const { propertyId } = req.body;

    if (!propertyId) {
      return res.status(400).json({
        status: "error",
        message: "Property ID is required...!"
      });
    }

    const user = await users.findById(userId);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found...!"
      });
    }

    const property = await properties.findById(propertyId);

    if (!property) {
      return res.status(404).json({
        status: "error",
        message: "Property not found...!"
      });
    }

    if (user.wishlist.includes(propertyId)) {
      return res.status(200).json({
        status: "success",
        message: "Property already in wishlist...!"
      });
    }

    user.wishlist.push(propertyId);
    await user.save();

    return res.status(200).json({
      status: "success",
      message: "Property added to wishlist",
      data: {
        property: property,
        wishlist: user.wishlist
      }
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "An unexpected error occurred...!",
      error: error.message
    });
  }
};

export const viewWishList = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await users.findById(userId);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "user not found...!"
      });
    }

    const wishPropertyId = user.wishlist;

    if (wishPropertyId.length === 0) {
      return res.status(200).json({
        status: "success",
        message: "wishlist is empty...",
        totalProperties: 0,
        data: []
      });
    }

    const wishProperties = await properties.find({ _id: { $in: wishPropertyId } });

    return res.status(200).json({
      status: "success",
      message: "wishlist fetched successfully",
      totalProperties: wishProperties.length,
      data: wishProperties
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "An unexpected error occurred",
      error: error.message
    });
  }
};

export const deleteWishlist = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await users.findById(userId);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found...!",
      });
    }

    const { propertyId } = req.body

    if (!propertyId) {
      return res.status(404).json({
        status: "error",
        message: "Property ID not found...!",
      });
    }
    if (!user.wishlist.includes(propertyId)) {
      return res.status(400).json({
        status: "error",
        message: "Property not found in wishlist...!"
      });
    }


    user.wishlist.pull(propertyId);
    await user.save();

    const updatedResult = await users.updateOne({ _id: userId }, { $pull: { wishlist: propertyId } });

    return res.status(200).json({
      status: "success",
      message: "Removed property from wishlist successfully"
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error...!",
      error: error.message,
    });
  }
}


export const deleteAllWishlist = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await users.findById(userId);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found...!",
      });
    }

    user.wishlist = [];
    await user.save();

    return res.status(200).json({
      status: "success",
      message: "Removed all items from wishlist successfully"
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error...!",
      error: error.message,
    });
  }
}



//--------------------------------------------------REVIEW SECTION --------------------------------------------------//
export const addReview = async (req, res) => {
  const { value, error } = joiReviewSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      status: "error",
      message: "please fill in all fields",
    });
  }

  const { userId, propertyId, rating, review } = value;

  try {
    const user = await users.findById(userId)
    const property = await properties.findById(propertyId)

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "user not found...!"
      })
    }
    if (!property) {
      return res.status(404).json({
        status: "error",
        message: "property not found...!"
      })
    }

    const existingUserReview = await reviews.findOne({ userId, propertyId });
    if (existingUserReview) {
      return res.status(400).json({
        status: "error",
        message: "user has been already reviewed this property...!"
      })
    }

    const newReview = new reviews({
      userId,
      propertyId,
      rating,
      review
    })
    await newReview.save();


    if (!user.reviews) {
      user.reviews = []
    }

    user.reviews.push(newReview._id)
    await user.save();

    return res.status(201).json({
      status: "success",
      message: "review added successfully",
      data: newReview
    })

  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message
    })
  }
}

export const viewReviews = async (req, res) => {
  const { id: propertyId } = req.params;
  try {
    const reviewCount = await reviews.countDocuments({ propertyId });
    const reviewDocs = await reviews.find({ propertyId }).populate(
      "userId",
      'username profileImg'
    );

    if (!reviewDocs || reviewDocs.length === 0) {
      return res.status(200).json({
        status: "success",
        message: "No reviews for this property",
        data: [],
        dataCount: reviewCount,
        overallRating: 0,
      });
    }

    const totalRating = reviewDocs.reduce((acc, review) => acc + review.rating, 0);
    const overallRating = totalRating / reviewCount;

    await properties.findByIdAndUpdate(propertyId, { overallRating });

    return res.status(200).json({
      status: "success",
      message: "Fetched reviews of this property",
      data: reviewDocs,
      dataCount: reviewCount,
      overallRating: overallRating.toFixed(1),
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};


export const editReview = async (req, res) => {
  try {
    const { reviewId, comment } = req.body

    if (!reviewId || !comment) {
      return res.status(400).json({
        status: "error",
        message: "all field required...!"
      })
    }

    const review = await reviews.findById(reviewId)
    if (!review) {
      return res.status(404).json({
        status: "error",
        message: "review not found...!"
      })
    }

    review.comment = comment;
    await review.save()

    return res.status(200).json({
      status: "success",
      message: "review updated successfully",
      data: review,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).josn({
      status: "error",
      message: "an unexpected error occurs...!",
      error: error.message
    })
  }
}
//--------------------------------------------------PAYMENT SECTION --------------------------------------------------//
export const payment = async (req, res) => {
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const { amount, currency, receipt } = req.body;

  try {
    const payment = await razorpay.orders.create({ amount, currency, receipt });
    return res.json({
      status: "success",
      message: "Payment initiated",
      data: payment,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const sendPaymentEmail = async (req, res) => {
  const {
    userId,
    email,
    amount,
    currency,
    receipt,
    customerName,
    hotelName,
    bookingId,
    checkInDate,
    checkOutDate,
    numberOfGuests,
    paymentDate,
    paymentTime,
    customerSupportEmail,
    customerSupportPhone
  } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Payment Confirmation for Your Booking at Stayfind',
    html: `<p>Dear ${customerName},</p>
           <p>We are pleased to inform you that your payment for the booking at <b>Stayfind</b> has been successfully processed. Thank you for choosing us for your hotel and resort needs. Here are the details of your transaction and booking:</p>
           <p><b>Booking Details:</b></p>
           <p>Hotel/Resort Name: ${hotelName}<br>
           Booking ID: ${bookingId}<br>
           Reciept ID: ${receipt}<br>
           Check-in Date: ${checkInDate}<br>
           Check-out Date: ${checkOutDate}<br>
           Number of Guests: ${numberOfGuests}<br>
           <p><b>Payment Details:</b></p>
           <p>Payment Amount: ₹${amount}/- ${currency}<br>
           Payment Date: ${paymentDate}<br>
           Payment Time: ${paymentTime}<br>
           <p>We look forward to hosting you and providing an exceptional stay experience. Should you have any questions or require further assistance, please do not hesitate to contact our customer support team at ${customerSupportEmail} or ${customerSupportPhone}.</p>
           <p>Thank you for choosing Stayfind. We wish you a pleasant stay!</p>
           <p>Best regards,</p>
           <p>The Stayfind Team<br>`
  };

  transporter.sendMail(mailOptions, async (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({
        error: 'error sending email...!'
      });
    }
    else {
      console.log('Email sent: ', info.response);

      const newBooking = new bookings({
        hotelName,
        bookingId,
        checkInDate,
        checkOutDate,
        numberOfGuests,
        amount,
        currency,
        paymentDate,
        paymentTime,
        receipt,
        user: userId
      });

      try {
        const savedBooking = await newBooking.save();
        const bookingId = savedBooking._id

        await userModel.findByIdAndUpdate(userId, { $push: { bookings: savedBooking._id } });

        return res.status(200).json({
          status: "success",
          message: 'Email sent successfully and booking updated',
          // NOITEE
          bookingId: bookingId
        });
      } catch (dbError) {
        console.error('Error updating booking:', dbError);
        return res.status(500).json({
          error: 'Error updating booking...!'
        });
      }
    }
  });
};


//--------------------------------------------------BOOKING SECTION --------------------------------------------------//
export const getBooking = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await users.findById(userId)
      .populate({
        path: "bookings",
        match: { isDeleted: { $ne: true } }
      })

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found...!",
      });
    }
    return res.status(200).json({
      status: "success",
      message: "Fetched booking details successfully",
      data: user.bookings,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error...!",
      error: error.message,
    });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const userId = req.params.userId;
    const bookingId = req.body.bookingId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid userId",
      });
    }

    const user = await users.findById(userId);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found...!",
      });
    }

    const booking = await bookings.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        status: "error",
        message: "Booking not found...!",
      });
    }

    booking.isDeleted = true;
    await booking.save();

    return res.status(200).json({
      status: "success",
      message: "Booking hidden successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error...!",
      error: error.message,
    });
  }
};


//--------------------------------------------------ENQUIRY SECTION --------------------------------------------------//
export const sendEnquiry = async (req, res) => {
  const { name, email, message } = req.body;
  console.log(req.body);

  if (!name || !email || !message) {
    return res.status(400).json({
      message: "Please fill all the fields...!"
    });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    }
  });

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER,
    replyTo: email,
    subject: `Enquiry from ${name}`,
    text: message
  };

  console.log(mailOptions);

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({
      status: "success",
      message: "Email sent successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: 'Error sending email',
      error: error.message
    });
  }
};


//--------------------------------------------------PROFILE SECTION --------------------------------------------------//
export const viewProfile = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await users.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: 'user not found...!'
      });
    }

    return res.status(200).json({
      message: 'User profile fetched successfully',
      data: user
    });
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
}

export const editProfile = async (req, res) => {
  const userId = req.params.id;
  const { username } = req.body;
  let imageUrl;

  try {
    const existingUser = await userModel.findOne({ username });
    if (existingUser && existingUser._id.toString() !== userId) {
      return res.status(200).json({
        message: "Username already taken"
      });
    }

    upload.single('profileImg')(req, res, async (error) => {
      if (error instanceof multer.MulterError) {
        return res.status(400).json({
          status: "error",
          message: error.message
        });
      } else if (error) {
        return res.status(400).json({
          status: "error",
          message: error
        });
      }

      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "Profile-images"
        });
        imageUrl = result.secure_url;

        fs.unlink(req.file.path, (unlink_error) => {
          if (unlink_error) {
            console.log("Error deleting local file after uploading to Cloudinary");
          }
        });
      }

      const userUpdate = { username };
      if (imageUrl) {
        userUpdate.profileImg = imageUrl;
      }

      const user = await users.findByIdAndUpdate(
        userId,
        userUpdate,
        { new: true }
      );

      if (!user) {
        return res.status(404).json({
          message: "User not found...!"
        });
      }

      return res.status(200).json({
        message: "Profile updated successfully",
        data: {
          username: user.username,
          profileImage: user.profileImg
        }
      });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error...!"
    });
  }
};






