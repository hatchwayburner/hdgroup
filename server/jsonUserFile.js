/*
The challenge did not include a database
so I opted for a simple JSON object to model
the stored data. A mongo API will present
the structure in JSON so this felt appropriate.
*/

const fs = require('fs');
const usersPath = './users.json';

//if file does not already exist...
function initUsersFile() {
    if (!fs.existsSync(usersPath)) {
        fs.writeFileSync(usersPath, "{}");
    }
}

module.exports.getUsers = function() {
    initUsersFile();
    let rawdata = fs.readFileSync(usersPath);
    let users = JSON.parse(rawdata);
    return users;
}

module.exports.setUsers = function(users) {
    initUsersFile();
    let rawdata = JSON.stringify(users);
    return fs.writeFileSync(usersPath, rawdata);
}
