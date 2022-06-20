/**
 * class Hairdresser.........létrehozza a fodrászok "káryáit"
 * 
 * 
 * 
 * hairdresserTemp().........Kigenerálja a "fodrászkártyák" HTML vázlatát
 * 
 * combineDatas()............Az időpontfoglaláshoz "begyűjti/egyesíti" az adatokat és "megosztja" az 
 * időpontfoglaló kártyákhoz
 * 
 * dateGenerateAndChange()...Beállítja a dátumot és figyeli a dátum változtatást. Szabályozza, hogy az
 * aktuális napnál régebbi dátumot ne lehessen beállítani
 * 
 * sendAppointDatas()........Begyűjti és minimálisan validálja a foglalási adatokat és POST-olja
 * 
 * datePicker()..............A dátum beállításához és a "foglaló kártyák" megjelenítéséhez szolgáltat adatokat
 * 
 */

class Hairdresser {

    constructor(obj) {
        this.obj = obj;
    }

    hairdresserTemp() {
        let out = "";
        for (const key of this.obj) {
            out += `
                <div class="cards flex flex-direction--column flex-position--center">
                  <div class="cards-header flex flex-direction--column">
                    <img src="${key.profilepic}" alt="profpic" class="profpic">
                    <h3 class="name margin-top">${key.name}</h3>
                    <span class="job margin-top">${key.job}</span>
                  </div>
                  <div class="cards-content margin-top">
                    <p class="content">${key.description}</p>
                  </div>
                  <div class="cards-footer margin-top">
                    <a href="#" id="${key._id}" class="appoint">Időpontfoglalás</a>
                  </div>
                </div>
              `
        }
        document.querySelector(".main-style").innerHTML = out;
        this.combineDatas();
    }

    combineDatas() {
        const contents = document.getElementsByClassName("appoint");
        for (let i = 0; i < contents.length; i++) {

            contents[i].addEventListener("click", event => {

                for (const key of this.obj) {

                    if (key._id == event.target.id) {

                        let id = key._id;
                        let profilepic = key.profilepic;
                        let hdname = key.name;

                        new Appointment(this.obj, profilepic, hdname).appointmentCardsTemp();

                        this.dateGenerateAndChange(id, hdname);

                    } 
                } 

            }); 

        } 
    }

    dateGenerateAndChange(id, hdname) {

        let datePicker = document.getElementById("datePicker");
        datePicker.valueAsDate = new Date();

        let actualDay = datePicker.valueAsDate.getDay();
        let day = days[datePicker.valueAsDate.getDay()];

        new Appointment(this.obj).opens(id, actualDay, day);
        selected(".times");

        datePicker.addEventListener("change", event => {

            let today = new Date();

            if (event.target.valueAsDate < today) {

                datePicker.valueAsDate = new Date();
                this.datePicker(event, id);

            } else {
                actualDay = datePicker.valueAsDate.getDay();
                date = datePicker.value;
                this.datePicker(event, id);
                this.sendAppointDatas(date, id, actualDay, hdname);
            }

        });

        let date = datePicker.value;
        this.sendAppointDatas(date, id, actualDay, hdname);
    }

    sendAppointDatas(date, id, actualDay, hdname, _id) {
        $s('.appoint').onclick = () => {

            let _id = "";
            let bookersName = $s('.inputName').value.trim();
            let timeReserved = $s('.times-bgc__reserved');

            if (bookersName == "" || !timeReserved) {

                $s('.inputName').style.color = "red";
                $s('.inputName').placeholder = "A név megadása kötelező";

                $s('.content').innerText = "Az időpont kiválasztása kötelező";
                $s('.content').style.color = "red";

            } else {
                let time;
                $sAll(".times").forEach(data => {

                    if (data == timeReserved) {

                        return time = data.innerText;
                    }
                });
                let bookerDatas = { _id, id, hdname, bookersName, time, date, actualDay };

                Request.post('/sendappoint/', bookerDatas, res => {
                    this.hairdresserTemp();
                })
            }

        };
    }

    datePicker(event, id) {
        let actualDay = event.target.valueAsDate.getDay();
        let day = days[event.target.valueAsDate.getDay()];
        new Appointment(this.obj).opens(id, actualDay, day);
        selected(".times");
    }

}