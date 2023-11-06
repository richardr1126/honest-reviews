import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import Axios from 'axios';
import MovieCard from './MovieCard';
import SearchBar from './SearchBar';
import Alert from '@mui/material/Alert';
import SorterControl from './SorterControl';
import { IonSpinner, IonIcon } from '@ionic/react';
import { caretDown, caretUp } from 'ionicons/icons';

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
  const [sorter, setSorter] = useState(localStorage.getItem('sorter') || 'release-date-new');
  const [genreSorter, setGenreSorter] = useState('all');

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

  const sortByMode = useCallback((sorter, movies) => {
    switch (sorter) {
      case 'latest-reviewed':
        //sort movies by their most recent review they have
        return movies.sort((a, b) => {
          const aDate = new Date(a.reviews[0].date);
          const bDate = new Date(b.reviews[0].date);
          return bDate - aDate;
        });
      case 'oldest-reviewed':
        //sort movies by their oldest review they have
        return movies.sort((a, b) => {
          const aDate = new Date(a.reviews[0].date);
          const bDate = new Date(b.reviews[0].date);
          return aDate - bDate;
        });
      case 'release-date-new':
        //sort movies by their release date
        return movies.sort((a, b) => {
          const aDate = new Date(a.releaseDate);
          const bDate = new Date(b.releaseDate);
          return bDate - aDate;
        });
      case 'release-date-old':
        //sort movies by their release date
        return movies.sort((a, b) => {
          const aDate = new Date(a.releaseDate);
          const bDate = new Date(b.releaseDate);
          return aDate - bDate;
        });
      default:
        //sort movies by their most recent review they have
        return movies.sort((a, b) => {
          const aDate = new Date(a.reviews[0].date);
          const bDate = new Date(b.reviews[0].date);
          return bDate - aDate;
        });
    }
  }, []);

  const sortByGenre = useCallback((genreSorter, movies) => {
    switch (genreSorter) {
      case 'all':
        return movies;
      case 'action':
        return movies.filter((movie) => movie.genre.toLowerCase().includes('action'));
      case 'adventure':
        return movies.filter((movie) => movie.genre.toLowerCase().includes('adventure'));
      case 'animation':
        return movies.filter((movie) => movie.genre.toLowerCase().includes('animation'));
      case 'comedy':
        return movies.filter((movie) => movie.genre.toLowerCase().includes('comedy'));
      case 'crime':
        return movies.filter((movie) => movie.genre.toLowerCase().includes('crime'));
      case 'documentary':
        return movies.filter((movie) => movie.genre.toLowerCase().includes('documentary'));
      case 'drama':
        return movies.filter((movie) => movie.genre.toLowerCase().includes('drama'));
      case 'family':
        return movies.filter((movie) => movie.genre.toLowerCase().includes('family'));
      case 'fantasy':
        return movies.filter((movie) => movie.genre.toLowerCase().includes('fantasy'));
      case 'history':
        return movies.filter((movie) => movie.genre.toLowerCase().includes('history'));
      case 'horror':
        return movies.filter((movie) => movie.genre.toLowerCase().includes('horror'));
      case 'music':
        return movies.filter((movie) => movie.genre.toLowerCase().includes('music'));
      case 'mystery':
        return movies.filter((movie) => movie.genre.toLowerCase().includes('mystery'));
      case 'romance':
        return movies.filter((movie) => movie.genre.toLowerCase().includes('romance'));
      default:
        return movies;
    }
  }, []);



  useEffect(() => {
    (async () => {
      try {
        const response = await Axios.get(
          process.env.NODE_ENV === 'production'
            ? 'https://honest-reviews-d38c2a521825.herokuapp.com/api/movies/get'
            : 'http://192.168.0.25:3001/api/movies/get'
        );

        setListOfMovies(filterAndDedupeMovies(sortByMode(sorter, sortByGenre(genreSorter, response.data))));

      } catch (error) {
        console.error(error);
      }
    })();
  }, [filterAndDedupeMovies, sortByMode, sorter, sortByGenre, genreSorter]);

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

  //create sorter legend
  const sorterLegend = {
    'latest-reviewed': 'Reviews',
    'oldest-reviewed': 'Reviews',
    'release-date-new': 'Release date',
    'release-date-old': 'Release date',
  };

  return (
    <div
      className='box container is-max-desktop'
      style={
        isMobile
          ? { padding: '10px', backgroundColor: bgColor, outline: '0' }
          : { backgroundColor: bgColor }
      }
    >
      <SorterControl genreSorter={genreSorter} setGenreSorter={setGenreSorter}></SorterControl>
      <SearchBar sorter={sorter} setSorter={setSorter} searchTerm={searchTerm} setSearchTerm={setSearchTerm} searchOMDB={searchOMDB} />           
      <span style={{ display: 'flex', width: 'fit-content', alignItems: 'center', justifyContent: 'left', marginBottom: '0.35rem' }} >
        <IonIcon icon={(sorter === 'latest-reviewed' || sorter === 'release-date-new') ? caretDown : caretUp} style={{fontSize: '1.4rem'}} />
        <p style={{fontSize: '0.9rem', fontWeight: 'bold',marginLeft: '0.25rem'}}>{sorterLegend[sorter]}</p>
      </span>
      {showAlert && (
        <Alert onClose={() => setShowAlert(false)} severity='warning'>
          Your review was marked for spam by ChatGPT and hidden, please write a real review!
        </Alert>
      )}

      {listOfMovies.length === 0 ? (
        <div className="spinner" style={{ textAlign: 'center', margin: '5rem' }}>
          <IonSpinner name="crescent" />
        </div>
      ) : (
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

      )}
    </div>
  );
}

export default MoviesList;

