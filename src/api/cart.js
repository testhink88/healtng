// src/api/cart.js

const STORAGE_KEY = "healtng_cart_v1";
const LATENCY = 80;

const delay = () => new Promise((r) => setTimeout(r, LATENCY));

const load = () => {
  if (typeof window === "undefined") return { items: [] };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { items: [] };
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.items)) return { items: [] };
    return parsed;
  } catch {
    return { items: [] };
  }
};

const save = (cart) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
};

export async function getCart() {
  await delay();
  return load();
}

export async function addItemToCart(item) {
  await delay();
  const cart = load();
  const id =
    item.id ||
    `CARTITEM_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
  const finalItem = { ...item, id };
  cart.items.push(finalItem);
  save(cart);
  return finalItem;
}

export async function updateCartItem(itemId, patch) {
  await delay();
  const cart = load();
  const idx = cart.items.findIndex((i) => String(i.id) === String(itemId));
  if (idx === -1) return null;
  cart.items[idx] = { ...cart.items[idx], ...patch };
  save(cart);
  return cart.items[idx];
}

export async function removeItemFromCart(itemId) {
  await delay();
  const cart = load();
  const idx = cart.items.findIndex((i) => String(i.id) === String(itemId));
  if (idx === -1) return false;
  cart.items.splice(idx, 1);
  save(cart);
  return true;
}

export async function clearCart() {
  await delay();
  const empty = { items: [] };
  save(empty);
  return empty;
}

export async function getCartSummary() {
  await delay();
  const cart = load();
  const total_items = cart.items.reduce(
    (acc, it) => acc + (Number(it.qty || 1) || 1),
    0
  );
  const total_amount = cart.items.reduce(
    (acc, it) => acc + (Number(it.qty || 1) * Number(it.price || 0)),
    0
  );
  return { total_items, total_amount };
}
