const express = require('express');
const app = express();
const TeemoJS = require('teemojs');
const axios = require("axios")
const bodyParser = require("body-parser");
const mongoose = require("mongoose")
const User = require('./models/user')
const cors = require("cors");
let PORT = process.env.PORT || 3000
var riotApiKey = "RGAPI-607ba14a-6294-44cb-b9dd-228184b35d32";

var api = TeemoJS(riotApiKey);

var url = "mongodb://localhost:27017/league"
console.log(process.env.MONGODB_URI)
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser:true, useUnifiedTopology: true, useFindAndModify: false});

app.use(bodyParser());
app.use(cors({
    "origin": ["http://localhost:5500"],
    "credentials": true,
    "methods": ["GET", "POST", "PUT", "OPTIONS"]
}))

app.use(express.static("public"));

app.get("/api/user/:userName", async (req, res) => {
    
    let username = req.params.userName;
    let userId = "";

    userId = await api.get('na1', 'summoner.getBySummonerName', username).then(data => {
        return data.id;
    })

    // connection.query(`SELECT * FROM users WHERE lol_id = "BxrMtWDzNjDQjX86VCpkgv5RY27XnPOGROWv2nN13nVN685K"`, (err, data) => {
    //     console.log(data)
    // })

    let selectedUser = await (await User.findOne({'lol_id':userId}))
    if (selectedUser)
        console.log("TRUEEEE");

    if (userId && !selectedUser) {
        let rank = await axios.get(`https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/${userId}?api_key=RGAPI-607ba14a-6294-44cb-b9dd-228184b35d32`)
          .then(res => {
              console.log(res.data);
            let soloRank = res.data.find(queueObj => queueObj.queueType === "RANKED_SOLO_5x5");
            if (soloRank){
                console.log("HERE: ", soloRank)
                let ranked = `${soloRank.tier} ${mapTier(soloRank.rank)}`;

                let user = new User({
                    username: soloRank.summonerName,
                    ranked: ranked,
                    wins: soloRank.wins,
                    losses: soloRank.losses,
                    lol_id: userId
                })
                user.save();

                // connection.query(`INSERT INTO users VALUES (0, "${soloRank.summonerName}", "${ranked}", ${soloRank.wins}, ${soloRank.losses}, "${userId}")`, (data) => {
                //     console.log(data);
                // });

            } else {
                return "";
            }
        });
        res.send({rank, username});    
    } else {
        res.status(403).send("USER ALREADY EXISTS");
    }
})

app.get("/api/users", async (req, res) => {
    let result = await User.find()
    console.log(result);
    res.send(result)
})




app.listen(PORT, ()=>{
    console.log("server running")
})


function mapTier(num) {
    switch(num) {
        case "I":
            return "1";
        case "II":
            return "2";
        case "III":
            return "3";
        case "IV":
            return "4";
        default:
           return "4";
    }
}