import React from "react";
import "./MembershipShowcase.css";

const cards = [
  {
    url: "https://img.freepik.com/free-vector/gradient-loyalty-card-template_23-2149374177.jpg",
    alt: "Blue Member Card"
  },
  {
    url: "https://img.freepik.com/free-vector/gradient-loyalty-card-template_23-2149374178.jpg",
    alt: "Gold Member Card"
  },
  {
    url: "https://img.freepik.com/free-vector/gradient-loyalty-card-template_23-2149374179.jpg",
    alt: "Silver Member Card"
  }
];

const womanImg = "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=400&h=400";

const MembershipShowcase = () => (
  <section className="membership-showcase-bg">
    <div className="membership-showcase-content">
      <div className="membership-showcase-left">
        <h2>Choose Your Membership & Start Saving</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.</p>
        <div className="membership-cards-row">
          {cards.map(card => (
            <img key={card.url} src={card.url} alt={card.alt} className="membership-card-img" />
          ))}
        </div>
      </div>
      <div className="membership-showcase-right">
        <img src={womanImg} alt="Happy Woman" className="membership-woman-img" />
      </div>
    </div>
  </section>
);

export default MembershipShowcase; 