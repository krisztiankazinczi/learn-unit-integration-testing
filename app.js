const express = require('express');
const port = 3000;
const app = express();

const mongodb = require('./models/mongodb.utils');

const employeeRoutes = require('./routes/employee-routes');

app.use(express.json());

app.use('/api', employeeRoutes);

mongodb.connect();

app.listen(port, () => console.log(`App is running on port: ${port}`));
