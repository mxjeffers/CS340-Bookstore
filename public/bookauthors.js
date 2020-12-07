
const author_table = document.getElementById("author_table")

// This function creates the author table by getting data form the database
// and deleting and recreating the table.
function createAuthorTable() {
        $('#author_table').empty()
        var headings = ["bookId", "Title", "authorId", "author"]
        var thead =  document.createElement('thead')
        author_table.appendChild(thead)
        var tr = document.createElement('tr')
        for (var i = 0; i < headings.length; i++) {
            var th = document.createElement('th')
            th.innerHTML = headings[i]
            tr.appendChild(th)
            thead.appendChild(tr)
        }
        $.get('/BookAuthors/data', (authordata) => {
            maketable(authordata)
            $(document).ready(function() {
                $('#author_table').DataTable()
                tableeditor()
                $('#author_table').on('draw.dt', () =>{
                    tableeditor()
                })
            })
        })
    }

    // This function takes the data received from the database and
    // places it in the table body.
    function maketable(authordata) {
        tbody =  document.createElement('tbody')
        author_table.appendChild(tbody)
        $.each(authordata, (key, val) => {
            var tr = author_table.insertRow(-1)
            for (x in val) {
                td = document.createElement('td')
                td.innerHTML = (val[x])
                tr.appendChild(td)
            }
            tbody.appendChild(tr)
        })
    }

// This function adds the jquery-tabledit plugin to 
// the table.
function tableeditor(){
        $('#author_table').Tabledit({
            // Changed commands so edit button acts like delete button
            url: '/bookauthoredit',
            columns: {
                identifier: [0,'bookid'],
                editable:[
                    [1,'title'],
                [2,'authorid'],
                [3,'author']
            ]
            },
            buttons:{
                edit: {
                    class: 'btn btn-sm btn-danger',
                    html: 'Delete',
                    action: 'remove'
                }, save: {
                    class: 'btn btn-sm btn-success',
                    html: 'Are you sure?'
                  }, 
            },
            autoFocus: false,
            editButton: true,
            inputClass: 'readonly form-control-plaintext',
            onSuccess: function(data, textStatus, jqXHR) {
                $('#author_table').DataTable().destroy()
                createAuthorTable()
            }
        })
}


// This function fills the select lists with data.
function getselectlists(){
    // Fills in the options for authors and books in dropdown box
    $.get('/OrderedBooks', bookdata =>{
        $.each(bookdata,(key,val)=>{
            $('#book_select').append('<option value="'+val.BookId+'">'+val.title+'</option>')
        })
    })
    $.get('/Orderedauthors', (authordata) => {
        $.each(authordata,(key,val)=>{
            $('#author_select').append('<option value="'+val.authorId+'">'+val.authorName+'</option>')
        })
    })

}

createAuthorTable()

// Changes the navbar highlight to active
$(document).ready(function () {
    $('a[href="' + this.location.pathname + '"]').parent().addClass('active');
    getselectlists()
});


// This button adds a bookauthor combo to the database.
$('#addbookauth').on('click', e =>{
    e.preventDefault()
    var payload = {
        bookId: $('#book_select').val(),
        authorId :$('#author_select').val()
    }
    $.post('/addbookauth', payload,function(data,status,xhr){
        $('#author_table').DataTable().destroy()
        createAuthorTable()
    })  
});