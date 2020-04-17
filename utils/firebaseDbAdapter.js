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
                        let reading = doc.data();
                        reading.id = doc.id;
                        readings.push(reading);
                        console.log(reading);
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
                console.log("Sensor information saved");
            } catch (e) {
                console.log(e);
            }
        }
    },
    getLogs: function (callback) {
        let logsArr = [];
        try {
            this.db.collection("logs")
                .get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        let log = doc.data();
                        log.id = doc.id;
                        logsArr.push(log);
                    });
                    callback(logsArr);
                })
                .catch(err => {
                    if (err) {
                        console.log("Error getting documents", err);
                    }
                });
        } catch (e) {
            console.log(e);
        }
        return logsArr;
    },
    getNotifications: function (callback) {
        let notificationsArr = [];
        try {
            this.db.collection("notifications")
                .get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        let notification = doc.data();
                        notification.id = doc.id;
                        notificationsArr.push(notification);
                    });
                    callback(notificationsArr);
                })
                .catch(err => {
                    if (err) {
                        console.log("Error getting documents", err);
                    }
                });
        } catch (e) {
            console.log(e);
        }
        return notificationsArr;
    }
}