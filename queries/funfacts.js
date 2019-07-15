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
  let iconWaterCons = "fas fa-tint";

  let roomTmp = "Average room temperature";
  let gasCons = "Average yearly gas consumption";
  let solarProd = "Average daily solar production";
  let elecCons = "Average yearly electricity consumption";
  let elecInjec = "Average daily electricity injection";
  let waterCons = "Average yearly water consumption";
  
  let roundRoomTemp = 2;
  let roundGasCons = 0;
  let roundSolarProd = 2;
  let roundElecCons = 0;
  let roundElecInjec = 3;
  let roundWaterCons = 2;

  let avgRoomTemp = 'select avg(value) as "Average room temperature" from room_temp_day';
  let avgGasCons = 'select sum(cons_sum)/count(cons_sum)*365 as "Average yearly gas consumption"\
                   from (select sum(value)/count(*) as cons_sum\
                   , customer_id from gas_cons_day group by customer_id) as sub_sum_query';
  let avgSolarProd = 'select sum(cons_sum)/count(cons_sum) as "Average daily solar production"\
                     from (select sum(value)/count(*) as cons_sum\
                     , customer_id from solar_prod_day group by customer_id) as sub_sum_query';
  let avgElecCons = 'select sum(cons_sum)/count(cons_sum)*365 as "Average yearly electricity consumption"\
                    from (select sum(value)/count(*) as cons_sum\
                    , customer_id from elec_cons_day group by customer_id) as sub_sum_query';

  let avgElecInjec = 'select sum(cons_sum)/count(cons_sum) as "Average daily electricity injection"\
                     from (select sum(value)/count(*) as cons_sum\
                     , customer_id from elec_inje_day group by customer_id) as sub_sum_query';

  let avgWaterCons = 'select sum(cons_sum)/count(cons_sum)*365 as "Average yearly water consumption"\
                     from (select sum(value)/count(*) as cons_sum\
                     , customer_id from water_cons_day group by customer_id) as sub_sum_query';

  pool.query(avgElecCons, (error, results) => {
    if (error) {
      throw error
    }
    averages = results.rows;
    data.push({ icon: iconElecCons, name: elecCons, value: averages[0][elecCons], unit: "kWh", precision: roundElecCons });

    pool.query(avgGasCons, (error, results) => {
      if (error) {
        throw error
      }
      averages = results.rows;
      data.push({ icon: iconGasCons, name: gasCons, value: averages[0][gasCons], unit: "m³", precision: roundGasCons });

      pool.query(avgWaterCons, (error, results) => {
        if (error) {
          throw error
        }
        averages = results.rows;
        data.push({ icon: iconWaterCons, name: waterCons, value: averages[0][waterCons], unit: "m³", precision: roundWaterCons });

        pool.query(avgRoomTemp, (error, results) => {
          if (error) {
            throw error
          }
          averages = results.rows;
          data.push({ icon: iconRoomTmp, name: roomTmp, value: averages[0][roomTmp], unit: "°C", precision: roundRoomTemp });

          pool.query(avgSolarProd, (error, results) => {
            if (error) {
              throw error
            }
            averages = results.rows;
            data.push({ icon: iconSolarProd, name: solarProd, value: averages[0][solarProd], unit: "kWh", precision: roundSolarProd });

            pool.query(avgElecInjec, (error, results) => {
              if (error) {
                throw error
              }
              averages = results.rows;
              data.push({ icon: iconElecInjec, name: elecInjec, value: averages[0][elecInjec], unit: "kWh", precision: roundElecInjec });

              response.status(200).send(data);
            })
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