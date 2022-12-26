const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  author: String,
  storyRating: Number,
  musicRating: Number,
  performencesRating: Number,
  review: String,
  date: Date
});

const movieSchema = new mongoose.Schema({
  _id: String,
  title: String,
  director: String,
  releaseDate: Date,
  genre: String,
  plot: String,
  cast: String,
  reviews: [reviewSchema],
  posterImageUrl: String
});

const MovieReviewModel = mongoose.model('movies', movieSchema);
module.exports = MovieReviewModel;