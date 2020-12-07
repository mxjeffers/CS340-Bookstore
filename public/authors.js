const author_table = document.getElementById("author_table")
    function createAuthorTable() {
        $('#author_table').empty()
        var headings = ["AuthorId", "Author","Books"]
        var thead = document.createElement('thead')
        author_table.appendChild(thead)
        var tr = document.createElement('tr')
        for (var i = 0; i < headings.length; i++) {
            var th = document.createElement('th')
            th.innerHTML = headings[i]
            tr.appendChild(th)
            thead.appendChild(tr)
        }
        $.get('/authordata', (authordata) => {
            maketable(authordata)
            $(document).ready(function () {
                $('#author_table').DataTable();
            tableeditor()
            $('#author_table').on('draw.dt',()=>{
                tableeditor()
            })
            
        })
    })}

    function maketable(authordata) {
        tbody = document.createElement('tbody')
        author_table.appendChild(tbody)
        $.each(authordata, (key, val) => {
            var tr = document.createElement('tr')
            for (x in val) {
                td = document.createElement('td')
                if(val[x] == ''){
                    td.innerHTML = 'NULL'
                }else{
                    td.innerHTML = (val[x])}
                tr.appendChild(td)
            }
        tbody.appendChild(tr)
        })
    }

createAuthorTable()

function tableeditor() {
    $('#author_table').Tabledit({
        url: '/authoredit',
        columns:{
            identifier:[0,'authorid'],
            editable:[[1,'authorName']]
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
    onSuccess: function (action, serialize) {
      $('#author_table')
        .DataTable()
        .destroy()
      createAuthorTable()
    },
    
    })
}

    $('#database').on('click', e =>{
        e.preventDefault()
        var payload = {
            action : "insert",
            authorName : $("#addauthor").val()
        }
        $.post('/authoredit',payload,(data,status,xhr)=>{
            $("#author_table").DataTable().destroy()
            createAuthorTable()
        })
        
    })

    $(document).ready(function () {
        $('a[href="' + this.location.pathname + '"]').parent().addClass('active');
    });