const Pool = require('pg').Pool
const pool = new Pool({
    user: 'docker',
    host: 'localhost',
    database: 'docker',
    password: 'docker',
    port: 5432,
})


const getSolarProdZip = (request, response) => {
    let zip = request.params.id;

    pool.query("select avg(sp.value) from solar_prod_day sp join postal_codes p on p.customer_id = sp.customer_id where p.postal_code = $1;",[zip], (error, results) => {
        if (error) {
            throw error
        }

        let average = results.rows;
        response.status(200).send(average);
    });
};

module.exports = {
    getSolarProdZip
}