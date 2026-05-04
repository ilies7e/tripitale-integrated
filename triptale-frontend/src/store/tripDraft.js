// Simple in-memory store for the multi-step trip creation flow.
// Not persisted intentionally: the draft resets when the app closes.
let listeners = new Set();

const initial = {
  categoryId: null,
  categorySlug: null,
  categoryTitle: null,
  title: '',
  location: '',
  region: '',
  country: '',
  description: '',
  budget: null,
  coverPhoto: null,
  gallery: [], // [{ uri }]
  guides: [], // [{ id, type, label, icon, text, locations: [] }]
};

let state = { ...initial };

export const getTripDraft = () => state;

export const setTripDraft = (patch) => {
  state = { ...state, ...patch };
  listeners.forEach((l) => l(state));
};

export const resetTripDraft = () => {
  state = { ...initial, gallery: [], guides: [] };
  listeners.forEach((l) => l(state));
};

export const subscribeTripDraft = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};
