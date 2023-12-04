# Air Quality
Node.js, Nest.js Rest Api to fetch air quality from IQAIR API

### Prequests   
 - [MongoDB] (https://www.mongodb.com/try/download/community)
### Dependencies  
- [Node.js](https://nodejs.org/en/)
- [Nest](https://github.com/nestjs/nest)
- [Mongoose](https://mongoosejs.com/)

## Running Application

- set ```.env``` file with environment variables needed
- API_KEY: IQAIR api key (https://www.iqair.com/fr/dashboard/api)
- MONGODB_URI: MongoDB connection string

```bash
# development mode to run Node.js application
$ npm install
$ npm start
```
## Unit Test

```bash
# use this command to run unit test
$ npm run test
```

## Integration Test

```bash
# use this command to run integration test
$ npm run test:int
```
