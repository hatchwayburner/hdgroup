// 'use strict';

const fs = require('fs');
const usersPath = './users.json';

//if file does not already exist...
if (!fs.existsSync(usersPath)) {
    fs.writeFileSync(usersPath, "{}");
}

module.exports.getUsers = function() {
    let rawdata = fs.readFileSync(usersPath);
    let users = JSON.parse(rawdata);
    return users;
}

module.exports.setUsers = function(users) {
    let rawdata = JSON.stringify(users);
    return fs.writeFileSync(usersPath, rawdata);
}
