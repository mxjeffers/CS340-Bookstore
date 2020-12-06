document.addEventListener('DOMContentLoaded', getBookData)
const book_table = document.getElementById('book_table')

function getBookData () {
  // Searches Google Books API for a book. Returns the results for the first book.
  // Chrome shows a degraded version of a get request. Should switch to Jquery get
  // when time is avaiable.
  document.getElementById('search').addEventListener('click', e => {
    var searchQuery = document.getElementById('booksearch').value
    var req = new XMLHttpRequest()
    req.open(
      'GET',
      'https://www.googleapis.com/books/v1/volumes?q=' + searchQuery,
      false
    )
    req.send()
    data = JSON.parse(req.response)

    updateVals(data.items[0])
    e.preventDefault()
  })
}

// Updates the values in the input fields with results from Google Books API
function updateVals (data) { 
  $('#book_title').val(data.volumeInfo.title)
  $('#google_id').val(data.id)
  $('#ISBN').val(data.volumeInfo.industryIdentifiers[0].identifier)
  $('#publisher').val(data.volumeInfo.publisher)
  $('#published_date').val(data.volumeInfo.publishedDate)
  $('#description').val(data.volumeInfo.description)
  $('#page_count').val(data.volumeInfo.pageCount)
  $('#authors').val(data.volumeInfo.authors)
}

// Send the data from the input fields to the database.
$('#database').on('click', e => {
  e.preventDefault()
  var payload = {
    googleId: $('#google_id').val(),
    title: $('#book_title').val(),
    isbn: $('#ISBN').val(),
    publisher: $('#publisher').val(),
    publishedDate: $('#published_date').val(),
    description: $('#description').val(),
    pageCount: $('#page_count').val(),
    rating: $('#rating').val(),
    price: $('#price').val(),
    quantityAvailable: $('#quantity').val(),
    authors: $('#authors')
      .val()
      .split(',')
  }
  //ajax data to server
  $.post('/addbook', payload,function(data,status,xhr){
  })
    .then(() => {
      alert('Book Added')
      //To correctly render table again, use datatable destroy then recreate
      $('#book_table')
        .DataTable()
        .destroy()
      createbookTable()
    })
    .catch(() => {
      alert('Book not added.')
    })
})

// Create the booktable 
function createbookTable () {
  $('#book_table').empty()
  var headings = [
    'bookID',
    'googleId',
    'title',
    'isbn',
    'publisher',
    'publishedDate',
    'description',
    'pageCount',
    'rating',
    'price',
    'qty',
    'authors',
     ]
  var thead = document.createElement('thead')
  book_table.appendChild(thead)
  var tr = document.createElement('tr')
  for (var i = 0; i < headings.length; i++) {
    var th = document.createElement('th')
    th.innerHTML = headings[i]
    tr.appendChild(th)
    thead.appendChild(tr)
  }
  //var booksdata
  $.get('/getAllBooks', bookdata => {
    maketable(bookdata)
    $(document).ready(function () {
      $('#book_table').DataTable({
        "scrollX": true
      })
      //jquery-tabledit adds delete and edit buttons to table.
      tableeditor()

      $('#book_table').on('draw.dt', () => {
        tableeditor()
      })
    })
  })
}


// Takes data received from the server and places it in the table.
function maketable (bookdata) {
  tbody = document.createElement('tbody')
  book_table.appendChild(tbody)
  $.each(bookdata, (key, val) => {
    var tr = document.createElement('tr')
    for (x in val) {
      td = document.createElement('td')
      if (x == 'description') {
        if (val[x] == '') {
          td.innerHTML = 'NULL'
        } else {
          td.innerHTML = 'Description included.'
        }
      } else {
        if (val[x] == '' || val[x] == null) {
          td.innerHTML = 'NULL'
        } else {
          td.innerHTML = val[x]
        }
      }
      tr.appendChild(td)
    }
    tbody.appendChild(tr)
  })
}
createbookTable()

// Creates a function to use the jquery-tabledit plugin
function tableeditor () {
  $('#book_table').Tabledit({
    url: '/bookedit',
    columns: {
      identifier: [0, 'bookid'],
      editable: [
        [1, 'googleId'],
        [2, 'title'],
        [3, 'isbn'],
        [4, 'publisher'],
        [5, 'publishedDate'],
        //[6, 'description'],
        [7, 'pageCount'],
        [8, 'rating'],
        [9, 'price'],
        [10, 'quantityAvailable'],
        [11, 'authors']
      ]
    },

    editButton: true,
    deleteButton: true,
    buttons: {
      edit: {
        class: 'btn btn-sm btn-primary',
        html: 'EDIT',
        action: 'edit'
      },
      delete: {
        class: 'btn btn-sm btn-danger',
        html: 'DELETE',
        action: 'delete'
      },
      save: {
        class: 'btn btn-sm btn-success',
        html: 'Save'
      },
      restore: {
        class: 'btn btn-sm btn-warning',
        html: 'Restore',
        action: 'restore'
      },
      confirm: {
        class: 'btn btn-sm btn-warning',
        html: 'Confirm'
      }
    },
    onAjax: function (action, serialize) {
      $('#book_table')
      .DataTable()
      .destroy()
      createbookTable()
    },
    onSuccess: function (data,textStatus, jqXHR) {      
    }
    
  })
}
