const inr = (n) => `₹${n.toLocaleString("en-IN")}`;

export default function Summary({ summary }) {
  const nothing = summary.lines.every((l) => !l.seat && l.meal.id === "none");
  return (
    <section className="receipt">
      <h2>Charges</h2>
      {nothing && <p className="hint">Nothing selected yet. Seats marked free add no charge.</p>}
      {summary.lines.map(({ passenger, seat, meal, seatPrice, mealPrice }) => (
        <div className="item" key={passenger.id}>
          <h3>{passenger.name}</h3>
          <p><span>{seat ? `Seat ${seat.id}` : "No seat"}</span><i /><span>{seat ? (seatPrice ? inr(seatPrice) : "Free") : "–"}</span></p>
          {meal.id !== "none" && <p><span>{meal.label}</span><i /><span>{mealPrice ? inr(mealPrice) : "Free"}</span></p>}
        </div>
      ))}
      <p className="total"><span>Total</span><strong aria-live="polite">{inr(summary.total)}</strong></p>
    </section>
  );
}
