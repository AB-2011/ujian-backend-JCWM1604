const { mysqldb } = require("./../connections");
const { createAccessToken } = require("./../helper/createToken");
const hashpass = require("./../helper/hashingpass");
const { promisify } = require("util");
const dba = promisify(mysqldb.query).bind(mysqldb);

module.exports = {
  getMovie: (req, res) => {
    let sql = `select * from movies m join movie_status ms  on m.status=ms.id join show_times st on m.status=st.id join locations l 
    on m.status=l.id `;
    mysqldb.query(sql, (err, movies) => {
      if (err) {
        console.log(err);
        return res.status(500).send({ message: "server error" });
      }
      return res.status(200).send(movies);
    });
  },
  getStatus: (req, res) => {
    const { status } = req.query;
    let sql;

    if (status) {
      // pakai connection.escape spy urlnya secure,
      // connection diganti mysqldb, krn suda dirapihkan difolder lain
      // biar tdk kena sql injection
      sql = `select * from movies m join movie_status ms  on m.status=ms.id join show_times st on m.status=st.id join locations l 
      on m.status=l.id where ms.status='on show'`;
    } else {
      // get semua user
      sql = `select * from movies`;
    }
    mysqldb.query(sql, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      // console.log(result);
      return res.send(result);
    });
  },
  getLocation: (req, res) => {
    const { location } = req.query;
    let sql;

    if (location) {
      // pakai connection.escape spy urlnya secure,
      // connection diganti mysqldb, krn suda dirapihkan difolder lain
      // biar tdk kena sql injection
      sql = `select * from movies m join movie_status ms  on m.status=ms.id join show_times st on m.status=st.id join locations l 
      on m.status=l.id where l.location='bandung'`;
    } else {
      // get semua user
      sql = `select * from movies`;
    }
    mysqldb.query(sql, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      // console.log(result);
      return res.send(result);
    });
  },
  getTime: (req, res) => {
    const { time } = req.query;
    let sql;

    if (time) {
      // pakai connection.escape spy urlnya secure,
      // connection diganti mysqldb, krn suda dirapihkan difolder lain
      // biar tdk kena sql injection
      sql = `select * from movies m join movie_status ms  on m.status=ms.id join show_times st on m.status=st.id join locations l 
      on m.status=l.id where st.time='9 AM'`;
    } else {
      // get semua user
      sql = `select * from movies`;
    }
    mysqldb.query(sql, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      // console.log(result);
      return res.send(result);
    });
  },
  getAllQuery: (req, res) => {
    const { status, location, time } = req.query;
    let sql;

    if (status && location && time) {
      // pakai connection.escape spy urlnya secure,
      // connection diganti mysqldb, krn suda dirapihkan difolder lain
      // biar tdk kena sql injection
      sql = `select * from movies m join movie_status ms  on m.status=ms.id join show_times st on m.status=st.id join locations l 
      on m.status=l.id where ms.status='on show' and l.location='Bandung' and st.time='9 AM'`;
    } else {
      // get semua user
      sql = `select * from movies`;
    }
    mysqldb.query(sql, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      // console.log(result);
      return res.send(result);
    });
  },
  addMovies: async (req, res) => {
    try {
      const {
        name,
        genre,
        release_date,
        release_month,
        release_year,
        duration_min,
        description,
      } = req.body;
      const { id } = req.user;
      if (
        !name ||
        !genre ||
        !release_date ||
        !release_month ||
        !release_year ||
        !duration_min ||
        !description
      )
        throw { message: "input tidak boleh kosong" };
      mysqldb.query(
        `select * from users where id = ?`,
        [id],
        (error, result) => {
          if (result[0].role === 1) {
            let data = {
              name: name,
              genre: genre,
              release_date: release_date,
              release_month: release_month,
              release_year: release_year,
              duration_min: duration_min,
              description: description,
            };
            mysqldb.query(`insert into movies set ?`, data, (error) => {
              if (error) throw { message: "query tipo" };
              res.status(201).send({ message: "movies berhasil ditambahkan" });
            });
          } else {
            throw { message: "server error" };
          }
        }
      );
    } catch (error) {
      console.error(error);
      return res.status(500).send(error.message);
    }
  },
  ubahStatus: async (req, res) => {
    try {
      const { uid } = req.params;
      if (req.params.uid === req.user.uid) {
        if (role == 1) {
          let dataUpdate = {
            status: 2,
          };
          let sql = `update movies set ? where uid = ?`;
          await dba(sql, [dataUpdate, uid]);
          return res.status(200).send({ message: "status has been changed" });
        }
      }
      return res.status(401).send({ message: "id unauthorize" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "server error" });
    }
  },
  addSchedule: async (req, res) => {
    try {
      const { uid } = req.params;
      if (req.params.uid === req.user.uid) {
        let dataUpdate = {
          location_id: 1,
          time_id: 1,
        };
        let sql = `update movies set ? where uid = ?`;
        await dba(sql, [dataUpdate, uid]);
        return res.status(200).send({ message: "schedule has been added" });
      }
      return res.status(401).send({ message: "id unauthorize" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "server error" });
    }
  },
};
