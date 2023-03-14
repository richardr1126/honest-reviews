import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Axios from 'axios';
import MovieCard from './MovieCard';
import SearchBar from './SearchBar';
import Alert from '@mui/material/Alert';


function MoviesList(props) {
  const [listofMovies, setListOfMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  //set new boolean variable to check if reviedId is in the query params
  const reviewId = queryParams.get('reviewId');
  const hasReviewId = reviewId !== null;

  const isMobile = window.innerWidth <= 768;
  const bgColor = props.darkMode ? '#262626' : 'white';

  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    Axios.get((process.env.NODE_ENV === 'production') ? '/api/movies/get' : 'http://192.168.0.25:3001/api/movies/get').then((response) => {
      //sort movies by latest review date
      setListOfMovies(response.data.filter((movie) =>
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

      }, []));
    });

  }, [searchTerm]);

  function searchOMDB() {
    //get movies from omdb api
    Axios.get(`https://www.omdbapi.com/?i=tt3896198&apikey=dd610a6e&s=${searchTerm}&type=movie`).then(async (response) => {
      if (response.data.Response === 'True') {
        const newMoviesPromises = response.data.Search.map(async (movieUnformatted) => {
          const movieDetailed = await Axios.get(`https://www.omdbapi.com/?i=tt3896198&apikey=dd610a6e&t=${movieUnformatted.Title}&type=movie`)
          if (movieDetailed.data.Response === 'True') {
            console.log(movieDetailed.data);

            return {
              _id: movieDetailed.data.imdbID,
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

        const allMovies = [...listofMovies, ...newMovies.filter((movie) => movie !== null)];
        const filteredMovies = allMovies.filter((movie) =>
          // check to make sure the movie has a poster image
          movie.posterImageUrl !== 'N/A'
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
        setListOfMovies(filteredMovies);
      }
    }).catch((error) => {
      console.error(error);
    });
  }

  function alertSpam() {
    setShowAlert(true);
  }

  useEffect(() => {
    if (showAlert) {
      setTimeout(() => {
        setShowAlert(false);
      }, 8000);
    }
  }, [showAlert]);



  return (
    <div className='box container is-max-desktop' style={isMobile ? { padding: '10px', backgroundColor: bgColor, outline: '0' } : { backgroundColor: bgColor }}>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} searchOMDB={searchOMDB} />
      {showAlert && <Alert severity="warning">Your review was marked for spam by ChatGPT and hidden, please write a real review!</Alert>}
      <ul aria-live="polite">
        {listofMovies.map((movie) => {
          return (
            <li key={movie._id}>
              <MovieCard hasReviewId={hasReviewId} reviewIdToScroll={reviewId} key={movie._id} darkMode={props.darkMode} movie={movie} setListOfMovies={setListOfMovies} listofMovies={listofMovies} alertSpam={alertSpam}/>
            </li>
          );
        })}
      </ul>
    </div>
  );

}

export default MoviesList;
