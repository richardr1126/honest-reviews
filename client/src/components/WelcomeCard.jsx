function WelcomeCard({ textStyle, darkMode }) {
  return (
    <div className="box content container is-max-desktop" style={darkMode ? { backgroundColor: '#262626' } : { backgroundColor: '#f5f5f5' }}>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div className={darkMode ? "box no-padding" : ""}><img className="image" src="/favicon-96x96.png" alt="Honest Reviews Logo" style={{ width: '2rem', height: '2rem', marginTop: darkMode ? '-0.35rem' : '-1rem' }}></img></div>

        <a style={{ marginLeft: '0.5rem' }} href="/"><h1 style={textStyle}>Honest reviews</h1></a>
      </div>

      <p style={textStyle}>
        Welcome to Honest reviews, a movie review website that lets anyone write reviews.
        The movies that currently have reviews attached are listed below.
        This website uses the <a href="https://www.omdbapi.com/" target="_blank" rel="noreferrer">OMDb API</a> to fetch movie information.
        Reviews are checked for spam using large language models with the <a href="https://platform.openai.com/docs/api-reference/chat" target="_blank" rel="noreferrer">OpenAI API</a>.
      </p>
      <ul style={textStyle}>
        <li>Tap movie to see reviews.</li>
        <li>Plus button to add your review.</li>
        <li>Filter the movies by title.</li>
        <li>Upvote or downvote reviews.</li>
      </ul>
    </div>
  );
}

export default WelcomeCard;