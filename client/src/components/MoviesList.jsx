import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Axios from 'axios';
import MovieCard from './MovieCard';
import SearchBar from './SearchBar';


function MoviesList(props) {
  const [listofMovies, setListOfMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const reviewId = queryParams.get('reviewId');

  useEffect(() => {
    Axios.get((process.env.NODE_ENV === 'production') ? '/api/movies/get' : 'http://localhost:3001/api/movies/get').then((response) => {
      //sort movies by latest review date
      const movies = response.data.sort((a, b) => {
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
      setListOfMovies(movies);
    });
    //if search term has more than 5 characters
    if (searchTerm.length >= 3) {
      //get movies from omdb api
      Axios.get(`https://www.omdbapi.com/?i=tt3896198&apikey=dd610a6e&s=${searchTerm}&type=movie`)
        .then(async (response) => {
          if (response.data.Response === 'True') {
            const newMoviesPromises = response.data.Search.map(async (movieUnformatted) => {
              const movieDetailed = await Axios.get(`https://www.omdbapi.com/?i=tt3896198&apikey=dd610a6e&t=${movieUnformatted.Title}&type=movie`)
              if (movieDetailed.data.Response === 'True') {
                console.log(movieDetailed.data);

                return {
                  _id: "",
                  title: movieDetailed.data.Title,
                  director: movieDetailed.data.Director,
                  releaseDate: (movieDetailed.data.Released === 'N/A') ? null : movieDetailed.data.Released,
                  genre: movieDetailed.data.Genre,
                  plot: movieDetailed.data.Plot,
                  cast: movieDetailed.data.Actors,
                  reviews: [],
                  posterImageUrl: movieDetailed.data.Poster
                };
              } else {
                return null;
              }
            });


            const newMovies = await Promise.all(newMoviesPromises);
            //check if any movies in the newMovies array have the same name, if they do filter them out
            setListOfMovies(listOfMovies => {
              const moviesToAdd = newMovies.filter(newMovie => !listOfMovies.some(movie => movie.title === newMovie.title));
              return [...listOfMovies, ...moviesToAdd];
            });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [searchTerm]);


  // filter through the list of movies to find the ones that match the search term
  const filteredMovies = listofMovies.filter((movie) =>
    // convert the movie title and the search term to lowercase so that it is case-insensitive
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    // check to make sure the movie has a poster image
    && movie.posterImageUrl !== 'N/A'
    // check to make sure the movie has a plot
    && movie.plot !== 'N/A'
    // check to make sure the movie has a cast
    && movie.cast !== 'N/A'
    // check to make sure the movie has a genre
    && movie.genre !== 'N/A'
    // check to make sure the movie has a director
    && movie.director !== 'N/A'
  ).reduce((acc, current) => {
    // if the movie is not already in the filtered list of movies, add it
    if (!acc.some((item) => item.title === current.title)) {
      acc.push(current);
    }
    // return the filtered list of movies
    return acc;

  }, []);


  try { //sort movies by latest review date
    filteredMovies.sort((a, b) => {
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

  } catch (error) { //if no reviews are attached to movies
    console.log("sorting error, no reviews attached to movies");
  }


  return (
    <div className='box container is-max-desktop' style={props.darkMode ? { backgroundColor: '#262626' } : { backgroundColor: 'white' }}>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <ul aria-live="polite">
        {filteredMovies.map((movie) => {
          return (
            <li key={movie._id}>
              <MovieCard reviewIdToScroll={reviewId} key={movie._id} darkMode={props.darkMode} movie={movie} setListOfMovies={setListOfMovies} listofMovies={listofMovies} />
            </li>
          );
        })}
      </ul>
    </div>
  );

}

export default MoviesList;
