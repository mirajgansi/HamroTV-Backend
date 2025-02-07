const express = require('express');
const router = express.Router();
const movieController = require('../controller/movieController');

// Add a new movie
router.post('/', movieController.addMovie);

// Get all movies
router.get('/', movieController.getAllMovies);

router.get('/movies', movieController.getAllMovies);

// Get a single movie by ID
router.get('/:id', movieController.getMovieById);

// Delete a movie by ID
router.delete('/:id', movieController.deleteMovie); // Fixed this line

module.exports = router;