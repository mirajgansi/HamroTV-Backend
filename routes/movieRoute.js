const express = require('express');
const router = express.Router();
const upload = require('../middleware/imageUpload'); // Import upload middleware
const movieController = require('../controller/movieController'); // Import controller

// Add a new movie
router.post('/', upload.single('thumbnailUpload'), movieController.addMovie);

// Get all movies
router.get('/', movieController.getAllMovies);

// Get a single movie by ID
router.get('/:id', movieController.getMovieById);
router.get('/name/:movie_name', movieController.getMovieByName);
// Delete a movie by ID
router.delete('/:id', movieController.deleteMovie);

module.exports = router;
