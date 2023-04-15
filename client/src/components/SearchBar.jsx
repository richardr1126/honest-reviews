import { useState, useRef, useEffect } from "react";
import Axios from 'axios';
import { IonIcon } from '@ionic/react';
import { searchOutline, funnelSharp } from 'ionicons/icons';
import Autocomplete from '@mui/material/Autocomplete';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { alpha, styled } from '@mui/material/styles';

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));

export default function SearchBar({ sorter, setSorter, searchTerm, setSearchTerm, searchOMDB }) {
  const [searchResults, setSearchResults] = useState([]);
  const [isClickedAway, setIsClickedAway] = useState(false);
  const debounceTimeout = useRef(null);
  const searchButtonRef = useRef(null);
  const autoRef = useRef(null);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (value) => {
    setAnchorEl(null);
    setSorter(value);
  };

  useEffect(() => {
    // Debounce the API call using setTimeout

    if (searchTerm.length > 2) {
      clearTimeout(debounceTimeout.current);
      debounceTimeout.current = setTimeout(() => {
        Axios.get(`https://api.themoviedb.org/3/search/movie?api_key=93e398a3dcc4a264a6fe485c3f16a028&language=en-US&query=${searchTerm}&page=1&include_adult=false`)
          .then(response => {
            setSearchResults(response.data.results.map(movie => movie.title + ' (' + new Date(movie.release_date).getFullYear() + ')'));
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
      <div className="control is-expanded" style={{ direction: 'row', display: 'flex' }}>
        <button
          id="sorter-button"
          className="button"
          style={{ backgroundColor: 'rgb(31, 84, 127)' }}
          aria-controls={open ? 'sorter-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          <IonIcon style={{ color: 'white' }} icon={funnelSharp} aria-label="Filter icon"  />
        </button>
        <Autocomplete
          includeInputInList={true}
          selectOnFocus={true}
          ref={autoRef}
          freeSolo={true}
          fullWidth={true}
          open={searchResults.length > 0 && !isClickedAway}
          options={searchResults}
          onBlur={() => { setIsClickedAway(true); }}
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
                style={{
                  width: '100%',
                  borderRadius: '0px',
                }}
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
          style={{ backgroundColor: 'rgb(31, 84, 127)', borderRadius: '0 4px 4px 0' }}
          onClick={searchOMDB}
        >
          <IonIcon style={{ color: 'white' }} icon={searchOutline} size='small' aria-label="Search icon" />
        </button>


        <StyledMenu
          id="sorter-menu"
          MenuListProps={{
            'aria-labelledby': 'sorter-button',
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={() => handleClose(sorter)}
          sx={{ width: '100%' }}
        >

          <MenuItem
            onClick={() => handleClose('latest-reviewed')}
            selected={sorter === 'latest-reviewed'}
            disableRipple
          >
            Reviews - New
          </MenuItem>
          <MenuItem
            onClick={() => handleClose('oldest-reviewed')}
            selected={sorter === 'oldest-reviewed'}
            disableRipple
          >
            Reviews - Old
          </MenuItem>
          <MenuItem
            onClick={() => handleClose('release-date-new')}
            selected={sorter === 'release-date-new'}
            disableRipple
          >
            Release date - New
          </MenuItem>
          <MenuItem
            onClick={() => handleClose('release-date-old')}
            selected={sorter === 'release-date-old'}
            disableRipple
          >
            Release date - Old
          </MenuItem>
        </StyledMenu>
      </div>
    </div>
  );
}