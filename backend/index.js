const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/habit", require("./src/routes/habit"));
app.use("/urgeEvent", require("./src/routes/urgeEvent"));

app.get("/", (req, res) => {
  res.json({ app: "BreakLoop Backend", status: "running" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`BreakLoop running on port ${PORT}`);
});

module.exports = app;