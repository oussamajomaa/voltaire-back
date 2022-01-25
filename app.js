const express = require('express')

const cors = require('cors')

const auth = require('./routes/auth')
const book = require('./routes/book')
const contributor = require('./routes/contributor')
const https = require('https')
const fs = require('fs')
const path = require("path")
const app = express()
console.log(https);

app.use(cors())

const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));


app.use(express.json());

app.use('', auth)
app.use('', book)
app.use('', contributor)



const sslServer = https.createServer(
    {
        key: fs.readFileSync(path.join(__dirname,'cert','key.pem')),
        cert: fs.readFileSync(path.join(__dirname,'cert','cert.pem'))
    }
    , app)


sslServer.listen(port, () => console.log(`Listening on port ${port}`))
