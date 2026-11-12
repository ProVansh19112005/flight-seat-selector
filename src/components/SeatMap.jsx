import Seat from "./Seat.jsx";
import { CATEGORIES } from "../data/seatData.js";

export default function SeatMap({ rows, passengers, activeId, onPick }) {
  const owner = Object.fromEntries(passengers.filter((p) => p.seatId).map((p) => [p.seatId, p.id]));
  const stateOf = (s) => (s.occupied ? "occupied" : owner[s.id] === activeId ? "selected" : owner[s.id] ? "taken" : "available");
  return (
    <div>
      <div className="cabin" role="group" aria-label="Seat map">
        {rows.map(({ row, groups }) => (
          <div className={`row${groups.flat().every((s) => s.category === "legroom") ? " exit" : ""}`} key={row}>
            <span className="row-no">{row}</span>
            {groups.map((g, i) => (
              <div className="group" key={i}>
                {g.map((s) => <Seat key={s.id} seat={s} state={stateOf(s)} onPick={onPick} />)}
              </div>
            ))}
            <span className="row-no">{row}</span>
          </div>
        ))}
      </div>
      <ul className="legend">
        {Object.entries(CATEGORIES).map(([k, c]) => (
          <li key={k}><i className={`dot seat--${k}`} />{c.label} {c.price ? `₹${c.price}` : "free"}</li>
        ))}
        <li><i className="dot is-selected" />Selected</li>
        <li><i className="dot is-taken" />Other passenger</li>
        <li><i className="dot is-occupied" />Occupied</li>
      </ul>
    </div>
  );
}
