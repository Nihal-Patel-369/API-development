const FilmModel = require('../models/filmModel');

/**
 * Controller handling film REST API requests
 */
exports.getAllFilms = async (req, res, next) => {
  try {
    const { page, limit, search, category } = req.query;
    const result = await FilmModel.findAll({ page, limit, search, category });
    res.json({
      status: 'success',
      ...result
    });
  } catch (error) {
    next(error);
  }
};

exports.getFilmById = async (req, res, next) => {
  try {
    const film = await FilmModel.findById(req.params.id);
    if (!film) {
      return res.status(404).json({
        status: 'fail',
        message: `Film with ID ${req.params.id} not found`
      });
    }
    res.json({
      status: 'success',
      data: film
    });
  } catch (error) {
    next(error);
  }
};

exports.createFilm = async (req, res, next) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({
        status: 'fail',
        message: 'Film title is required'
      });
    }
    const newFilm = await FilmModel.create(req.body);
    res.status(201).json({
      status: 'success',
      data: newFilm
    });
  } catch (error) {
    next(error);
  }
};

exports.updateFilm = async (req, res, next) => {
  try {
    const updatedFilm = await FilmModel.update(req.params.id, req.body);
    if (!updatedFilm) {
      return res.status(404).json({
        status: 'fail',
        message: `Film with ID ${req.params.id} not found`
      });
    }
    res.json({
      status: 'success',
      data: updatedFilm
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteFilm = async (req, res, next) => {
  try {
    const deleted = await FilmModel.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        status: 'fail',
        message: `Film with ID ${req.params.id} not found`
      });
    }
    res.json({
      status: 'success',
      message: `Film ${req.params.id} deleted successfully`
    });
  } catch (error) {
    next(error);
  }
};
