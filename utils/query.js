const mysql = require("./dbcon")

const orm ={
    selectAllBooks: function(cb){
        mysql.pool.query('SELECT * FROM Books', (err,data)=>{
            if(err) {cb(err,null)};
            cb(null,data)
        })
    },
    
    addBook: function(data, cb){
        var newbook ='INSERT INTO Books (`googleID`, `title`, `isbn`, `publisher`, `publishedDate`, `description`, `pageCount`, `rating`, `price`, `quantityAvailable`) VALUES (?,?,?,?,?,?,?,?,?,?)'
        var {googleId,title,isbn,publisher,publishedDate,description,pageCount,rating,price,quantityAvailable,authors} = data;
        
        console.log(googleId)
        mysql.pool.query(newbook,[googleId,title,isbn,publisher,publishedDate,description,pageCount,rating,price,quantityAvailable],(err,results)=>{
            if (err) console.log(err)
            console.log(results)
        })
        //authors.foreach do insert query
        // do bookAuthors query within foreach
        

    }
}


module.exports = orm;