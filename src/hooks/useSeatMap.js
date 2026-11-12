import { useCallback, useEffect, useState } from "react";
import { fetchSeatMap } from "../data/seatData.js";

export default function useSeatMap(layoutId) {
  const [state, setState] = useState({ status: "loading", rows: [], error: null });
  const [tick, setTick] = useState(0);
  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading", rows: [], error: null });
    fetchSeatMap(layoutId)
      .then((rows) => !cancelled && setState({ status: "ready", rows, error: null }))
      .catch((e) => !cancelled && setState({ status: "error", rows: [], error: e.message }));
    return () => { cancelled = true; };
  }, [layoutId, tick]);
  return { ...state, retry: useCallback(() => setTick((t) => t + 1), []) };
}
