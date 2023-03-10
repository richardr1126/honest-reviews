import React from "react";
import MoviesList from "../components/MoviesList";
import { useState, useEffect, useId } from 'react';
import WelcomeCard from "../components/WelcomeCard";
import Footer from "../components/Footer";


function Home() {
	// check if device is in dark mode
	const [darkMode, setDarkMode] = useState(false);
	const moviesListId = useId();
	const isMobile = window.innerWidth <= 768;

	useEffect(() => {
		const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
		setDarkMode(prefersDarkScheme.matches);
		prefersDarkScheme.addEventListener('change', mediaQuery => setDarkMode(mediaQuery.matches));

		return () => prefersDarkScheme.removeEventListener('change', () => { });
	}, []);

	const textStyle = darkMode ? { color: 'white' } : { color: 'black' };
	//dark grey: #1f1f1f
	document.getElementById('root').style.backgroundColor = darkMode ? '#1f1f1f':'white';

	return (
		<div style={isMobile ? { padding: '5px'}:{ padding: '1rem'}}>
			<WelcomeCard key={'welcome-card'} textStyle={textStyle} darkMode={darkMode} />
			<MoviesList key={"movies-list-"+moviesListId} darkMode={darkMode} />
			<Footer darkMode={darkMode}/>
		</div>
	);
}

export default Home;