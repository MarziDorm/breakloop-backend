const express = require("express");
const router = express.Router();
const habitDao = require("../dao/habitDao");
const { validate } = require("../middleware/validate");

const createSchema = {
  properties: {
    name: { type: "string", maxLength: 100 },
    description: { type: "string", maxLength: 500 },
    triggerDescription: { type: "string", maxLength: 500 },
    replacementAction: { type: "string", maxLength: 250 },
  },
  required: ["name"],
};

const updateSchema = {
  properties: {
    id: { type: "string" },
    name: { type: "string", maxLength: 100 },
    description: { type: "string", maxLength: 500 },
    triggerDescription: { type: "string", maxLength: 500 },
    replacementAction: { type: "string", maxLength: 250 },
    status: { type: "string", enum: ["Active", "Paused", "Resolved"] },
  },
  required: ["id"],
};

// habit/create  POST
router.post("/create", (req, res) => {
  const dtoIn = req.body;
  const { errors, unsupportedKeys } = validate(createSchema, dtoIn);

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      code: "breakloop/habit/create/invalidDtoIn",
      message: "DtoIn is not valid.",
      invalidTypeKeyMap: errors,
    });
  }

  const warnings = [];
  if (unsupportedKeys.length > 0) {
    warnings.push({
      code: "breakloop/habit/create/unsupportedKeys",
      message: "DtoIn contains unsupported keys.",
      unsupportedKeyList: unsupportedKeys,
    });
  }

  const dtoOut = habitDao.create(dtoIn);
  return res.status(200).json({ ...dtoOut, ...(warnings.length ? { warnings } : {}) });
});

// habit/get  GET
router.get("/get", (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({
      code: "breakloop/habit/get/invalidDtoIn",
      message: "DtoIn is not valid.",
      invalidTypeKeyMap: { id: "required" },
    });
  }

  const habit = habitDao.get(id);
  if (!habit) {
    return res.status(404).json({
      code: "breakloop/habit/get/habitDoesNotExist",
      message: "Habit with given id does not exist.",
    });
  }

  return res.status(200).json(habit);
});

// habit/list  GET
router.get("/list", (req, res) => {
  const dtoOut = habitDao.list();
  return res.status(200).json(dtoOut);
});

// habit/update  POST
router.post("/update", (req, res) => {
  const dtoIn = req.body;
  const { errors, unsupportedKeys } = validate(updateSchema, dtoIn);

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      code: "breakloop/habit/update/invalidDtoIn",
      message: "DtoIn is not valid.",
      invalidTypeKeyMap: errors,
    });
  }

  const existing = habitDao.get(dtoIn.id);
  if (!existing) {
    return res.status(404).json({
      code: "breakloop/habit/update/habitDoesNotExist",
      message: "Habit with given id does not exist.",
    });
  }

  const warnings = [];
  if (unsupportedKeys.length > 0) {
    warnings.push({
      code: "breakloop/habit/update/unsupportedKeys",
      message: "DtoIn contains unsupported keys.",
      unsupportedKeyList: unsupportedKeys,
    });
  }

  const dtoOut = habitDao.update(dtoIn);
  return res.status(200).json({ ...dtoOut, ...(warnings.length ? { warnings } : {}) });
});

// habit/delete  POST
router.post("/delete", (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({
      code: "breakloop/habit/delete/invalidDtoIn",
      message: "DtoIn is not valid.",
      invalidTypeKeyMap: { id: "required" },
    });
  }

  const existing = habitDao.get(id);
  if (!existing) {
    return res.status(404).json({
      code: "breakloop/habit/delete/habitDoesNotExist",
      message: "Habit with given id does not exist.",
    });
  }

  habitDao.remove(id);
  return res.status(200).json({});
});

module.exports = router;
