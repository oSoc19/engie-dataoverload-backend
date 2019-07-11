const getWaterConsEstimation = (request, response) => {
  var nb_bath_day = 1;
  var nb_showers_day = 2;
  var water_year = (nb_showers_day + nb_bath_day) * 365;
  
  var out_data = [];
  out_data.push({water_year: water_year});
  response.status(200).send(out_data);
};

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
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

function deg2rad(deg) {
  return deg * (Math.PI/180)
}
module.exports = {
  getWaterConsEstimation
}