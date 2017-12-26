# Widgets-R-Us Host app

The structure goes as such: the entry point to the app is technically
/bin/www.js, however, the main application flow exists inside the app.js file.
Once a request gets through app.js it is routed via the files under /routes/* to the service layer
The routes layer parses a request into the fields relevant to the request and awaits
a response from the respective service call. The service call can respond with
either a 2xx http status code or 4xx http status code via an ApiResponse object.
The ApiResponse object has a status code and a message. The service layer may use data access
objects or use the Model objects directly to hit the database. The application's model
is in a separate npm package called '@widgets-r-us/model'. You can navigate to that
package's README for more info on the Model and how it's implemented.