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
        `https://api.themoviedb.org/3/search/movie?api_key=93e398a3dcc4a264a6fe485c3f16a028&language=en-US&query=${searchTerm}&page=1&include_adult=false`
      );
      //console.log('response', response);
      if (response.data.total_results > 0) {
        const newMoviesPromises = response.data.results.map(async (movieUnformatted) => {
          try {
            const movieDetailed = await Axios.get(
              `https://api.themoviedb.org/3/movie/${movieUnformatted.id}?api_key=93e398a3dcc4a264a6fe485c3f16a028&language=en-US`
            );
            const castAndCrew = await Axios.get(`https://api.themoviedb.org/3/movie/${movieUnformatted.id}/credits?api_key=93e398a3dcc4a264a6fe485c3f16a028&language=en-US`);
            
            //get first 5 cast members
            const cast = castAndCrew.data.cast.slice(0, 4).map((member) => member.name).join(', ');
            //get director
            const director = castAndCrew.data.crew.find((member) => member.job === 'Director');
            const directorName = director ? director.name : '';

            //get genres
            const genre = movieDetailed.data.genres.map((genre) => genre.name).join(', ');

            if (
              movieDetailed.data.status !== 'Released' ||
              movieDetailed.data.poster_path === null ||
              movieDetailed.data.overview === '' ||
              movieDetailed.data.release_date === '' ||
              movieDetailed.data.original_title === '' ||
              movieDetailed.data.imdb_id === ''
            ) {
              return null;
            }

            return {
              _id: movieDetailed.data.imdb_id,
              title: movieDetailed.data.original_title,
              director: directorName,
              releaseDate: movieDetailed.data.release_date,
              genre: genre,
              //limit plot to 200 characters
              plot: movieDetailed.data.overview,
              cast: cast,
              reviews: [],
              posterImageUrl: `https://image.tmdb.org/t/p/original${movieDetailed.data.poster_path}`,
            };
            
            
            
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
                setSearchTerm={setSearchTerm}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default MoviesList;

