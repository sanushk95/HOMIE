var fs = require('fs');
var admin = require("firebase-admin");

module.exports = {
    readEncodedModuleFile: function (path) {
        try {
            var filename = require.resolve(path);
            //fs.readFile(filename, 'utf8', callback);
            //var buffer = new Buffer(contents);
            //content = buffer.toString('base64');
            //Buffer.alloc(number) 
            var contentEncrypted = fs.readFileSync(filename, 'utf8');
            var buffer = Buffer.from(contentEncrypted, 'base64');
            contentDecrypted = buffer.toString();
            console.log(contentDecrypted);
            return contentDecrypted;
        } catch (e) {
            callback(e);
            console.log(e);
        }
    },
    getServiceAccount: function () {
        var fileContent = this.readEncodedModuleFile("./firebase-key-encrypted");
        var obj = JSON.parse(fileContent);
        var serviceAccount = Object.assign(obj, admin.ServiceAccount);
        return serviceAccount;
    }
}