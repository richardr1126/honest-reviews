import { useState, useRef, useEffect } from "react";
import Axios from 'axios';
import { IonIcon } from '@ionic/react';
import { searchOutline } from 'ionicons/icons';
import Autocomplete from '@mui/material/Autocomplete';

export default function SearchBar({ searchTerm, setSearchTerm, searchOMDB }) {
  const [searchResults, setSearchResults] = useState([]);
  const [isClickedAway, setIsClickedAway] = useState(false);
  const debounceTimeout = useRef(null);
  const searchButtonRef = useRef(null);
  const autoRef = useRef(null);

  useEffect(() => {
    // Debounce the API call using setTimeout
    
    if (searchTerm.length > 2) {
      clearTimeout(debounceTimeout.current);
      debounceTimeout.current = setTimeout(() => {
        Axios.get(`https://www.omdbapi.com/?i=tt3896198&apikey=dd610a6e&s=${searchTerm}&type=movie`)
        .then(response => {
          setSearchResults(response.data.Search.map(movie => movie.Title + ' (' + movie.Year + ')'));
        })
        .catch(error => {
          console.error(error);
        });
      }, 500);
    } else {
      clearTimeout(debounceTimeout.current);
      setSearchResults([]);
    }
    
  }, [searchTerm]);


  return (
    <div className="field has-addons">
      <div className="control is-expanded">
        <Autocomplete
          includeInputInList={true}
          selectOnFocus={true}
          ref={autoRef}
          freeSolo={true}
          open={searchResults.length > 0 && !isClickedAway}
          options={searchResults}
          onBlur={() => { setIsClickedAway(true);}}
          onFocus={() => setIsClickedAway(false)}
          blurOnSelect={true}
          onChange={(event, value) => {
            setIsClickedAway(true);
            setSearchTerm(value.split(' (')[0]);
            setSearchResults([]);

            setTimeout(() => {
              
              searchButtonRef.current.click();
            }, 200);
            
          }}
          renderInput={(params) => (
            <div ref={params.InputProps.ref}>
              <input
                {...params.inputProps}
                id="searchInput"
                className="input"
                type="text"
                placeholder="Search for any movie by title"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                onKeyDown={(event) => { if (event.key === 'Enter') { searchButtonRef.current.click(); } }}
                aria-label="Filter by title or search for a movie"
              />
            </div>
          )}
        />
      </div>
      <div className="control">
        <button
          ref={searchButtonRef}
          className="button"
          style={{ backgroundColor: 'rgb(31, 84, 127)' }}
          onClick={searchOMDB}
        >
          <IonIcon style={{ color: 'white' }} icon={searchOutline} size='small' aria-label="Search icon" />
        </button>
      </div>
    </div>
  );
}