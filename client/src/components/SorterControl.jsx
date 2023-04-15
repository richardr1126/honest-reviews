import * as React from 'react';
import { styled, alpha, createTheme, ThemeProvider } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';



const StyledTabs = styled(Tabs)(({ theme }) => ({
  color:
    theme.palette.mode === 'dark'
      ? '#ffffff'
      : '#1f547f',
  '& .MuiTabs-indicator': {
    backgroundColor: theme.palette.mode === 'dark'
      ? '#ffffff'
      : '#1f547f',
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  color: theme.palette.mode === 'dark' ? alpha('#ffffff', 0.5) : alpha('#000000', 0.65),
  '&.Mui-selected': {
    color:
      theme.palette.mode === 'dark'
        ? '#ffffff'
        : '#1f547f',
  },
}));


export default function SorterControl({ genreSorter, setGenreSorter }) {
  

  const handleGenreChange = (event, newValue) => {
    setGenreSorter(newValue);
  };

  const dark = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  const light = createTheme({
    palette: {
      mode: 'light',
    },
  });

  //check if device in dark mode
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = prefersDarkMode ? dark : light;

  return (
    <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>

      <ThemeProvider theme={theme}>
        <StyledTabs
          value={genreSorter}
          onChange={handleGenreChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          aria-label="scrollable auto tabs example"
        >
          <StyledTab label="All" value="all" />
          <StyledTab label="Action" value="action" />
          <StyledTab label="Adventure" value="adventure" />
          <StyledTab label="Animation" value="animation" />
          <StyledTab label="Comedy" value="comedy" />
          <StyledTab label="Crime" value="crime" />
          <StyledTab label="Documentary" value="documentary" />
          <StyledTab label="Drama" value="drama" />
          <StyledTab label="Family" value="family" />
          <StyledTab label="Fantasy" value="fantasy" />
          <StyledTab label="History" value="history" />
          <StyledTab label="Horror" value="horror" />
          <StyledTab label="Music" value="music" />
          <StyledTab label="Mystery" value="mystery" />
          <StyledTab label="Romance" value="romance" />
        </StyledTabs>
      </ThemeProvider>


    </div>
  );
}
