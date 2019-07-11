const getWaterConsEstimation = (request, response) => {
  var nb_bath_day = 1;
  var nb_showers_day = 2;
  var water_year = (nb_showers_day + nb_bath_day) * 365;
  
  var out_data = [];
  out_data.push({water_year: water_year});
  response.status(200).send(out_data);
};

module.exports = {
  getWaterConsEstimation
}