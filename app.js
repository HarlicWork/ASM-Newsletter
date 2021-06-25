const express = require("express");
const bodyParser = require("body-parser");
//const request = require("request");
const https = require("https");

const app = express();
const port = process.env.PORT;

var apiKey = "6dcc1b3504a71f8cc1d0c0094053b8ff-us6";
var id = "796d6cd9c6";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended:true }));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
})

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

app.post("/failure", (req, res) => {
    res.redirect("/");
})

app.listen(port || 3000, () => {
    console.log("Server is running on http://localhost:3000");
})