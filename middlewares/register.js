let connection = require('./db')
let moment = require('moment')

var bcrypt    = require('bcrypt');




class Message {

    constructor (row) {
        this.row = row
    }

    get content () {
        return this.row.username
    }


    
    get id () {
        return this.row.ID
    }


    get created_at () {
        return moment(this.row.created_at).fromNow()
    }

    
    static create (content, cb) {
        bcrypt.hash(content[1], 5, function( err, bcryptedPassword ) {
            connection.query('INSERT INTO account SET username = ?,password = ?, created_at = ?', [content[0] ,bcryptedPassword, new Date()], (err, result) => {
                if (err) throw err
                cb(result)
          });
    })
    }

    static delete (id) {
        connection.query('DELETE FROM account WHERE id = ?', [id], (err, result) => {
            if (err) throw err
    })
    }



static all (cb) {
    connection.query('SELECT * FROM account', (err,rows) => {
        if (err) throw err
            cb(rows.map((row) => new Message(row)))
    })
}
}

module.exports = Message