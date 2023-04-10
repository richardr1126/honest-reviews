import * as React from 'react';
import { styled, alpha, createTheme, ThemeProvider } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

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

export default function SorterControl({ sorter, setSorter, genreSorter, setGenreSorter }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (value) => {
    setAnchorEl(null);
    setSorter(value);
  };

  const handleGenreChange = (event, newValue) => {
    setGenreSorter(newValue);
  };

  const customTabsTheme = createTheme({
    palette: {
      primary: {
        main: '#1f547f',
      },
    },
  });

  return (
    <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
      <Button
        id="sorter-button"
        aria-controls={open ? 'sorter-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        variant="contained"
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
        sx={{ backgroundColor: '#1f547f', color: 'white', width: '100%', maxWidth: '15ch', display: 'flex'}}
      >
        Sort
      </Button>
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
      <ThemeProvider theme={customTabsTheme}>
        <Tabs
          value={genreSorter}
          onChange={handleGenreChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          aria-label="scrollable auto tabs example"
          textColor="primary"
        >
          <Tab label="All" value="all" />
          <Tab label="Action" value="action" />
          <Tab label="Adventure" value="adventure" />
          <Tab label="Animation" value="animation" />
          <Tab label="Comedy" value="comedy" />
          <Tab label="Crime" value="crime" />
          <Tab label="Documentary" value="documentary" />
          <Tab label="Drama" value="drama" />
          <Tab label="Family" value="family" />
          <Tab label="Fantasy" value="fantasy" />
          <Tab label="History" value="history" />
          <Tab label="Horror" value="horror" />
          <Tab label="Music" value="music" />
          <Tab label="Mystery" value="mystery" />
          <Tab label="Romance" value="romance" />
        </Tabs>
      </ThemeProvider>
    </div>
  );
}
