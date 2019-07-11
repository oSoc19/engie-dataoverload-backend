const Pool = require('pg').Pool
const pool = new Pool({
    user: 'docker',
    host: 'localhost',
    database: 'docker',
    password: 'docker',
    port: 5432,
})

const http_request = require('request');

const getSolarProdZip = (request, response) => {
    let zip = request.params.id;

    pool.query("select avg(sp.value) from solar_prod_day sp join postal_codes p on p.customer_id = sp.customer_id where p.postal_code = $1;", [zip], (error, results) => {
        if (error) {
            throw error;
        }

        let average = results.rows;

        if (average.avg) {
            response.status(200).send(average);
        } else {

            var options = {
                url: 'https://nominatim.openstreetmap.org/search?q=1790,Belgi%C3%AB&format=json',
                headers: {
                    'User-Agent': 'engie-data-overload'
                }
            };

            http_request(options, (err, res, body) => {
                if (err) { return console.log(err); }
                let info = JSON.parse(body);
                let lat = info[0].lat;
                let long = info[0].lon;
                console.log(lat + ", " + long);
            });

            pool.query("select avg(sp.value) from solar_prod_day sp join postal_codes p on p.customer_id = sp.customer_id where p.postal_code = $1;", [zip], (error, results) => {
                response.status(200).send("average");
            });
        }

    });
};

module.exports = {
    getSolarProdZip
}