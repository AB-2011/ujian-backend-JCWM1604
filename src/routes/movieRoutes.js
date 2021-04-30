const express = require("express");
const router = express.Router();

const { verifyTokenAccess } = require("./../helper/verifiyToken");
// get,post,put,delete ada disini
const { MovieControllers } = require("./../controllers");
// import middleware

const {
  getMovie,
  getStatus,
  addMovies,
  ubahStatus,
  getLocation,
  getAllQuery,
} = MovieControllers;

router.get("/get/all", getMovie);
router.post("/add", addMovies);
router.patch("/edit/:id", ubahStatus);

router.get("/get", getStatus);
router.get("/get", getLocation);
router.get("/get", getAllQuery);

module.exports = router;
