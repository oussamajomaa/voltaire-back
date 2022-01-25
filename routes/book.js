const express = require('express')
const router = express.Router()
const mysql = require('../connection')
const jwt = require("jsonwebtoken");

// Cette fonction est pour vérifier le token
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

// Une route qui sert à ajouter un livre
router.post('/add-book', verifyToken, (req, res) => {
    jwt.verify(req.token, 'voltaire', (err, decode) => {
        if (err) res.send({ status: '403', err })
        else {
            let book_id
            const book = req.body

            mysql.query('INSERT INTO book SET ?', book, (err, rows) => {
                if (!err) {
                    res.send({ message: `The book ${book.title} has been added.`, book_id: rows.insertId })
                } else {
                    console.log(err)
                }
            })
        }
    })
})

// Une route qui sert à ajouter l'id du livre avec l'id du contributeur dans une table intermidiare book_contributeur
router.post('/add-book-contibutor', (req, res) => {
    const item = req.body
    mysql.query('INSERT INTO book_contributor SET ?', item, (err, rows) => {
        if (!err) {
            res.send({ message: `success` })
        }
    })
})

// Une route qui sert à mettre à jour un livre
router.patch('/edit-book', verifyToken, (req, res) => {
    jwt.verify(req.token, 'voltaire', (err, decode) => {
        if (err) res.send({ status: '403', err })
        else {
            const id = req.body.id
            mysql.query(`DELETE from book_contributor where book_id = ${id}`, (err, rows) => { })
            const book = [
                req.body.title,
                req.body.publisher,
                req.body.publication_place,
                req.body.publication_date,
                req.body.publisher_stated,
                req.body.publication_place_stated,
                req.body.publication_date_stated,
                req.body.type_document,
                req.body.multivolume,
                req.body.volume,
                req.body.format,
                req.body.source,
                req.body.marginalia,
                req.body.binding,
                req.body.library,
                req.body.cote,
                req.body.provenance,
                req.body.ferney,
                req.body.digital_voltaire,
                req.body.external_resource,
                req.body.notes,
                req.body.user_update,
                req.body.update_date,
                req.body.id
            ]
            mysql.query(`UPDATE book set    title = ?,
                                            publisher = ?,
                                            publication_place = ?,
                                            publication_date = ?,
                                            publisher_stated = ?,
                                            publication_place_stated = ?,
                                            publication_date_stated = ?,
                                            type_document = ?,
                                            multivolume = ?,
                                            volume = ?,
                                            format = ?,
                                            source = ?,
                                            marginalia = ?,
                                            binding = ?,
                                            library = ?,
                                            cote = ?,
                                            provenance = ?,
                                            ferney = ?,
                                            digital_voltaire = ?,
                                            external_resource = ?,
                                            notes = ?,
                                            user_update = ?,
                                            update_date = ?
                                            where id = ?`, book, (err, rows) => {
                if (!err) res.send({ message: "One item has been updated" })
                else console.log(err)
            })
        }
    })
})

// Une route qui sert à supprimer un livre
router.delete('/deleteBook', verifyToken, (req, res, next) => {
    jwt.verify(req.token, 'voltaire', (err, decode) => {
        if (err) res.send({ status: '403', err })
        else {
            const id = req.query["id"]
            mysql.query(`DELETE from book_contributor where book_id = ${id}`, (err, rows) => { })
            mysql.query(`DELETE from book where id = ${id}`, (err, rows) => {
                if (!err) res.send({ message: "one book has been deleted" })
                else res.send(err)
            })
        }
        // decode
    })
})

// Une route qui sert à récupérer tous les livres
router.get('/show-book', verifyToken, (req, res) => {
    jwt.verify(req.token, 'voltaire', (err, decode) => {
        if (err) res.send({ status: '403', err })
        else {
            mysql.query('select *from book order by title', (err, rows) => {
                if (!err) {
                    res.send(rows)
                }
                else {
                    console.log(err)
                }
            })
        }
    })
})


// ##### route without token
// router.get('/show-book', (req, res) => {     
//             mysql.query('select *from book order by title', (err, rows) => {
//                 if (!err) {
//                     res.send(rows)
//                 }
//                 else {
//                     console.log(err)
//                 }

//     })
// })


// Une route qui sert à récupérer un livre
router.get('/get-one-book', verifyToken, (req, res) => {
    jwt.verify(req.token, 'voltaire', (err, decode) => {
        if (err) res.send({ status: '403', err })
        else {
            const id = req.query["id"]
            // mysql.query(`SELECT * from book where id = ${id}`, (err, row) => {
            mysql.query(`SELECT b.*,u.email from book b left join user u on b.user_id = u.id where b.id = ${id}`, (err, row) => {
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
