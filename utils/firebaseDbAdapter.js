module.exports = {
    db: null,
    writeEnable: true,
    setDb(db) {
        this.db = db;
    },
    enableWrites: function () {
        this.writeEnable = true;
    },
    disableWrites: function () {
        this.writeEnable = false;
    },
    read: function (sensor) {
        let readings = [];
        try {
            this.db.collection("readings")
                .get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        let reaading = doc.data();
                        reaading.id = doc.id;
                        readings.push(reaading);
                        console.log(reaading);
                    });
                })
                .catch(err => {
                    if (err) {
                        console.log("Error getting documents", err);
                    }
                });
        } catch (e) {
            console.log(e);
        }
        return readings;
    },
    write: function (sensor, value) {
        if (this.writeEnable) {
            console.log(value);
            try {
                let time = new Date().toISOString();
                this.db.collection("readings").add({
                    sensor: sensor,
                    value: value,
                    date: time
                }).catch(err => {
                    if (err) {
                        console.log("Error writing document", err);
                    }
                });
            } catch (e) {
                console.log(e);
            }
        }
    }
}