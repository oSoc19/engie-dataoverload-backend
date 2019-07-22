var SQL = require('sql-template-strings')

const url = require('url')
 
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
/*
const pool = new Pool({
  user: 'docker',
  host: 'localhost',
  database: 'docker',
  password: 'docker',
  port: 5432
})*/

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

const elec_cons_solar_monthly = (SQL
`select datepart, avg(sum_month) as avg_cons_solar
from (SELECT t1.customer_id, extract(month from t1.date) as datepart, sum(t1.value) as sum_month 
  from elec_cons_day as t1
  inner join
    (SELECT customer_id 
    from solar_prod_day
    group by customer_id) solar_t 
  on t1.customer_id = solar_t.customer_id
  group by t1.customer_id, datepart) as t2
group by datepart
order by datepart`
)

const elec_cons_nonsolar_monthly = (SQL
`select datepart, avg(sum_month) as avg_cons_nonsolar
from (
  SELECT t1.customer_id, extract(month from t1.date) as datepart, sum(t1.value) as sum_month 
  from elec_cons_day as t1
  inner join
    (SELECT customer_id
    from elec_cons_day
    group by customer_id
    except
    select customer_id
    from solar_prod_day
    group by customer_id) non_solar_t 
  on t1.customer_id = non_solar_t.customer_id
  group by t1.customer_id, datepart
) as t2
group by datepart`
)

const elec_cons_solar_weekly = (SQL
`select datepart, avg(sum_week) as avg_cons_solar
from (SELECT t1.customer_id, extract(week from t1.date) as datepart, sum(t1.value) as sum_week 
  from elec_cons_day as t1
  inner join
    (SELECT customer_id 
    from solar_prod_day
    group by customer_id) solar_t 
  on t1.customer_id = solar_t.customer_id
  group by t1.customer_id, datepart) as t2
group by datepart
order by datepart`
)

const elec_cons_nonsolar_weekly = (SQL
`select datepart, avg(sum_week) as avg_cons_nonsolar
from (
  SELECT t1.customer_id, extract(week from t1.date) as datepart, sum(t1.value) as sum_week 
  from elec_cons_day as t1
  inner join
    (SELECT customer_id
    from elec_cons_day
    group by customer_id
    except
    select customer_id
    from solar_prod_day
    group by customer_id) non_solar_t 
  on t1.customer_id = non_solar_t.customer_id
  group by t1.customer_id, datepart
) as t2
group by datepart`
)

const elec_cons_solar_daily =
"SELECT date_part('dow', date) as datepart, sum(elec_t.value)/count(elec_t.customer_id) as avg_cons_solar \
from elec_cons_day elec_t \
inner join\
(SELECT customer_id \
from solar_prod_day \
group by customer_id) solar_t \
on elec_t.customer_id = solar_t.customer_id \
group by datepart \
order by datepart"

const elec_cons_nonsolar_daily =
"SELECT date_part('dow', date) as datepart, sum(elec_t.value)/count(elec_t.customer_id) as avg_cons_nonsolar \
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

const getSolarWeekly = (request, response) => {
  var nonsolar_data;
  // final output data contain entries with date, solar-cons, nonsolar-cons
  var api_data;
  const length_date_format = 15; // |Thu Apr 05 2018| = 15

  pool.query(elec_cons_solar_weekly, (error, results) => {
    if (error) {
      throw error
    }
    api_data = results.rows;
    console.log(api_data);
    pool.query(elec_cons_nonsolar_weekly, (error, results) => {
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

const getSolarDaily = (request, response) => {
  var nonsolar_data;
  // final output data contain entries with date, solar-cons, nonsolar-cons
  var api_data;
  const length_date_format = 15; // |Thu Apr 05 2018| = 15

  pool.query(elec_cons_solar_daily, (error, results) => {
    if (error) {
      throw error
    }
    api_data = results.rows;
    console.log(api_data);
    pool.query(elec_cons_nonsolar_daily, (error, results) => {
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
  getSolarWeekly,
  getSolarDaily,
  getSolarAndNonSolarConsumption,
}
