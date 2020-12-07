
const order_table = document.getElementById('orders_table')
const details_table = document.getElementById('details_table')

function createOrderTable() {
    $('#orders_table').empty()
    var headings = ["orderId", "customerId", "customer", "orderDate"]
    var thead = document.createElement('thead')
    order_table.appendChild(thead)
    var tr = document.createElement('tr')
    for (var i = 0; i < headings.length; i++) {
        var th = document.createElement('th')
        th.innerHTML = headings[i]
        tr.appendChild(th)
        thead.appendChild(tr)
    }
    $.get('/getOrders', (orderData) => {
        order_table.appendChild(maketable(orderData))
        $(document).ready(function () {
            $('#orders_table').DataTable()
            order_tableditor()
            $('#orders_table').on('draw.dt', () => {
                order_tableditor()
            })
        })
    })
}

function createDetailsTable() {
    $('#details_table').empty()
    var headings = ["orderid", "bookid", "Book Title", "Quantity Sold"]
    var thead = document.createElement('thead')
    details_table.appendChild(thead)
    var tr = document.createElement('tr')
    for (var i = 0; i < headings.length; i++) {
        var th = document.createElement('th')
        th.innerHTML = headings[i]
        tr.appendChild(th)
        thead.appendChild(tr)
    }
    $.get('/getOrderDetails', (detailsData) => {
        details_table.appendChild(maketable(detailsData))
        $(document).ready(function () {
            $('#details_table').DataTable()
            details_tableditor()
            $('#details_table').on('draw.dt', () => {
                details_tableditor()
            })
        })
    })
}


function maketable(data) {
    tbody = document.createElement('tbody')
    $.each(data, (key, val) => {
        var tr = document.createElement('tr')
        for (x in val) {
            td = document.createElement('td')
            if (val[x] == '' || val[x] == null) {
                td.innerHTML = 'NULL'
            } else {
                td.innerHTML = (val[x])
            }
            tr.appendChild(td)
        }
        tbody.appendChild(tr)
    })
    return tbody
}

function order_tableditor() {
    $('#orders_table').Tabledit({
        url: '/editOrders',
        columns: {
            identifier: [0, 'orderId'],
            editable: [[3, 'orderDate']]
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
    onSuccess: function(data, textStatus, jqXHR) {
        $('#orders_table').DataTable().destroy()
        createOrderTable()
      },

    })

}

function details_tableditor() {
    $('#details_table').Tabledit({
        url: '/editDetails',
        columns: {
            identifier: [0, 'orderId'],
            editable: [[1, 'bookId']]
        },
        editButton: true,
        autoFocus: false,

    buttons: {
      edit: {
        class: 'btn btn-sm btn-danger',
        html: 'DELETE',
        action: 'remove'
      },
      
      save: {
        class: 'btn btn-sm btn-success',
        html: 'Are you sure?'
      },
      
    },
    inputClass:'readonly form-control-plaintext',
    onSuccess: function(data, textStatus, jqXHR) {
        $('#details_table').DataTable().destroy()
        createDetailsTable()
      }


            save: {
                class: 'btn btn-sm btn-success',
                html: 'Are you sure?'
            },

        },
        inputClass: 'readonly form-control-plaintext',
        onAjax: function (action, serialize) {
            $('#details_table').DataTable().destroy()
            createDetailsTable()
        }
    })
}

function selectbars() {
    $('#customer_select').empty()
    $('#book_select').empty()
    $('#order_select').empty()
    $.get('/getCustomers', customerdata => {
        $.each(customerdata, (key, val) => {
            $('#customer_select').append('<option value="' + val.customerId + '"> Id:' +
                val.customerId + " " + val.firstName + " " + val.lastName + '</option>')
        })
    })
    $.get('/OrderedBooks', bookdata => {
        $.each(bookdata, (key, val) => {
            $('#book_select').append('<option value="' + val.BookId + '">' + val.title + '</option>')
        })
    })
    $.get('/getOrders', orderdata => {
        $.each(orderdata, (key, val) => {
            $('#order_select').append('<option value="' + val.orderId + '">ID:' +
                val.orderId + " " + val.names + '</option>')
        })
    })
}

$('#addOrder').on('click', e => {
    e.preventDefault()
    var payload = {
        customerId: $('#customer_select').val(),
        orderDate: $('#order_date').val()
    }
    $.post('/addOrder', payload, function (data, status, xhr) {
        $('#orders_table').DataTable().destroy()
        createOrderTable()
        selectbars()
    })

})

$('#addDetails').on('click', e => {
    e.preventDefault()
    var payload = {
        orderId: $('#order_select').val(),
        bookId: $('#book_select').val(),
        quantitySold: $('#quantity_sold').val()
    }
    $.post('/addOrderDetails', payload, function (data, status, xhr) {
        $('#details_table').DataTable().destroy()
        createDetailsTable()

    })
})


$(document).ready(function () {
    $('a[href="' + this.location.pathname + '"]').parent().addClass('active');
    createOrderTable()
    createDetailsTable()
    selectbars()
});