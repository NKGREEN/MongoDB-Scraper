$('#scrape').on('click', function () {

    $.get('/api/scrape', function (data) {
        if (data) {
            console.log(data)
            $('#number').text(data);
            $('#scraped-modal').modal('show');
        }

    })

})
$('#close').on('click', function () {
    $.get('/', function (data) {
        if (data) {
            location.reload();
            console.log(data)
        }
    })

})
$(".saved").on('click', function () {
    var id = $(this).data('id');
    var saved = $(this).data('saved');
    var state
    console.log(id)
    if (saved === false) {
        state = true;
    }
    else {
        state = false;
    }
    var newState = {
        saved: state
    }

    $.ajax('/articles/' + id, {
        type: "PUT",
        data: newState
    }).then(function (data) {
        if (data) {
            console.log(data)
        }
    })
})
$('.delete').on('click', function () {
    var id = $(this).data('id');
    $.ajax("/api/articles/" + id, {
        type: "POST"
    }).then(
        function (data) {
            if (data) {
                location.reload();
            }
        })
})
$('.note').on('click', function () {
    $('#unordered-list').empty()
    var title = $(this).data('title')
    var id = $(this).data('id');
    $.get('/note/' + id, function (data) {
        console.log(data.notes)
        if (data != 'none') {
            console.log(data.notes[0].body)
            for (var i = 0; i < data.notes.length; i++) {
                var divCard = $("<div>").addClass('card').attr('id', 'card')
                var divBody = $("<div>").addClass('card-body')
                var list = $("#unordered-list")
                var btn = $('<button>').addClass('float-right').attr('data-dismiss', 'modal').attr('id', 'note-delete').attr('type', 'button')
                    .attr('data-id', data.notes[i]._id).text('X');
                var listItem = $('<li>');
                var text = $("<p>").addClass('card-text').attr('id', 'card-text').text(data.notes[i].body);
                text.append(btn)
                divBody.append(text)
                divCard.append(divBody)
                listItem.append(divCard)
                list.append(listItem)
                console.log(list)
            }
            $('#article-title').text(title)
            $('#article-title').attr('data-id', id)
            $('#note-modal').modal('show')
        }
        else {

            $('#article-title').text(title)
            $('#article-title').attr('data-id', id)
            $('#note-modal').modal('show')
        }
    })

})
$('#add').on('click', function () {
    var id = $('#article-title').data('id')
    var note = $('#new-note').val().trim()
    if (note != "") {
        $.ajax({
            method: 'POST',
            url: '/articles/' + id,
            data: {
                body: note
            }
        }).then(function (data) {
            console.log(data)

        })
    }
    $('#new-note').val('');
})
$(document).on('click','#note-delete',  function () {
    var id = $(this).data('id')
    console.log(id)
    console.log('working')
    $.ajax({
        method: "DELETE",
        url: '/note/' + id
    })
        .then(function (data) {
            if (data) {
                console.log(data)
            }
        })
})
$('.home').on('click', function(){
    window.location = '/';
})
$('.saved-articles').on('click', function(){
    window.location = '/saved'
})
            
            $('#delete-articles').on('click', function(){
                $.ajax('/articles', {
                    type: 'delete'
                }).then(function (data){
                    if(data){
                        location.reload();
                    }
                })
            })
            
