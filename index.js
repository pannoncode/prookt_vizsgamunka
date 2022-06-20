const express = require('express');
const app = express();

const mongodb = require('mongodb');
const uri = "mongodb+srv://Drageron:<idekellbeírniajelszót>@cluster0.xzxsf.mongodb.net/?retryWrites=true&w=majority";
const MongoClient = mongodb.MongoClient;

const path = require('path');

let mongo = (uri, dbName, collectName, fn) => {
    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    client.connect(err => {
        const collection = client.db(dbName).collection(collectName);

        fn(client, collection);
    });
}


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

//Adatbázis lekérése
app.get("/data", (req, res) => {


    mongo(uri, "vizsgamunka", "fodraszszalon", (client, collection) => {

        collection.find().toArray((err, resp) => {

            if (err)
                console.log("Adat lekérési hiba");
            else {
                res.json(resp);
                client.close();
            }

        });
    });
});

//Foglalás mentése MongoDB-be => eredeti változat
app.post("/sendappoint", (req, res) => {

    let reservDatas = req.body;
    reservDatas._id = parseInt(new Date().getTime() + 1);

    mongo(uri, "vizsgamunka", "fodraszszalon", (client, collection) => {

        collection.findOneAndUpdate({ _id: reservDatas.id }, { $push: { reserv: reservDatas } }, (err, resp) => {
            if (err)
                console.log("Sikertelen mentés");
            else {
                res.json({ newreserv: "ok" });
                client.close();
            }

        });

    });

});


//Foglalások törlése MongoDB-ből
app.delete("/delete/:userid/:reservedid", (req, res) => {

    const userId = parseInt(req.params.userid);
    const reservedId = parseInt(req.params.reservedid);

    mongo(uri, "vizsgamunka", "fodraszszalon", (client, collection) => {

        collection.updateOne({
                _id: userId
            }, {
                $pull: {
                    reserv: { _id: reservedId }
                }
            },
            (err, resp) => {
                if (err) {
                    console.log("Nem találja az ID-t: " + reservedId + "Törlés sikertelen!");
                    console.log(resp);
                } else {
                    console.log(resp);
                    res.json({ delete: "ok" });
                    client.close();
                }

            });

    });

});

app.listen(3000);