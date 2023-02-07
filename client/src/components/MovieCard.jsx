import { useRef, useState, useId, useEffect } from 'react';
import { IonIcon } from '@ionic/react';
import { addCircleOutline, chevronUpOutline } from 'ionicons/icons';
import ReviewModal from './ReviewModal';
import Review from './Review';
import CookieConsent from 'react-cookie-consent';

function MovieCard(props) {
  // Create a ref for the modal element
  const modalRef = useRef(null);
  // useState for openening and closing the card
  const [expanded, setExpanded] = useState(false);
  //---------------------------------------------
  // Create a unique id for the movie card with random number
  const randomNum = Math.floor(Math.random() * 1000000000);
  const movieId = "movie-" + randomNum + useId();
  props.movie._id = movieId;
  //---------------------------------------------
  // Check if device is mobile
  const isMobile = window.innerWidth < 768;
  // Check if movie has reviews
  const hasReviews = props.movie.reviews.length > 0;
  //---------------------------------------------
  // Create a date formatter to format the date from the database
  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: '2-digit',
    year: 'numeric'
  });
  //---------------------------------------------
  // Card style
  const cardStyle_padding = expanded ^ !hasReviews ? { paddingBottom: '12px' } : {};

  useEffect(() => {
    if (hasReviews) {
      setExpanded(false);
    } else {
      setExpanded(true);
    }
  }, [hasReviews]);

  return (
    <div key={movieId}>
      <br />
      <div className={expanded ? (props.darkMode ? "card is-darkmode-hoverable" : "card is-hoverable") : (props.darkMode ? "card is-darkmode-hoverable has-cursor-pointer" : "card is-hoverable has-cursor-pointer")} onClick={(event) => {
        if (!expanded) {
          setExpanded(true);
        }
      }} style={{ backgroundColor: '#f5f5f5' }}>
        <div className="card-content" style={cardStyle_padding}>
          {isMobile && (
            <div className="card-image" style={{ paddingBottom: '0.75rem' }}>
              <figure className={expanded && !isMobile ? 'image is-150x225' : 'image is-75x112'}>
                <img className='is-hoverable' src={props.movie.posterImageUrl} alt={props.movie.title} style={{ borderRadius: '0.25rem' }} />
              </figure>
            </div>
          )}
          <div className="media" style={expanded ? {} : { margin: '0rem' }}>
            {!isMobile && (
              <div className="media-left">
                <figure className={expanded && !isMobile ? 'image is-150x225' : 'image is-75x112'}>
                  <img className='is-hoverable' src={props.movie.posterImageUrl} alt={props.movie.title} style={{ borderRadius: '0.25rem' }} />
                </figure>
              </div>
            )}

            {/* No scroll media-content*/}
            <div className="media-content is-clipped" style={{ overflow: 'hidden' }}>
              <div className='columns'>
                <div className='column'>
                  <p className={expanded ? "title is-4" : "title is-5"}>
                    {props.movie.title + ' '}
                    {calculateAverageRating(props.movie.reviews) > 0 && (
                      <span className={expanded ? "tag is-info is-medium" : "tag is-info is-small"}>{calculateAverageRating(props.movie.reviews)}</span>
                    )}
                  </p>
                  <p className="subtitle is-6">
                    {'Directed by ' + props.movie.director}
                  </p>
                  <p className="subtitle is-6">
                    {dateFormatter.format(new Date(props.movie.releaseDate))}
                  </p>
                  <p>{props.movie.genre}</p>
                  <p>{props.movie.cast}</p>
                </div>
                <div className='column'>
                  {props.movie.plot}
                </div>
              </div>
            </div>
          </div>

          <div className={expanded ? 'content is-expanded' : 'content is-collapsed'}>
            {props.movie.reviews.sort((a, b) => (b.votes) - (a.votes)).map((review) => (
              <Review key={review._id} movie={props.movie} review={review} />
            ))}

            <ReviewModal movie={props.movie} modalRef={modalRef} setListOfMovies={props.setListOfMovies} listofMovies={props.listofMovies} />

            <button onClick={() => { modalRef.current.classList.toggle('is-active'); }} className='button is-fullwidth is-medium' style={{ borderRadius: '0.5rem' }}>
              <IonIcon icon={addCircleOutline} size='large' />
            </button>

            <div onClick={() => { setExpanded(false); }} className={expanded ^ !hasReviews ? '' : 'is-collapsed'}>
              <br />
              <IonIcon className='has-cursor-pointer' icon={chevronUpOutline} size='small' />
            </div>

          </div>

        </div>
      </div>
      {//if expanded, show cookie consent
        expanded && (<CookieConsent
          location="bottom"
          buttonText="Sure man!!"
          cookieName="acceptedCookies_BOOL"
          style={{ background: "#2B373B" }}
          buttonStyle={{ color: "#4e503b", fontSize: "18px", borderRadius: '5px', marginTop: isMobile ? '0' : '15px' }}
          expires={1000}
        >
          This website uses cookies to store the reviews you have upvoted.{" "}
          <span style={{ fontSize: "10px" }}>Or downvoted. To enhance the user experience :O</span>
        </CookieConsent>)
      }
    </div>
  );
}

// Calculates the average rating of reviews based on their individual ratings in story, music and performance aspects
function calculateAverageRating(reviews) {
  // If there are no reviews return 0
  if (reviews.length === 0) return 0;

  // Total variable set to 0
  // Calculating the sum of ratings from all reviews for story, music and performance
  // Multiplying each rating with its percentage weight
  const totalRating = reviews.reduce((acc, review) => acc + (review.storyRating * 15) + (review.musicRating * 8) + (review.performancesRating * 10), 0);

  // Dividing the total ratings with the sum of weights
  // Rounding the result to nearest integer
  return Math.round((totalRating / (reviews.length * 33)) * 2);
}


export default MovieCard;
