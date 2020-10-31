const express = require('express');
const cors = require('cors');
const mysql = require('./utils/dbcon');
const query = require('./utils/query');
const path = require('path')
const app = express();
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars')


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.set('port', port);
app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,'public')));
const getAllQuery ='SELECT * FROM Books';

// Youtube video used to setup
// https://www.youtube.com/watch?v=eyKgivrIDpI&list=PLurIMwd6GdCi3ssXNAcjZ2l5mYaTfYPhf&index=14&ab_channel=EsterlingAccime
// https://www.youtube.com/watch?v=HPIjjFGYSJ4&ab_channel=TheodoreAnderson older
app.get('/',(req,res)=>{
    query.selectAllBooks((error,data)=>{
        if (error){
            res.send(error)
        }else{
        res.render('index',{book_data:data})}
    })
} );


app.get('/addbooks',(req,res)=>{
    res.sendFile(__dirname + '/public/addbooks.html')
})

app.get('/books', (req,res)=>{
    mysql.pool.query(getAllQuery,(err,results)=>{
        if(err){
            return res.send(err)
        } else {
            return res.json({data:results})
        }
    })
});

app.post('/addbook',(req,res)=>{
    data =req.body
    query.addBook(data)
    res.send("Books added")
})

app.listen(app.get('port'), function(){
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
  });