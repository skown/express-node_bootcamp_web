const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('../controllers/handlerFactory');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

// exports.getAllUsers = catchAsync(async (req, res, next) => {
//   const users = await User.find();

//   //SEND RESPONSE
//   res.status(200).json({
//     status: 'success',
//     results: users.length,
//     data: {
//       users,
//     },
//   });
// });

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

// update the current authenticated user
exports.updateMe = catchAsync(async (req, res, next) => {
  // Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword',
        400
      )
    );
  }

  // Update the user document but only name and email
  const filtredBody = filterObj(req.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    filtredBody,
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    status: 'success',
    data: {
      updatedUser,
    },
  });
});

// function to delete the current user, changing the active field to false in user collection
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message:
      'This route is not yet defined! Please use /signup instead.',
  });
};

// exports.getUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not yet defined!',
//   });
// };

// exports.updateUser = (req, res) => {
//   res.status(500).json({
//     status: 'error',
//     message: 'This route is not yet defined!',
//   });
// };

//Function to DELETE a user using factory handlerFunction
exports.deleteUser = factory.deleteOne(User);
//Function to UPDATE a user using factory handlerFunction
exports.updateUser = factory.updateOne(User);
//Function to GET a user using factory handlerFunction
exports.getUser = factory.getOne(User);
//Function to GET all users using factory handlerFunction
exports.getAllUsers = factory.getAll(User);
