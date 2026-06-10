import React from 'react';
import './ContactPage.css';

const ContactPage: React.FC = () => {
  const projects = [
    {
      title: "🧠 AI Health Assistant",
      desc: "AI-powered web app that provides basic health guidance using symptom-based analysis.",
      tech: "Python, Gemini API, HTML, CSS, JS",
      role: "Built UI, integrated AI API, handled query logic"
    },
    {
      title: "🛣️ Pothole Detection & Navigation",
      desc: "Smart app that detects potholes and maps safer routes in real time.",
      tech: "AI/Computer Vision, Maps API, JS",
      role: "Designed architecture, built map UI, integrated detection logic"
    },
    {
      title: "🌦️ Weather Forecast App",
      desc: "Real-time weather app with city-based search using AccuWeather API.",
      tech: "HTML, CSS, JS",
      role: "Full-stack frontend dev, API integration, responsive design"
    },
    {
      title: "🧩 Dementia Awareness Website",
      desc: "Informational platform for dementia education and caregiver support.",
      tech: "HTML, CSS, JS",
      role: "Designed UI, structured content, built responsive layout"
    },
    {
      title: "🎮 Flapping Birthday Game",
      desc: "Flappy Bird-style Python game with custom birthday theme.",
      tech: "Python (Pygame)",
      role: "Built game logic, animations, scoring system"
    },
    {
      title: "🖼️ Media Viewer App",
      desc: "Desktop app for browsing and viewing media files easily.",
      tech: "Python",
      role: "Developed core logic, file navigation, UI"
    }
  ];

  return (
    <div className="contact-page-container">
      <div className="profile-header">
        <div className="profile-avatar">
          {/* Avatar Placeholder or initials */}
          <span>KD</span>
        </div>
        <h1>Karthikeya Darisi</h1>
        <p className="profile-title">Full Stack Developer & AI Enthusiast</p>
        <div className="contact-info-pills">
          <div className="info-pill">
            <span className="pill-icon">📞</span> +91 70935 94807
          </div>
          <div className="info-pill">
            <span className="pill-icon">✉️</span> karthikeya200511@yahoo.com
          </div>
          <a href="https://karthikeya-d.netlify.app/" target="_blank" rel="noreferrer" style={{textDecoration: 'none'}}>
            <div className="info-pill" style={{ cursor: 'pointer', background: 'linear-gradient(135deg, #7e22ce 0%, #6366f1 100%)', borderColor: 'transparent' }}>
              <span className="pill-icon">🌐</span> Portfolio Website
            </div>
          </a>
        </div>
      </div>

      <div className="projects-section">
        <h2 className="section-title">My Projects</h2>
        <div className="projects-grid">
          {projects.map((proj, idx) => (
            <div key={idx} className="project-card">
              <h3 className="project-title">{proj.title}</h3>
              <p className="project-desc">{proj.desc}</p>
              <div className="project-meta">
                <span className="meta-label">Tech:</span> {proj.tech}
              </div>
              <div className="project-meta">
                <span className="meta-label">Role:</span> {proj.role}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
