import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3 className="footer-logo">InternMatch</h3>
          <p className="footer-description">
            La plateforme innovante qui connecte les étudiants aux opportunités de stage.
          </p>
        </div>
        
        <div className="footer-section">
          <h4>Navigation</h4>
          <ul className="footer-links">
            <li><Link to="/">Accueil</Link></li>
            <li><Link to="/about">À propos</Link></li>
            <li><Link to="/login">Connexion</Link></li>
            <li><Link to="/register">Inscription</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Support</h4>
          <ul className="footer-links">
            <li><a href="#help">Aide</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><a href="#privacy">Confidentialité</a></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="footer-copyright">
          <p>&copy; 2025 InternMatch. Tous droits réservés.</p>
        </div>
        <div className="footer-credits">
          <Link to="/about" className="about-link">
            À propos de nous
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
