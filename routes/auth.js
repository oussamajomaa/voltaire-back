const express = require('express')
const router = express.Router()
const mysql = require('../connection')
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');


function verifyToken(req, res, next) {
    const bearerHeader = req.headers.authorization
    if (typeof bearerHeader !== "undefined") {
        const bearerToken = bearerHeader.split(' ')[1]
        req.token = bearerToken
        next()
    }
    else {
        return res.sendStatus(403)
    }
}

router.post('/register', verifyToken, (req, res) => {
    jwt.verify(req.token, 'voltaire', (err, decode) => {
        if (err) res.send({ status: '403', err })
        else {
            let user = req.body
            bcrypt.hash(user.password, 10, function (err, hash) {
                user.password = hash
                mysql.query('SELECT * FROM user WHERE email = ?', [user.email],
                    (err, result) => {
                        if (result.length) {
                            res.send({
                                status: '409',
                                message: 'This username is already in use!'
                            })
                        }
                        else {
                            mysql.query('INSERT INTO user SET ?', user, (err, rows) => {

                                if (!err) {
                                    res.send({
                                        status: '200',
                                        message: 'A user has been added.'
                                    })
                                } else {
                                    console.log(err)
                                }
                            })
                        }
                    })
            })
            decode
        }
    })
})



router.post('/login', (req, res) => {

    const email = req.body.email;
    const password = req.body.password
    let hash

    if (email && password) {
        mysql.query('SELECT * FROM user WHERE email = ?', [email],
            (error, result, fields) => {
                if (result.length > 0) {
                    hash = result[0]['password']
                    bcrypt.compare(password, hash, function (err, isMatch) {
                        if (err) {
                            throw err
                        }
                        else if (!isMatch) {
                            res.send({ message: "Password incorrect" })
                        }
                        else {
                            const token = jwt.sign({
                                id: result[0]['id'],
                                email: result[0]['email'],
                                role: result[0]['role']
                            },
                                'voltaire', { expiresIn: '7d' }
                            )
                            res.send({ message: "You are logged in with success", token })
                            mysql.query(
                                `UPDATE user SET last_login = now() WHERE id = '${result[0].id}'`
                            );
                        }
                    })
                }
                else {
                    res.send({ message: 'Please enter a valid email and password!' });
                    res.end();
                }
            })
    }
})

router.get('/users', (req, res) => {
    mysql.query('SELECT * FROM user', (err, rows) => {
        if (!err) res.send(rows)
    })
})

router.delete('/deleteUser', verifyToken, (req, res, next) => {
    jwt.verify(req.token, 'voltaire', (err, decode) => {
        if (err) res.send({ status: '403', err })
        else {
            const id = req.query["id"]
            mysql.query(`DELETE from user where id = ${id}`, (err, rows) => {
                if (!err) res.send({ message: "One user has been deleted" })
                else res.send(err)
            })
        }
        // decode
    })
})

router.patch('/updateUser', verifyToken, (req, res, next) => {
    jwt.verify(req.token, 'voltaire', (err, decode) => {
        if (err) res.send({ satus: '403', err })
        else {
            
            const role = req.body.role
            const id = req.query["id"]
            const data = [req.body.role,req.query['id']]
            // mysql.query(`UPDATE user set role = ? where id = ?`, data, (err, rows) => {
            mysql.query(`UPDATE user set role = ? where id = ?`, [role,id], (err, rows) => {
                if (!err) res.send({ message: "One user has been updated" })
                else res.send(err)
            })
        }
    })
})

module.exports = router