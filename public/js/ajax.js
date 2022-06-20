//Az órán vett anyag teljes felhasználása
const Request = {

    http: function(success) {
        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function() {

            if (this.readyState == 4 && this.status == 200)
                success(this.responseText);

        }

        return xhttp;
    },

    get: function(url, success) {
        var xhttp = Request.http(success);

        xhttp.open("GET", url);
        xhttp.send();

    },

    post: function(url, params, success) {
        var xhttp = Request.http(success);

        xhttp.open("POST", url);
        xhttp.setRequestHeader("Content-type", "application/json")
        xhttp.send(JSON.stringify(params || {}));

    },

    delete: function(url, success) {

        var xhttp = Request.http(success);

        xhttp.open("DELETE", url);
        xhttp.send();
    }

};