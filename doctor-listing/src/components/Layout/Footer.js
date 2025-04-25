// src/components/Layout/Footer.js
import React from 'react';
import styles from './Layout.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h4>MediConnect</h4>
          <p>Finding the right doctor has never been easier.</p>
        </div>
        <div className={styles.footerSection}>
          <h4>Quick Links</h4>
          <ul>
            <li>About Us</li>
            <li>Find Doctors</li>
            <li>Contact Us</li>
            <li>FAQs</li>
          </ul>
        </div>
        <div className={styles.footerSection}>
          <h4>Legal</h4>
          <ul>
            <li>Terms of Service</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
        <div className={styles.footerSection}>
          <h4>Connect With Us</h4>
          <div className={styles.socialIcons}>
            <span>Facebook</span>
            <span>Twitter</span>
            <span>Instagram</span>
          </div>
        </div>
      </div>
      <div className={styles.copyright}>
        © {new Date().getFullYear()} MediConnect. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;