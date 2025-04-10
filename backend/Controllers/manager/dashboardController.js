import firebase from '../../firebase.js';
import {
  getFirestore,
  query as firestoreQuery
} from 'firebase/firestore';
import { 
  getWeek,
  startOfWeek,
  endOfWeek
} from 'date-fns';
import { 
  GLOBALFUNC__MonthNames,
  GLOBALFUNC__GetAnalytics__Projects,
  GLOBALFUNC__GetAnalytics__Tasks,
  GLOBALFUNC__GetAnalyticsForOrganization__WorkedHours,
  GLOBALFUNC__GetAnalytics__problems,
  GLOBALFUNC__GetActivities,
  GLOBALFUNC__CompleteActivityData
} from '../../Global/GlobalFunctions.js';

const db = getFirestore(firebase);


export const getData = async (req, res, next) => {
    const dateToday = new Date();
    const currentYear = dateToday.getFullYear();
    const currentDay = dateToday.getDate();
    const currentMonth = dateToday.getMonth() + 1;
    const today = `${currentDay}-${currentMonth}-${currentYear}`;
    
    try {
      // Get analytics
      let dashboardData = {
        worked_hours: {
          analytics: null,
          month: `Ingevuld voor deze maand (${GLOBALFUNC__MonthNames[dateToday.getMonth()]})`,
          week: `Ingevuld voor deze week (week ${getWeek(dateToday)}, ${startOfWeek(dateToday, {weekStartsOn: 1}).getDate()} 
          ${GLOBALFUNC__MonthNames[startOfWeek(dateToday, {weekStartsOn: 1}).getMonth()]} t/m ${endOfWeek(dateToday, {weekStartsOn: 1}).getDate()}
          ${GLOBALFUNC__MonthNames[endOfWeek(dateToday, {weekStartsOn: 1}).getMonth()]})`
        },
        projects: null,
        tasks: null,
        activities: null,
        problems: null
      };
        
      const workedHoursDoc = GLOBALFUNC__GetAnalyticsForOrganization__WorkedHours(
        req.body.organization_id,
        currentYear
      );

      const projectsDoc = GLOBALFUNC__GetAnalytics__Projects(
        req.body.organization_id
      );

      const tasksDoc = GLOBALFUNC__GetAnalytics__Tasks(
        req.body.organization_id
      );
  
      const problemsDoc = GLOBALFUNC__GetAnalytics__problems(
        req.body.organization_id
      );

      // Get activities
      const activitiesSnap = GLOBALFUNC__GetActivities(
        req.body.organization_id,
        today
      );

      let tempActivities = [];
      await Promise.all([
        workedHoursDoc,
        projectsDoc,
        tasksDoc,
        problemsDoc,
        activitiesSnap
      ]).then(data => {
        if(data[0].exists()){
          dashboardData.worked_hours.analytics = data[0].data();
        }
        dashboardData.projects = data[1].data();
        dashboardData.tasks = data[2].data();
        dashboardData.problems = data[3].data();
        if(!data[4].empty){
          dashboardData.activities = [];
          data[4].forEach(doc => {
            tempActivities.push({
              ...doc.data(),
              activity_id: doc.id
            });
          });
        }
      });

      dashboardData.activities = await GLOBALFUNC__CompleteActivityData(
        tempActivities,
        req.body.organization_id
      );

      res.status(200).send({
        response: 'successfull',
        message: dashboardData
      });
    } catch (error) {
      res.status(400).send({
        response: 'error',
        message: error.message 
      });
    }
  }