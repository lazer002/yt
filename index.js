const express = require("express");

const dotenv = require("dotenv");



dotenv.config();

const runRoutes =
  require("./routes/run");



const app = express();



// BODY PARSER
app.use(express.json());



// ROUTES
app.use("/api", runRoutes);



// HEALTH CHECK
app.get("/", (req, res) => {

  res.json({

    success: true,

    message:
      "AI Shorts Bot API Running"

  });

});



const PORT =
  process.env.PORT || 5000;



app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});