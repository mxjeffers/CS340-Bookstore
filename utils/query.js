const mysql = require("./dbcon")

function blanktoNull(array){
    // This function takes blank values and sets them to undefined, so they are NULL in the database.
    for (i=0; i < array.length; i++)
    {if (array[i] == "" || array[i] == "NULL"){
        array[i] = undefined
    }}}

const orm = {
    selectAllBooks: function (cb) {
        bookandauthors = `SELECT Books.bookId, Books.googleId, Books.title, Books.isbn, Books.publisher, Books.publishedDate,
        Books.description, Books.pageCount, Books.rating, Books.price, Books.quantityAvailable,
        GROUP_CONCAT(Authors.authorName ORDER BY Authors.authorName SEPARATOR ', ') Authors
        FROM Books
            LEFT JOIN BookAuthors
                ON Books.bookId = BookAuthors.bookId
            LEFT JOIN Authors
                ON BookAuthors.authorId = Authors.authorId
        GROUP BY Books.bookId`

        mysql.pool.query(bookandauthors, (err, data) => {
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
        var values = [googleId, title, isbn, publisher, publishedDate, description, pageCount, rating, price, quantityAvailable]

        blanktoNull(values)
        //console.log(googleId)
        //console.log(publishedDate)
        // Add Book to database
        mysql.pool.query(newbook, values, (err, results) => {
            if (err) console.log(err)
            //console.log("BOOK")
        })
        // Add each author to database
        authors.forEach(curr_author => {
            mysql.pool.query(newauthor, [curr_author], (err, results) => {
                if (err) console.log(err)
                //console.log(results)
            })
            // Link book and authors
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
    },
    deletebook: function (data,cb){
        var DeleteBook = `DELETE FROM Books WHERE Books.bookId = (?)`
        mysql.pool.query(DeleteBook,data.bookid,(err,results)=>{
            if(err){cb(err,null)}
            cb(null,results)
        })
    },
    
    // Updatebook figure out cb functions
    updatebook: function (data,cb){
        var updatebook = `UPDATE Books SET googleId=?, title=?, isbn=?, publisher=?, publishedDate=?,
                            pageCount=?, rating=?, price=?, quantityAvailable=? Where bookId=?`
        var {bookid, googleId, title, isbn, publisher, publishedDate, description, pageCount, rating, price, quantityAvailable, authors} = data;
        values =[googleId,title,isbn,publisher,publishedDate,pageCount,rating,price,quantityAvailable,bookid]
        blanktoNull(values)
        mysql.pool.query(updatebook,values,(err,results)=>{
            if(err){console.log(err)}
        })
    },

    //add queries for customers, orders, addresses.
    //get all customers, orders, addresses
    getAllCustomers: function (cb) {
        mysql.pool.query('SELECT * FROM Customers ORDER BY customerId', (err, data) => {
            if (err) { cb(err, null) };
            cb(null, data)
        })
    },

    getAllOrders: function (cb) {
        mysql.pool.query('SELECT * FROM Orders ORDER BY orderId', (err, data) => {
            if (err) { cb(err, null) };
            cb(null, data)
        })
    },

    getAllAddresses: function (cb) {
        mysql.pool.query('SELECT * FROM Addresses ORDER BY addressId', (err, data) => {
            if (err) { cb(err, null) };
            cb(null, data)
        })
    },

    //add new customer

    //add new order

    //add new address

    //update current customer

    //update current order

    //update current address


    //delete current customer

    //delete current order

    //delete current address

}


module.exports = orm;