import firebase from '../firebase.js';
import {
  getFirestore,
  doc,
  updateDoc,
  query as firestoreQuery,
} from 'firebase/firestore';
import { 
    GLOBALFUNC__UpdateMonthAnalyticsForOrganization__WorkedHours,
    GLOBALFUNC__UpdateWeekAnalyticsForOrganization__WorkedHours,
    GLOBALFUNC__UpdateMonthAnalyticsForManager__WorkedHours,
    GLOBALFUNC__UpdateWeekAnalyticsForManager__WorkedHours,
    GLOBALFUNC__UpdateMonthAnalyticsForResource__WorkedHours,
    GLOBALFUNC__UpdateWeekAnalyticsForResource__WorkedHours
} from '../Global/GlobalFunctions.js';

const db = getFirestore(firebase);


export const updateWorkedHourStatus = async (req, res, next) => {
    try {
        const workedhourData = {
            status: req.body.new_status,
            rejection_reason: req.body.rejection_reason
        }
        const workedhourDoc = updateDoc(
            doc(
                db, 
                'worked_hours',
                req.body.workedhour_id
            ), 
            workedhourData
        );
        const organizationMonthDoc = GLOBALFUNC__UpdateMonthAnalyticsForOrganization__WorkedHours(
            req.body.organization_id,
            req.body.year,
            req.body.month,
            req.body.old_status,
            req.body.new_status
        );
        const organizationWeekDoc = GLOBALFUNC__UpdateWeekAnalyticsForOrganization__WorkedHours(
            req.body.organization_id,
            req.body.year,
            req.body.week,
            req.body.old_status,
            req.body.new_status
        );
        const managerMonthDoc = GLOBALFUNC__UpdateMonthAnalyticsForManager__WorkedHours(
            req.body.manager_id,
            req.body.year,
            req.body.month,
            req.body.old_status,
            req.body.new_status
        );
        const managerWeekDoc = GLOBALFUNC__UpdateWeekAnalyticsForManager__WorkedHours(
            req.body.manager_id,
            req.body.year,
            req.body.week,
            req.body.old_status,
            req.body.new_status
        );
        const resourceMonthDoc = GLOBALFUNC__UpdateMonthAnalyticsForResource__WorkedHours(
            req.body.user_id,
            req.body.year,
            req.body.month,
            req.body.old_status,
            req.body.new_status,
            req.body.hours
        );
        const resourceWeekDoc = GLOBALFUNC__UpdateWeekAnalyticsForResource__WorkedHours(
            req.body.user_id,
            req.body.year,
            req.body.week,
            req.body.old_status,
            req.body.new_status,
            req.body.hours
        );

        await Promise.all([
            workedhourDoc,
            organizationMonthDoc,
            organizationWeekDoc,
            managerMonthDoc,
            managerWeekDoc,
            resourceMonthDoc,
            resourceWeekDoc
        ]);
    
        res.status(200).send({
          response: 'successfull',
          message: ''
        });
    } catch (error) {
        res.status(400).send({
            response: 'error',
            message: error.message 
        });
    }
}

export const updateWorkedHour = async (req, res, next) => {
    try {
        const workedhourData = {
            hours: parseFloat(req.body.hours.toString().replace(',', '.')).toFixed(2),
            kilometers_traveled: parseFloat(req.body.kilometers_traveled.toString().replace(',','.')).toFixed(2)
        }
        await updateDoc(
            doc(
                db, 
                'worked_hours',
                req.body.workedhour_id
            ), 
            workedhourData
        );

        res.status(200).send({
            response: 'successfull',
            message: ''
        });
    } catch (error) {
        res.status(400).send({
            response: 'error',
            message: error.message 
        });
    }
}
