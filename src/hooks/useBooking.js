import { useMemo, useReducer } from "react";

const makePassengers = (n, old = []) =>
  Array.from({ length: n }, (_, i) => old[i] ?? { id: i + 1, name: `Passenger ${i + 1}`, seatId: null, mealId: "none" });

const init = { passengers: makePassengers(1), activeId: 1, notice: null };

// seatId lives on the passenger, so one seat each comes for free; ASSIGN guards the other direction.
function reducer(state, a) {
  const patch = (id, fields) => state.passengers.map((p) => (p.id === id ? { ...p, ...fields } : p));
  switch (a.type) {
    case "SET_COUNT": {
      const passengers = makePassengers(a.count, state.passengers);
      const activeId = passengers.some((p) => p.id === state.activeId) ? state.activeId : passengers[0].id;
      return { ...state, passengers, activeId, notice: null };
    }
    case "SELECT": return { ...state, activeId: a.id, notice: null };
    case "RENAME": return { ...state, passengers: patch(a.id, { name: a.name }) };
    case "SET_MEAL": return { ...state, passengers: patch(a.id, { mealId: a.mealId }) };
    case "RESET_SEATS": // seat ids differ between layouts
      return { ...state, passengers: state.passengers.map((p) => ({ ...p, seatId: null })), activeId: state.passengers[0].id, notice: null };
    case "CLEAR": return { ...state, passengers: patch(a.id, { seatId: null }), notice: null };
    case "ASSIGN": {
      const { seat } = a;
      if (seat.occupied) return { ...state, notice: { type: "error", text: `${seat.id} is already occupied. Pick another seat.` } };
      const owner = state.passengers.find((p) => p.seatId === seat.id);
      if (owner?.id === state.activeId)
        return { ...state, passengers: patch(owner.id, { seatId: null }), notice: { type: "info", text: `Removed seat ${seat.id}.` } };
      if (owner) return { ...state, notice: { type: "error", text: `${seat.id} is already assigned to ${owner.name}.` } };
      const passengers = state.passengers.map((p) => (p.id === state.activeId ? { ...p, seatId: seat.id } : p));
      const next = passengers.find((p) => !p.seatId); // move on to whoever still has no seat
      return { ...state, passengers, activeId: next ? next.id : state.activeId, notice: { type: "ok", text: `Seat ${seat.id} assigned, ${seat.price ? "₹" + seat.price : "no charge"}.` } };
    }
    default: return state;
  }
}

export default function useBooking(seatLookup, meals) {
  const [state, dispatch] = useReducer(reducer, init);
  const summary = useMemo(() => {
    const lines = state.passengers.map((p) => {
      const seat = p.seatId ? seatLookup[p.seatId] : null;
      const meal = meals.find((m) => m.id === p.mealId);
      return { passenger: p, seat, meal, seatPrice: seat?.price ?? 0, mealPrice: meal?.price ?? 0 };
    });
    return { lines, total: lines.reduce((s, l) => s + l.seatPrice + l.mealPrice, 0) };
  }, [state.passengers, seatLookup, meals]);
  return { state, dispatch, summary };
}
