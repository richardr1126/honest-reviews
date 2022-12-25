import React from "react";
import MoviesList from "../components/MoviesList";
import { useState, useEffect } from 'react';

function Home() {
	// check if device is in dark mode
	const [darkMode, setDarkMode] = useState(false);

	useEffect(() => {
		const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
		setDarkMode(prefersDarkScheme.matches);
		prefersDarkScheme.addEventListener('change', mediaQuery => setDarkMode(mediaQuery.matches));
		return () => prefersDarkScheme.removeEventListener('change', () => { });
	}, []);

	const textStyle = darkMode ? { color: 'white' } : { color: 'black' };
	return (
		<div style={{ padding: '1rem' }}>
			<div className="box content container is-max-desktop" style={darkMode ? { backgroundColor: '#262626' } : { backgroundColor: '#f5f5f5' }}>

				<div style={{ display: 'flex', alignItems: 'center' }}>
					<div className={darkMode ? "box no-padding" : ""}><img className="image" src="/logo192.png" alt="HR Logo" style={{ width: '2rem', height: '2rem', marginTop: darkMode ? '-0.35rem' : '-1rem' }}></img></div>

					<a style={{marginLeft: '0.5rem'}} href="/"><h2 style={textStyle}>Honest reviews</h2></a>
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
					<li>When there is nothing in the search bar the most recent reviewed movie shows first.</li>
				</ul>
			</div>
			<MoviesList key={'movies-list'} darkMode={darkMode} />
		</div>
	);
}

export default Home;