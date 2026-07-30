const ActorModel = require('../models/actorModel');

exports.getAllActors = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;
    const result = await ActorModel.findAll({ page, limit, search });
    res.json({
      status: 'success',
      ...result
    });
  } catch (error) {
    next(error);
  }
};

exports.getActorById = async (req, res, next) => {
  try {
    const actor = await ActorModel.findById(req.params.id);
    if (!actor) {
      return res.status(404).json({
        status: 'fail',
        message: `Actor with ID ${req.params.id} not found`
      });
    }
    res.json({
      status: 'success',
      data: actor
    });
  } catch (error) {
    next(error);
  }
};

exports.createActor = async (req, res, next) => {
  try {
    const { first_name, last_name } = req.body;
    if (!first_name || !last_name) {
      return res.status(400).json({
        status: 'fail',
        message: 'first_name and last_name are required'
      });
    }
    const newActor = await ActorModel.create({ first_name, last_name });
    res.status(201).json({
      status: 'success',
      data: newActor
    });
  } catch (error) {
    next(error);
  }
};

exports.updateActor = async (req, res, next) => {
  try {
    const updated = await ActorModel.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({
        status: 'fail',
        message: `Actor with ID ${req.params.id} not found`
      });
    }
    res.json({
      status: 'success',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteActor = async (req, res, next) => {
  try {
    const deleted = await ActorModel.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        status: 'fail',
        message: `Actor with ID ${req.params.id} not found`
      });
    }
    res.json({
      status: 'success',
      message: `Actor ${req.params.id} deleted successfully`
    });
  } catch (error) {
    next(error);
  }
};
