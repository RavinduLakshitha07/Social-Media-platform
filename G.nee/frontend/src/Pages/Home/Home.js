import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import cook from './cook.mp4';

function Home() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <div className="home-container">
      <video autoPlay loop muted className="cover-video">
        <source src={cook} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="overlay-content">
        <h1 className="hero-title">Welcome to Cook Master</h1>
        <p className="hero-description">
          Discover delicious recipes and cooking tips from chefs around the world.
        </p>
        <button className="get-started-button" onClick={handleGetStarted}>
          Get Started
        </button>
      </div>
    </div>
  );
}

export default Home;
