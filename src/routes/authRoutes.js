const express = require("express");
const router = express.Router();

const { verifyTokenAccess } = require("./../helper/verifiyToken");
// get,post,put,delete ada disini
const { AuthControllers } = require("./../controllers");
// import middleware

const {
  Register,
  Login,
  activeAccount,
  deactiveAccount,
  closedAccount,
} = AuthControllers;

router.post("/register", Register);
router.post("/login", Login);
router.patch("/deactive/:uid", verifyTokenAccess, deactiveAccount);
router.patch("/active/:uid", verifyTokenAccess, activeAccount);
router.patch("/close/:uid", verifyTokenAccess, closedAccount);

// router.post("/login", Login);
// router.patch("/users/admin/:iduser", verifyTokenAccess, ChangeToAdmin);
// router.delete("/users/delete/:iduser", verifyTokenAccess, deleteUser);

module.exports = router;
