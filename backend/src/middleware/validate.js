function validate(schema, data) {
  const errors = {};

  
  for (const key of schema.required || []) {
    if (data[key] === undefined || data[key] === null || data[key] === "") {
      errors[key] = "required";
    }
  }

  
  for (const [key, rules] of Object.entries(schema.properties || {})) {
    if (data[key] === undefined) continue;
    if (rules.type === "string" && typeof data[key] !== "string") {
      errors[key] = "must be a string";
    }
    if (rules.type === "boolean" && typeof data[key] !== "boolean") {
      errors[key] = "must be a boolean";
    }
    if (rules.type === "number" && typeof data[key] !== "number") {
      errors[key] = "must be a number";
    }
    if (rules.maxLength && typeof data[key] === "string" && data[key].length > rules.maxLength) {
      errors[key] = `max length is ${rules.maxLength}`;
    }
    if (rules.enum && !rules.enum.includes(data[key])) {
      errors[key] = `must be one of: ${rules.enum.join(", ")}`;
    }
  }

  
  const allowedKeys = Object.keys(schema.properties || {});
  const unsupportedKeys = Object.keys(data).filter((k) => !allowedKeys.includes(k));

  return { errors, unsupportedKeys };
}

module.exports = { validate };
