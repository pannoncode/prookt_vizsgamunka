const express = require('express');
const app = express();


const path = require('path');
const fs = require('fs');


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

//Adatok lekérése
app.get("/data", (req, res) => {

    fs.readFile("hairdressers.json", (err, fileContent) => {

        res.json(JSON.parse(fileContent));

    });
});

//Foglalás mentése
app.post("/sendappoint", (req, res) => {

    let appointDatas = req.body;
    appointDatas._id = parseInt(new Date().getTime() + 1);

    fs.readFile("hairdressers.json", (err, fileContent) => {

        let datas = JSON.parse(fileContent);
        let data = datas.find(id => id._id == appointDatas.id);
        data.reserv.push(appointDatas);

        fs.writeFile("hairdressers.json", JSON.stringify(datas), () => {

            res.json({ save: "OK" });

        });

    });

});

//Foglalás törlése
app.delete("/delete/:userid/:reservedid", (req, res) => {

    const userId = parseInt(req.params.userid);
    const reservedId = parseInt(req.params.reservedid);

    fs.readFile(path.join(__dirname, "hairdressers.json"), (err, fileContent) => {

        let datas = JSON.parse(fileContent);

        let userDeleteId = datas.find(p => p._id == userId);
        let reservedResult = userDeleteId.reserv;

        let reservDeleteId = reservedResult.findIndex(p => p._id == reservedId);

        if (reservDeleteId > -1) {
            reservedResult.splice(reservDeleteId, 1);

            fs.writeFile(path.join(__dirname, "hairdressers.json"), JSON.stringify(datas), function() {

                res.json(JSON.parse(fileContent));

            });
        }

    });
});

app.listen(3000);