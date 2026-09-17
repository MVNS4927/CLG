export const nanoid = (size = 8) =>
  crypto.randomUUID
    ? crypto.randomUUID().replace(/-/g, '').slice(0, size)
    : Math.random().toString(36).replace(/[^a-z0-9]+/g, '').slice(0, size);
