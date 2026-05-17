const { v4: uuidv4 } = require("uuid");

const storage = [];

const habitDao = {
  create(habit) {
    const record = {
      id: uuidv4().replace(/-/g, ""),
      name: habit.name,
      description: habit.description || null,
      triggerDescription: habit.triggerDescription || null,
      replacementAction: habit.replacementAction || null,
      createdAt: new Date().toISOString(),
      status: "Active",
    };
    storage.push(record);
    return { ...record };
  },

  get(habitId) {
    return storage.find((h) => h.id === habitId) || null;
  },

  list() {
    return { habitList: storage.map((h) => ({ ...h })) };
  },

  update(habit) {
    const idx = storage.findIndex((h) => h.id === habit.id);
    if (idx === -1) return null;
    storage[idx] = { ...storage[idx], ...habit };
    return { ...storage[idx] };
  },

  remove(habitId) {
    const idx = storage.findIndex((h) => h.id === habitId);
    if (idx === -1) return false;
    storage.splice(idx, 1);
    return true;
  },
};

module.exports = habitDao;
