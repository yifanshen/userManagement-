'use strict;'
//Include crypto to generate the user id
var crypto = require('crypto');

module.exports = function () {
    return {
        userList: [
            {
                id: 'd6e439af0feb46852a56e045aeac7e945c77c512',
                username: 'Admin',
                password: 'Admin',
                email: 'admin@gmail.com',
                phone: '0000000000',
                role: 'admin',
                lastLogin: '03/05/2018',
                actions: ['adduser']
            },
            {
                id: '83ed7070317e2ddaf2f3dd35144a13fb9363023b',
                username: 'user1',
                password: 'user1',
                email: 'user1@gmail.com',
                phone: '1111111111',
                role: 'user',
                lastLogin: '03/01/2018',
                actions: ['logout','login']
            },
            {
                id: '51ff9c0f67cf4081a4c7a08c147a90f0c52f812c',
                username: 'user2',
                password: 'user2',
                email: 'user2@gmail.com',
                phone: '2222222222',
                role: 'user',
                lastLogin: '03/01/2018',
                actions: ['logout', 'login']
            }
        ],
        /*
         * Save the user inside the "db".
         */
        save(user) {
            var userInfo = new Object();
            userInfo.id = crypto.randomBytes(20).toString('hex');
            for(var key in user) userInfo[key] = user[key]
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth() + 1; //January is 0!
            var yyyy = today.getFullYear();
            today = mm + '/' + dd + '/' + yyyy;
            userInfo.lastLogin = today;
            userInfo.actions = [];
            this.userList.push(userInfo);
            return 1;
        },
        /*
         * Retrieve a user with a given id or return all the users if the id is undefined.
         */
        find(id) {
            if (id) {
                var founduser = this.userList.find(element => {
                    return element.id === id;
                });
                founduser.actions.push("search for a user");
                this.update(id,founduser);
                var returnValue = [];
                returnValue.push(founduser);
                return returnValue;
            } else {
                return this.userList;
            }
        },
        /*
         * Delete a user with the given id.
         */
        remove(id) {
            var found = 0;
            this.userList = this.userList.filter(element => {
                if (element.id === id) {
                    found = 1;
                } else {
                    return element.id !== id;
                }
            });
            return found;
        },
        /*
         * Update a user with the given id
         */
        update(id, user) {
            var userIndex = this.userList.findIndex(element => {
                return element.id === id;
            });
            if (userIndex !== -1) {
                this.userList[userIndex].username = user.username?user.username: this.userList[userIndex].username;
                this.userList[userIndex].password = user.password ? user.password : this.userList[userIndex].password;
                this.userList[userIndex].email = user.email ? user.email : this.userList[userIndex].email;
                this.userList[userIndex].phone = user.phone ? user.phone : this.userList[userIndex].phone;
                this.userList[userIndex].role = user.role ? user.role : this.userList[userIndex].role;
                this.userList[userIndex].actions = user.actions ? user.actions : this.userList[userIndex].actions;
                return 1;
            } else {
                return 0;
            }
        }
    }
};  