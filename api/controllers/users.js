'use strict';
// Include our "db"
var db = require('../../config/db')();
// Exports all the functions to perform on the db
module.exports = {
    getAll,
    save,
    getOne,
    update,
    delUser
};

//GET /users operationId
function getAll(req, res, next) {
    res.json({users: db.find()});
}
//POST /users operationId
function save(req, res, next) {
    res.json({
        success: db.save(req.body),
        description: "user added to the list!"
    });
}
//GET /users/{id} operationId
function getOne(req, res, next) {
    var id = req.swagger.params.id.value; //req.swagger contains the path parameters
    var user = db.find(id);
    if (user) {
        res.json(user);
    } else {
        res.status(204).send();
    }
}
//PUT /users/{id} operationId
function update(req, res, next) {
    
    var id = req.swagger.params.id.value; //req.swagger contains the path parameters
    var user = req.body;
    if (db.update(id,user)) {
        res.json({
            success: 1,
            description: "User updated!"
        });
    } else {
        res.status(204).send();
    }

}
//DELETE /users/{id} operationId
function delUser(req, res, next) {
    var id = req.swagger.params.id.value; //req.swagger contains the path parameters
    if (db.remove(id)) {
        res.json({
            success: 1,
            description: "User deleted!"
        });
    } else {
        res.status(204).send();
    }

}