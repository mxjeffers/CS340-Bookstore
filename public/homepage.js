// Rating Select Change

function getauthorlist(){
    $.get('/Orderedauthors',(authordata)=>{
        $.each(authordata,(key,val)=>{
            $('#authordrop').append('<a class="dropdown-item" href="/author/'
            + val.authorId + '/Name/'+val.authorName+'">'
            +val.authorName +'</a>')
        })
    })
}

$(document).ready(function(){
    getauthorlist()
})