# currency-converter

azure server: 
https://dijokas-converter.azurewebsites.net/

To run app on your local server and to save data to local database:

1. public/js/script.js  -- line 85

  add 'http://localhost:3000' before '/calculate?currencyOne....'

2. src/util/fetch-data.js  -- line 8

  comment out line 8

  uncomment line 9
  
3. index.js  -- line 11

  uncomment line 11

  comment out line 12
  
4. Optional: download robo 3t platform 
https://robomongo.org/
