const Pool = require('pg').Pool
const pool = new Pool({
  user: 'docker',
  host: 'localhost',
  database: 'docker',
  password: 'docker',
  port: 5432,
})

const testquery = "select * from \"BOXX_15min20k\" "
                  "where variable = \"solar_prod\" "
                  "order by customer_id"

const getTestQuery = (request, response) => {
    pool.query(testquery, (error, results) => {

      if (error) {
        throw error
      }

      console.log(results.rows);
      response.status(200).send(results.rows);
    })
};

const createTest = (request, response) => {
  console.log(request.query);
  
  const { testid, texttest } = request.query;

  pool.query('insert into test(testid, texttest) VALUES ($1, $2)', [testid, texttest], (error, results) => {
    if (error) {
      throw error
    }
    //console.log(results);
    
    response.status(201).send(request.query)
  })
}

module.exports = {
    getTestQuery,
    createTest
}