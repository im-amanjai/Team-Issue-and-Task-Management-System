import "../../../styles/teamMembers.css";

const members = [
  {
    name: "Sarah Miller",
    role: "Manager",
    issues: 12,
    initials: "SM",
  },
  {
    name: "David Wilson",
    role: "Developer",
    issues: 8,
    initials: "DW",
  },
  {
    name: "Emma Clark",
    role: "Developer",
    issues: 6,
    initials: "EC",
  },
  {
    name: "Michael Moore",
    role: "Designer",
    issues: 4,
    initials: "MM",
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
