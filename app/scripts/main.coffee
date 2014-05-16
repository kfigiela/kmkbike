lib = require('scripts/lib')
places = undefined
current_location = undefined

update_distances = ->
  return unless places and current_location
  
  _.each places, (place) ->
    distance = lib.getDistanceFromLatLonInKm(
                                         current_location.coords.latitude, 
                                         current_location.coords.longitude, 
                                         parseFloat(place.getAttribute("lat")), 
                                         parseFloat(place.getAttribute("lng"))
                                      )
    $(place).attr "distance", distance

sorted_places = ->
  if current_location
    _.sortBy places, (place) ->
      parseFloat $(place).attr("distance")
  else
    _.sortBy places, (place) ->
      $(place).attr "name"


location_found = (_current_location) ->
  current_location = _current_location
  display()

display = ->
  return unless places
  
  update_distances()
  
  row = require('templates/row')
  $("#rowery > tbody").html ""

  _.each sorted_places(), (_place) ->
    place = $(_place)
    num_bikes = parseInt(place.attr("bikes"))

    params =
      name:  place.attr("name")
      bikes: place.attr("bikes")
      status: 
        if num_bikes >= 5
          "label-success"
        else if num_bikes is 0
          "label-danger"
        else
          "label-warning"      
      distance: (if place.attr("distance") then parseFloat(place.attr("distance")).toFixed(1))
      url: (if lib.is_android  then "geo:" else "https://maps.google.com/maps?q=")
      query: "#{place.attr("lat")},#{place.attr("lng")}"

    $("#rowery > tbody").append row(params)


start_geoloc = -> 
  navigator.geolocation.getCurrentPosition location_found if navigator.geolocation

init = (city) ->
  if lib.is_android
    $(".promo-web").hide()
    $(".promo-android").show()
  else
    $(".promo-web").show()
    $(".promo-android").hide()
  
  start_geoloc()
  
  $.get("https://nextbike.net/maps/nextbike-official.xml?&city=#{city}").done((data) ->
    $("#info").html ""
    places = $(data).find("place")
    display()
  ).fail (err) ->
    $("#info").html "<div class=\"alert alert-danger\">Coś poszło nie tak :(</div>"
    console.log err

module.exports = init