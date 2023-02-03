function Footer({ darkMode }) {
  const currentYear = new Date().getFullYear();
  const textColor = darkMode ? 'white' : 'black';
  const bgColor = darkMode ? '#262626' : 'white';

  return (
    <footer className="footer container is-max-desktop" style={{borderRadius: '0.5rem', backgroundColor: bgColor}}>
      <div className="content has-text-centered">
        <p style={{color: textColor}} >Copyright © {currentYear} Richard Roberson</p>
      </div>
    </footer>
  );
};

export default Footer;