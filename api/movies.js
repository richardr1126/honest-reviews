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
      director: movie.director,
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

router.post('/upvote', async (req, res) => {
  const { movie, review, newval_up, newval_down } = req.body;
  //console.log(review);
  let foundMovie = await MovieReviewModel.findOne({ title: movie.title });
  if (foundMovie) {
    //console.log(foundMovie.reviews);
    let foundReview = foundMovie.reviews.find(r => r._id.toString() === review._id);
    //console.log(foundReview);
    if (foundReview) {
      foundReview.upvotes = newval_up;
      foundReview.downvotes = newval_down;
      //console.log(foundReview);
      await foundMovie.save();
      res.json({ message: 'Upvote added successfully' });
    } else {
      res.status(404).json({ message: 'Review not found' });
    }
  } else {
    res.status(404).json({ message: 'Movie not found' });
  }
});

//downvote a review
router.post('/downvote', async (req, res) => {
  const { movie, review, newval_down, newval_up } = req.body;
  //console.log(review);
  let foundMovie = await MovieReviewModel.findOne({ title: movie.title });
  if (foundMovie) {
    //console.log(foundMovie.reviews);
    let foundReview = foundMovie.reviews.find(r => r._id.toString() === review._id);
    //console.log(foundReview);
    if (foundReview) {
      foundReview.downvotes = newval_up;
      foundReview.upvotes = newval_down;
      //console.log(foundReview);
      await foundMovie.save();
      res.json({ message: 'Downvote added successfully' });
    } else {
      res.status(404).json({ message: 'Review not found' });
    }
  } else {
    res.status(404).json({ message: 'Movie not found' });
  }
});

module.exports = router 