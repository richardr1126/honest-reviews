import { useState, useRef, useEffect } from 'react';
import Axios from 'axios';

function ReviewModal(props) {
  // Create a state variable for the slider values
  const [storySliderValue, setStorySliderValue] = useState(getRandomInt(0, 5));
  const [performancesSliderValue, setPerformancesSliderValue] = useState(getRandomInt(0, 5));
  const [musicSliderValue, setMusicSliderValue] = useState(getRandomInt(0, 5));
  const [reviewAuthorError, setReviewAuthorError] = useState(false);
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


  function createNewReview() {
    if (reviewAuthorRef.current.value === '') {
      setReviewAuthorError(true);
      if (reviewTextRef.current.value === '' || reviewTextRef.current.value.length < 200 || getWordCount(reviewTextRef.current.value) < 20) {
        setReviewTextError(true);
        return;
      }
      return;
    } else {
      if (reviewTextRef.current.value === '' || reviewTextRef.current.value.length < 200 || getWordCount(reviewTextRef.current.value) < 20) {
        setReviewTextError(true);
        return;
      }
    }

    Axios.post((process.env.NODE_ENV === 'production') ? '/api/movies/post' : 'http://localhost:3001/api/movies/post', {
      movie: props.movie, review: {
        author: reviewAuthorRef.current.value,
        storyRating: storySliderValue,
        musicRating: musicSliderValue,
        performencesRating: performancesSliderValue,
        review: reviewTextRef.current.value,
        date: new Date()
      }
    }).then((response) => {
      props.modalRef.current.classList.toggle('is-active');
      props.setListOfMovies(response.data);
      //set scroll to top
      window.scrollTo(0, 0);
      //set all refs and states to default
      reviewAuthorRef.current.value = '';
      reviewTextRef.current.value = '';
      setStorySliderValue(getRandomInt(0, 5));
      setPerformancesSliderValue(getRandomInt(0, 5));
      setMusicSliderValue(getRandomInt(0, 5));
    });

  };

  return (
    <div className="modal" ref={props.modalRef}>
      <div className='modal-background'>
        <div className="modal-content" style={{ paddingTop: '5rem', paddingRight: isMobile ? '2.5rem' : '', height: 'min-content' }}>
          <div className="box">
            <button className="modal-close is-large" aria-label="close" onClick={() => { props.modalRef.current.classList.toggle('is-active'); }}></button>
            <form onSubmit={event => { event.preventDefault(); }}>
              <div className="field">
                <label className="label" style={reviewAuthorError ? { color: "red" } : {}}>{reviewAuthorError ? "Error: Please enter a name" : "Name"}</label>
                <div className="control">
                  <input ref={reviewAuthorRef} className="input" type="text" placeholder="Your name" style={reviewAuthorError ? { border: "2px solid red" } : {}} />
                </div>
              </div>
              <div className="field">
                <label className="label">Story Rating: {storySliderValue}</label>
                <div className="control">
                  <input value={storySliderValue} onChange={(event) => { setStorySliderValue(event.target.value); }} className="bar" type="range" min="0" max="5" step="1" style={{ width: '100%' }} />
                </div>
              </div>
              <div className="field">
                <label className="label">Performences Rating: {performancesSliderValue}</label>
                <div className="control">
                  <input value={performancesSliderValue} onChange={(event) => { setPerformancesSliderValue(event.target.value); }} className="bar" type="range" min="0" max="5" step="1" style={{ width: '100%' }} />
                </div>
              </div>
              <div className="field">
                <label className="label">Music Rating: {musicSliderValue}</label>
                <div className="control">
                  <input value={musicSliderValue} onChange={(event) => { setMusicSliderValue(event.target.value); }} className="bar" type="range" min="0" max="5" step="1" style={{ width: '100%' }} />
                </div>
              </div>
              <div className="field">
                <label className="label" style={reviewTextError ? { color: "red" } : {}}>{reviewTextError ? "Error: Must be longer than 200 characters and more than 20 words" : "Review"}</label>
                <div className="control">
                  <textarea ref={reviewTextRef} className="textarea" onChange={(event) => { setCharacterCount(event.target.value.length); }} placeholder="Write a review of at least 200 characters" style={((characterCount < 200 && characterCount > 0) || reviewTextError) ? { border: "2px solid #f14668" } : ((characterCount > 0) ? {border: "2px solid #48c78e"}:{})}></textarea>
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
