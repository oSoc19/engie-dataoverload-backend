const Pool = require('pg').Pool

const params = url.parse(process.env.DATABASE_URL);
const auth = params.auth.split(':');

const config = {
  user: auth[0],
  password: auth[1],
  host: params.hostname,
  port: params.port,
  database: params.pathname.split('/')[1],
  ssl: true
};

const pool = new Pool(config);

/*const pool = new Pool({
  user: 'docker',
  host: 'localhost',
  database: 'docker',
  password: 'docker',
  port: 5432
})*/

const http_request = require('request');

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

const getSolarProdZip = (request, response) => {
    let zip = request.params.id;

    pool.query("select avg(sp.value) from solar_prod_day sp join postal_codes p on p.customer_id = sp.customer_id where p.postal_code = $1;", [zip], (error, results) => {
        if (error) {
            throw error;
        }

        let average = results.rows;
        console.log(average);

        if (average[0].avg != null) {
            response.status(200).send(average);
        } else {

            var options = {
                url: 'https://nominatim.openstreetmap.org/search?q='+zip+',Belgi%C3%AB&format=json',
                headers: {
                    'User-Agent': 'engie-data-overload'
                }
            };

            http_request(options, (err, res, body) => {
                if (err) { return console.log(err); }
                let info = JSON.parse(body);
                let lat = info[0].lat;
                let long = info[0].lon;

                let closest_zip = 0;
                let smallest_distance = Number.MAX_SAFE_INTEGER;
                pool.query('select * from (select * from postal_codes where customer_id in (select customer_id from solar_prod_day)) a;', (error, results) => {

                    results.rows.forEach(function (element) {
                        let long1 = element.longitude;
                        let lat1 = element.latitude;
                        let distance = getDistanceFromLatLonInKm(lat1, long1,lat,long);
                        if(distance < smallest_distance){
                            smallest_distance = distance;
                            closest_zip = element.postal_code;
                        }
                        console.log(smallest_distance);
                    });

                    console.log(closest_zip);
                    
                    
                    pool.query("select avg(sp.value) from solar_prod_day sp join postal_codes p on p.customer_id = sp.customer_id where p.postal_code = $1;", [closest_zip], (error, results) => {
                        let closest_average = results.rows;
                        response.status(200).send(closest_average);
                    });
                });
            });
        }

    });
};

module.exports = {
    getSolarProdZip
}
