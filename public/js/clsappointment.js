/**
 * class Appointment ........Létrehozza a fodrászok "foglaló kártyáját"
 * 
 * 
 * 
 * appointmentCardsTemp()....Kigenerálja a HTML vázlatot a megjelenítéshez
 * 
 * opens()...................A nyitvatartási adatokat gyűjti ki
 * 
 * renderOpens().............A nyitvatartási adatok alapján létrehozza a nyitvatartási időket és megjeleníti
 * 
 * reservedCheck()...........Megkeresi a lefoglalt időpontokat és azt nem jeleníti meg
 * 
 */

class Appointment {

    constructor(obj, profpic, hdname) {

        this.obj = obj;
        this.profpic = profpic;
        this.hdname = hdname;

    }

    appointmentCardsTemp() {
        let out = "";

        for (const key of this.obj) {
            out = `
            <div class="cards-appointment-wrapper flex flex-direction--column">
              <div class="datePick margin-top">
                <input type="date" name="date" id="datePicker">
              </div>
              <div class="cards-appointment flex flex-direction--column flex-position--center">
                <div class="cards-header flex flex-direction--column">
                  <img src="${this.profpic}" alt="profpic" class="profpic">
                  <h3 class="name margin-top">${this.hdname}</h3>
                  <div class="dates margin-top"></div>
                </div>
                <div class="cards-content margin-top">
                  <p class="content">Szabad időpontok:</p>
                  <div class="times-wrapper margin-top flex">
                  </div>
                </div>
                <div>
                  <input type="text" class="inputName margin-top" placeholder="Add meg a neved a foglaláshoz">
                </div>

                <div class="cards-footer margin-top">
                  <a href="#" id="${key._id}" class="appoint">Lefoglalom</a>
                </div>
              </div>
            </div>
            `;
        }
        document.querySelector(".main-style").innerHTML = out;

    }


    opens(id, actualDay, day) {
        for (const key of this.obj) {
            if (id == key._id) {
                for (const opens of key.open) {
                    if (opens.dayIndex == actualDay) {
                        this.renderOpens(opens.from, opens.to);
                        this.reservedCheck(id, actualDay);
                        break;
                    } else {
                        document.querySelector(".times-wrapper").innerHTML = `<h3>Sajnos a ${day}-i napon nem dolgozom!`;
                    }

                }
            }
        }
    }


    renderOpens(from, to) {
        let row = "";
        let out = "";

        for (let i = 0; i < from; i++) {

            row = "";

            for (let j = 0; from <= to; from++) {
                row += `<div class="times">${from}:00</div>`;
            }

            out += `<div class="flex flex--wrapper">${row}</div>`;
            break;

        }
        document.querySelector(".times-wrapper").innerHTML = out;

    }

    reservedCheck(id, actualDay) {
        Request.get('/data', res => {
            let data = JSON.parse(res);
            let datepicker = $s('#datePicker').value;

            for (const key of data) {
                for (const reserv of key.reserv) {
                    if (id == reserv.id) {

                        if (reserv.date == datepicker && actualDay == reserv.actualDay) {

                            $sAll('.times').forEach(data => {
                                if (data.innerHTML == reserv.time) {
                                    data.style.display = "none";
                                }
                            });
                        }
                    }
                }
            }
        });
    }
}