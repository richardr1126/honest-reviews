const express = require('express');
const router = express.Router()

const MovieReviewModel = require('../models/Movies')
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);



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
  const reviewText = review.review;
  const prompt = `Can you detect if this is a spam or inappropriate movie review or if it just doesn't belong on a real website, respond with just "true" if it is a bad review and "false" if it is a good review? Review: \n"${reviewText}"`;
  console.log(prompt);
  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    temperature: 0.2,
    max_tokens: 800,
    messages: [
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

  //return updated list of movies
  MovieReviewModel.find({}, (err, movies) => {
    if (err) {
      res.json(err);
    } else {
      res.json(movies);
    }
  });
})

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