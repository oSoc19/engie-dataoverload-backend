const Pool = require('pg').Pool
const pool = new Pool({
  user: 'docker',
  host: '192.168.99.100',
  database: 'docker',
  password: 'docker',
  port: 5432,
})

const getAll = (request, response) => {
    pool.query('SELECT * FROM test;', (error, results) => {

      if (error) {
        throw error
      }

      console.log(results.rows);
      response.status(200).send(results.rows);
    })
};

const getAverages = (request, response) => {
    let averages = [];
    let dataTmp;
    let avgRoomTemp = 'SELECT AVG(value) AS "Average room temperature"' + 
                      'FROM "BOXX_15min20k" WHERE variable = \'room_temp\';';
    let avgGasCons = 'SELECT AVG(value) AS "Average gas consumption"' + 
                     'FROM "BOXX_15min20k" WHERE variable = \'gas_cons\';';
    let avgSolarProd = 'SELECT AVG(value) AS "Average solar production"' + 
                       'FROM "BOXX_15min20k" WHERE variable = \'solar_prod\';';
    let avgElecCons = 'SELECT AVG(value) AS "Average electricity consumption"' + 
                      'FROM "BOXX_15min20k" WHERE variable = \'elec_cons_lt\'' +
                      'OR variable = \'elec_cons_ht\';';
    let avgElecInjec = 'SELECT AVG(value) AS "Average electricity injection"' + 
                      'FROM "BOXX_15min20k" WHERE variable = \'elec_inje_lt\'' +
                      'OR variable = \'elec_inje_ht\';';                 

    pool.query(avgRoomTemp, (error, results) => {
      if (error) {
        throw error
      }
      dataTmp = results.rows;
      averages.push(dataTmp);
    
      pool.query(avgGasCons, (error, results) => {
        if (error) {
          throw error
        }
        dataTmp = results.rows;
        averages.push(dataTmp);

        pool.query(avgSolarProd, (error, results) => {
          if(error){
            throw error
          }
          dataTmp = results.rows;
          averages.push(dataTmp);

          pool.query(avgElecCons, (error, results) => {
            if(error){
              throw error
            }
            dataTmp = results.rows;
            averages.push(dataTmp);

            pool.query(avgElecInjec, (error, results) => {
              if(error){
                throw error
              }
              dataTmp = results.rows;
              averages.push(dataTmp);
              
              response.status(200).send(averages);
            })
          })
        })
      })
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
    getAll,
    createTest,
    getAverages
}