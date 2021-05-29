const bodyParser = require("body-parser");
const express = require("express");
const request = require("request");
const app = express();
const https = require("https");
const client = require("@mailchimp/mailchimp_marketing");
const { copyFileSync, read } = require("fs");
client.setConfig({apiKey: "37bb41f87da4f8bef6a55d440f659285",  server: "us1",});

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req, res){
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;
    const subscribingUser = {
        firstName: firstName,
        lastName: lastName,
        email: email
    }

    const run = async () => {
        const response = await client.lists.addListMember("176688afd3", {
          email_address: subscribingUser.email,
          status: "subscribed",
          merge_fields: {
              FNAME: subscribingUser.firstName,
              LNAME: subscribingUser.lastName
          }
        });

        if (res.statusCode === 200) {
           res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }
       }; 

    run();
})

app.post("/failure", function(req, res){
    res.redirect("/")
});

app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running on port 3000.");
}); 

// 37bb41f87da4f8bef6a55d440f659285-us1
// 176688afd3