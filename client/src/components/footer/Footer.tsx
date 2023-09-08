import React from 'react'
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <p className="footer-info">
        <a className="footer-link"
          href="https://github.com/LidiaOrfanu/ping-charging-station"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub source code
        </a>
      </p>
      <p className="footer-info">
        <a className="footer-link"
          href="https://www.linkedin.com/in/lidiaorfanu/"
          target="_blank"
          rel="noopener noreferrer"
        >
          ✉️ Connect with me: LinkedIn
        </a>
      </p>
    </footer>
  )
}


export default Footer;
