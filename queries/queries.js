const Pool = require('pg').Pool
const pool = new Pool({
  user: 'docker',
  host: 'localhost',
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
    let averages;
    let data = [];
    let iconStr = "fas fa-fire";
    let roomTmp = "Average room temperature";
    let gasCons = "Average gas consumption";
    let solarProd = "Average solar production";
    let elecCons = "Average electricity consumption";
    let elecInjec = "Average electricity injection";
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
      averages = results.rows;
      data.push({icon: iconStr, name: roomTmp, value: averages[0][roomTmp]});
    
      pool.query(avgGasCons, (error, results) => {
        if (error) {
          throw error
        }
        averages = results.rows;
        data.push({icon: iconStr, name: gasCons, value: averages[0][gasCons]});

        pool.query(avgSolarProd, (error, results) => {
          if(error){
            throw error
          }
          averages = results.rows;
          data.push({icon: iconStr, name: solarProd, value: averages[0][solarProd]});

          pool.query(avgElecCons, (error, results) => {
            if(error){
              throw error
            }
            averages = results.rows;
            data.push({icon: iconStr, name: elecCons, value: averages[0][elecCons]});

            pool.query(avgElecInjec, (error, results) => {
              if(error){
                throw error
              }
              averages = results.rows;
              data.push({icon: iconStr, name: elecInjec, value: averages[0][elecInjec]});
              
              response.status(200).send(data);
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