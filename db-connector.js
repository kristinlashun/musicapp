// Get an instance of mysql 
var mysql = require('mysql')

// Create a 'connection pool' using the provided credentials
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'classmysql.engr.oregonstate.edu',
    user            : 'cs361_townskr', // 
    password        : 'y5NFKAiYsWOz5NIol2', // 
    database        : 'cs361_townskr' 
})

// Export it for use 
module.exports.pool = pool;
