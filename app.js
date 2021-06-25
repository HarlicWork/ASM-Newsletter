const express = require("express");
const bodyParser = require("body-parser");
//const request = require("request");
const https = require("https");
const env = require("dovent").config();

const app = express();
const port = process.env.PORT;

var apiKey = process.env.API_KEY;

var id = process.env.API_ID;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended:true }));

//GET
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
})

//POST: Signup page
app.post("/", (req, res) => {

    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);

    const url = "https://us6.api.mailchimp.com/3.0/lists/" + id;

    const option = {
        method: "POST",
        auth: "asm:" + apiKey
    }

    const request = https.request(url, option, (response) => {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", (d) => {
            console.log(JSON.parse(d));
        })
    })

    request.write(jsonData);
    request.end();
})

//POST: Failure redirect
app.post("/failure", (req, res) => {
    res.redirect("/");
})

// SERVER LISTENER
app.listen(port || 3000, () => {
    console.log("Server is running on http://localhost:3000");
})