$(document).ready(function(){
    var template = _.template("<li><a href=\"geo:<%= q %>\"><%= name %><span class=\"label pull-right <%= status %>\"><%= bikes %></a></li>");
    $.get('https://nextbike.net/maps/nextbike-official.xml?&domains=kp&maponly=1').done(function(data){
        $("#info").html('');    
        var places = _.sortBy($(data).find('place'), function(place) { return $(place).attr('name'); });
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
        
    }).fail(function(err){
        $("#info").html('<div class="alert alert-danger">Coś poszło nie tak :(</div>');
        console.log(err);
    });
})