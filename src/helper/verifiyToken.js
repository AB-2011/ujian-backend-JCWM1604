const jwt = require("jsonwebtoken");

// middleware token
// jdi sblm akses get,post,put,delete users harus pnya token
module.exports.verifyTokenAccess = (req, res, next) => {
  // dngn bearer
  //   klo pake bearer, nanti dipostman headernya sblm token dikasih Bearer,spy bsa jln
  console.log("token", req.token);
  const token = req.token;
  const key = "saitama"; //kata kunci terserah
  jwt.verify(token, key, (err, decoded) => {
    // bakal error klo expired
    if (err) return res.status(401).send({ message: "user unauthorized" });
    console.log(decoded);
    req.user = decoded;
    next(); //klo next,akan msk ke getuser
  });
};
