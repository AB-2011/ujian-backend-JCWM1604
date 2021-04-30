const { mysqldb } = require("./../connections");
const { createAccessToken } = require("./../helper/createToken");
const hashpass = require("./../helper/hashingpass");
const { promisify } = require("util");
const dba = promisify(mysqldb.query).bind(mysqldb);

module.exports = {
  Register: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      if (
        !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
          email
        )
      ) {
        return res.status(400).send({ message: "email invalid" });
      } else {
        res.status(200);
      }
      let number = /[0-9]/g;
      let specChar = /[!@#$%^&*]/g;
      if (!username || !email || !password) {
        return res.status(400).send({ message: "bad request" });
      }

      if (username.length < 6) {
        return res.status(400).send({
          message: "username must contain at least 6 characters or more",
        });
      }
      if (!password.match(number)) {
        return res
          .status(400)
          .send({ message: "password must contain at least a number" });
      }
      if (!password.match(specChar)) {
        return res.status(400).send({
          message: "password must contain at least a special character",
        });
      }
      let sql = `select * from users where email = ?`;
      let dataUsers = await dba(sql, [email]);
      if (dataUsers.length) {
        return res.status(500).send({ message: "email has been registered" });
      }
      // insert user ke table users
      sql = `insert into users set ?`;
      const uid = Date.now();
      let data = {
        uid: uid,
        email: email,
        username: username,
        password: hashpass(password),
      };
      await dba(sql, [data]);
      // get lagi datanya sebagai response dari database
      sql = `select * from users where uid = ?`;
      dataUsers = await dba(sql, [uid]);
      let dataToken = {
        uid: dataUsers[0].uid,
        username: dataUsers[0].username,
      };
      const tokenAccess = createAccessToken(dataToken);
      res.set("x-token-access", tokenAccess);
      return res.status(201).send({ ...dataUsers[0], token: tokenAccess });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "server error" });
    }
  },
  Login: async (req, res) => {
    try {
      const { usernameoremail, password } = req.body;
      if (!usernameoremail || !password) {
        return res.status(400).send({ message: "bad request" });
      }
      let sql = `select * from users where (username = ? or email = ?) and password = ?`;
      //   datauser.length && datauser[0].status !== "Closed"
      const datauser = await dba(sql, [
        usernameoremail,
        usernameoremail,
        hashpass(password),
      ]);
      if (
        datauser.length &&
        datauser[0].status !== 2 &&
        datauser[0].status !== 3
      ) {
        const datatoken = {
          uid: datauser[0].uid,
          username: datauser[0].username,
        };
        // buat token
        const tokenAccess = createAccessToken(datatoken);
        // buat responheader
        res.set("tokenAccess", tokenAccess);
        return res.status(200).send({ ...datauser[0], token: tokenAccess });
      } else {
        return res
          .status(500)
          .send({ message: "login gagal / user sudah deactive/close" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "server error" });
    }
  },
  activeAccount: async (req, res) => {
    try {
      const { uid } = req.params;
      if (req.params.uid === req.user.uid) {
        let dataUpdate = {
          status: 1,
        };
        let sql = `update users set ? where uid = ?`;
        await dba(sql, [dataUpdate, uid]);
        return res.status(200).send({ message: "status: Active" });
      }
      return res.status(401).send({ message: "id unauthorize" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "server error" });
    }
  },
  deactiveAccount: async (req, res) => {
    try {
      const { uid } = req.params;
      if (req.params.uid === req.user.uid) {
        let dataUpdate = {
          status: 2,
        };
        let sql = `update users set ? where uid = ?`;
        await dba(sql, [dataUpdate, uid]);
        return res.status(200).send({ message: "status: deactive" });
      }
      return res.status(401).send({ message: "id unauthorize" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "server error" });
    }
  },
  closedAccount: async (req, res) => {
    try {
      const { uid } = req.params;
      if (req.params.uid === req.user.uid) {
        let dataUpdate = {
          status: 3,
        };
        let sql = `update users set ? where uid = ?`;
        await dba(sql, [dataUpdate, uid]);
        return res.status(200).send({ message: "status: closed" });
      }
      return res.status(401).send({ message: "id unauthorize" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "server error" });
    }
  },
};
