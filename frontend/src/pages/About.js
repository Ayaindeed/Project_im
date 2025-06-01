import React from 'react';
import './About.css';
import creatrice1 from '../assets/creatrice1.jpg';
import creatrice2 from '../assets/creatrice2.jpg';

const About = () => {
  return (
    <div className="about-container">
      <div className="about-hero">
        <h1>À Propos de Nous</h1>
        <p className="about-subtitle">
          Découvrez l'équipe passionnée derrière InternMatch
        </p>
      </div>

      <div className="about-content">
        <div className="about-intro">
          <h2>Notre Mission</h2>
          <p>
            InternMatch est né de notre passion pour l'innovation technologique et notre désir 
            de faciliter la connexion entre les étudiants et les opportunités de stage. 
            En tant qu'étudiantes en Big Data Analytics, nous comprenons les défis que rencontrent 
            les étudiants dans leur recherche de stages et nous avons créé cette plateforme 
            pour simplifier ce processus.
          </p>
        </div>

        <div className="creators-section">
          <h2>Les Créatrices</h2>
          <div className="creators-grid">
            <div className="creator-card">
              <div className="creator-image">
                <img src={creatrice1} alt="Créatrice 1" />
                <div className="creator-overlay">
                  <div className="creator-social">
                    <a href="https://github.com/Ayaindeed" className="social-link">
                      <i className="fab fa-github"></i>
                    </a>
                  </div>
                </div>
              </div>
              <div className="creator-info">
                <h3>Rifi Aya</h3>
                <p className="creator-role">Étudiante en Big Data Analytics</p>
                <p className="creator-speciality">Spécialisée en Data Science & Machine Learning</p>
                <div className="creator-skills">
                  <span className="skill-tag">Python</span>
                  <span className="skill-tag">React</span>
                  <span className="skill-tag">SQL</span>
                  <span className="skill-tag">Analytics</span>
                </div>
              </div>
            </div>
            <div className="creator-card">
              <div className="creator-image">
                <img src={creatrice2} alt="Créatrice 2" />
                <div className="creator-overlay">
                  <div className="creator-social">
                    <a href="https://github.com/nisbe1218" className="social-link">
                      <i className="fab fa-github"></i>
                    </a>
                  </div>
                </div>
              </div>
              <div className="creator-info">
                <h3>Ben-Ali Nisrine</h3>
                <p className="creator-role">Étudiante en Big Data Analytics</p>
                <p className="creator-speciality">Spécialisée en Data Engineering & Visualization</p>
                <div className="creator-skills">
                  <span className="skill-tag">JavaScript</span>
                  <span className="skill-tag">Node.js</span>
                  <span className="skill-tag">MySQL</span>
                  <span className="skill-tag">Tableau</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="about-project">
          <h2>Le Projet InternMatch</h2>
          <div className="project-stats">
            <div className="stat-card">
              <div className="stat-number">2025</div>
              <div className="stat-label">Année de création</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">100%</div>
              <div className="stat-label">Passion investie</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">∞</div>
              <div className="stat-label">Possibilités</div>
            </div>
          </div>
          
          <div className="project-description">
            <p>
              Ce projet représente l'aboutissement de nos études en Big Data Analytics. 
              Nous avons combiné nos compétences en analyse de données, développement web 
              et design UX/UI pour créer une solution complète et intuitive.
            </p>
            <p>
              InternMatch utilise les dernières technologies web et intègre des principes 
              d'analyse de données pour offrir une expérience optimisée à tous les utilisateurs.
            </p>
          </div>
        </div>

        <div className="contact-section">
          <h2>Nous Contacter</h2>
          <p>
            Nous serions ravies de discuter de notre projet avec vous ou de répondre 
            à vos questions sur InternMatch.
          </p>
          <div className="contact-buttons">
            <a href="mailto:contact@internmatch.com" className="btn btn-primary">
              Nous Écrire
            </a>
            <a href="#demo" className="btn btn-secondary">
              Demander une Démo
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
