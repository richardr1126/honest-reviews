function WelcomeCard({ textStyle, darkMode }) {
  return (
    <div className="box content container is-max-desktop" style={darkMode ? { backgroundColor: '#262626' } : { backgroundColor: '#f5f5f5' }}>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div className={darkMode ? "box no-padding" : ""}><img className="image" src="/favicon-96x96.png" alt="HR Logo" style={{ width: '2rem', height: '2rem', marginTop: darkMode ? '-0.35rem' : '-1rem' }}></img></div>

        <a style={{ marginLeft: '0.5rem' }} href="/"><h2 style={textStyle}>Honest reviews</h2></a>
      </div>

      <p style={textStyle}>
        Welcome to Honest reviews, a movie review website that lets anyone write reviews.
        The movies that currently have reviews attached are listed below.
        This website uses the <a href="https://www.omdbapi.com/" target="_blank" rel="noreferrer">OMDb API</a> to fetch movie information.
      </p>
      <ul style={textStyle}>
        <li>Tap movie to see reviews.</li>
        <li>Plus button to add your review.</li>
        <li>Filter the movies by title.</li>
        <li>Upvote or downvote reviews.</li>
        <li>When there is nothing in the search bar the most recent reviewed movie shows first.</li>
      </ul>
    </div>
  );
}

export default WelcomeCard;