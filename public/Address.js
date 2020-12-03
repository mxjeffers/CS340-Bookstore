const addresses_table = document.getElementById("address_table")

function createAddressTable(){
    $('#address_table').empty()
    var headings = ['addressId', "street", "city","state", "zipCode"]
    var thead =  document.createElement('thead')
    addresses_table.appendChild(thead)
    var tr = document.createElement('tr')
    for (var i = 0; i < headings.length; i++) {
        var th = document.createElement('th')
        th.innerHTML = headings[i]
        tr.appendChild(th)
        thead.appendChild(tr)
}

$.get('/getAllAddresses', (addressdata)=>{
    maketable(addressdata)
    $(document).ready(function(){
        $('#address_table').DataTable()
        tableeditor()
        $('#address_table').on('draw.dt', () =>{
            tableeditor()
        })
    })
})
}

function maketable(data){
    tbody = document.createElement('tbody')
        addresses_table.appendChild(tbody)
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
    $('#address_table').Tabledit({
        url: '/addressedit',
        columns: {
            identifier : [0,'addressId'],
            editable :[
                [1,"street"],
                [2,"city"],
                [3,"state"],
                [4,"zipCode"]
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
        $('#address_table').DataTable().destroy()
        createAddressTable()
      }
    })
}

createAddressTable()

$('#addAddress').on('click', e =>{
    e.preventDefault()
    var payload = {
        street : $('#inputStreet').val(),
        city : $('#inputCity').val(),
        state : $('#inputState').val(),
        zipCode : $('#inputZip').val()
    }
    $.post('/addAddress', payload, function(data,status,xhr){
        $('address_table').DataTable().destroy()
        createAddressTable()
    })
})





$(document).ready(function () {
    $('a[href="' + this.location.pathname + '"]').parent().addClass('active');
})