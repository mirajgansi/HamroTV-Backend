const Movie = require("../model/movie");

// Add a new movie
exports.addMovie = async (req, res) => {
  try {
    const { movie_name, movie_description, youtube_link, release_year, genre, director, rating } = req.body;
    const thumbnailupload = req.file ? req.file.path : null;

    const newMovie = await Movie.create({
      movie_name:trim(),
      movie_description,
      youtube_link,
      release_year,
      genre,
      director,
      rating,
      thumbnailupload,
    });

    res.status(201).json(newMovie);
  } catch (err) {
    console.error("Error adding movie:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get all movies
exports.getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.findAll({ attributes: { exclude: ["timestamps"] } }); // Exclude timestamps if needed
    res.status(200).json(movies);
  } catch (err) {
    console.error("Error fetching movies:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get a single movie by ID
exports.getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id); // ✅ Use `findByPk()`
    if (!movie) return res.status(404).json({ error: "Movie not found" });
    res.status(200).json(movie);
  } catch (err) {
    console.error("Error fetching movie:", err);
    res.status(500).json({ error: err.message });
  }
};

const { Op } = require("sequelize");

exports.getMovieByName = async (req, res) => {
  try {
    const movieName = req.params.movie_name.trim();  // Trim spaces from movie name
    console.log("Searching for movie:", movieName);

    if (!movieName) {
      return res.status(400).json({ error: "Movie name is required" });
    }

    // Log the movie name to make sure it's being passed correctly
    console.log("Movie name after trimming:", movieName);

    // Perform the case-insensitive search using ILIKE
    const movies = await Movie.findAll({
      where: {
        movie_name: {
          [Op.iLike]: `%${movieName}%`  // Case-insensitive search
        }
      },
      attributes: ["movie_name", "thumbnailupload", "youtube_link"]
    });

    // Log the found movies to see if they're being retrieved correctly
    console.log("Movies retrieved from the database:", movies.map(movie => movie.movie_name));

    if (movies.length === 0) {
      console.log("No movies found with the name:", movieName);
      return res.status(404).json({ error: "No movies found" });
    }

    res.status(200).json(movies);
  } catch (err) {
    console.error("Error fetching movie:", err);
    res.status(500).json({ error: err.message });
  }
};


// Delete a movie by ID
exports.deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id);
    if (!movie) return res.status(404).json({ error: "Movie not found" });

    await movie.destroy(); // ✅ Use `destroy()` instead of `findByIdAndDelete()`
    res.status(200).json({ message: "Movie deleted successfully" });
  } catch (err) {
    console.error("Error deleting movie:", err);
    res.status(500).json({ error: err.message });
  }
};
