const express = require('express')
const cors = require('cors')

const mongoose = require('mongoose')

const app = express()
app.use(cors())
app.use(express.json())
require("dotenv").config()

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("connected to database")
}).catch((error) => {
    console.log("Connected to failed",error)
})

const nodemailer = require('nodemailer')

const credential = mongoose.model('credential', {}, "bulkmail")

app.post('/sendemail', (req, res) => {
    var msg = req.body.msg
    var emaillist = req.body.emaillist
    credential.find().then((data) => {
        console.log(data[0].toJSON())
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: data[0].toJSON().user,
                pass: data[0].toJSON().pass,
            }
        })
        new Promise(async (resolve, reject) => {
            try {
                for (var i = 0; i < emaillist.length; i++) {
                    await transporter.sendMail({
                        from: '20bcs115.akilan.k@gmail.com',
                        to: emaillist[i],
                        subject: 'A Message from Bulk Mail App',
                        text: msg
                    }
                    )
                    console.log("Email sent to:" + emaillist[i])
                }
                resolve("success")
            }
            catch (error) {
                reject("failed")
            }
        }).then(() => {
            res.send(true)
        }).catch(() => {
            res.send(false)
        })
    }).catch((error) => {
        console.log(error)
    })
})
const PORT =process.env.PORT
app.listen(PORT,() => {
    console.log(`server is running on port 3000 ${PORT}`)
})