// src/components/Layout/Header.js
import React from 'react';
import { Link } from 'react-router-dom';  // Import Link
import styles from './Layout.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.logo}>MediConnect</div>
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <Link to="/dashboard" className={styles.navLink}>Home</Link>
            </li>
            <li className={styles.navItem}>
              <Link to="/doctors" className={styles.navLink}>Find Doctors</Link> {/* Link added */}
            </li>
            <li className={styles.navItem}>
              <Link to="/appointment" className={styles.navLink}>Book Appointment</Link>
            </li>
            <li className={styles.navItem}>
              <Link to="/health-articles" className={styles.navLink}>Health Articles</Link>
            </li>
          </ul>
        </nav>
        <div className={styles.userActions}>
          <button className={styles.loginButton}>Login</button>
          <button className={styles.signupButton}>Sign Up</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
