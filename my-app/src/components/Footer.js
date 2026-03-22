import "./Footer.css"

// New Footer Component
function Footer() {

const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // For smooth scrolling
    });
  };

  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-section footer-info">
          {/* Rumi Logo */}
          <img
            src="./rumi2.png"
            alt="RUMI Logo"
            className="footer-logo"
          />
          {/* Placeholder Text */}
          <p className="footer-description">
              RUMI is Sri Lanka's leading platform for finding verified, trusted rooms and shared spaces. We ensure a seamless booking experience, giving you confidence and security with every reservation.
            </p>       
            {/* Social Icons */}
          <div className="social-links">

            <div id="Socials">
            <a href="#" aria-label="Facebook">
              <img src="./Facebook-Logo.png" alt="Facebook" className="social-icon facebook" />
            </a>
            </div>
            <a href="#" aria-label="Instagram">
              <img src="./instagram-Logo.png" alt="Instagram" className="social-icon instagram" />
            </a>
            <a href="#" aria-label="LinkedIn">
              <img src="./Linkedin-Logo.png" alt="LinkedIn" className="social-icon linkedin" />
            </a>
            <a href="#" aria-label="X (formerly Twitter)">
              <img src="./x.com-Logo.png" alt="X" className="social-icon x" />
            </a>
          </div>
          {/* Back to Top Button */}
          <button className="back-to-top"
            onClick={scrollToTop}
          >
            <span className="arrow-up"></span>
            BACK TO TOP
          </button>
        </div>

        <div className="footer-section footer-sitemap">
          <h3 className="footer-title">SiteMap</h3>
          <ul className="footer-links">
            <li><a href="#">Home Page</a></li>
            <li><a href="#">Find Rooms</a></li>
            <li><a href="#">Resources & News</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Contact Us</a></li>
          </ul>
        </div>

        <div className="footer-section footer-legal">
          <h3 className="footer-title">Legal</h3>
          <ul className="footer-links">
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Services</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}


export default Footer;