function WelcomeCard({ textStyle, darkMode }) {
  const bgColor = darkMode ? '#262626' : '#f5f5f5';
  const isMobile = window.innerWidth <= 768;

  return (
    <div className="box content container is-max-desktop" style={isMobile ? {margin: '5px', marginBottom: '1.5rem', backgroundColor: bgColor} : {backgroundColor: bgColor}}>

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
        <li>Movies with reviews attached are below.</li>
        <li>Press the search button to search for new movies.</li>
        <li>Tap a movie to see reviews.</li>
        <li>Upvote or downvote reviews.</li>
        <li>Share reviews.</li>
      </ul>
    </div>
  );
}

export default WelcomeCard;