# School website

## Start

> production mode:
```cmd
npm i && ng build --prod && node server.js
```
go to http://localhost:3000/ and enter your username and password (school account) then you will see your grades, schedules, info and absences.

> start in debug mode:

go to index and menu folder, then change URL variable value to 'http://localhost:4200/' (default is document.location.href)
and run this :
```cmd
ng serve --configration=es5 && start http://localhost:4200/ && node server.js
```

## Build 
```cmd
ng build --prod
```



