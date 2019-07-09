const Pool = require('pg').Pool
const pool = new Pool({
  user: 'docker',
  host: 'localhost',
  database: 'docker',
  password: 'docker',
  port: 5432,
})


const getAverages = (request, response) => {
    let averages;
    let data = [];
    let iconRoomTmp = "fas fa-thermometer-half";
    let iconGasCons = "fas fa-burn";
    let iconSolarProd = "fas fa-solar-panel";
    let iconElecCons = "fas fa-bolt";
    let iconElecInjec = "fas fa-plug";

    let roomTmp = "Average room temperature";
    let gasCons = "Average gas consumption";
    let solarProd = "Average solar production";
    let elecCons = "Average electricity consumption";
    let elecInjec = "Average electricity injection";

    let avgRoomTemp = 'SELECT AVG(value) AS "Average room temperature"' + 
                      'FROM "room_temp";';
    let avgGasCons = 'SELECT AVG(value) AS "Average gas consumption"' + 
                     'FROM "gas_cons";';
    let avgSolarProd = 'SELECT AVG(value) AS "Average solar production"' + 
                       'FROM "solar_prod";';
    let avgElecCons = 'SELECT AVG(value) AS "Average electricity consumption"' + 
                      'FROM "elec_cons";';
    let avgElecInjec = 'SELECT AVG(value) AS "Average electricity injection"' + 
                      'FROM "elec_inje";';               

    pool.query(avgRoomTemp, (error, results) => {
      if (error) {
        throw error
      }
      averages = results.rows;
      data.push({icon: iconRoomTmp, name: roomTmp, value: averages[0][roomTmp], unit: "°C"});
    
      pool.query(avgGasCons, (error, results) => {
        if (error) {
          throw error
        }
        averages = results.rows;
        data.push({icon: iconGasCons, name: gasCons, value: averages[0][gasCons], unit: "m³"});

        pool.query(avgSolarProd, (error, results) => {
          if(error){
            throw error
          }
          averages = results.rows;
          data.push({icon: iconSolarProd, name: solarProd, value: averages[0][solarProd], unit: "kWh"});

          pool.query(avgElecCons, (error, results) => {
            if(error){
              throw error
            }
            averages = results.rows;
            data.push({icon: iconElecCons, name: elecCons, value: averages[0][elecCons], unit: "kWh"});

            pool.query(avgElecInjec, (error, results) => {
              if(error){
                throw error
              }
              averages = results.rows;
              data.push({icon: iconElecInjec, name: elecInjec, value: averages[0][elecInjec], unit: "kWh"});
              
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
    createTest,
    getAverages,
}