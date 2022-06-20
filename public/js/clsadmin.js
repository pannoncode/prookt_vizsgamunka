/**
 *class Admin...............Az admin oldal megjelenítését generálja ki
 *
 *
 * 
 * appointmentCardsTemp()...Kigenerálja az Admin oldal HTML vázlatát
 * 
 * createHeader()...........Megcsinálja a fejlécet a foglalási adatok megjelenítéséhez
 * 
 * getReservedDatas().......Összegyűjti a foglalási adatokat, ellenőrzi, hogy adott napon léteznek
 * e foglalási adatok, és kigenerálja a megjelenítéséhez
 * 
 * generateChange().........A dátum változtatásához gyűjti az adatokat
 * 
 * delete().................A foglalások törlését kezeli
 * 
 */

class Admin {
    constructor(obj, header) {
        this.obj = obj;
        this.header = header;;
        this.appointmentCardsTemp()
    }

    appointmentCardsTemp() {
        let out = '';
        for (const key of this.obj) {
            out = `
            <div class="adminCards-appointment-wrapper flex flex-direction--column margin-left">
              <div class="datePick margin-top">
                <input type="date" name="date" id="datePicker">
                <p class="content margin-top">Foglalások:</p>
              </div>
              <div class="cards-appointment flex flex-direction--column flex-position--center">
                <div class="reserved-content margin-top">
                  <div class="noreserv"></div>
                  <div class="header"></div>
                  <div class="reserved"></div>
                </div>
              </div>
            </div>
            `
        }

        document.querySelector('.main-style').innerHTML = out;
        this.generateChange();
    }

    createHeader() {
        let headers = '';
        let headersOut = '';

        for (const h of this.header) {
            headers += `<div class="cell header--cell margin-top" style="width:100%">${h.title}</div>`;
        }
        headersOut += `<div class="row header--row" style="width:100%">${headers}</div>`;

        $s('.header').innerHTML = headersOut;
    }

    getReservedDatas(date) {
        let row = '';
        let contentOut = '';
        let reservDatas = [];

        for (const objelem of this.obj) {
            for (const reservedDatas of objelem.reserv) {
                if (objelem._id == reservedDatas.id && date == reservedDatas.date) {
                    reservDatas.push(reservedDatas);
                }
            }
        }

        if (reservDatas.length > 0) {
            for (const items of reservDatas) {
                row = '';
                for (const key in items) {
                    if (key != 'id' && key != '_id') {
                        row += `<div class="cell admin--cell" style="width:100%">${key != 'actualDay'
                            ? items[key]
                            : `<div class="cell delete" style="width:100%"><span class="del" data-user="${items.id}" data-id="${items._id}">X</span></div>`
                            }</div>`;
                    }
                }
                contentOut += `<div class="row admin--row" style="width:100%" ">${row}</div>`;
            }

            $s('.reserved').innerHTML = contentOut;
        }else {
            reservDatas = [];
            $s('.reserved').innerHTML = `<p class="margin-top" style="color:red">Ezen a napon nincsenek foglalások</p>`
        }

    }

    generateChange() {
        $sAll('#datePicker').forEach(element => {
            let date = element;
            date.valueAsDate = new Date();

            this.createHeader();
            this.getReservedDatas(date.value);
            this.delete();

            date.addEventListener('change', event => {
                let date = event.target.value;

                this.createHeader();

                this.getReservedDatas(date);

                this.delete();
            });
        })
    }

    delete() {
        $sAll('.del').forEach(element => {
            let userId = element.dataset.user;
            let reservedId = element.dataset.id;
            element.onclick = () => {
                let conf = confirm('Biztos törölni szeretnéd?');
                if (conf) {
                    Request.delete(`/delete/${userId}/${reservedId}`, res => {
                        Request.get('/data', res => {
                            let datas = JSON.parse(res);
                            new Admin(datas, header);
                        });
                    });
                }
            };
        });
    }
}