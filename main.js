$(document).ready(function(){
    var places, geolocation;
    
    var sortPlaces = function(places) {
        if(geolocation) {
            return _.sortBy(places, function(place) { 
                // This should be good-enough approximation
                var x = geolocation.coords.latitude-parseFloat($(place).attr('lat'));
                var y = geolocation.coords.longitude-parseFloat($(place).attr('lng'));
                return Math.sqrt(x*x+y*y);
            });
        } else {
            return _.sortBy(places, function(place) { return $(place).attr('name'); });
        }
    }
    
    var display = function(){
        $("#rowery").html('');
        places = sortPlaces(places);
        var list = places.forEach(function(_place) {
            var place = $(_place);
            var numBikes = parseInt(place.attr('bikes'));
            var status;
            if(numBikes >= 5) status = 'label-success';
            else if(numBikes == 0) status = "label-danger";
            else status = "label-warning";
            var params = {
                    name: place.attr('name'), 
                    bikes: place.attr('bikes'), 
                    status: status,
                    q: [place.attr('lat'),place.attr('lng')].join(",")
                };
            
            $('#rowery').append(template(params));
        });
    };
    
    var geoloc = function(_geolocation) {
        geolocation = _geolocation;
        if(places)
            display();
    };
    
    navigator.geolocation.getCurrentPosition(geoloc);
    
    var template = _.template("<li><a href=\"geo:<%= q %>\"><%= name %><span class=\"label pull-right <%= status %>\"><%= bikes %></a></li>");
    $.get('https://nextbike.net/maps/nextbike-official.xml?&domains=kp&maponly=1').done(function(data){
        $("#info").html('');    
        places = $(data).find('place')
        display();
    }).fail(function(err){
        $("#info").html('<div class="alert alert-danger">Coś poszło nie tak :(</div>');
        console.log(err);
    });
})