const express = require('express')
const router = express.Router()
const mysql = require('../connection')
const jwt = require("jsonwebtoken");


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

// Une route qui sert à ajouter un contributor
router.post('/add-contributor',verifyToken, (req, res) => {
    jwt.verify(req.token, 'voltaire', (err, decode) => {
        if (err) res.send({ status: '403', err })
        else {
            const contributor = req.body
            mysql.query('INSERT INTO contributor SET ?', contributor, (err, rows) => {
                if (!err) {
                    res.send({ message: `The contributor ${contributor.name} has been added.` })
                } else {
                    console.log(err)
                }
            })
        }
    })
})


// Une route qui sert à mettre à jour un contributor
router.patch('/edit-contributor',verifyToken, (req, res) => {
    jwt.verify(req.token, 'voltaire', (err, decode) => {
        if (err) res.send({ status: '403', err })
        else {
            // const book = req.body
            const contributor = [
                            req.body.name,
                            req.body.status,
                            req.body.id
                        ]
                        console.log(contributor);
            mysql.query(`UPDATE contributor set name = ?,
                                                status = ?
                                                where id = ?`, contributor, (err, rows) => {
                if (!err) res.send({ message: "One contributor has been updated" })
                else console.log(err)
            })
        }
    })
})

// Une route qui sert à supprimer un contributor
router.delete('/delete-contributor',verifyToken,(req,res,next) => {
    jwt.verify(req.token, 'voltaire', (err, decode) => {
        if (err) res.send({ status: '403', err })
        else {
            const id = req.query["id"]
            mysql.query(`DELETE from contributor where id = ${id}`, (err, rows) => {
                if (!err) res.send({message:"One contributor has been deleted"})
                else res.send(err)
            })
        }
        // decode
    })
})


// Une route qui sert à récupérer touss les contributors
router.get('/show-contributor',verifyToken, (req, res) => {
    // router.get('/show-contributor', (req, res) => {
    jwt.verify(req.token, 'voltaire', (err, decode) => {
        if (err) res.send({ status: '403', err })
        else {
            mysql.query('SELECT * from contributor order by name', (err, rows) => {
                if (!err) {
                    res.send(rows)
                }
                else {
                    console.log('hi');
                    console.log(err)
                }
            })
        }
    })
})



router.get('/book-contributor',verifyToken, (req, res) => {
    jwt.verify(req.token, 'voltaire', (err, decode) => {
        if (err) res.send({ status: '403', err })
        else {
            const id = req.query["id"]
            mysql.query(`SELECT * from book_contributor
                        join contributor on book_contributor.contributor_id = contributor.id where book_contributor.book_id = ${id}`, (err, row) => {
                if (!err) {
                    res.send(row)
                }
                else {
                    console.log(err)
                }
            })
        }
    })
})

module.exports = router
