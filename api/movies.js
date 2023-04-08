const express = require('express');
const router = express.Router()

const MovieReviewModel = require('../models/Movies')
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const Axios = require('axios');



router.get('/get', (req, res) => {
  let searchTerm = req.query.searchTerm;
  MovieReviewModel.find({})
    .exec((err, response) => {
      if (err) {
        res.json(err);
      } else {
        const movies = response;
        movies.sort((a, b) => {
          if (a.reviews.length > 0 && b.reviews.length > 0) {
            return new Date(b.reviews[b.reviews.length - 1].date) - new Date(a.reviews[a.reviews.length - 1].date);
          } else if (a.reviews.length > 0) {
            return new Date(b.reviews[b.reviews.length - 1].date) - new Date(a.releaseDate);
          } else if (b.reviews.length > 0) {
            return new Date(b.releaseDate) - new Date(a.reviews[a.reviews.length - 1].date);
          } else {
            return new Date(b.releaseDate) - new Date(a.releaseDate);
          }
        });
        
        res.json(movies);
      }
    });
});



router.post('/post', async (req, res) => {
  const { movie, review } = req.body;
  const reviewText = review.review;
  const sys_prompt = `You are a Movie Review Checker Bot. You detect if movie reviews are spam, inappropriate, or if they don't have anything 
  to do with the title of the movie at all. I will give you the title of the movie and the review. Reply only with 'true' if it is spam or 'false' if it isn't, nothing else.`;
  const prompt = `Title: ${movie.title}\nReview: ${reviewText}`;
  console.log(prompt);
  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    max_tokens: 800,
    messages: [
      { "role": "system", "content": sys_prompt },
      { "role": "user", "content": prompt },
    ]
  });
  console.log(completion.data.choices[0].message.content);
  const response = completion.data.choices[0].message.content.toLowerCase();
  const isSpam = response.match(/\btrue\b/) ? true : false;
  console.log(isSpam);

  let foundMovie = await MovieReviewModel.findOne({ title: movie.title });
  if (!isSpam) {
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
  }

  //send movies and isSpam to frontend
  const movies = await MovieReviewModel.find({});
  movies.sort((a, b) => {
    if (a.reviews.length > 0 && b.reviews.length > 0) {
      return new Date(b.reviews[b.reviews.length - 1].date) - new Date(a.reviews[a.reviews.length - 1].date);
    } else if (a.reviews.length > 0) {
      return new Date(b.reviews[b.reviews.length - 1].date) - new Date(a.releaseDate);
    } else if (b.reviews.length > 0) {
      return new Date(b.releaseDate) - new Date(a.reviews[a.reviews.length - 1].date);
    } else {
      return new Date(b.releaseDate) - new Date(a.releaseDate);
    }
  });
  res.json({ movies, isSpam });
});

router.post('/vote', async (req, res) => {
  const { movie, review } = req.body;
  //console.log(review);
  let foundMovie = await MovieReviewModel.findOne({ title: movie.title });
  if (foundMovie) {
    //console.log(foundMovie.reviews);
    let foundReview = foundMovie.reviews.find(r => r._id.toString() === review._id);
    //console.log(foundReview);
    if (foundReview) {
      foundReview.votes = review.votes;
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


module.exports = router 