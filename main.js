function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var deg2rad = function(deg) { return deg * (Math.PI/180); }
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}





var android = navigator.userAgent.match(/android/ig);

$(document).ready(function(){
    var places, geolocation;
    
    var sortPlaces = function(places) {
        if(geolocation) {
            return _.sortBy(places, function(place) { 
                return parseFloat($(place).attr('distance'));
            });
        } else {
            return _.sortBy(places, function(place) { return $(place).attr('name'); });
        }
    }
    
    var updateDistances = function() {
        if(places && geolocation) {
            $(places).each(function(_idx,_place){
                var place = $(_place);
                var distance = getDistanceFromLatLonInKm(geolocation.coords.latitude, geolocation.coords.longitude, parseFloat(place.attr('lat')), parseFloat(place.attr('lng')));
                place.attr('distance', distance);
            });
        }
    };
    
    var display = function(){
        var template = _.template("<tr><td><a href=\"<%= prefix %><%= q %>\"><%= name %></a> <small><%= distance  %></small></td><td><span class=\"label pull-right <%= status %>\"><%= bikes %></tr>");
        
        $("#rowery > tbody").html('');
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
                    distance: (place.attr('distance')?'('+(parseFloat(place.attr('distance'))).toFixed(1)+' km)':''), 
                    status: status,
                    prefix: android?'geo:':'https://maps.google.com/maps?q=',
                    q: [place.attr('lat'),place.attr('lng')].join(",")
                };
            
            $('#rowery > tbody').append(template(params));
        });
    };
    
    var geoloc = function(_geolocation) {
        console.log(["Got location",_geolocation]);
        geolocation = _geolocation;
        updateDistances();
        if(places)
            display();
    };

    if(navigator.geolocation) navigator.geolocation.getCurrentPosition(geoloc);
    
    $.get('https://nextbike.net/maps/nextbike-official.xml?&domains=kp&maponly=1').done(function(data){
        $("#info").html('');    
        places = $(data).find('place');
        updateDistances();
        display();
    }).fail(function(err){
        $("#info").html('<div class="alert alert-danger">Coś poszło nie tak :(</div>');
        console.log(err);
    });
});
$(document).ready(function(){
    if (android) {
        $('.promo-web').hide();
        $('.promo-android').show();
    } else {
        $('.promo-web').show();
        $('.promo-android').hide();
    }
});