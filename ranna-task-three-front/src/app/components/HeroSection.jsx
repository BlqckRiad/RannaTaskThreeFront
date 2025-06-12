import React from "react";
import Image from "next/image";
import "./HeroSection.css";

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-image-wrapper">
        <Image
          src="/istanbul.jpeg"
          alt="Istanbul"
          fill
          style={{objectFit: 'cover'}}
          priority
        />
        <div className="hero-overlay" />
        <div className="hero-content hero-content-left">
          <h1>Explore Türkiye</h1>
          <p>& Save in best places!</p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 