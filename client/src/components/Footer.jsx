function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="footer box" style={{borderRadius: '0.5rem'}}>
      <div className="content has-text-centered">
        <p>Copyright © {currentYear} Richard Roberson</p>
      </div>
    </footer>
  );
};

export default Footer;