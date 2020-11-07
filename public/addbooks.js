document.addEventListener('DOMContentLoaded', getBookData);
const book_table = document.getElementById("book_table")

function getBookData(){
    document.getElementById('search').addEventListener('click',(e)=>{
        var searchQuery = document.getElementById("booksearch").value
        var req = new XMLHttpRequest();
        req.open("GET", "https://www.googleapis.com/books/v1/volumes?q=" + searchQuery, false)
        req.send();
        data = JSON.parse(req.response)
        console.log(data.items[0])
        updateVals(data.items[0])
        e.preventDefault();
    })
}

function updateVals(data){
    //jquery all the stuff to add data.itesm[0].whatevea
    //$("#test")
    console.log(data.volumeInfo.title)
    $("#book_title").val(data.volumeInfo.title)
    $("#google_id").val(data.id)
    $("#ISBN").val(data.volumeInfo.industryIdentifiers[0].identifier)
    $("#publisher").val(data.volumeInfo.publisher)
    $("#published_date").val(data.volumeInfo.publishedDate)
    $("#description").val(data.volumeInfo.description)
    $("#page_count").val(data.volumeInfo.pageCount)
    $("#authors").val(data.volumeInfo.authors)
    console.log($("#authors").val().split(","))
}   

$('#database').on('click', (e)=>{
    e.preventDefault();
    var payload = { googleId: $("#google_id").val(),
                    title: $("#book_title").val(),
                    isbn: $("#ISBN").val(),
                    publisher: $("#publisher").val(),
                    publishedDate: $("#published_date").val(),
                    description: $("#description").val(),
                    pageCount: $("#page_count").val(),
                    rating: $("#rating").val(),
                    price : $("#price").val(),
                    quantityAvailable: $("#quantity").val(),
                    authors: ($("#authors").val().split(","))
                    }
    console.log(payload)
                    
    //ajax data to server
    $.post("/addbook", payload)
    .then(()=>{alert('Book Added')
                createbookTable()})
    .catch(()=>{alert("Book not added.")})

    
})

function createbookTable(){
    $('#book_table').empty()
    var headings = ["bookID","googleId","title","isbn","publisher","publishedDate",
                    "description","pageCount","rating","price","quantityAvailable","authors"];
    var thead = document.createElement('thead')
    book_table.appendChild(thead)
    var tr = document.createElement('tr');
    for (var i=0; i < headings.length; i++){
        var th = document.createElement('th')
        th.innerHTML = headings[i];
        tr.appendChild(th);
        thead.appendChild(tr)
    }
    var booksdata
    $.get("/getAllBooks",(bookdata)=>{
        
        maketable(bookdata)
        $(document).ready( function () {
            $('#book_table').DataTable();
        });
    })
    
}

function maketable(bookdata){
    tbody = document.createElement('tbody')
    book_table.appendChild(tbody)
    $.each(bookdata,(key,val)=>{
        var tr =document.createElement('tr')
        for(x in val){
            td = document.createElement('td')
            if(x == "description"){
                if(val[x] == ""){
                    td.innerHTML = "NULL"
                }else{
                
                td.innerHTML = "Description included."}
            } else{
                td.innerHTML=(val[x])}
            tr.appendChild(td)
            
        }
        tbody.appendChild(tr)
    })
}
createbookTable()

