$(document).ready(() => {
    $('#form_poppup').hide();
    $('#tab_2').hide();
    $('#tab_3').hide();
    $('#update_form').hide();

    refreshData();
    $('#list_main').click((event) => {
        let list_item_id = $(event.target).parent();
        let list_item_desc = $(list_item_id).children('.item_desc');

        list_item_desc.slideToggle();
    })
    $('#list_submitted').click((event) => {
        let list_item_id = $(event.target).parent();
        let list_item_desc = $(list_item_id).children('.item_desc');

        list_item_desc.slideToggle();
    })
    let previousTab = 1;
    $('.btn').click((event) => {
        let currentTab = parseInt($(event.target).attr('id'));

        for (let i = 1; i <= 3; i++) {
            if (i === currentTab) { $('#tab_' + i).fadeIn(); }
            else { $('#tab_' + i).fadeOut(); }
        }
        previousTab = currentTab;
    });
    $('.temp_item').click(() => {
        $('#insert_form').show();
        $('#update_form').hide();
        $('#form_poppup').fadeToggle();
    });
    $('.n').click(() => {
        $('#form_poppup').fadeToggle();
    })

    let submit_context = '/submit';
    let updateID;
    $('#btn-submit').click(() => {
        let form_data_group = $('.form_input');
        let d = new Date(form_data_group[2]);
        let getYear = d.getFullYear().toString();

        $.post(submit_context, {
            poster_link: $(form_data_group[0]).val(),
            series_title: $(form_data_group[1]).val(),
            released_year: getYear,
            cert: $(form_data_group[3]).val(),
            runtime: $(form_data_group[4]).val(),
            genre: $(form_data_group[5]).val(),
            rating: $(form_data_group[6]).val(),
            overview: $(form_data_group[7]).val(),
            score: $(form_data_group[8]).val(),
            director: $(form_data_group[9]).val(),
            star1: $(form_data_group[10]).val(),
            star2: $(form_data_group[11]).val(),
            star3: $(form_data_group[12]).val(),
            star4: $(form_data_group[13]).val(),
            votes: $(form_data_group[14]).val(),
            gross: $(form_data_group[15]).val(),
            updateID: updateID || null
        }, (data, status) => {
            refreshData();
        });
        $('.temp_title').html("Add more items!");
        submit_context = '/submit';
    })

    let timeoutID = 0;
    let context_element;
    $('#list_submitted').on('mousedown', (event) => {
        context_element = event.target;
        timeoutID = setTimeout(() => {
            $('#insert_form').hide();
            $('#update_form').show();
            $('#form_poppup').fadeToggle();
        }, 1000);
    }).on('mouseup mouseleave', () => {
        clearTimeout(timeoutID);
    });
    $('#btn-update').click(() => {;
        $('#insert_form').fadeToggle('fast', () => {
            $('#update_form').fadeToggle();
        });
        
        updateID = $(context_element).children('.series_title').html();
        submit_context = '/update-input';
    })
    $('#btn-delete').click(() => {
        let deleteID = $(context_element).children('.series_title').html();
        $.post('/delete-input', {
            deleteID: deleteID
        });
        refreshData();
    });

    function refreshData() {
        $('#list_main').empty();
        $('#list_submitted').empty();
        $.get('/home', (data) => {
            let allData = JSON.parse(data);
            let itemID = 1;
            for(element of allData) {
                let list_element =
                `
                <div class="listItem item-1000" id="item_${itemID}">
                    <div class="item_main font-dark">
                        <div class="item_placing"><h1>#${itemID}</h1></div>
                        <h1 class="series_title">${element.Series_Title}</h1>
                        <div class="item_rating">
                            <h1>${element.IMDB_Rating}</h1>
                        </div>
                    </div>
                    <div class="item_desc desc-1000">
                        <div class="dis_row">
                            <img src="${element.Poster_Link}">
                            <div class="item_text">
                                <h3>${element.Overview}</h3>
                                <h3>Director: ${element.Director}</h3>
                                <h3>Actors:</h3>
                                <h3>- ${element.Star1}</h3>
                                <h3>- ${element.Star2}</h3>
                                <h3>- ${element.Star3}</h3>
                                <h3>- ${element.Star4}</h3>
                            </div>
                        </div>
                    </div>
                </div>
                `;
                $('#list_main').append(list_element);
                itemID++;
            }
        })
        $.get('/user-submit', (data) => {
            let submitData = JSON.parse(data);
            let itemID = 1;
            if (submitData.length === 0) {
                $('.temp_title').html("No entries as of yet, Add one now!");
            }
            else { 
                for(element of submitData) {
                    let list_element =
                    `
                    <div class="listItem item-user" id="item_${itemID}">
                        <div class="item_main font-dark">
                            <div class="item_placing"><h1>#${itemID}</h1></div>
                            <h1 class="series_title">${element.Series_Title}</h1>
                            <div class="item_rating">
                                <h1>${element.IMDB_Rating}</h1>
                            </div>
                        </div>
                        <div class="item_desc desc-user">
                            <div class="dis_row">
                                <img src="${element.Poster_Link}">
                                <div class="item_text">
                                    <h3>${element.Overview}</h3>
                                    <h3>Director: ${element.Director}</h3>
                                    <h3>Actors:</h3>
                                    <h3>- ${element.Star1}</h3>
                                    <h3>- ${element.Star2}</h3>
                                    <h3>- ${element.Star3}</h3>
                                    <h3>- ${element.Star4}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    `;
                    $('#list_submitted').append(list_element);
                    itemID++;
                }
            }
        });
    }
})