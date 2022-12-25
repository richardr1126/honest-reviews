const express = require('express');
const router = express.Router()

const MovieReviewModel = require('../models/Movies')

router.get('/get', (req, res) => {
  MovieReviewModel.find({}, (err, movies) => {
    if (err) {
      res.json(err);
    } else {
      res.json(movies);
    }
  });
})

router.post('/post', async (req, res) => {
  const { movie, review } = req.body;
  let foundMovie = await MovieReviewModel.findOne({ title: movie.title });
  if (!foundMovie) {
    foundMovie = new MovieReviewModel({
      _id: movie._id,
      title: movie.title,
      releaseDate: movie.releaseDate,
      genre: movie.genre,
      plot: movie.plot,
      cast: movie.cast,
      reviews: [review],
      posterImageUrl: movie.posterImageUrl,
    });
    await foundMovie.save();
  } else {
    foundMovie.reviews.push(review);
    await foundMovie.save();
  }

  //return updated list of movies
  MovieReviewModel.find({}, (err, movies) => {
    if (err) {
      res.json(err);
    } else {
      res.json(movies);
    }
  });
})

module.exports = router 