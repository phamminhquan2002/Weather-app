const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const https = require("https");
const { response } = require("express");

const port = 3000;

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/",(_,res)=>{
    res.sendFile(`${__dirname}/signup.html`);
    
})

app.post("/failure",(req,res)=>{
    res.redirect('/');
})


app.post("/",(req,res)=>{
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;


    const data = {
        members:[
            {
                email_address : email,
                status: "subscribed",
                merge_fields:{
                    FNAME: firstName,
                    LNAME: lastName,
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);
    
    const url = "https://us13.api.mailchimp.com/3.0/lists/4c7ca71d34";
    const options = {
        method: "POST",
        auth: "quanp:ab43d572bc4cb592c8c37d7305fecfbc-us13"
    }
    const request = https.request(url, options, response =>{
        if (response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        }
        else {
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data",data=>{
            console.log(JSON.parse(data));
        })
    })
    
    request.write(jsonData);
    request.end();

    console.log(firstName,lastName,email);
});

app.listen(process.env.PORT||port, ()=>{console.log("Listening on port 3000");})


//APIKEY: ab43d572bc4cb592c8c37d7305fecfbc-us13
//AUDIENCE ID: 4c7ca71d34