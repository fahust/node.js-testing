let connection = require('./db')
let moment = require('moment')





class Message {

    constructor (row) {
        this.row = row
    }

    get content () {
        return this.row.content
    }


    
    get id () {
        return this.row.ID
    }


    get created_at () {
        return moment(this.row.created_at).fromNow()
    }

    
    static create (content, cb) {
        connection.query('INSERT INTO messages SET content = ?, created_at = ?', [content, new Date()], (err, result) => {
            if (err) throw err
            cb(result)
    })
    }

    static delete (id) {
        connection.query('DELETE FROM messages WHERE id = ?', [id], (err, result) => {
            if (err) throw err
    })
    }



static all (cb) {
    connection.query('SELECT * FROM messages', (err,rows) => {
        if (err) throw err
            cb(rows.map((row) => new Message(row)))
    })
}
}

module.exports = Message