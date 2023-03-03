import { useState, useRef, useEffect, useId } from 'react';
import Axios from 'axios';

function ReviewModal(props) {
  // Create a state variable for the slider values
  const [storySliderValue, setStorySliderValue] = useState(getRandomInt(0, 5));
  const [performancesSliderValue, setPerformancesSliderValue] = useState(getRandomInt(0, 5));
  const [musicSliderValue, setMusicSliderValue] = useState(getRandomInt(0, 5));
  const [reviewTextError, setReviewTextError] = useState(false);
  //character count
  const [characterCount, setCharacterCount] = useState(0);

  // Create state variables for the review author and text
  const reviewAuthorRef = useRef();
  const reviewTextRef = useRef();

  const isMobile = window.innerWidth <= 768;

  useEffect(() => {
    if (characterCount >= 200) {
      setReviewTextError(false);
    }
  }, [characterCount]);

  //get word count
  function getWordCount(str) {
    return str.trim().split(/\s+/).length;
  }

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function isSpamReview(review) {
    if (getWordCount(review) < 20) {
      return true;
    }

    const spamKeywords = ["fuck", "buy now", "click here", "shit", "bitch"];
    for (let keyword of spamKeywords) {
      if (review.includes(keyword)) {
        return true;
      }
    }
    if (review.match(/https?:\/\/[^\s]+/g) || review.includes(".com")) {
      return true;
    }
    const words = review.split(" ");
    const uniqueWords = [...new Set(words)];
    const uniqueWordsPercentage = uniqueWords.length / words.length;

    if (uniqueWordsPercentage < 0.5) {
      return true;
    }

    return false;
  }


  function createNewReview() {
    // Check if review author value is empty, set it to Anonymous if so
    reviewAuthorRef.current.value = reviewAuthorRef.current.value || 'Anonymous';

    // Check if review text is empty or less than 200 characters or is a spam review  
    if (!reviewTextRef.current.value || reviewTextRef.current.value.length < 200 || isSpamReview(reviewTextRef.current.value)) {
      setReviewTextError(true);
      return;
    }

    // Create object with the new review
    const newReview = {
      author: reviewAuthorRef.current.value,
      votes: 0,
      storyRating: storySliderValue,
      musicRating: musicSliderValue,
      performancesRating: performancesSliderValue,
      review: reviewTextRef.current.value,
      date: new Date()
    };

    // Make API call to post the new review
    Axios.post((process.env.NODE_ENV === 'production') ? '/api/movies/post' : 'http://localhost:3001/api/movies/post', {
      movie: props.movie, review: newReview
    })
      .then((response) => {
        props.modalRef.current.classList.toggle('is-active'); // toggle off modal
        props.setListOfMovies(response.data);
        window.scrollTo(0, 0);
        reviewAuthorRef.current.value = '';
        reviewTextRef.current.value = '';
        setCharacterCount(0);
        setStorySliderValue(getRandomInt(0, 5));
        setPerformancesSliderValue(getRandomInt(0, 5));
        setMusicSliderValue(getRandomInt(0, 5));
      });
  }

  //get unique id from react useId()

  const formId = useId();

  return (
    <div className="modal" ref={props.modalRef}>
      <div className='modal-background'>
        <div className="modal-content" style={{ paddingTop: '5rem', paddingRight: isMobile ? '2.5rem' : '', height: 'min-content' }}>
          <div className="box">
            <button className="modal-close is-large" aria-label="close" onClick={() => { props.modalRef.current.classList.toggle('is-active'); }}></button>
            <form onSubmit={event => { event.preventDefault(); }}>
              <div className="field">
                <label htmlFor={("reviewerName" + formId)} className="label">Name</label>
                <div className="control">
                  <input ref={reviewAuthorRef} id={("reviewerName" + formId)} className="input" type="text" placeholder="Enter a name or leave blank to be anonymous" />
                </div>
              </div>
              <div className="field">
                <label htmlFor={("storyRating" + formId)} className="label">Story Rating: {storySliderValue}</label>
                <div className="control">
                  <input value={storySliderValue} onChange={(event) => { setStorySliderValue(event.target.value); }} className="bar" type="range" min="0" max="5" step="1" style={{ width: '100%' }} id={("storyRating" + formId)} />
                </div>
              </div>
              <div className="field">
                <label htmlFor={("performancesRating" + formId)} className="label">Performances Rating: {performancesSliderValue}</label>
                <div className="control">
                  <input value={performancesSliderValue} onChange={(event) => { setPerformancesSliderValue(event.target.value); }} className="bar" type="range" min="0" max="5" step="1" style={{ width: '100%' }} id={("performancesRating" + formId)} />
                </div>
              </div>
              <div className="field">
                <label htmlFor={("musicRating" + formId)} className="label">Music Rating: {musicSliderValue}</label>
                <div className="control">
                  <input value={musicSliderValue} onChange={(event) => { setMusicSliderValue(event.target.value); }} className="bar" type="range" min="0" max="5" step="1" style={{ width: '100%' }} id={("musicRating" + formId)} />
                </div>
              </div>
              <div className="field">
                <label htmlFor={("reviewText" + formId)} className="label" style={reviewTextError ? { color: "red" } : {}}>{reviewTextError ? "Error: Please enter a valid review" : "Review"}</label>
                <div className="control">
                  <textarea ref={reviewTextRef} className="textarea" onChange={(event) => { setCharacterCount(event.target.value.length); }} placeholder="Write a review of at least 200 characters" style={((characterCount < 200 && characterCount > 0) || reviewTextError) ? { border: "2px solid #f14668" } : ((characterCount > 0) ? { border: "2px solid #48c78e" } : {})} id={("reviewText" + formId)}></textarea>
                </div>
              </div>
              <div className="columns">
                <div className="column">
                  <div className="control">
                    <button onClick={createNewReview} className="button is-link">Submit</button>
                  </div>
                </div>
                <div className="column has-text-right">
                  <p className={(characterCount < 200) ? 'has-text-danger' : 'has-text-success'}>{characterCount}/200</p>
                </div>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewModal;
