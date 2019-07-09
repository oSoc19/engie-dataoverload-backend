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

const elec_cons_solar_monthly =
"SELECT extract(month from elec_t.date) as datepart, sum(elec_t.value)/count(elec_t.customer_id) as avg_cons_solar \
from elec_cons_day elec_t \
inner join\
(SELECT customer_id \
from solar_prod_day \
group by customer_id) solar_t \
on elec_t.customer_id = solar_t.customer_id \
group by datepart \
order by datepart"

const elec_cons_nonsolar_monthly =
"SELECT extract(month from elec_t.date) as datepart, sum(elec_t.value)/count(elec_t.customer_id) as avg_cons_nonsolar \
from elec_cons_day elec_t \
inner join\
(SELECT customer_id \
from elec_cons_day \
group by customer_id \
except \
select customer_id \
from solar_prod_day \
group by customer_id) non_solar_t \
on elec_t.customer_id = non_solar_t.customer_id \
group by datepart \
order by datepart"

const getSolarMonthly = (request, response) => {
  var nonsolar_data;
  // final output data contain entries with date, solar-cons, nonsolar-cons
  var api_data;
  const length_date_format = 15; // |Thu Apr 05 2018| = 15

  pool.query(elec_cons_solar_monthly, (error, results) => {
    if (error) {
      throw error
    }
    api_data = results.rows;
    console.log(api_data);
    pool.query(elec_cons_nonsolar_monthly, (error, results) => {
      if (error) {
        throw error
      }
      nonsolar_data = results.rows;
      for (item of nonsolar_data) {
        console.log(item["datepart"]);
        for (i = 0; i < api_data.length; i++) {
          if (api_data[i]["datepart"] === item["datepart"]) {
            api_data[i].avg_cons_nonsolar = item["avg_cons_nonsolar"];
          }
        } 
      }
    response.status(200).send(api_data);
    })
  })
};

const getSolarAndNonSolarConsumption = (request, response) => {
  var solar_data; 
  var nonsolar_data;
  // final output data contain entries with date, solar-cons, nonsolar-cons
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

module.exports = {
  getSolarMonthly,
  getSolarAndNonSolarConsumption,
}