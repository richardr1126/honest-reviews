function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="footer" style={{borderRadius: '0.5rem', backgroundColor: 'white'}}>
      <div className="content has-text-centered">
        <p>Copyright © {currentYear} Richard Roberson</p>
      </div>
    </footer>
  );
};

export default Footer;