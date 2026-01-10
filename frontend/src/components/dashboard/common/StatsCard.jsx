const StatsCard = ({ title, value, delta, icon }) => {
  return (
    <div className="stat-card">
      <div className="stat-info">
        <p>{title}</p>
        <h2>{value}</h2>
        {delta && <span className="delta">{delta}</span>}
      </div>
      <div className="stat-icon">{icon}</div>
    </div>
  );
};

export default StatsCard;
