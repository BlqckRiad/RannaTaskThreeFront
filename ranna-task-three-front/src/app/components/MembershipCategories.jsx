import React from "react";
import "./MembershipCategories.css";

const memberships = [
  { name: "Silver", color: "#A0A0A0" },
  { name: "Gold", color: "#E6B23A" },
  { name: "Diamond", color: "#5B6DED" },
];

const categories = [
  { name: "Dining", icon: "🍴" },
  { name: "Attractions", icon: "📷" },
  { name: "Shopping", icon: "🛍️" },
  { name: "Health", icon: "🤲" },
];

const MembershipCategories = () => {
  return (
    <div className="membership-categories">
      <div className="memberships">
        {memberships.map((m) => (
          <div className="membership-box" style={{ background: m.color }} key={m.name}>
            <span className="membership-title">{m.name}</span>
            <span className="membership-sub">Membership</span>
          </div>
        ))}
      </div>
      <div className="categories">
        {categories.map((c, i) => (
          <React.Fragment key={c.name}>
            <div className="category-tab">
              <span className="category-icon">{c.icon}</span>
              <span className="category-name">{c.name}</span>
            </div>
            {i !== categories.length - 1 && <div className="category-divider" />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default MembershipCategories; 