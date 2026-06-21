import User from "../models/user.model.js";

//get user profile
export async function getProfile(req, res, next) {
  try {

    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User doesn't exist"
      })
    }

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user
    })

  } catch (error) {
    next(error);
  }
}


//update user profile
export async function updateProfile(req, res, next) {
  try {
    
    const data = req.body;

    if(!data) {
      return res.status(400).json({
        success: false,
        message: "data is required for updation"
      })
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, data, {
      new: true
    });

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      updatedUser: updatedUser
    })

  } catch (error) {
    next(error);
  }
}


//delete user profile
export async function deleteProfile(req, res, next) {
  try {
    
    const deletedUser = await User.findByIdAndDelete(req.user._id);

    if(!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User doesn't exist"
      })
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: deletedUser
    })

  } catch (error) {
    next(error);
  }
}


//get user history
export async function getUserHistory(req, res, next) {
  try {
    
  } catch (error) {
    next(error);
  }
}