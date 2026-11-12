import { CATEGORIES } from "../data/seatData.js";

// state: "available" | "occupied" | "selected" (active passenger) | "taken" (other passenger)
export default function Seat({ seat, state, onPick }) {
  const label = `Seat ${seat.id}, ${CATEGORIES[seat.category].label}, ${seat.price ? `₹${seat.price}` : "free"}${state === "occupied" ? ", occupied" : ""}`;
  return (
    <button className={`seat seat--${seat.category} is-${state}`} aria-label={label} aria-pressed={state === "selected"} title={label} onClick={() => onPick(seat)}>
      {state === "occupied" ? "×" : seat.letter}
    </button>
  );
}
