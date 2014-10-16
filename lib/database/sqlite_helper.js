var sqlite3         = require('sqlite3').verbose();
var _               = require("underscore");
var config          = require("../../iot").config;
var DB              = require("./db_prototype");

function SQLiteHelper() {
    'use strict';
    return;
}

SQLiteHelper.prototype = new DB();

function generateDBKey(this_block) {
    'use strict';
    var str = "";
    _.each(this_block, function (key) {
        str += key + ",";
    });
    str = str.substring(0, str.length - 1);
    return str;
}

SQLiteHelper.init = function () {
    'use strict';
    var db = new sqlite3.Database(config.db_name);
    var create_table = 'create table if not exists ' + config.table_name + '(' + config.db_table + ');';

    db.serialize(function () {
        db.run(create_table);
        _.each(config.init_table, function (insert_data) {
            db.run(insert_data);
        });
    });
    db.close();
};

SQLiteHelper.postData = function (block, callback) {
    'use strict';
    var db = new sqlite3.Database(config.db_name);
    var str = generateDBKey(config.keys);
    var string = generateDBKey(block);

    var insert_db_string = "insert or replace into " + config.table_name + " (" + str + ") VALUES (" + string + ");";
    console.log(insert_db_string);
    db.all(insert_db_string, function (err) {
        if (err !== null) {
            console.log(err);
        }
        db.close();
        callback();
    });
};

SQLiteHelper.deleteData = function (url, callback) {
    'use strict';
    var db = new sqlite3.Database(config.db_name);
    console.log("DELETE FROM  " + config.table_name + "  where " + url.split('/')[1] + "=" + url.split('/')[2]);
    var insert_db_string = "DELETE FROM  " + config.table_name + "  where " + url.split('/')[1] + "=" + url.split('/')[2];
    console.log(insert_db_string);
    db.all(insert_db_string, function (err) {
        if (err !== null) {
            console.log(err);
        }
        db.close();
        callback();
    });
};

SQLiteHelper.getData = function (url, db_callback) {
    'use strict';
    var db = new sqlite3.Database(config.db_name);
    console.log("SELECT * FROM " + config.table_name + " where " + url.split('/')[1] + "=" + url.split('/')[2]);
    db.all("SELECT * FROM  " + config.table_name + "  where " + url.split('/')[1] + "=" + url.split('/')[2], function (err, rows) {
        if (err !== null) {
            console.log(err);
        }
        db.close();
        db_callback(JSON.stringify(rows));
    });
};

module.exports = SQLiteHelper;