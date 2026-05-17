const express = require("express");
const router = express.Router();
const urgeEventDao = require("../dao/urgeEventDao");
const habitDao = require("../dao/habitDao");
const { validate } = require("../middleware/validate");

const VALID_TRIGGER_TAGS = ["Stress", "Boredom", "Loneliness", "Other"];

const createSchema = {
  properties: {
    habitId: { type: "string" },
    occurredAt: { type: "string" },
    triggerTag: { type: "string", enum: VALID_TRIGGER_TAGS },
    resisted: { type: "boolean" },
    slipUpNote: { type: "string", maxLength: 1000 },
    urgeDurationSec: { type: "number" },
  },
  required: ["habitId", "triggerTag", "resisted"],
};

const updateSchema = {
  properties: {
    id: { type: "string" },
    triggerTag: { type: "string", enum: VALID_TRIGGER_TAGS },
    resisted: { type: "boolean" },
    slipUpNote: { type: "string", maxLength: 1000 },
    urgeDurationSec: { type: "number" },
  },
  required: ["id"],
};

// urgeEvent/create  POST
router.post("/create", (req, res) => {
  const dtoIn = req.body;
  const { errors, unsupportedKeys } = validate(createSchema, dtoIn);

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      code: "breakloop/urgeEvent/create/invalidDtoIn",
      message: "DtoIn is not valid.",
      invalidTypeKeyMap: errors,
    });
  }

  // Validate occurredAt is not in the future
  if (dtoIn.occurredAt) {
    const occurredDate = new Date(dtoIn.occurredAt);
    if (isNaN(occurredDate.getTime())) {
      return res.status(400).json({
        code: "breakloop/urgeEvent/create/invalidDtoIn",
        message: "DtoIn is not valid.",
        invalidTypeKeyMap: { occurredAt: "must be a valid ISO date-time string" },
      });
    }
    if (occurredDate > new Date()) {
      return res.status(400).json({
        code: "breakloop/urgeEvent/create/invalidOccurredAt",
        message: "occurredAt must be current time or in the past.",
      });
    }
  }

  // Validate parent habit exists and is Active
  const habit = habitDao.get(dtoIn.habitId);
  if (!habit) {
    return res.status(404).json({
      code: "breakloop/urgeEvent/create/habitDoesNotExist",
      message: "Habit with id dtoIn.habitId does not exist.",
    });
  }
  if (habit.status !== "Active") {
    return res.status(400).json({
      code: "breakloop/urgeEvent/create/habitNotActive",
      message: "Habit is not Active. Only Active habits can receive urge events.",
    });
  }

  const warnings = [];
  if (unsupportedKeys.length > 0) {
    warnings.push({
      code: "breakloop/urgeEvent/create/unsupportedKeys",
      message: "DtoIn contains unsupported keys.",
      unsupportedKeyList: unsupportedKeys,
    });
  }

  const dtoOut = urgeEventDao.create(dtoIn);
  return res.status(200).json({ ...dtoOut, ...(warnings.length ? { warnings } : {}) });
});

// urgeEvent/get  GET
router.get("/get", (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({
      code: "breakloop/urgeEvent/get/invalidDtoIn",
      message: "DtoIn is not valid.",
      invalidTypeKeyMap: { id: "required" },
    });
  }

  const event = urgeEventDao.get(id);
  if (!event) {
    return res.status(404).json({
      code: "breakloop/urgeEvent/get/urgeEventDoesNotExist",
      message: "UrgeEvent with given id does not exist.",
    });
  }

  return res.status(200).json(event);
});

// urgeEvent/list  GET  (optional filter by habitId)
router.get("/list", (req, res) => {
  const filter = {};
  if (req.query.habitId) filter.habitId = req.query.habitId;
  const dtoOut = urgeEventDao.list(filter);
  return res.status(200).json(dtoOut);
});

// urgeEvent/update  POST
router.post("/update", (req, res) => {
  const dtoIn = req.body;
  const { errors, unsupportedKeys } = validate(updateSchema, dtoIn);

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      code: "breakloop/urgeEvent/update/invalidDtoIn",
      message: "DtoIn is not valid.",
      invalidTypeKeyMap: errors,
    });
  }

  const existing = urgeEventDao.get(dtoIn.id);
  if (!existing) {
    return res.status(404).json({
      code: "breakloop/urgeEvent/update/urgeEventDoesNotExist",
      message: "UrgeEvent with given id does not exist.",
    });
  }

  const warnings = [];
  if (unsupportedKeys.length > 0) {
    warnings.push({
      code: "breakloop/urgeEvent/update/unsupportedKeys",
      message: "DtoIn contains unsupported keys.",
      unsupportedKeyList: unsupportedKeys,
    });
  }

  const dtoOut = urgeEventDao.update(dtoIn);
  return res.status(200).json({ ...dtoOut, ...(warnings.length ? { warnings } : {}) });
});

// urgeEvent/delete  POST
router.post("/delete", (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({
      code: "breakloop/urgeEvent/delete/invalidDtoIn",
      message: "DtoIn is not valid.",
      invalidTypeKeyMap: { id: "required" },
    });
  }

  const existing = urgeEventDao.get(id);
  if (!existing) {
    return res.status(404).json({
      code: "breakloop/urgeEvent/delete/urgeEventDoesNotExist",
      message: "UrgeEvent with given id does not exist.",
    });
  }

  urgeEventDao.remove(id);
  return res.status(200).json({});
});

module.exports = router;
