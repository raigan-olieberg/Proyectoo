import express from 'express';
import cors from 'cors';

import config from './config.js';
import accountRoute from './Routes/accountRoute.js';
import dashboardRoute from './Routes/dashboardRoute.js';
import resourceRoute from './Routes/resourceRoute.js';
import workedHoursRoute from './Routes/workedHoursRoute.js';
import problemsRoute from './Routes/problemsRoute.js';
import customerRoute from './Routes/customerRoute.js';
import tasksRoute from './Routes/tasksRoute.js';
import resourcePlanningRoute from './Routes/resourcePlanningRoute.js'

const app = express();

app.use(cors());
app.use(express.json());

//routes
app.use('/api', accountRoute);
app.use('/api', dashboardRoute);
app.use('/api', resourceRoute);
app.use('/api', workedHoursRoute);
app.use('/api', problemsRoute);
app.use('/api', customerRoute);
app.use('/api', tasksRoute);
app.use('/api', resourcePlanningRoute);


app.listen(config.port, () =>
  console.log(`Server is live @ ${config.hostUrl}`),
);