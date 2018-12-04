/* -------------------------------------------------------------------------------------------------- */
/*                                                                                                    */
/*                                        BACKGROUND IMAGES                                           */
/*                                                                                                    */
/* -------------------------------------------------------------------------------------------------- */

/* ---------------------------------------------------------------- */
/* Mandeep's changes                                                */
/* ---------------------------------------------------------------- */

// Background image array
let bgImageArray = [
    "https://image.tmdb.org/t/p/original/gLhYg9NIvIPKVRTtvzCWnp1qJWG.jpg",
    "https://image.tmdb.org/t/p/original/wdj8FK2bCA7iNtZRSzJHrltAwnr.jpg",
    "https://image.tmdb.org/t/p/original/pb60xSzUnS9D5iDvrV8N6QOG3ZR.jpg",
    "https://image.tmdb.org/t/p/original/pAWOZHOM86jLN1TlzQZ1NMGjdqK.jpg",
    "https://image.tmdb.org/t/p/original/aJ7RVMe6eE7gnTVjWqRUiw9wD9D.jpg",
    "https://image.tmdb.org/t/p/original/ozFatXRKefWqyZQJfiBenTizuqr.jpg"
];

//default location

let longitude = 47.7059591;
let latitude = -122.2106905;

let geolocation = "47.7059591,-122.2106905";

// Starts the array index at 0
let bgIndex = 0;

// When false, background zooms in, when true, background zooms out
let flip1 = false;
let flip2 = true;
let flip3 = false;


/* Mandeep Function */
getLocation = function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        console.log("Geolocation not supported by this browser.");
    }
};

showPosition = function (position) {
    // console.log("Latitude: " + position.coords.latitude +
    //     " Longitude: " + position.coords.longitude);
    longitude = position.coords.longitude;
    latitude = position.coords.latitude;
    geolocation = position.coords.latitude + "," + position.coords.longitude;
    //console.log(geolocation);

};


NowPlaying = function () {

    //Clear other Cards/About/NowPlaying divs
    $(".now-playing-container").css("display", "flex");
    $(".container-fluid").css("display", "none");
    $(".playing-near-me").css("display", "none");
    renderFooter();

    // movieInput passed as a param to search movie titles
    let queryURL = "https://api.themoviedb.org/3/movie/now_playing?api_key=c5203bcbbee2d69dcb21052d7ef5621c&language=en-US&page=1";

    $.ajax({ /* jquery ajax call */
        url: queryURL,
        method: "GET"
    })
        .then(function (response) { /* promise */
            //console.log(response);

            var top20 = response.results.length;
            for (i = 0; i < top20; i++) {
                var movieID = response.results[i].id;
                var posterpath = "http://image.tmdb.org/t/p/original" + response.results[i].poster_path;
                var title = response.results[i].title;

                bgImageArray.push(posterpath);
            };
        });

};

/****************************************** */
/*     NowPlaying Cinemas near me           */
/****************************************** */

//International Showtimes API
showTimes = function () {

    //Clear other Cards/About/NowPlaying divs
    allowVerticalScroll();
    $(".now-playing-container").css("display", "none");
    $(".container-fluid").css("display", "none");
    $(".playing-near-me").css("display", "block");
    $("#about-container").css("display","none");
    $(".footer").attr("class","footer fixed-bottom");
    renderFooter();

    //console.log(geolocation);

    showtimeURL = "https://api.internationalshowtimes.com/v4/movies/?location=" + geolocation + "&distance=10&limit=10&fields=id,title,synopsis,poster_image_thumbnail,runtime,genres,ratings,website,release_dates,trailers";

    //console.log(showtimeURL);

    $.ajax({
        url: showtimeURL,
        type: "GET",
        data: {
            "countries": "US",
        },
        headers: {
            "X-API-Key": "jDUuWtnLAKvxl1cNbMyNVpHJcpnFGbnX",
        },
        beforeSend: function () {
            showLoading();
        },
    })
        .done(function (data, textStatus, jqXHR) {
            //console.log("HTTP Request Succeeded: " + jqXHR.status);
            //console.log(data);

            hideLoading();

            var movieId;
            var posterThumbnail;
            var runtime;
            var synopsis;
            var title;
            var genre;
            var trailers;
            var website;

            //show only 10 movies currently playing near by
            for (i = 0; i < 10; i++) {

                //assign Movie data
                movieId = data.movies[i].id;
                posterThumbnail = data.movies[i].poster_image_thumbnail;
                runtime = data.movies[i].runtime;
                synopsis = data.movies[i].synopsis;
                title = data.movies[i].title;
                genre = data.movies[i].genres;
                trailers = data.movies[i].trailers;
                website = data.movies[i].website;

                var displaymovieid = "movie-row-"+(i+1);

                var playingMovieHTML = 
               "<div class='col-12' id='"+displaymovieid+"'>"+
                "<div class='row'>"+
                    "<div class='col-3'>"+
                        "<img src='"+posterThumbnail+"' alt='"+title+"' class='now-playing'>"+
                    "</div>"+
                    "<div class='col-9'>"+

                        "<div class='row'>"+
                            "<div class='col-4 runtime'>"+
                               "Runtime: "+ runtime + " mins"+
                            "</div>"+
                            "<div class='col-4 genre'>"+
                                "Genre: "+ genre.map(e => e.name).join(", ")+
                            "</div>"+
                            "<div class='col-4'>"+
                                "<a href='"+trailers[0].trailer_files[0].url+"' class='trailer-link' target='_blank'>Trailer</a>"+
                            "</div>"+
                        "</div>"+

                        "<div class='row'>"+
                            "<div class='col-12'>"+
                                "<h5 class='title'>"+title+"</h5>"+
                                "<p class='synopsis'>"+synopsis+"</p>"+
                            "</div>"+
                        "</div>"+

                        "<div class='row'>"+
                            "<div class='col-4 theatre1'>"+
                                "<a class='theatreName1'></a>"+
                                "<p class='theatreAdd1'></p>"+
                                "<h6 class='theatrePh1'></h6>"+
                            "</div>"+
                            "<div class='col-4'>"+
                                "<a class='theatre2'></a>"+
                                "<p class='theatreAdd2'></p>"+
                                "<h6 class='theatrePh2'></h6>"+
                            "</div>"+
                            "<div class='col-4'>"+
                                "<a class='theatre3'></a>"+
                                "<p class='theatreAdd3'></p>"+
                                "<h6 class='theatrePh3'></h6>"+
                            "</div>"+
                        "</div>"+
                    "</div>"+
                "</div>";

            $(".playing-near-me").append(playingMovieHTML);      
            
            
            
                //get 3 near by cinemas where this movie is being played
                var cinemasQuery = "https://api.internationalshowtimes.com/v4/cinemas?movie_id=" + movieId + "&location=" + geolocation + "&distance=10&limit=4";
                //console.log(cinemasQuery);

                var resp = 
                $.ajax({
                    url: cinemasQuery,
                    type: "GET",
                    data: {
                        "countries": "US",
                    },
                    headers: {
                        "X-API-Key": "jDUuWtnLAKvxl1cNbMyNVpHJcpnFGbnX",
                    },
                })
                    .done(function (data, textStatus, jqXHR) {
                        //console.log("HTTP Request Succeeded: " + jqXHR.status);
                        // console.log(data);
                        
                        var theatreName=["","",""];
                        var theatreAddress=["","",""];
                        var theatrePhone=["","",""];
                        var theatreWebsite=["","",""];
                       
                        for (j = 0; j < 3; j++) {
                            theatreName[j] = data.cinemas[j].name;
                           
                            theatreAddress[j] = data.cinemas[j].location.address.display_text;
                    
                            theatrePhone[j] = data.cinemas[j].telephone;
                         
                            theatreWebsite[j] = data.cinemas[j].website;
                           
                        };
                    })
                    .fail(function (jqXHR, textStatus, errorThrown) {
                        console.log("HTTP Request Failed");
                    });
                    
                    // console.log(
                    //     theatreName + "\n" + theatreAddress + "\n" + theatrePhone + "\n" + theatreWebsite );

        };

            //google.maps.event.addDomListener(window, 'load', initMap);

        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            console.log("HTTP Request Failed");
        });
};

initMap = function () {

    console.log(latitude, longitude);
    var location = new google.maps.LatLng(latitude, longitude);

    var mapCanvas = document.getElementById('map');
    var mapOptions = {
        center: location,
        zoom: 16,
        panControl: false,
        scrollwheel: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    var map = new google.maps.Map(mapCanvas, mapOptions);

    var markerImage = 'marker.png';

    var marker = new google.maps.Marker({
        position: location,
        map: map,
        icon: markerImage
    });

    var contentString = '<div class="info-window">' +
        '<h3>Info Window Content</h3>' +
        '<div class="info-content">' +
        '<p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.</p>' +
        '</div>' +
        '</div>';

    var infowindow = new google.maps.InfoWindow({
        content: contentString,
        maxWidth: 400
    });

    marker.addListener('click', function () {
        infowindow.open(map, marker);
    });

    var styles = [{ "featureType": "landscape", "stylers": [{ "saturation": -100 }, { "lightness": 65 }, { "visibility": "on" }] }, { "featureType": "poi", "stylers": [{ "saturation": -100 }, { "lightness": 51 }, { "visibility": "simplified" }] }, { "featureType": "road.highway", "stylers": [{ "saturation": -100 }, { "visibility": "simplified" }] }, { "featureType": "road.arterial", "stylers": [{ "saturation": -100 }, { "lightness": 30 }, { "visibility": "on" }] }, { "featureType": "road.local", "stylers": [{ "saturation": -100 }, { "lightness": 40 }, { "visibility": "on" }] }, { "featureType": "transit", "stylers": [{ "saturation": -100 }, { "visibility": "simplified" }] }, { "featureType": "administrative.province", "stylers": [{ "visibility": "off" }] }, { "featureType": "water", "elementType": "labels", "stylers": [{ "visibility": "on" }, { "lightness": -25 }, { "saturation": -100 }] }, { "featureType": "water", "elementType": "geometry", "stylers": [{ "hue": "#ffff00" }, { "lightness": -25 }, { "saturation": -97 }] }];

    map.set('styles', styles);


}

// Shorthand for $( document ).ready()
$(function () {

    //Onload set GeoLocation from client's browser
    getLocation();

    //Clear other Cards/About/NowPlaying divs
    $(".now-playing-container").css("display", "flex");
    $(".container-fluid").css("display", "none");
    $(".playing-near-me").css("display", "none");
    // restrictVerticalScroll();

    NowPlaying();

    /***********Set Container 1**************** */
    $('#container-cl-1').find('.inner-div-in').addClass('active');

    // Pass index of bgImageArray as url link for background image
    $('#container-cl-1').find('.inner-div-in').css("background-image", `url('${bgImageArray[bgIndex]}')`);

    bgIndex++;
    $('#container-cl-1').find('.inner-div-out').css("background-image", `url('${bgImageArray[bgIndex]}')`);

    // Timer to change background every 10 secs
    setInterval(() => {
        if (!flip1) {
            zoomOut("#container-cl-1");
        } else if (flip1) {
            zoomIn("#container-cl-1");
        }
    }, 10000);

    /***********Set Container 2**************** */
    $('#container-cl-2').find('.inner-div-in').addClass('active');

    //bgIndex++;
    // Pass index of bgImageArray as url link for background image
    $('#container-cl-2').find('.inner-div-in').css("background-image", `url('${bgImageArray[bgIndex]}')`);

    bgIndex++;
    $('#container-cl-2').find('.inner-div-out').css("background-image", `url('${bgImageArray[bgIndex]}')`);

    // Timer to change background every 10 secs
    setInterval(() => {
        if (!flip2) {
            zoomOut("#container-cl-2");
        } else if (flip2) {
            zoomIn("#container-cl-2");
        }
    }, 8000);

    /***********Set Container 3**************** */
    $('#container-cl-3').find('.inner-div-in').addClass('active');

    //bgIndex++;
    // Pass index of bgImageArray as url link for background image
    $('#container-cl-3').find('.inner-div-in').css("background-image", `url('${bgImageArray[bgIndex]}')`);

    bgIndex++;
    $('#container-cl-3').find('.inner-div-out').css("background-image", `url('${bgImageArray[bgIndex]}')`);

    // Timer to change background every 10 secs
    setInterval(() => {
        if (!flip3) {
            zoomOut("#container-cl-3");
        } else if (flip3) {
            zoomIn("#container-cl-3");
        }
    }, 9000);


    zoomIn = function (container) {

        $(container).find('.inner-div-out').removeClass('active');
        $(container).find('.inner-div-in').remove();
        $(container).find('.inner-div-out').remove();
        //console.log(`Zoom-in: removed div-in and div-out, bgIndex: ${bgIndex}`);

        if (bgIndex < bgImageArray.length) {
            let innerDivIn = $('<div class="inner-div-in"></div>');
            innerDivIn.css("background-image", `url('${bgImageArray[bgIndex]}')`);
            innerDivIn.addClass('active');
            $(container).find('.outer-div').append(innerDivIn);
            bgIndex++;
            let innerDivOut = $('<div class="inner-div-out"></div>');
            innerDivOut.css("background-image", `url('${bgImageArray[bgIndex]}')`);
            $(container).find('.outer-div').append(innerDivOut);

            if (container === "#container-cl-1") {
                flip1 = false;
            } else if (container === "#container-cl-2") {
                flip2 = false;
            } else if (container === "#container-cl-3") {
                flip3 = false;
            };
        } else {
            bgIndex = 0;
            zoomIn(container);
        }

    };


    zoomOut = function (container) {
        // if (bgIndex <= 1) {
        //     $(container).find('.inner-div-in').removeClass('active');
        //     setTimeout(() => {
        //         $(container).find('.inner-div-in').remove();
        //     }, 2000);
        //     bgIndex++;
        // } else if ((bgIndex >= 1) && 

        if (bgIndex < bgImageArray.length) {

            $(container).find('.inner-div-in').removeClass('active');
            $(container).find('.inner-div-in').remove();
            $(container).find('.inner-div-out').remove();
            //console.log(`Zoom-out: removed div-in and div-out, bgIndex: ${bgIndex}`);

            let innerDivOut = $('<div class="inner-div-out"></div>');
            innerDivOut.css("background-image", `url('${bgImageArray[bgIndex]}')`);
            innerDivOut.addClass('active');
            $(container).find('.outer-div').append(innerDivOut);
            bgIndex++;
            let innerDivIn = $('<div class="inner-div-in"></div>');
            innerDivIn.css("background-image", `url('${bgImageArray[bgIndex]}')`);
            $(container).find('.outer-div').append(innerDivIn);
            if (container === "#container-cl-1") {
                flip1 = true;
            } else if (container === "#container-cl-2") {
                flip2 = true;
            } else if (container === "#container-cl-3") {
                flip3 = true;
            };
        } else {
            bgIndex = 0;
            zoomOut(container);
        }
    };


});

/* -------------------------------------------------API's Etc------------------------------------------------- */

// globals used as param in query urls
let page = 1;
let pagePrev = page - 1;
let pageNext = page + 1;
let movieInput = "";
let genreID = "";
let decadeID = "";
let i = 0;
let yearStart = "";
let yearEnd = "";
let callApiByTitle = false;
let callApiByGenre = false;
// refelcts number of page loads for API calls
let pageCount = 0;
let landingPage = true;

// prevents scrolling of body
restrictVerticalScroll = function () {
    if (landingPage) {
        $('body').css('overflow', 'hidden');
    }
}

// allows scrolling of body
allowVerticalScroll = function () {
    if (!landingPage) {
        $('body').css('overflow', 'visible');
    }
}

// calls function to display background images
// renderBackground();
// and prevent body scroll
// restrictVerticalScroll(); ---commented by Mandeep

// capture input values for genre
$('#genre').on('click', 'a', function (e) {
    genreID = $(this).attr('id');
})


// capture input values for decade
$('#decade').on('click', 'a', function (e) {
    decadeID = $(this).attr('id');
})


// captures value(s) from form submission
$('#my-form').submit(function (event) {
    event.preventDefault();

    $(".footer").attr("class","footer fixed-bottom");

    $(".container-fluid").css("display", "block");
    if ($('#movie-input').val() === "") {
        makeApiCallGenre(genreID, decadeID);
        clearBody();
        landingPage = false;
    } else {
        // grab input value from form
        movieInput = $('#movie-input').val().trim();
        //clear input field after passing value
        $("#movie-input").val("");
        clearBody();
        // pass value to function
        makeApiCall(movieInput);
        
        landingPage = false;
    }
});


clearBody = function () {
    // hidse background images, pagiantion and footer
    $(".playing-near-me").css("display","none");
    $('.now-playing-container').css('display', 'none');
    $(".about-hidden").css("display", 'none');
    $('#pagination').remove();
    // $('.container-fluid').css('display','none');
    $('.footer').css('visibility', 'hidden');
}


makeApiCall = function (movieInput) {
    // empties any previous cards
    $('.row').empty();
    // iterate page count
    // prevents double-render of pagination div
    pageCount += 1;

    // movieInput passed as a param to search movie titles
    let queryURL = "https://api.themoviedb.org/3/search/movie?api_key=c5203bcbbee2d69dcb21052d7ef5621c&query=" + movieInput + "&page=" + page + "&sort_by=popularity.desc";


    $.ajax({ /* jquery ajax call */
        url: queryURL,
        method: "GET",
        beforeSend: function () {
            showLoading();
        },
    })
        .then(function (response) { /* promise */
            let data = response;
            parseData(data);
            hideLoading();
            callApiByGenre = false;
            callApiByTitle = true;
            allowVerticalScroll();
            renderPagination();
        });
}


makeApiCallGenre = function (genreID, decadeID) {
    // empties any previous cards
    $('.row').empty();
    // iterate pageCount. prevents double-render of pagination div
    pageCount += 1;

    switch (true) {
        case decadeID == "30's":
            yearStart = "1930", yearEnd = "1949"
            break
        case decadeID == "40's":
            yearStart = "1940", yearEnd = "1949"
            break
        case decadeID == "50's":
            yearStart = "1950", yearEnd = "1959"
            break
        case decadeID === "60's":
            yearStart = "1960", yearEnd = "1969"
            break
        case decadeID === "70's":
            yearStart = "1970", yearEnd = "1979"
            break
        case decadeID === "80's":
            yearStart = "1980", yearEnd = "1989"
            break
        case decadeID === "90's":
            yearStart = "1990", yearEnd = "1999"
            break
        case decadeID === "00's":
            yearStart = "2000", yearEnd = "2009"
            break;
        case decadeID === "10's":
            yearStart = "2010", yearEnd = "2019"
            break;
    }

    // movie genreInput passed as a param to search movie genre's  
    let queryURL = "https://api.themoviedb.org/3/discover/movie?api_key=c5203bcbbee2d69dcb21052d7ef5621c&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=" + page + "&primary_release_date.gte=" + yearStart + "-01-01&primary_release_date.lte=" + yearEnd + "-12-31&vote_average.gte=6&with_genres=" + genreID;


    $.ajax({ /* jquery ajax call */
        url: queryURL,
        method: "GET",
        beforeSend: function () {
            showLoading();
        },
    })
        .then(function (response) { /* promise */
            let data = response;
            parseData(data);
            hideLoading();
            callApiByTitle = false;
            callApiByGenre = true;
            allowVerticalScroll();
            renderPagination();
        });
}


parseData = function (data) {
    let base = "http://image.tmdb.org/t/p/w342/";

    data.results.forEach(function (element) {
        let poster = "";

        // if poster path returns empty
        if (element.poster_path === null) {
            // display stock placeholder image
            poster = "./assets/stock-image/noPoster.jpg";
        } else {
            poster = base + element.poster_path;
        }

        let title = element.title;
        let release_date = element.release_date;
        let overview = element.overview;
        let vote_average = element.vote_average;
        let vote_color = "";
        // converts 0-10 num to percent
        vote_average = Math.round((vote_average * 10));

        // constructs percentage colors
        if (vote_average <= 70) {
            vote_color = "orange";
        } else if (vote_average <= 80) {
            vote_color = "green";
        } else if (vote_average >= 80) {
            vote_color = "blue";
        }

        // converts voting percentage into string
        vote_average = vote_average.toString();
        renderCard(title, release_date, poster, overview, vote_average, vote_color);
    });
}


showLoading = function () {
    $('#loading').show();
}


hideLoading = function () {
    $('#loading').hide();
};


renderCard = function (title, release_date, poster, overview, vote_average, vote_color) {
    let myCol = $('<div class="col-sm-6 col-md-6 pb-4"></div>');

    let myPanel = $('<div class="card card-outline-info" id="' + i + 'Panel"><div class="card-block"> <img src="' + poster + ' "class="rounded poster"> <div class="box"><div class="single-chart"><svg viewBox="0 0 36 36" class="circular-chart ' + vote_color + '"><path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/><path class="circle" stroke-dasharray="' + vote_average + ', 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/><text x="18" y="20.35" class="percentage">' + vote_average + '%</text></svg><span id="title">' + title + '<br><span id="release-date">' + release_date + '</span></span></div><div id="overview"><p class="overflow">' + overview + ' </p></div></div></div></div>');

    myPanel.appendTo(myCol);
    myCol.appendTo('#contentPanel');
    i++;
}


renderPagination = function () {
    // if this is the first page render
    if (pageCount === 1) {
        // renders the pagination 
        let pages = $('<div id="pagination"><ul class="pagination pagination-content"><li><a href="#" class="page" id="prev">Prev</a></li><li><a href="#" class="page" id="1">1</a></li><li><a href="#" class="page" id="2">2</a></li><li><a href="#" class="page" id="3">3</a></li><li><a href="#" class="page" id="next">Next</a></li></ul></div>');
        pages.appendTo('.container-fluid');

        renderFooter();
    }

    else if (pageCount > 1) {
        // removes previous pagination div
        $('.pagination').remove();

        // renders the pagination with page variables
        let pages = $('<div id="pagination"><ul class="pagination pagination-content"><li><a href="#" class="page" id="prev">Prev</a></li><li><a href="#" class="page" id="' + pagePrev + '">' + pagePrev + '</a></li><li><a href="#" class="page" id="' + page + '">' + page + '</a></li><li><a href="#" class="page" id="' + pageNext + '">' + pageNext + '</a></li><li><a href="#" class="page" id="next">Next</a></li></ul></div>');
        pages.appendTo('.container-fluid');

        renderFooter();
    }
}

renderFooter = function () {
    $('.footer').css('visibility', 'visible');
}


// captures clicks on pagination buttons
$(document).on("click", ".pagination li a", function (e) {
    e.preventDefault();

    // gets id of page button clicked
    pageInput = $(this).attr('id');

    // updates page global based on which button was clicked
    if (pageInput === 'prev') {
        page = (parseInt(page) - 1);
    } else if (pageInput === 'next') {
        page = (parseInt(page) + 1);
    } else {
        page = parseInt(pageInput);
    }

    // updates globals
    pagePrev = page - 1;
    pageNext = page + 1;

    goToPage();
});


goToPage = function () {
    // empties page of previous cards
    $('.row').empty();

    // if user is paginating via genre's
    if (callApiByGenre) {
        makeApiCallGenre(genreID, decadeID);
        // scrolls to top of window
        window.scrollTo(0, 0);
        // if user is paginating via title
    } else if (callApiByTitle) {
        makeApiCall(movieInput);
        // scrolls to top of window
        window.scrollTo(0, 0);
    }
}


// // home button clicked
// $('#home').click(function () {
//     $('#about-container').remove();
//     $('.row').empty();
//     // removes previous pagination div
//     $('.pagination').remove();
//     $(".pic-container").css("visibility", 'visible').css('display', 'block');
//     // $('.footer').remove();
//     renderBackground();
//     // reset pageCount
//     pageCount = 0;
//     landingPage = true;
//     // restrictVerticalScroll();
// });


// Anny's code

$("#notification").on("click", function(){
  
    //   //console.log("test"); 
      $(".tooltiptext").toggle("hide");
      
      
     })

$("#about").on("click", function () {

    $("#about-container").css("display","block");
    $(".playing-near-me").css("display","none");
    $(".now-playing-container").css("display", 'none');
    // $(".tooltip").toggle("hide");
    $(".container-fluid").css("display", 'none');

    // $("html, body").scrollTop(2);
});

// Initialize Firebase
var config = {
    // apiKey: "AIzaSyBvEDRjMvvZ39keCybb9VWvlKNKdAD9NQg",
    // authDomain: "movie-of-all-time-web.firebaseapp.com",
    // databaseURL: "https://movie-of-all-time-web.firebaseio.com",
    // projectId: "movie-of-all-time-web",
    // storageBucket: "movie-of-all-time-web.appspot.com",
    // messagingSenderId: "338668317924"

    apiKey: "AIzaSyDSuTBSAA-n9YAyX6i2QIaqGsI_8hNqY8o",
    authDomain: "bootcamp-mk.firebaseapp.com",
    databaseURL: "https://bootcamp-mk.firebaseio.com",
    projectId: "bootcamp-mk",
    storageBucket: "bootcamp-mk.appspot.com",
    messagingSenderId: "1069260610018"

};
firebase.initializeApp(config);

var database = firebase.database();

// 2. Submit Email button
$("#email-submit").on("click", function (event) {
    event.preventDefault();

    // Grabs user input
    var emailAddress = $("#email-input").val().trim();

    // Creates local "temporary" object for holding employee data
    var newEmail = {
        email: emailAddress
    };

    // Uploads employee data to the database
    database.ref().push(newEmail);

    //console.log(newEmail.email);

    $("#email-input").val("");

    $(".movie-notify").toggle("hide");

});