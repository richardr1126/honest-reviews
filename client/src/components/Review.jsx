import { useState } from "react";
import { IonIcon } from "@ionic/react";
import { arrowUpOutline, arrowDownOutline } from "ionicons/icons";
import Axios from "axios";
import { useCookies } from "react-cookie";
import CookieConsent from "react-cookie-consent";

export default function Review({ movie, review, setUpvotesCallback, setDownvotesCallback }) {
  const [upvotes, setUpvotes] = useState(review.upvotes);
  const [downvotes, setDownvotes] = useState(review.downvotes);
  const [cookies, setCookie] = useCookies(['upvoteIds', 'downvoteIds', 'acceptedCookies_BOOL']);
  const upvoteIds = cookies.upvoteIds || [];
  const downvoteIds = cookies.downvoteIds || [];

  const isUpvoted = upvoteIds.includes(review._id);
  const isDownvoted = downvoteIds.includes(review._id);


  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: '2-digit',
    year: 'numeric'
  });

  const isMobile = window.innerWidth < 768;
  const iconSize = isMobile ? 'large' : 'small';
  const fontSize = isMobile ? '1.5rem' : '1rem';


  function upvote() {
    if (downvoteIds.includes(review._id)) {
      setCookie("downvoteIds", downvoteIds.filter((id) => id !== review._id));
      review.downvotes--;
      setDownvotes(review.downvotes);
    }
    if (upvoteIds.includes(review._id)) {
      // remove the id if it is in the list
      setCookie("upvoteIds", upvoteIds.filter((id) => id !== review._id));
      review.upvotes--;
      setUpvotes(review.upvotes);
    } else {
      // add the review id to the list if it is not in the list
      setCookie("upvoteIds", [...upvoteIds, review._id]);
      review.upvotes++;
      setUpvotes(review.upvotes);
    }
    Axios.post((process.env.NODE_ENV === 'production') ? '/api/movies/upvote' : 'http://localhost:3001/api/movies/upvote', {
      movie: movie, review: review, newval: review.upvotes
    }).then((response) => {
      console.log('upvote updated');
    });
  }

  function downvote() {
    if (upvoteIds.includes(review._id)) {
      setCookie("upvoteIds", upvoteIds.filter((id) => id !== review._id));
      review.upvotes--;
      setUpvotes(review.upvotes);
    }
    if (downvoteIds.includes(review._id)) {
      // remove the id if it is in the list
      setCookie("downvoteIds", downvoteIds.filter((id) => id !== review._id));
      review.downvotes--;
      setDownvotes(review.downvotes);
    } else {
      // add the review id to the list if it is not in the list
      setCookie("downvoteIds", [...downvoteIds, review._id]);
      review.downvotes++;
      setDownvotes(review.downvotes);
    }
    Axios.post((process.env.NODE_ENV === 'production') ? '/api/movies/downvote' : 'http://localhost:3001/api/movies/downvote', {
      movie: movie, review: review, newval: review.downvotes
    }).then((response) => {
      console.log('downvote updated');
    });
  }

  const columnClassName = isMobile ? 'column is-8' : 'column is-11';
  const columnClassName2 = isMobile ? 'column' : 'column';

  return (
    <div className='box is-hoverable' key={review._id}>
      <div className='columns'>
        <div className='column is-three-quarters'>
          <strong>{review.author}</strong>
          <p>{review.review}</p>
          <p>{dateFormatter.format(new Date(review.date))}</p>
        </div>
        <div className='column' style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingBottom: '3px' }}>
          <label className='label'>Story <progress className="progress is-danger is-small" value={review.storyRating} max="5">{review.storyRating}%</progress></label>
          <label className='label'>Performances <progress className="progress is-info is-small" value={review.performancesRating} max="5">{review.performancesRating}%</progress></label>
          <label className='label'>Music <progress className="progress is-primary is-small" value={review.musicRating} max="5">{review.musicRating}%</progress></label>
          <div className="columns has-text-right is-gapless is-mobile" style={{ marginTop: 'auto', paddingTop: isMobile ? '' : '0.5rem' }}>
            <div className={columnClassName}>
              <p style={{ marginTop: '8px', marginRight: isMobile ? '' : '1px', fontSize: fontSize }}>{upvotes - downvotes}</p>
            </div>
            <div className={columnClassName2} style={isMobile ? { marginTop: '10px' } : {}}>
              <IonIcon style={{ color: isUpvoted ? 'red' : '' }} onClick={upvote} className="has-cursor-pointer is-hoverable" icon={arrowUpOutline} size={iconSize} />
              <IonIcon style={{ color: isDownvoted ? 'red' : '' }} onClick={downvote} className="has-cursor-pointer is-hoverable" icon={arrowDownOutline} size={iconSize} />

            </div>


          </div>

        </div>
      </div>
      {/* have buttonStyle take up entire div */}
      <CookieConsent
        location="bottom"
        buttonText="Sure man!!"
        cookieName="acceptedCookies_BOOL"
        style={{ background: "#2B373B"}}
        buttonStyle={{ color: "#4e503b", fontSize: "18px", borderRadius: '5px', marginTop: isMobile ? '0' : '15px' }}
        expires={150}
      >
        This website uses cookies to store the reviews you have upvoted.{" "}
        <span style={{ fontSize: "10px" }}>Or downvoted. To enhance the user experience :O</span>
      </CookieConsent>
    </div>
  )
}