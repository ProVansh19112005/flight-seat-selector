// Mock data. fetchSeatMap stands in for an API call.
export const LAYOUTS = {
  "3-2": { label: "3–2", groups: [["A", "B", "C"], ["D", "E"]] },
  "2-3-2": { label: "2–3–2", groups: [["A", "B"], ["C", "D", "E"], ["F", "G"]] },
};

export const CATEGORIES = {
  standard: { label: "Standard", price: 0 },
  premium: { label: "Premium", price: 250 },
  legroom: { label: "Extra legroom", price: 350 },
};

export const MEALS = [
  { id: "none", label: "No meal", price: 0 },
  { id: "veg", label: "Veg sandwich", price: 0 },
  { id: "chicken", label: "Chicken biryani", price: 280 },
  { id: "vegan", label: "Vegan bowl", price: 220 },
];

const ROWS = 12;
const LEGROOM_ROWS = [4, 10];
// Exact values from the brief's sample table
const OVERRIDES = { "1A": "standard", "1B": "standard", "1C": "legroom", "1D": "standard", "1E": "premium", "2A": "legroom", "2B": "standard" };

const categoryFor = (id, row, isWindow) => {
  if (OVERRIDES[id]) return OVERRIDES[id];
  if (LEGROOM_ROWS.includes(row)) return "legroom";
  if (row <= 3 && isWindow) return "premium";
  return "standard";
};

export function buildSeatMap(layoutId) {
  const groups = LAYOUTS[layoutId].groups;
  const letters = groups.flat();
  return Array.from({ length: ROWS }, (_, r) => {
    const row = r + 1;
    return {
      row,
      groups: groups.map((g) =>
        g.map((letter) => {
          const id = `${row}${letter}`;
          const idx = letters.indexOf(letter);
          const isWindow = idx === 0 || idx === letters.length - 1;
          const category = categoryFor(id, row, isWindow);
          const occupied = !OVERRIDES[id] && (row * 7 + idx * 13) % 5 === 0;
          return { id, row, letter, category, price: CATEGORIES[category].price, occupied };
        })
      ),
    };
  });
}

// Fake latency so the loading and error states are real.
// Open the page with ?fail to see the error state.
let attempts = 0;
export const fetchSeatMap = (layoutId) =>
  new Promise((resolve, reject) =>
    setTimeout(() => {
      attempts += 1;
      if (new URLSearchParams(location.search).has("fail") && attempts % 2 === 1) reject(new Error("Seat map service is unreachable."));
      else resolve(buildSeatMap(layoutId));
    }, 600)
  );
