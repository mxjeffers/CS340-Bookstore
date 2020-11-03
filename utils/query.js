const mysql = require("./dbcon")

const orm = {
    selectAllBooks: function (cb) {
        mysql.pool.query('SELECT * FROM Books', (err, data) => {
            if (err) { cb(err, null) };
            cb(null, data)
        })
    },

    addBook: function (data, cb) {
        // This function adds the book data and authors to a database. It ignores duplicates. A Book is a duplicate if it has 
        // the same googleID and price. Once the book is loaded. The authors are added one at a time. Then the BOOKAUTHORS
        // Table is added with the correct book that was just added.
        var newbook = 'INSERT IGNORE INTO Books (`googleID`, `title`, `isbn`, `publisher`, `publishedDate`, `description`, `pageCount`, `rating`, `price`, `quantityAvailable`) VALUES (?,?,?,?,?,?,?,?,?,?)'
        var { googleId, title, isbn, publisher, publishedDate, description, pageCount, rating, price, quantityAvailable, authors } = data;
        var newauthor = 'INSERT IGNORE INTO `Authors`(`authorName`) VALUES (?)'
        var bookAuthors = 'INSERT IGNORE INTO `BookAuthors`(`bookId`, `authorId`) VALUES ((SELECT bookID FROM Books WHERE googleID = ? and price = ?),(SELECT authorId FROM Authors WHERE authorName = ?));'

        mysql.pool.query(newbook, [googleId, title, isbn, publisher, publishedDate, description, pageCount, rating, price, quantityAvailable], (err, results) => {
            if (err) console.log(err)
            //console.log("BOOK")
        })
        authors.forEach(curr_author => {
            mysql.pool.query(newauthor, [curr_author], (err, results) => {
                if (err) console.log(err)
                //console.log(results)
            })
            mysql.pool.query(bookAuthors, [googleId, price, curr_author], (err, results) => {
                if (err) console.log(err)
                //console.log("BOOKAUTHOS")
                //console.log(results)
            })
        });
    },
    getAllAuthors: function (cb) {
        mysql.pool.query('SELECT * FROM Authors ORDER BY authorId', (err, data) => {
            if (err) { cb(err, null) };
            cb(null, data)
        })
    },

    getALLBookAuthors: function (cb) {
        var BookAuthor = `SELECT Books.bookId, Books.title, Authors.authorID, Authors.authorName
        FROM Books
        Join BookAuthors on Books.bookId = BookAuthors.bookId
        JOIN Authors ON BookAuthors.authorId = Authors.authorId`
        mysql.pool.query(BookAuthor, (err, data) => {
            if (err) { cb(err, null) }
            cb(null, data)
        })
    }

    //add queries for add customers, add orders, add addresses.

}


module.exports = orm;