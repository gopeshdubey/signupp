const express = require('express');
const mysql = require('mysql');
const http = require('http');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const app = express();
app.use(bodyParser.json());

// Create connection
function getConnection() {
  return  mysql.createConnection({
      host     : 'localhost',
      user     : 'admin',
      password : 'admin123',
      database : 'data',
      multipleStatements: true
  })
}

const db = getConnection()

// Connect
db.connect((err) => {
    if(err){
        throw err;
    }
    console.log('MySql Connected...');
});

app.get('/hello', (req, res) => {
  
  console.log("inside form");

})

app.get('/show', (req, res) => {
  
  console.log("inside db");
  db.query('SELECT * FROM `dataa`', (err, rows, fields) => {
    if(!err)
    res.send(rows)
    console.log("inside db");
    else {
      console.log(err);
    }
  })
})

app.post('/signup', (req, res) => {
                    var newUserMysql = {
                       username: req.body.username,
                       password: req.body.password
                   };

                   db.query("SELECT * FROM dataa WHERE username = ?",[newUserMysql.username], function(err, rows) {
                         if (err)
                             return done(err);
                         if (rows.length) {
                             res.send("already a user")
                         } else {

                           var newUserMysql = {
                                  username: req.body.username,
                                  password: bcrypt.hashSync(req.body.password, null, null)
                              };

                             const sql = "INSERT INTO dataa ( username, password ) values (?,?)";

                             db.query(sql, [newUserMysql.username, newUserMysql.password], (err, rows, fields) =>  {
                               if(!err){
                                         res.send({key: rows});
                                         console.log("inside db");
                                       }
                                         else {
                                           console.log(err);
                                         }
                             });
             }
         });

})

// ????????????????????????????????????????????????????????????????




app.post('/login', (req, res) => {

                    var username= req.body.username;
                    var password= req.body.password;


                   db.query("SELECT * FROM dataa WHERE username = ?",[username], function(err, rows, fields) {

                     console.log("inside db");
                     console.log(rows[0].username);
                     console.log(rows[0].password);
                     console.log(password);

                         if (err){
                             res.send(err)
                           }else{

                             if (rows.length>0) {
                             res.send("hello")

                             // console.log(bcrypt.compareSync(rows[0].password, password));

                             if(bcrypt.compareSync(password, rows[0].password)){
                               res.send("successfully logged in");
                             }else{
                               res.send("password doesnt matched");
                             }
                           }
                          else{
                            res.send("no username exist")
                          }
                        }
                        });


})













// app.post('/login', (req, res) => {
//   var newUserMysql = {
//                        username: req.body.username,
//                        password: bcrypt.hashSync(req.body.password, null, null)
//                    };
//
//   const sql = "INSERT INTO dataa(`username`, `password`) VALUES (?, ?)"
//
//   db.query(sql, [newUserMysql.username, newUserMysql.password], (err, rows, fields) =>  {
//       if(!err)
//           res.send(rows);
//           else {
//             console.log(err);
//           }
//         });
//         })

// app.post('/login', (req, res) => {
//
//   const username = req.body.username
//   const password = req.body.password
//   const sql = "INSERT INTO dataa(`username`, `password`) VALUES (?, ?)"
//
//   db.query(sql, [username, password], (err, rows, fields) => {
//     if(!err)
//     res.send(rows);
//     else {
//       console.log(err);
//     }
//   })
// })

app.listen(3000, () => {
  console.log("server is running on port: 3000");
})
