import { useState, useEffect } from 'react';
import Axios from 'axios';
import MovieCard from './MovieCard';
import SearchBar from './SearchBar';


function MoviesList(props) {
  const [listofMovies, setListOfMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');


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
      Axios.get(`https://www.omdbapi.com/?i=tt3896198&apikey=${process.env.OMDB_APIKEY}&s=${searchTerm}&type=movie`)
        .then(async (response) => {
          if (response.data.Response === 'True') {
            const newMoviesPromises = response.data.Search.map(async (movieUnformatted) => {
              const movieDetailed = await Axios.get(`https://www.omdbapi.com/?i=tt3896198&apikey=${process.env.OMDB_APIKEY}&t=${movieUnformatted.Title}&type=movie`)
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


  const filteredMovies = listofMovies.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    && movie.posterImageUrl !== 'N/A'
    && movie.plot !== 'N/A'
    && movie.cast !== 'N/A'
    && movie.genre !== 'N/A'
    && movie.director !== 'N/A'
  ).reduce((acc, current) => {
    if (!acc.some((item) => item.title === current.title)) {
      acc.push(current);
    }
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
      {filteredMovies.map((movie) => {
        return (
          <MovieCard darkMode={props.darkMode} movie={movie} setListOfMovies={setListOfMovies} listofMovies={listofMovies} />
        );
      })}
    </div>
  );
}

export default MoviesList;
