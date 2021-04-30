const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");
// main app
const app = express();

require("dotenv").config();
app.use(
  cors({
    exposedHeaders: [
      "Content-Length",
      "x-token-access",
      "x-token-refresh",
      "x-total-count",
      // exposed header untk token
    ],
  })
);

// apply middleware
// app.use(cors())
// app.use(bodyparser.json())
const bearerToken = require("express-bearer-token");
app.use(bearerToken());
const PORT = 5000;

const morgan = require("morgan");
morgan.token("date", function () {
  return new Date();
});
app.use(
  morgan(":method :url :status :res[content-lenght] - :response-time ms :date")
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

// main route

app.get("/", (req, res) => {
  res.send("<h1>REST API JCWM1604</h1>");
});

const { AuthRoutes, MovieRoutes } = require("./src/routes");
app.use("/user", AuthRoutes);
app.use("/movies", MovieRoutes);

// app.use("/product", ProductRoutes);

app.all("*", (req, res) => {
  res.status(404).send("resource not found");
});

// bind to local machine
app.listen(PORT, () => console.log("listen in port " + PORT));
