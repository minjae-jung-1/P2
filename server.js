const express = require('express');
const app = express();
const TeemoJS = require('teemojs');
const axios = require("axios")
const bodyParser = require("body-parser");
const {parse, stringify} = require("flatted/cjs")

const connection = require("./config");

var riotApiKey = "RGAPI-607ba14a-6294-44cb-b9dd-228184b35d32";

var api = TeemoJS(riotApiKey);


app.use(bodyParser());

app.get("/api/user/:userName", async (req, res) => {
    
    let username = req.params.userName;
    let userId = "";

    userId = await api.get('na1', 'summoner.getBySummonerName', username).then(data => {
        return data.id;
    })

    // connection.query(`SELECT * FROM users WHERE lol_id = "BxrMtWDzNjDQjX86VCpkgv5RY27XnPOGROWv2nN13nVN685K"`, (err, data) => {
    //     console.log(data)
    // })

    let selectedUser = await connection.query(`SELECT * FROM users WHERE lol_id = "${userId}"`, (err, data) => {
        console.log(data, userId);
        return data;
    });

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

                connection.query(`INSERT INTO users VALUES (0, "${soloRank.summonerName}", "${ranked}", ${soloRank.wins}, ${soloRank.losses}, "${userId}")`, (data) => {
                    console.log(data);
                });

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
     let returnData = await connection.query(`SELECT * FROM users`)
    res.send(returnData);
})




app.listen(3000, ()=>{
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