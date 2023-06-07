const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

// Create the function that will return the function similar to deleteTour.
// Inside this factory function we should pass the Model.
exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(
        new AppError('No document found with that ID', 404)
      );
    }

    res.status(204).json({
      status: 'Success',
      data: null,
    });
  });

// Factory function of UPDATE using updateTour function inside tourController file.
exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!doc) {
      return next(
        new AppError('No document found with that ID', 404)
      );
    }

    res.status(200).json({
      status: 'Success',
      data: {
        data: doc,
      },
    });
  });

//Factory function of POST using createTour function inside tourController file.
exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'Success',
      data: {
        data: doc,
      },
    });
  });

//Factory function of GET based on findbyId
exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) {
      query = query.populate(popOptions);
    }
    const doc = await query;

    if (!doc) {
      return next(
        new AppError('No document found with that ID', 404)
      );
    }

    res.status(200).json({
      status: 'Success',
      data: {
        data: doc,
      },
    });
  });

//Function to GET all of the data from the database with all API features.
exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    //If there is a tour ID in route get all reviews that belong to this tour ID specified in the route parameter
    //To allow for nested GET reviews on tour (small hack)
    let filter = {};
    if (req.params.tourId) {
      filter = { tour: req.params.tourId };
    }

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const docs = await features.query; // We can add .explain() to see the query details.

    //SEND RESPONSE
    res.status(200).json({
      status: 'Success',
      results: docs.length,
      data: {
        data: docs,
      },
    });
  });
