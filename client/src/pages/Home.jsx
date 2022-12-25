import React from "react";
import MoviesList from "../components/MoviesList";

function Home() {
	//check if we are on mobile
  const isMobile = window.innerWidth <= 768;

	return (
		<div style={isMobile ? {padding: '1rem'} : {paddingTop: '1rem'}}>
			<div className="box content container is-max-desktop" style={{backgroundColor: '#262626'}}>
				<a href="/"><h2 style={{color: 'white'}}>Honest reviews</h2></a>
				<p style={{color: 'white'}}>
					Welcome to Honest reviews, a movie review website that lets anyone write reviews. 
					The movies that currently have reviews attached are listed below. 
					This website uses the <a href="https://www.omdbapi.com/" target="_blank" rel="noreferrer">OMDb API</a> to fetch movie information.
				</p>
				<ul style={{color: 'white'}}>
					<li>Click on a movie card below to see it's reviews.</li>
					<li>Click the plus button to add your review.</li>
					<li>Filter the movies by typing in the search bar.</li>
					<li>Use the search for more button to find movies that aren't reviewed yet.</li>
				</ul>
			</div>
    	<MoviesList />
		</div>
	);
}

export default Home;