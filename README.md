# School website

## Start

> production mode:
```
npm i && node server.js
```
go to http://localhost:3000/ and enter your username and password (school account) then you will see your grades, schedules, info and absences.

> start in debug mode:

go to index and menu folder, then change URL variable value to 'http://localhost:4200/' (default is document.location.href)
and run this :
```
ng serve --configration=es5 && node server.js && start http://localhost:4200/ 
```

## Build 
```
ng build --prod
```



