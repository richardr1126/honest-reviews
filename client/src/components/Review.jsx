import { useState } from "react";
import { IonIcon } from "@ionic/react";
import { arrowUpOutline, arrowDownOutline } from "ionicons/icons";
import Axios from "axios";
import { useCookies } from "react-cookie";

export default function Review({ movie, review }) {
  const [votes, setVotes] = useState(review.votes);

  const [cookies, setCookie] = useCookies(['upvoteIds', 'downvoteIds']);
  const upvoteIds = cookies.upvoteIds || [];
  const downvoteIds = cookies.downvoteIds || [];

  const [isUpvoted, setIsUpvoted] = useState(upvoteIds.includes(review._id));
  const [isDownvoted, setIsDownvoted] = useState(downvoteIds.includes(review._id));



  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: '2-digit',
    year: 'numeric'
  });

  const isMobile = window.innerWidth < 768;
  const iconSize = isMobile ? 'large' : 'small';
  const fontSize = isMobile ? '1.5rem' : '1rem';


  function vote(upOrDown) {
    //make sure to update cookies
    if (upOrDown === 'up') {
      if (isUpvoted) {
        setIsUpvoted(false);
        setVotes(votes - 1);
        review.votes = votes - 1;
        setCookie('upvoteIds', upvoteIds.filter((id) => id !== review._id));
      } else {
        setIsUpvoted(true);
        setVotes(votes + 1);
        review.votes = votes + 1;
        setCookie('upvoteIds', [...upvoteIds, review._id]);
        if (isDownvoted) {
          setIsDownvoted(false);
          setVotes(votes + 2);
          review.votes = votes + 2;
          setCookie('downvoteIds', downvoteIds.filter((id) => id !== review._id));
        }
      }

    } else if (upOrDown === 'down') {
      if (isDownvoted) {
        setIsDownvoted(false);
        setVotes(votes + 1);
        review.votes = votes + 1;
        setCookie('downvoteIds', downvoteIds.filter((id) => id !== review._id));
      } else {
        setIsDownvoted(true);
        setVotes(votes - 1);
        review.votes = votes - 1;
        setCookie('downvoteIds', [...downvoteIds, review._id]);
        if (isUpvoted) {
          setIsUpvoted(false);
          setVotes(votes - 2);
          review.votes = votes - 2;
          setCookie('upvoteIds', upvoteIds.filter((id) => id !== review._id));
        }
      }

    }
    Axios.post((process.env.NODE_ENV === 'production') ? '/api/movies/vote' : 'http://localhost:3001/api/movies/vote', {
      movie: movie, review: review
    }).then((response) => {
      console.log('upvote updated');
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
              <p style={{ marginTop: '8px', marginRight: isMobile ? '' : '1px', fontSize: fontSize }}>{votes}</p>
            </div>
            <div className={columnClassName2} style={isMobile ? { marginTop: '10px' } : {}}>
              <IonIcon style={{ color: isUpvoted ? 'red' : '' }} onClick={() => { vote('up'); }} className="has-cursor-pointer is-hoverable" icon={arrowUpOutline} size={iconSize} />
              <IonIcon style={{ color: isDownvoted ? 'red' : '' }} onClick={() => { vote('down'); }} className="has-cursor-pointer is-hoverable" icon={arrowDownOutline} size={iconSize} />

            </div>


          </div>

        </div>
      </div>
      {/* have buttonStyle take up entire div */}

    </div>
  )
}