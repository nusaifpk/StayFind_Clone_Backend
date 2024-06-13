import jwt from "jsonwebtoken"
import users from '../Model/userSchema.js'
import properties from '../Model/propertySchema.js'
import { joiPropertySchema } from '../Model/validationSchema.js'
import bookings from '../Model/bookingShema.js'
import category from "../Model/categorySchema.js"


//--------------------------------------------------LOGIN SECTION --------------------------------------------------//
export const adminLogin = async (req, res) => {
    const { username, password } = req.body

    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {

        const token = jwt.sign({ username }, process.env.ADMIN_ACCESS_TOKEN_SECRET)

        return res.status(200).json({
            status: "success",
            message: "admin logged in successfully",
            token: token
        })
    }
    else {
        return res.status(401).json({
            status: "error",
            message: "invalid admin credentials...!"
        })
    }
}

//--------------------------------------------------USER MANAGEMENT --------------------------------------------------//
export const viewUser = async (req, res) => {
    const all_users = await users.find();
    const all_user_count = await users.countDocuments();

    if (all_users.length === 0) {
        return res.status(404).json({
            status: "error",
            message: "users not found...!"
        })
    }
    else {
        return res.status(200).json({
            status: "success",
            message: "fetched users successfully",
            data: all_users,
            dataCount: all_user_count
        })
    }
}

export const viewUserById = async (req, res) => {
    const userId = req.params.id;
    const user = await users.findById(userId)

    if (!user) {
        return res.status(404).json({
            status: "error",
            message: "user not found...!"
        })
    }
    else {
        return res.status(200).json({
            status: "success",
            message: "fetched user by id",
            data: user
        })
    }
}

export const blockUser = async (req, res) => {
    try {
        const userId = req.params.id
        const user = await users.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (user.isBlocked) {
            return res.status(400).json({
                message: "User is already blocked"
            });
        }

        user.isBlocked = true;
        await user.save();

        return res.status(200).json({
            message: "User is blocked! 🔒",
            data: user
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

export const unBlockUser = async (req, res) => {
    try {
        const userId = req.params.id
        const user = await users.findById(userId);

        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "User not found"
            });
        }

        if (!user.isBlocked) {
            return res.status(400).json({
                error: "error",
                message: "User is not blocked"
            });
        }

        user.isBlocked = false;
        await user.save();

        return res.status(200).json({
            status: "success",
            message: "User is unblocked 🔓",
            data: user
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}


//--------------------------------------------------PROPERTY MANAGEMENT --------------------------------------------------//
export const addProperty = async (req, res) => {
    const { value, error } = joiPropertySchema.validate(req.body)
    const { name, category, location, guest, bedroom, bathroom, description, images, price } = value
    console.log(value);

    if (error) {
        return res.status(400).json({
            error: error.details[0].message
        })
    }
    else {
        const property_data = await properties.create({
            name,
            category,
            location,
            guest,
            bedroom,
            bathroom,
            description,
            images,
            price,
        })

        return res.status(201).json({
            status: "success",
            message: "property added successfully",
            data: property_data
        })
    }
}

export const viewProperty = async (req, res) => {
    const allProperties = await properties.find()
    const allProperties_count = await properties.countDocuments()

    if (!allProperties) {
        return res.status(404).json({
            status: "error",
            message: "properties not found...!"
        })
    }
    else {
        return res.status(200).json({
            status: "success",
            message: "fetched property data",
            data: allProperties,
            dataCount: allProperties_count
        })
    }
}

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

export const updateProperty = async (req, res) => {
    const propertyId = req.params.id;

    const { value, error } = joiPropertySchema.validate(req.body);

    if (error) {
        return res.status(400).json({
            status: "error",
            message: error.details[0].message
        });
    }

    const { name, category, location, guest, bedroom, bathroom, description, images, price } = value;

    try {
        const updatedProperty = await properties.findByIdAndUpdate(
            propertyId,
            { $set: { name, category, location, guest, bedroom, bathroom, description, images, price } },
            { new: true, runValidators: true }
        );

        if (updatedProperty) {
            return res.status(200).json({   
                status: "success",
                message: "Property updated successfully",
                data: updatedProperty
            });
        } else {
            return res.status(404).json({
                status: "error",
                message: "Property not found...!"
            });
        }
    } catch (error) {
        console.error("Error updating property: ", error);
        return res.status(500).json({
            status: "error",
            message: "Internal server error...!"
        });
    }
};

export const deleteProperty = async (req, res) => {
    const propertyId = req.params.id
    const property = await properties.findById(propertyId)


    if (!property) {
        return res.status(400).json({
            status: "error",
            message: "invalid property id...!"
        })
    }

    try {
        const deleteProperty = await properties.findOneAndDelete({ _id: propertyId })
        if (!deleteProperty) {
            return res.status(500).json({
                status: "error",
                message: "property not found...!"
            })
        }

        return res.status(200).json({
            status: "success",
            message: "property deleted successfully"
        })
    }
    catch (error) {
        console.log("Error deleting property: ", error);
        return res.status(500).json({
            status: "error",
            message: "internal server error...!",
            error: error.message
        })
    }
}


//--------------------------------------------------BOOKINGS MANAGEMENT --------------------------------------------------//
export const getAllBookings = async (req, res) => {
    try {
        const allBookings = await bookings.find({}).populate('user', 'name email phone');
        const allBookingsCount = await bookings.countDocuments()

        if (!allBookings || allBookings.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "No bookings found",
            });
        }

        return res.status(200).json({
            status: "success",
            message: "Fetched all bookings successfully",
            data: allBookings,
            dataCount: allBookingsCount
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
            error: error.message,
        });
    }
};

//--------------------------------------------------CATEGORY MANAGEMENT --------------------------------------------------//

export const addCategory = async (req,res) => {
    const { name } = req.body

    const existingCategory = await category.findOne({ name })
    if(existingCategory){
        return res.status(400).json({
            status:"error",
            message:"category already added"
        })
    }
    const categories = new category({name})
    await categories.save()

    

    return res.status(200).json({
        status:"success",
        message:"category added successfully",
        data:categories
    })
}

export const viewCategory = async (req,res) => {
    const categories = await category.find()

    if(categories === ''){
        return res.status(200).json({
            status:"success",
            message:"categories is empty"
        })
    }

    return res.status(200).json({
        status:"success",
        message:"fetched categories successfully",
        data:categories
    })
}

export const editCategory = async (req,res) => {
    const categoryId  = req.params.id;
    const { name } = req.body; 
  
  try {
    const updatedCategory = await category.findByIdAndUpdate(categoryId, { name }, { new: true });

    if (!updatedCategory) {
      return res.status(404).json({
        status: "error",
        message: "Category not found"
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Category updated successfully",
      data: updatedCategory
    });

  } 
  catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error"
    });
  }
}

export const deleteCategory = async (req,res) => {
    const categoryId = req.params.id

  try {
    const deletedCategory = await category.findByIdAndDelete(categoryId);

    if (!deletedCategory) {
      return res.status(404).json({
        status: "error",
        message: "Category not found"
      });
    }
    return res.status(200).json({
      status: "success",
      message: "Category deleted successfully",
      data: deletedCategory
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error"
    });
  }
}