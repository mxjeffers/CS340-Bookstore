const customers_table = document.getElementById("customers_table")

// Creates the customer table
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

// Takes data from the database and places it int he table
function maketable(data){
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

//  function for jquery-tabledit plugin  
function tableeditor(){
    $('#customers_table').Tabledit({
        url: '/customeredit',
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
    onSuccess: function(data, textStatus, jqXHR) {
        $('#customers_table').DataTable().destroy()
        createCustomerTable()
      },
        
    })
}

// This button adds the custome to the database
$('#addCustomer').on('click', e =>{
    e.preventDefault()
    var payload = {
        firstName : $('#addFirstName').val(),
        lastName : $('#addLastName').val(),
        email : $('#addEmail').val(),
        custAddressId : $('#address_select').val()
    }
    
    $.post('/addCustomer', payload, function(data,status,xhr){
        $('#customers_table').DataTable().destroy()
        createCustomerTable()
    })
    
})


createCustomerTable()


$(document).ready(function () {
    getAddresslist()
    $('a[href="' + this.location.pathname + '"]').parent().addClass('active');
});

// Places data in the address select section
function getAddresslist(){
    $.get('/getAddresses', data =>{
        $.each(data,(key,val)=>{
            $('#address_select').append('<option value="'+val.addressId+'">Id:'+
            val.addressId + '     '+val.street+  ' ' + val.city + ', '+ val.state +'    ' +
             val.zipCode +'</option>')
        })
    })
}