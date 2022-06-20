/*------------------------*\
  #BASIC FUNCTIONS
\*------------------------*/

//querySelector-hoz függvények
const $s = sel => document.querySelector(sel);
const $sAll = sel => document.querySelectorAll(sel);


//Napok a nyitvatartáshoz
const days = ["Vasárnap", "Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat"];


//effekt függvény 
let mouseOnLeave = (sel1, css, sel2) => {
    if ($s(sel1)) {
        $s(sel1).onmouseenter = () => $s(sel2 ? sel2 : sel1).classList.add(css);
        $s(sel1).onmouseleave = () => $s(sel2 ? sel2 : sel1).classList.remove(css);
    }
}

//single select függvény
let selected = (sel) => {
    $sAll(sel).forEach(data => {

        data.onclick = () => {
            let selected = $s(".times-bgc__reserved");
            data.classList.toggle("times-bgc__reserved");

            if (selected != null && data != selected) {
                selected.classList.remove("times-bgc__reserved");
            }

        };
    });
}

//Header az admin oldalhoz
const header = [{
        title: "Fodrász neve",
        key: "hdname"
    },
    {
        title: "Foglaló neve",
        key: "bookersName"
    },
    {
        title: "Időpont",
        key: "time"
    },
    {
        title: "Foglalás dátum",
        key: "date"
    },
    {
        title: "Foglalás törlése",
        key: "delete"
    }
];

/*------------------------*\
  #ROUTERS
\*------------------------*/

//Kezdő oldalhoz az adatok
Request.get("/data", res => {

    let hairDressData = JSON.parse(res);
    new Hairdresser(hairDressData).hairdresserTemp();

});

//Fodrász szalon menüre kattintás esetén az adatok lekérése
$s("#hairdresser").onclick = () => {

    Request.get("/data", res => {

        let hairDressData = JSON.parse(res);
        new Hairdresser(hairDressData).hairdresserTemp();

    });

};

//Admin menüre kattintás esetén az adatok lekérése
$s("#admin").onclick = () => {

    Request.get("/data", res => {

        let datas = JSON.parse(res);
        new Admin(datas, header);

    });
}



/*---------*\
  #EFFECTS
\*---------*/

//Menu items shadows
mouseOnLeave("#hairdresser", "text__shadows");
mouseOnLeave("#admin", "text__shadows");