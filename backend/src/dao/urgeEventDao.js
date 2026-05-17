const { v4: uuidv4 } = require("uuid");

const storage = [];

const urgeEventDao = {
  create(event) {
    const record = {
      id: uuidv4().replace(/-/g, ""),
      habitId: event.habitId,
      occurredAt: event.occurredAt || new Date().toISOString(),
      triggerTag: event.triggerTag,
      resisted: event.resisted,
      slipUpNote: event.slipUpNote || null,
      urgeDurationSec: event.urgeDurationSec || null,
    };
    storage.push(record);
    return { ...record };
  },

  get(urgeEventId) {
    return storage.find((e) => e.id === urgeEventId) || null;
  },

  list(filter = {}) {
    let result = storage.map((e) => ({ ...e }));
    if (filter.habitId) result = result.filter((e) => e.habitId === filter.habitId);
    return { urgeEventList: result };
  },

  update(event) {
    const idx = storage.findIndex((e) => e.id === event.id);
    if (idx === -1) return null;
    storage[idx] = { ...storage[idx], ...event };
    return { ...storage[idx] };
  },

  remove(urgeEventId) {
    const idx = storage.findIndex((e) => e.id === urgeEventId);
    if (idx === -1) return false;
    storage.splice(idx, 1);
    return true;
  },

  listByHabitId(habitId) {
    return storage.filter((e) => e.habitId === habitId).map((e) => ({ ...e }));
  },
};

module.exports = urgeEventDao;
