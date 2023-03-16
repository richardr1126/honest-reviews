import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import Axios from 'axios';
import MovieCard from './MovieCard';
import SearchBar from './SearchBar';
import Alert from '@mui/material/Alert';

function MoviesList(props) {
  const [listOfMovies, setListOfMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const reviewId = queryParams.get('reviewId');
  const hasReviewId = reviewId !== null;

  const isMobile = window.innerWidth <= 768;
  const bgColor = props.darkMode ? '#262626' : 'white';

  const [showAlert, setShowAlert] = useState(false);

  const filterAndDedupeMovies = useCallback((movies) => {
    return movies
      .filter((movie) =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        movie.posterImageUrl !== 'N/A' &&
        movie.plot !== 'N/A' &&
        movie.cast !== 'N/A' &&
        movie.genre !== 'N/A' &&
        movie.director !== 'N/A'
      )
      .reduce((acc, current) => {
        if (!acc.some((item) => item.title === current.title)) {
          acc.push(current);
        }
        return acc;
      }, []);
  }, [searchTerm]);

  useEffect(() => {
    (async () => {
      try {
        const response = await Axios.get(
          process.env.NODE_ENV === 'production'
            ? '/api/movies/get'
            : 'http://192.168.0.25:3001/api/movies/get'
        );
        setListOfMovies(filterAndDedupeMovies(response.data));
      } catch (error) {
        console.error(error);
      }
    })();
  }, [filterAndDedupeMovies]);

  const searchOMDB = useCallback(async () => {
    try {
      const response = await Axios.get(
        `https://www.omdbapi.com/?i=tt3896198&apikey=dd610a6e&s=${searchTerm}&type=movie`
      );
      if (response.data.Response === 'True') {
        const newMoviesPromises = response.data.Search.map(async (movieUnformatted) => {
          try {
            const movieDetailed = await Axios.get(
              `https://www.omdbapi.com/?i=tt3896198&apikey=dd610a6e&t=${movieUnformatted.Title}&type=movie`
            );
            if (movieDetailed.data.Response === 'True') {
              return {
                _id: movieDetailed.data.imdbID,
                title: movieDetailed.data.Title,
                director: movieDetailed.data.Director,
                releaseDate: movieDetailed.data.Released === 'N/A' ? null : movieDetailed.data.Released,
                genre: movieDetailed.data.Genre,
                plot: movieDetailed.data.Plot,
                cast: movieDetailed.data.Actors,
                reviews: [],
                posterImageUrl: movieDetailed.data.Poster,
              };
            } else {
              return null;
            }
          } catch (error) {
            console.error(error);
            return null;
          }
        });

        const newMovies = await Promise.all(newMoviesPromises);
        const allMovies = [...listOfMovies, ...newMovies.filter((movie) => movie !== null)];
        const filteredMovies = filterAndDedupeMovies(allMovies);
        setListOfMovies(filteredMovies);
      }
    } catch (error) {
      console.error(error);
    }
  }, [searchTerm, listOfMovies, filterAndDedupeMovies]);

  function alertSpam() {
    setShowAlert(true);
  }

  useEffect(() => {
    if (showAlert) {
      setTimeout(() => {
        setShowAlert(false);
      }, 30000);
    }
  }, [showAlert]);

  return (
    <div
      className='box container is-max-desktop'
      style={
        isMobile
          ? { padding: '10px', backgroundColor: bgColor, outline: '0' }
          : { backgroundColor: bgColor }
      }
    >
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} searchOMDB={searchOMDB} />
      {showAlert && (
        <Alert onClose={() => setShowAlert(false)} severity='warning'>
          Your review was marked for spam by ChatGPT and hidden, please write a real review!
        </Alert>
      )}
      <ul aria-live='polite'>
        {listOfMovies.map((movie) => {
          return (
            <li key={movie._id}>
              <MovieCard
                hasReviewId={hasReviewId}
                reviewIdToScroll={reviewId}
                key={movie._id}
                darkMode={props.darkMode}
                movie={movie}
                setListOfMovies={setListOfMovies}
                listOfMovies={listOfMovies}
                alertSpam={alertSpam}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default MoviesList;

