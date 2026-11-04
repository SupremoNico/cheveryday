export default function CalendarLegend() {
  return (
    <div className="calendar-legend">
      <span>
        <i className="legend-dot today-dot" /> Today
      </span>
      <span>
        <i className="legend-box" /> Selected day
      </span>
      <span className="tip">Tip: Select any date to view its activities</span>
    </div>
  );
}
