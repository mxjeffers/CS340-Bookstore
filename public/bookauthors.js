
const author_table = document.getElementById("author_table")


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
    })
})
}
function maketable(authordata) {
    tbody = document.createElement('tbody')
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

function tableeditor() {
    $('#author_table').Tabledit({
        // Changed commands so edit button acts like delete button
        url: '/bookauthoredit',
        columns: {
            identifier: [0, 'bookid'],
            editable: [
                [1, 'title'],
                [2, 'authorid'],
                [3, 'author']
            ]
        },
        buttons: {
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
        onAjax: function (action, serialize) {
            //After confirm button is hit this recreate table
            $('#author_table').DataTable().destroy()
            createAuthorTable()
        }
    })
}

function getselectlists() {
    // FIlls in the options for authors and books in dropdown box
    $.get('/OrderedBooks', bookdata => {
        $.each(bookdata, (key, val) => {
            $('#book_select').append('<option value="' + val.bookId + '">' + val.title + '</option>')
        })
    })
    $.get('/Orderedauthors', (authordata) => {
        $.each(authordata, (key, val) => {
            $('#author_select').append('<option value="' + val.authorId + '">' + val.authorName + '</option>')
        })
    })

}

createAuthorTable()
$(document).ready(function () {
    $('a[href="' + this.location.pathname + '"]').parent().addClass('active');
    getselectlists()
});

$('#addbookauth').on('click', e => {
    e.preventDefault()
    var payload = {
        bookId: $('#book_select').val(),
        authorId: $('#author_select').val()
    }
    $.post('/addbookauth', payload, function (data, status, xhr) {
        $('#author_table').DataTable().destroy()
        createAuthorTable()
    })
});