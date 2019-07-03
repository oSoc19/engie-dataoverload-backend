const Pool = require('pg').Pool
const pool = new Pool({
  user: 'docker',
  host: 'localhost',
  database: 'docker',
  password: 'docker',
  port: 5432,
})

const avg_elec_cons_daily_solar =
 "select sum(t1.value)/count(t1.customer_id) as avg_cons, date(t1.timestamp_begin)\
 from \"BOXX_15min20k\" t1\
 inner join\
 (select customer_id from \"BOXX_15min20k\"\
 where variable = 'solar_prod'\
 group by customer_id) t2\
 on t1.customer_id = t2.customer_id\
 where t1.variable = 'elec_cons_lt' or t1.variable = 'elec_cons_ht'\
 group by date(t1.timestamp_begin)"

 const avg_elec_cons_daily_nonsolar =
 "select sum(t1.value)/count(t1.customer_id) as avg_cons, date(t1.timestamp_begin)\
 from \"BOXX_15min20k\" t1\
 inner join\
 (select customer_id from \"BOXX_15min20k\"\
 group by customer_id) t2\
 on t1.customer_id = t2.customer_id\
 where t1.variable = 'elec_cons_lt' or t1.variable = 'elec_cons_ht'\
 group by date(t1.timestamp_begin)"

const getTestQuery = (request, response) => {
  var solar_data; 
  var nonsolar_data;
  var api_data = [];
  const length_date_format = 15; // |Thu Apr 05 2018| = 15

  pool.query(avg_elec_cons_daily_solar, (error, results) => {
    if (error) {
      throw error
    }
    solar_data = results.rows;
    var itr_date; 
    var itr_cons;
    for (item of solar_data) {
      itr_date = item["date"].toString();
      itr_date = itr_date.substring(0,length_date_format);
      itr_cons = item["avg_cons"];
      api_data.push({date: itr_date, avg_cons_solar: itr_cons});
    }

    pool.query(avg_elec_cons_daily_nonsolar, (error, results) => {
      if (error) {
        throw error
      }
      nonsolar_data = results.rows;
      for (item of nonsolar_data) {
        itr_date = item["date"].toString();
        itr_date = itr_date.substring(0,length_date_format);  
        itr_cons = item["avg_cons"];
        var i;
        for (i = 0; i < api_data.length; i++) {
          if (api_data[i]["date"] === itr_date) {
            api_data[i].avg_cons_nonsolar = itr_cons;
          }
        }
      }
      response.status(200).send(api_data);
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
    getTestQuery,
    createTest
}