# Engie - Insight The boxx backend
Before starting the project run: 
``` npm install ```

To start the project run:
```npm start```

This will start the API using nodemon. Using nodemon your process will automatically restart when your code changes.

The API will start at http://localhost:9000/

## Routes

http://localhost:9000/api/ : GET - To check if the API is working.

http://localhost:9000/api/test : GET - Test route for displaying JSON data from the test table.

http://localhost:9000/api/test : PUSH - route for adding test data using params for example: http://localhost:9000/api/add?testid=1&texttest=this is a test

http://localhost:9000/api/allaverages : GET - To get averages for electricity, water, gas, room temperature, daily solar production and daily electricity injection

http://localhost:9000/api/solar/daily : GET - To get the comparison of electricity consumption of users with and without solar panels by day

http://localhost:9000/api/solar/weekly : GET - To get the comparison of electricity consumption of users with and without solar panels by week

http://localhost:9000/api/solar/monthly : GET - To get the comparison of electricity consumption of users with and without solar panels by month

http://localhost:9000/api/solar/solarzip : GET - To get the comparison of electricity consumption of users with and without solar panels by day

http://localhost:9000/api/solarzip/:id : GET - To get the average solar production (by day) of a certain area (zipcode) or the closest area in case no values are available

## Queries

**_funfact.js_**  :
  -avgRoomTemp : Returns the average room temperature from the room temperature table (ordered by day)
  -avgGasCons : Returns the average yearly gas consumption from the gas_cons_day table (ordered by day)
  -avgWaterCons : Returns the average yearly water consumption from the water_cons_day table (ordered by day)
  -avgElecCons : Returns the average yearly electric consumption from the elec_cons_day table (ordered by day)
  -avgElecInjec : Returns the average yearly electric injection from the elec_inje_day table (ordered by day)
  -avgSolarProd : Returns the average yearly gas consumption from the solar_prod_day table (ordered by day)
  
**_solar.js_**  :
  elec_cons_solar_monthly : Returns the
  elec_cons_nonsolar_monthly :
  elec_cons_solar_weekly :
  elec_cons_nonsolar_weekly :
  elec_cons_solar_daily :
  elec_cons_nonsolar_daily :

## License
![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)
