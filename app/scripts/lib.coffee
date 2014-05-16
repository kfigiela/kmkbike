module.exports.getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) ->
  deg2rad = (deg) ->
    deg * (Math.PI / 180)

  R = 6371 # Radius of the earth in km
  dLat = deg2rad(lat2 - lat1) # deg2rad below
  dLon = deg2rad(lon2 - lon1)
  a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  d = R * c # Distance in km
  d
  
module.exports.is_android = navigator.userAgent.match(/android/g)