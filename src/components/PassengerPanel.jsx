import { MEALS } from "../data/seatData.js";

export default function PassengerPanel({ passengers, activeId, dispatch }) {
  const setCount = (count) => dispatch({ type: "SET_COUNT", count });
  const n = passengers.length;
  return (
    <section className="passengers">
      <div className="head">
        <h2>Passengers</h2>
        <div className="stepper" role="group" aria-label="Number of passengers">
          <button onClick={() => setCount(n - 1)} disabled={n <= 1} aria-label="Fewer passengers">−</button>
          <output>{n}</output>
          <button onClick={() => setCount(n + 1)} disabled={n >= 6} aria-label="More passengers">+</button>
        </div>
      </div>
      <ol>
        {passengers.map((p, i) => (
          <li key={p.id} className={p.id === activeId ? "active" : ""}>
            <button className="pick" onClick={() => dispatch({ type: "SELECT", id: p.id })} aria-pressed={p.id === activeId}>
              <span className="num">{i + 1}</span>
              <span className="pname">{p.name}</span>
              <span className={`pseat${p.seatId ? "" : " none"}`}>{p.seatId ?? "none"}</span>
            </button>
            {p.id === activeId && (
              <div className="detail">
                <label>Name
                  <input value={p.name} maxLength={24} onChange={(e) => dispatch({ type: "RENAME", id: p.id, name: e.target.value })} />
                </label>
                <label>Meal
                  <select value={p.mealId} onChange={(e) => dispatch({ type: "SET_MEAL", id: p.id, mealId: e.target.value })}>
                    {MEALS.map((m) => <option key={m.id} value={m.id}>{m.label} ({m.price ? `₹${m.price}` : "free"})</option>)}
                  </select>
                </label>
                {p.seatId && <button className="link" onClick={() => dispatch({ type: "CLEAR", id: p.id })}>Remove seat {p.seatId}</button>}
              </div>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
