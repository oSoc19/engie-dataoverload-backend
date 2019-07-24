# Engie - Insight the boxx backend

The goal of this project is to deliver insights based on consumption data from consumers.
The project took place at the Belgian edition of [Open Summer of Code 2019](https://2019.summerofcode.be/) and the data is provided by [Engie](https://www.engie-electrabel.be/fr/). 

## Installation
Before starting the project run: 
``` npm install ```

To start the project run:
```npm start```

This will start the API using nodemon. Using nodemon your process will automatically restart when your code changes.

The API will start at http://localhost:9000/.

If you want to use docker for your PostgreSQL database, follow the instructions in the [README](https://github.com/oSoc19/engie-dataoverload-backend/blob/master/docker/README.md) of the `docker/` folder.

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
Here is a description of all SQL queries that are implemented in files of the `queries/` folder.


**_funfact.js_**  :

  - `avgRoomTemp` Returns the average room temperature from the room temperature table (ordered by day)
  
  - `avgGasCons` Returns the average yearly gas consumption from the gas_cons_day table (ordered by day)
  
  - `avgWaterCons` Returns the average yearly water consumption from the water_cons_day table (ordered by day)
  
  - `avgElecCons` Returns the average yearly electric consumption from the elec_cons_day table (ordered by day)
  
  - `avgElecInjec` Returns the average yearly electric injection from the elec_inje_day table (ordered by day)
  
  - `avgSolarProd` Returns the average yearly gas consumption from the solar_prod_day table (ordered by day)
  
**_solar.js_**  :

  - `elec_cons_solar_monthly` Returns the average *monthly* electric consumption of customers having solar panels.
  
  - `elec_cons_nonsolar_monthly` Returns the average *monthly* electric consumption of customers that don't have solar panels.
  
  - `elec_cons_solar_weekly` Returns the average *weekly* electric consumption of customers having solar panels.
  
  - `elec_cons_nonsolar_weekly` Returns the average *weekly* electric consumption of customers that don't have solar panels.
  
  - `elec_cons_solar_daily` Returns the average *daily* electric consumption of customers having solar panels.
  
  - `elec_cons_nonsolar_daily` Returns the average *daily* electric consumption of customers that don't have solar panels.

## License
![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)
