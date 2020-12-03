const customers_table = document.getElementById("customers_table")

function createCustomerTable(){
    $('#customers_table').empty()
    var headings = ["customerId", "First Name", "Last Name", "Email", "Address Id"]
    var thead = document.createElement('thead')
    customers_table.appendChild(thead)
    var tr = document.createElement('tr')
    for (var i = 0; i < headings.length; i++) {
        var th = document.createElement('th')
        th.innerHTML = headings[i]
        tr.appendChild(th)
        thead.appendChild(tr)
    }

    $.get('/getCustomers', (customerdata)=>{
        maketable(customerdata)
        $(document).ready(function(){
           $('#customers_table').DataTable()
            tableeditor()
            $('#customers_table').on('draw.dt', () =>{
                tableeditor()
            })
        })
    })
}

function maketable(data){
    console.log(data)
    tbody = document.createElement('tbody')
        customers_table.appendChild(tbody)
        $.each(data, (key, val) => {
            var tr = document.createElement('tr')
            for (x in val) {
                td = document.createElement('td')
                if(val[x] == '' || val[x] == null){
                    td.innerHTML = 'NULL'
                }else{
                    td.innerHTML = (val[x])}
                tr.appendChild(td)
            }
            tbody.appendChild(tr)
        })
    }

function tableeditor(){
    $('#customers_table').Tabledit({
        url: '/customerdit',
        columns : {
            identifier:[0,'customerId'],
            editable:[
                [1,'firstName'],
                [2,'lastName'],
                [3,'email'],
                [4,'addressId']
            ]},
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
        $('#customers_table').DataTable().destroy()
        createCustomerTable()
      },
        
    })
}

$('#addCustomer').on('click', e =>{
    e.preventDefault()
    var payload = {
        firstName : $('#addFirstName').val(),
        lastName : $('#addLastName').val(),
        email : $('#addEmail').val(),
        custAddressId : $('#address_select').val()
    }
    console.log(payload)
    $.post('/addCustomer', payload, function(data,status,xhr){
        $('#customers_table').DataTable().destroy()
        createCustomerTable()
    })
    
})

createCustomerTable()
$(document).ready(function () {
    getAddresslist()
});
$(document).ready(function () {
    $('a[href="' + this.location.pathname + '"]').parent().addClass('active');
});

function getAddresslist(){
    $.get('/getAddresses', data =>{
        console.log(data)
        $.each(data,(key,val)=>{
            $('#address_select').append('<option value="'+val.addressId+'">Id:'+
            val.addressId + '     '+val.street+  ' ' + val.city + ', '+ val.state +'    ' +
             val.zipCode +'</option>')
        })
    })
}