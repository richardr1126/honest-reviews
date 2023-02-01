import { useRef, useState, useId, useEffect } from 'react';
import { IonIcon } from '@ionic/react';
import { addCircleOutline, chevronUpOutline } from 'ionicons/icons';
import ReviewModal from './ReviewModal';

function MovieCard(props) {

  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: '2-digit',
    year: 'numeric'
  });

  // Create a ref for the modal element
  const modalRef = useRef(null);

  const [expanded, setExpanded] = useState(false);

  const movieId = "movie-" + useId();
  props.movie._id = movieId;

  const isMobile = window.innerWidth < 768;
  const hasReviews = props.movie.reviews.length > 0;

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
        <div className="card-content" style={expanded ^ !hasReviews ? { paddingBottom: '12px' } : {}}>
          {isMobile && (
            <div className="card-image" style={{paddingBottom: '0.75rem'}}>
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
            {props.movie.reviews.map((review) => (
              <div className='box is-hoverable' key={review._id}>
                <div className='columns'>
                  <div className='column is-three-quarters'>
                    <strong>{review.author}</strong>
                    <p>{review.review}</p>
                    <p>{dateFormatter.format(new Date(review.date))}</p>
                  </div>
                  <div className='column'>
                    <label className='label'>Story <progress className="progress is-danger is-small" value={review.storyRating} max="5">{review.storyRating}%</progress></label>
                    <label className='label'>Performences <progress className="progress is-info is-small" value={review.performencesRating} max="5">{review.performencesRating}%</progress></label>
                    <label className='label'>Music <progress className="progress is-primary is-small" value={review.musicRating} max="5">{review.musicRating}%</progress></label>
                  </div>
                </div>

              </div>

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

    </div>
  );
}

function calculateAverageRating(reviews) {
  if (reviews.length === 0) return 0;
  const totalRating = reviews.reduce((acc, review) => acc + (review.storyRating * 3) + review.musicRating + (review.performencesRating * 2), 0);
  return Math.round((totalRating / (reviews.length * 6)) * 2);
}



export default MovieCard;
