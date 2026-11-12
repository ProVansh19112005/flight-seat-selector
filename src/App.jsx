import { useMemo, useState } from "react";
import useSeatMap from "./hooks/useSeatMap.js";
import useBooking from "./hooks/useBooking.js";
import PassengerPanel from "./components/PassengerPanel.jsx";
import SeatMap from "./components/SeatMap.jsx";
import Summary from "./components/Summary.jsx";
import { LAYOUTS, MEALS } from "./data/seatData.js";

export default function App() {
  const [layoutId, setLayoutId] = useState("3-2");
  const { status, rows, error, retry } = useSeatMap(layoutId);
  const seatLookup = useMemo(() => Object.fromEntries(rows.flatMap((r) => r.groups.flat()).map((s) => [s.id, s])), [rows]);
  const { state, dispatch, summary } = useBooking(seatLookup, MEALS);
  const active = state.passengers.find((p) => p.id === state.activeId);

  const changeLayout = (id) => {
    if (id === layoutId) return;
    const hasSeats = state.passengers.some((p) => p.seatId);
    if (hasSeats && !window.confirm("Seat numbers differ between layouts, so your current seats will be cleared. Continue?")) return;
    dispatch({ type: "RESET_SEATS" });
    setLayoutId(id);
  };

  return (
    <div className="app">
      <header className="top">
        <div>
          <h1>Select seats</h1>
          <p>Mumbai to Delhi, 6E 214, Fri 20 Nov</p>
        </div>
        <div className="layouts" role="group" aria-label="Cabin layout">
          <span>Cabin</span>
          {Object.entries(LAYOUTS).map(([id, l]) => (
            <button key={id} className={id === layoutId ? "on" : ""} aria-pressed={id === layoutId} onClick={() => changeLayout(id)}>{l.label}</button>
          ))}
        </div>
      </header>

      <main className="grid">
        <PassengerPanel passengers={state.passengers} activeId={state.activeId} dispatch={dispatch} />

        <section className="cabin-wrap">
          <p className={`status ${state.notice?.type ?? ""}`} role="status">
            {state.notice?.text ?? `Choosing a seat for ${active.name}.`}
          </p>
          {status === "loading" && <div className="state"><span className="spinner" />Loading seat map</div>}
          {status === "error" && (
            <div className="state">
              <p>{error} Nothing you picked has been lost.</p>
              <button className="retry" onClick={retry}>Retry</button>
            </div>
          )}
          {status === "ready" && (
            <SeatMap rows={rows} passengers={state.passengers} activeId={state.activeId} onPick={(seat) => dispatch({ type: "ASSIGN", seat })} />
          )}
        </section>

        <Summary summary={summary} />
      </main>
    </div>
  );
}
