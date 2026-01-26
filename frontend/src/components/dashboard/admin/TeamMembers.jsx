import "../../../styles/teamMembers.css";

const members = [
  {
    name: "John Doe",
    role: "Manager",
    issues: 12,
    initials: "JD",
  },
  {
    name: "Alice Bob",
    role: "Developer",
    issues: 8,
    initials: "AB",
  },
  {
    name: "Kasak Anand",
    role: "Developer",
    issues: 6,
    initials: "KA",
  },
  {
    name: "Aman Jaiswal",
    role: "Designer",
    issues: 4,
    initials: "AJ",
  },
];

const TeamMembers = () => {
  return (
    <div className="team-section">
      <h3>Team Members</h3>

      <div className="members-grid">
        {members.map((m) => (
          <div className="member-card" key={m.name}>
            <div className="member-avatar">{m.initials}</div>

            <div className="member-info">
              <p className="member-name">{m.name}</p>
              <p className="member-role">{m.role}</p>
            </div>

            <span className="issue-count">{m.issues} issues</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamMembers;
