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


router.get('/chart-book-contributor', (req, res) => {
    mysql.query(`SELECT * from book_contributor
                        join contributor on book_contributor.contributor_id = contributor.id 
                        join book on book_contributor.book_id = book.id`, (err, row) => {
        if (!err) {
            res.send(row)
        }
        else {
            console.log(err)
        }
    })
})

router.get('/chart-book', (req, res) => {
    mysql.query(`SELECT * from book`, (err, row) => {
        if (!err) {
            res.send(row)
        }
        else {
            console.log(err)
        }
    })
})

router.get('/chart-contributor', (req, res) => {
    mysql.query(`SELECT * from contributor
                join book_contributor on contributor.id = book_contributor.contributor_id`, (err, row) => {
        if (!err) {
            res.send(row)
        }
        else {
            console.log(err)
        }
    })
})

router.get('/chart-classification', (req, res) => {
    mysql.query(`SELECT * from book
                join classification on book.id = classification.book_id`, (err, row) => {
        if (!err) {
            res.send(row)
        }
        else {
            console.log(err)
        }
    })
})



module.exports = router
