const mysql = require("./dbcon")

function blanktoNull(array) {
    // This function takes blank values and sets them to undefined, so they are NULL in the database.
    for (i = 0; i < array.length; i++) {
        if (array[i] == "" || array[i] == "NULL") {
            array[i] = undefined
        }
    }
}

function rating_verify(data){
    //This function verifies the rating number is between 1 and 5
    if (data == undefined){
        return
    } else if (data < 1){
        data = 1
    } else if (data >= 5){
        data = 5
    } else{
        data = Math.round(data)
    }
    return data

}
const orm = {
    //get and show all books
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
    //Add new Book to database
    addBook: function (data, cb) {
        // This function adds the book data and authors to a database. It ignores duplicates. A Book is a duplicate if it has 
        // the same googleID and price. Once the book is loaded. The authors are added one at a time. Then the BOOKAUTHORS
        // Table is added with the correct book that was just added.
        var newbook = 'INSERT IGNORE INTO Books (`googleID`, `title`, `isbn`, `publisher`, `publishedDate`, `description`, `pageCount`, `rating`, `price`, `quantityAvailable`) VALUES (?,?,?,?,?,?,?,?,?,?)'
        var { googleId, title, isbn, publisher, publishedDate, description, pageCount, rating, price, quantityAvailable, authors } = data;
        var newauthor = 'INSERT IGNORE INTO `Authors`(`authorName`) VALUES (?)'
        var bookAuthors = 'INSERT IGNORE INTO `BookAuthors`(`bookId`, `authorId`) VALUES ((SELECT bookID FROM Books WHERE googleID = ? and price = ?),(SELECT authorId FROM Authors WHERE authorName = ?));'
        rating = rating_verify(rating)
        var values = [googleId, title, isbn, publisher, publishedDate, description, pageCount, rating, price, quantityAvailable]
        
        // Set values to Null if they are blank
        blanktoNull(values)
        rating_verify(values[7])
        // Add Book to database
        mysql.pool.query(newbook, values, (err, results) => {
            if (err) console.log(err)
            
        })
        // Add each author to database
        authors.forEach(curr_author => {
            mysql.pool.query(newauthor, [curr_author], (err, results) => {
                if (err) console.log(err)
            })
            // Link book and authors
            mysql.pool.query(bookAuthors, [googleId, price, curr_author], (err, results) => {
                if (err) console.log(err)
            })
        });
    },

    //get all authors
    getAllAuthors: function (cb) {
        mysql.pool.query(`
            SELECT Authors.authorId, Authors.authorName,
            GROUP_CONCAT(Books.title ORDER BY Books.title SEPARATOR ', ')
            FROM Authors
            LEFT JOIN BookAuthors
                ON Authors.authorId = BookAuthors.authorId
            LEFT JOIN Books
                ON BookAuthors.bookId = Books.bookId
            GROUP BY Authors.authorId`,
            (err, data) => {
                if (err) { cb(err, null) };
                cb(null, data)
            })
    },

    //get join table
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

    //delete current book
    deletebook: function (data, cb) {
        var DeleteBook = `DELETE FROM Books WHERE Books.bookId = (?)`
        mysql.pool.query(DeleteBook, data.bookid, (err, results) => {
            if (err) { console.log(err) }

        })
    },

    // Updatebook figure out cb functions
    updatebook: function (data, cb) {
        var updatebook = `UPDATE Books SET googleId=?, title=?, isbn=?, publisher=?, publishedDate=?,
                            pageCount=?, rating=?, price=?, quantityAvailable=? Where bookId=?`
        var { bookid, googleId, title, isbn, publisher, publishedDate, description, pageCount, rating, price, quantityAvailable, authors } = data;
        // Verify rating is between 1 and 5 
        rating = rating_verify(rating)
        values = [googleId, title, isbn, publisher, publishedDate, pageCount, rating, price, quantityAvailable, bookid]
        blanktoNull(values)
        mysql.pool.query(updatebook, values, (err, results) => {
            if (err) { console.log(err) }
        })
    },
    //Insert an Author
    insertauthor: function (data, cb) {
        var newauthor = 'INSERT IGNORE INTO `Authors`(`authorName`) VALUES (?)'
        mysql.pool.query(newauthor, data.authorName, (err, results) => {
            if (err) { console.log(err) }
        })
    },
    //Delete an Author
    deleteauthor: function (data, cb) {
        var deleteauthor = `DELETE FROM Authors WHERE Authors.authorId = (?)`
        mysql.pool.query(deleteauthor, data.authorid, (err, results) => {
            if (err) { console.log(err) }
        })
    },

    //Update an Authors name
    updateauthor: function (data, cb) {
        //Since there is only one value check blank to Null with data directly
        blanktoNull(data.authorName)
        var updateauthor = `UPDATE Authors Set authorName=? Where authorId = ?`
        mysql.pool.query(updateauthor, [data.authorName, data.authorid], (err, results) => {
            if (err) { console.log(err) }
        })
    },
    deleteBookAuthor: function (data) {
        var delBkAuthor = `DELETE FROM BookAuthors Where bookid = ? and Authorid = ?`
        mysql.pool.query(delBkAuthor, [data.bookid, data.authorid], (err, results) => {
            if (err) { console.log(err) }
        })
    },

    addbookauth: function (data) {
        var addbookauth = 'INSERT IGNORE INTO `BookAuthors`(`bookId`, `authorId`) VALUES (?,?)'
        mysql.pool.query(addbookauth, [data.bookId, data.authorId], (err, results) => {
            if (err) { console.log(err) }
        })
    },

    // Selects books by rating
    bookbyrating: function(rating, cb){
        var rating_query = `SELECT * FROM Books WHERE rating = ?`
        mysql.pool.query(rating_query,rating,(err,results)=>{
            if (err){cb(err,null)
            } else {
                cb(null,results)
            }
        })
    },

    selectAuthor: function(authorid,cb){
        var sel_author_query = `SELECT Books.bookId, Books.googleId, Books.title, Books.isbn, Books.publisher, Books.publishedDate,
        Books.description, Books.pageCount, Books.rating, Books.price, Books.quantityAvailable, Authors.authorName
            FROM Authors
	        INNER JOIN BookAuthors
		    ON Authors.authorId = BookAuthors.authorId
	        INNER JOIN Books
		    ON BookAuthors.bookId = Books.bookId
            WHERE Authors.authorid = ?`
        mysql.pool.query(sel_author_query,authorid,(err,results)=>{
            if (err){cb(err,null)
            } else {
                cb(null,results)
            }
        })  
    },

    // Orders authors by name
    orderedauthors: function(cb){
        var orderauthor = `SELECT Authors.authorId, Authors.authorName
                            FROM Authors
                            Order BY Authors.authorName`
        mysql.pool.query(orderauthor,(err,results)=>{
            if (err){cb(err,null)
            } else {
                cb(null,results)
            }
        })
    },

    // Orders booktitles by title
    orderedbooktitles: function(cb){
        var ordertitles = `SELECT Books.BookId,  Books.title
                            FROM Books
                            ORDER BY Books.title`
        mysql.pool.query(ordertitles,(err,results)=>{
            if(err){cb(err,null)
            } else {
                cb(null,results)
            }
        })
    },

    //SQL queries for customers, orders, addresses.
    //READ all customers, orders, addresses

    getAllAddresses: function (cb) {

        mysql.pool.query('SELECT * FROM Addresses ORDER BY addressId', (err, data) => {
            if (err) { cb(err, null) }
            else {
            cb(null, data)}
        })
    },

    getAllCustomers: function (cb) {
        mysql.pool.query('SELECT * FROM Customers ORDER BY customerId', (err, data) => {
            if (err) { cb(err, null) }
            else {cb(null, data)}
        })
    },

    getAllOrders: function (cb) {
        mysql.pool.query('SELECT * FROM Orders ORDER BY orderId', (err, data) => {
            if (err) { cb(err, null) }
            else{
            cb(null, data)}
        })
    },

    // Adds a customer to the database
    addCustomer: function (data,cb){
        add_customer = `INSERT IGNORE INTO Customers (firstName, lastName, email, custAddressId)
        VALUES (?,?,?,?)`
        var {firstName, lastName, email, custAddressId} = data
        var values = [firstName,lastName,email,custAddressId]
        blanktoNull(values)
        mysql.pool.query(add_customer,values,(err,results)=>{
            if (err){cb(err,null)
            console.log(err)} else{
            cb(null,results)}
        })
    },

    deletecustomer: function(data){
        customerdelete = `DELETE FROM Customers WHERE customerID = ?`
        mysql.pool.query(customerdelete,data,(err,results)=>{
            if(err){console.log(err)}
        })
    },

    updatecustomer: function(data){
        customerupdate = `UPDATE Customers SET firstName=?, lastName=?, email=?, custaddressId=?
        WHERE customerId = ?`
        var {customerId, firstName, lastName, email, addressId} = data
        values = [firstName,lastName,email,addressId,customerId]
        blanktoNull(values)
        mysql.pool.query(customerupdate,values,(err,results)=>{
            if(err){console.log(err)}
        })
    },

    addAddress: function(data,cb){
        insertAddress = `INSERT IGNORE INTO Addresses (street, city, state, zipCode) VALUES (?,?,?,?)`
        var {street, city, state, zipCode} = data
        var values = [street,city,state,zipCode]
        blanktoNull(values)
        mysql.pool.query(insertAddress,values,(err,results)=>{
            if(err){cb(err,null)
            console.log(err)} else{
            cb(null,results)}
        })
    },

    deleteAddress : function(data){
        addressdelete = `DELETE FROM Addresses WHERE addressId = ?`
        mysql.pool.query(addressdelete,data.addressId,(err,results)=>{
            if(err){console.log(err)}
        })
    },

    updateAddress : function(data){
        addressupdate = `UPDATE Addresses SET street=?, city=?, state=?, zipCode=? WHERE addressId = ? `
        var {addressId, street, city, state, zipCode} = data
        var values = [street,city,state,zipCode,addressId]
        blanktoNull(values)
        mysql.pool.query(addressupdate,values,(err,results)=>{
            if(err){console.log(err)}
        })
    }

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