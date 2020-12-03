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
app.use('/public', express.static(__dirname + '/public'));


// Youtube video used to setup
// https://www.youtube.com/watch?v=eyKgivrIDpI&list=PLurIMwd6GdCi3ssXNAcjZ2l5mYaTfYPhf&index=14&ab_channel=EsterlingAccime
// https://www.youtube.com/watch?v=HPIjjFGYSJ4&ab_channel=TheodoreAnderson older
app.get('/', (req, res) => {
    query.selectAllBooks((error, data) => {
        if (error) {
            res.send(error)
        } else {
            res.render('index', {
                book_data: data,
                title: "Bookstore"
            })
        }
    })
});

// Update index page with books by rating
app.get('/rating/:rating',(req,res)=>{
    query.bookbyrating(req.params.rating, (error,data) =>{
        if (error){ res.send(error)
        } else{
            res.render('index',{book_data:data,
                                title:"Bookstore",
                                sorted: req.params.rating})
        }
    })
})

app.get('/author/:authorId/Name/:authorName',(req,res)=>{
    query.selectAuthor(req.params.authorId, (error,data)=>{
        if (error){res.send(error)
        } else {
            if(data.length == 0){
                res.render('index',{title:"Bookstore",
                                    nobooks: "true"})
            } else{
            res.render('index',{book_data:data,
                                title:"Bookstore",
                            Author:req.params.authorName})}
        }
    })
})


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

app.get('/authors', (req, res) => {
    res.render('authors', { title: "Authors" })
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

app.get('/BookAuthors', (req, res) => {
    res.render('BookAuthors', { title: "BookAuthors" })
})

app.get('/OrderedAuthors',(req,res)=>{
    query.orderedauthors((err,data)=>{
        if(err){ res.send(err)
        } else {
            res.send(data)
        }
    })
})

app.get('/OrderedBooks',(req,res)=>{
    query.orderedbooktitles((err,data)=>{
        if(err){res.send(err)
        } else {
            res.send(data)
        }
    })
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

//Show Customers, Orders, Addresses pages
app.get('/Customers', (req, res) => {
    res.render('Customers', { title: "Manage Customers" })
})

app.get('/Orders', (req, res) => {
    res.render('Orders', { title: "Manage Orders" })
})

app.get('/Addresses', (req, res) => {
    res.render('Addresses', { title: "Manage Addresses" })
})

//Get data for Customers, Orders, Addresses
app.get('/getAllCustomers', (req, res) => {
    query.getAllCustomers((error, data) => {
        if (error) {
            res.send(error)
        } else {
            res.send(data)
        }
    })
})

app.get('/getAllAddresses', (req, res) => {
    query.getAllAddresses((error, data) => {
        if (error) {
            res.send(error)
        } else {
            res.send(data)
        }
    })
})

app.get('/getAllOrders', (req, res) => {
    query.getAllOrders((error, data) => {
        if (error) {
            res.send(error)
        } else {
            res.send(data)
        }
    })
})

//Create
app.post('/addCustomers', (req, res) => {
    res.render('Customers', { title: "Manage Customers" })
})

//Edit
app.post('/editCustomers', (req, res) => {
    res.render('Customers', { title: "Manage Customers" })
})

//delete
app.delete('/deleteCustomers', (req, res) => {
    res.render('Customers', { title: "Manage Customers" })
})


// This post handles the edit and delete button on the Books Page
app.post('/bookedit', (req, res) => {
    if (req.body.action == 'delete') {
        query.deletebook(req.body)
        res.send("completed")
    } else if (req.body.action = 'edit') {
        query.updatebook(req.body)
        res.send('completed')
    }
})

app.post('/authoredit',(req,res)=>{
    if (req.body.action == 'delete'){
        query.deleteauthor(req.body)
        res.send("completed")
    } else if (req.body.action == 'edit') {
        query.updateauthor(req.body)
        res.send('completed')
    } else if (req.body.action == 'insert') {
        query.insertauthor(req.body)
        res.send('completed')
    }
})

// Removes a book author link
app.post('/bookauthoredit',(req,res)=>{
    if (req.body.action == 'remove'){
        query.deleteBookAuthor(req.body)
        res.send("completed")
    }
})

// Customer edit
app.post('/customerdit',(req,res)=>{
    if (req.body.action == 'delete'){
        query.deletecustomer(req.body.customerId)
        res.send("completed")
    } else if(req.body.action == 'edit'){
        query.updatecustomer(req.body)
        res.send("completed")}
})
// adds bookauthor to BookAuthors table
app.post('/addbookauth',(req,res)=>{
    query.addbookauth(req.body)
    res.send('completed')
})

// Sends all customer data from database
app.get('/getCustomers',(req,res)=>{
    query.getAllCustomers((err,data)=>{
        if(err){res.send(err)
        } else{
            res.send(data)
        }
    })
})

// Route to add a customer to the database
app.post('/addCustomer',(req,res)=>{
    query.addCustomer(req.body, (err,data)=>{
        if(err){res.send(err)
            console.log(err)
        } else{
            res.send("Customer Added")
        }
    })
})

// Route to get addresses
app.get('/getAddresses', (req,res)=>{
    query.getAllAddresses((err,data)=>{
        if(err){res.send(err)
        } else {
            res.send(data)
        }
    })
})


app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});