const express = require('express');
const cors = require('cors');
const mysql = require('./utils/dbcon');
const query = require('./utils/query');
const path = require('path')
const app = express();
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const { error } = require('console');


let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}

app.set('port', port);
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static(__dirname + '/public'))


// Youtube video used to setup
// https://www.youtube.com/watch?v=eyKgivrIDpI&list=PLurIMwd6GdCi3ssXNAcjZ2l5mYaTfYPhf&index=14&ab_channel=EsterlingAccime
// https://www.youtube.com/watch?v=HPIjjFGYSJ4&ab_channel=TheodoreAnderson older
app.get('/', (req, res) => {
    query.selectAllBooks((error, data) => {
        if (error) {
            res.send(error)
        }else{
        res.render('index',{book_data:data,
                            title:"Bookstore"})}
    })
});

app.get('/Books',(req,res)=>{
    res.render('Books',{title:"Books"})
})

app.post('/addbook', (req, res) => {
    data = req.body
    query.addBook(data)
    res.send("Books added")
})

app.get('/getAllBooks', (req, res) => {
    query.selectAllBooks((error, data) => {
        if (error) {
            res.send(error)
        } else {
            res.send(data)
        }
    })
})

app.get('/authors',(req,res)=>{
    res.render('authors',{title:"Authors"})
})

app.get('/authordata', (req, res) => {
    query.getAllAuthors((err, data) => {
        if (err) {
            res.send(err)
        } else {
            res.send(data)
        }
    })
})
app.get('/BookAuthors',(req,res)=>{
    res.render('BookAuthors',{title:"BookAuthors"})
})

app.get('/BookAuthors/data', (req, res) => {
    query.getALLBookAuthors((err, data) => {
        if (err) {
            res.send(err)
        } else {
            res.send(data)
        }
    })
})

//Get Customers, Orders, Addresses pages
app.get('/Customers', (req, res) => {
    res.render('Customers',{title:"Manage Customers"})
})

app.get('/Orders', (req, res) => {
    res.render('Orders',{title:"Manage Orders"})
})

app.get('/Addresses', (req, res) => {
    res.render('Addresses',{title:"Manage Addresses"})
})
// This post handles the edit and delete button on the Books Page
app.post('/bookedit',(req,res)=>{
    //console.log(req.body)
    if (req.body.action =='delete'){
        query.deletebook(req.body)
        res.send("completed")
    } else if(req.body.action = 'edit'){
        query.updatebook(req.body)
        res.send('completed')
    }
})

app.post('/authoredit',(req,res)=>{
    //console.log(req.body)
    if (req.body.action == 'delete'){
        query.deleteauthor(req.body)
        res.send("completed")
    } else if(req.body.action == 'edit'){
        query.updateauthor(req.body)
        res.send('completed')
    } else if(req.body.action == 'insert'){
        query.insertauthor(req.body)
        res.send('completed')
    }
})

app.post('/bookauthoredit',(req,res)=>{
    console.log(req.body)
    if (req.body.action == 'remove'){
        query.deleteBookAuthor(req.body)
        res.send("completed")
    }
})

app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});