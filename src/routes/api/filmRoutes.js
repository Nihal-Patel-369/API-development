const express = require('express');
const router = express.Router();
const filmController = require('../../controllers/filmController');

router.route('/')
  .get(filmController.getAllFilms)
  .post(filmController.createFilm);

router.route('/:id')
  .get(filmController.getFilmById)
  .put(filmController.updateFilm)
  .delete(filmController.deleteFilm);

module.exports = router;
