# Flight seat selection

**Live demo:** https://flight-seat-selector.vercel.app

A seat picker for up to six passengers on a 3–2 or 2–3–2 cabin. Each passenger gets one seat and optionally a meal, and the total updates as you go. Everything runs on mock data.

## Screenshots

![Seat map](screenshots/seat-map.jpg)

![Seat selection in progress](screenshots/working.jpg)

## Running it

```bash
npm install
npm run dev      # localhost:5173
npm run build    # output in dist/
```

Open the page with `?fail` to see the seat map error and retry state.

Deploys as-is to Vercel (Vite preset). For GitHub Pages, publish `dist/`; the base path is already relative.

## How it's put together

- `data/seatData.js`: layouts, price categories, meals, and the function that builds the seat map. Layouts are just groups of seat letters, so a new one is a single entry.
- `hooks/useBooking.js`: a reducer holding the passenger list, which passenger is active, and the latest message. It also derives the per-passenger charges and the total.
- `hooks/useSeatMap.js`: loading, error and retry for the (fake) seat map request.
- `components/`: `PassengerPanel`, `SeatMap`, `Seat`, `Summary`.

## Seat assignment

A seat ID is stored on the passenger who holds it, so nobody can have two seats. The reverse rule is checked in the `ASSIGN` action, in this order:

1. Occupied seat: refused, with a message.
2. Seat already held by the active passenger: released.
3. Seat held by someone else: refused, with a message.
4. Otherwise it's assigned, and the selection moves to the next passenger without a seat.

Switching passengers only changes who is active, so earlier choices stay put. Lowering the passenger count drops only the passengers removed. How a seat looks (free, occupied, yours, someone else's) is worked out when rendering rather than stored, which keeps it from getting out of step with the assignments.

The total is calculated from the passengers list on every change: seat price plus meal price for each person. There's no separate total to keep in sync.

Switching layout clears seats, since seat IDs differ between cabins; the app asks first.

Prices: standard free, premium ₹250, extra legroom ₹350. The sample seats from the brief (1A–1E, 2A, 2B) use exactly those prices.
