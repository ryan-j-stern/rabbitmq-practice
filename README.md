# Weather App with RabbitMQ

## Weather Service

### Routes and Requests

All routes in the weather service will start with **http://domain:PORT/weather**

#### POST

- url: /location

- body:
  {
  "location": String
  }

- responses:
  - 201 - Returns back a formatted string
  - 500 - Returns back a message of "Internal Service Error"
