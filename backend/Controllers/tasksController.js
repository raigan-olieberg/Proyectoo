import firebase from '../firebase.js';
import {
  getFirestore,
  query as firestoreQuery,
} from 'firebase/firestore';
import { 
    GLOBALFUNC__CreateActivity,
} from '../Global/GlobalFunctions.js';

const db = getFirestore(firebase);

export const createMessageActivity = async (req, res, next) => {
    try {
        /*if(req.body.assigned_to.length > 0){
            req.body.assigned_to.map(user => {
                userIdsForActivity.push(user.user_id);
            });
        }*/
        await GLOBALFUNC__CreateActivity(
            req.body.dateForActivity,
            'task_message_added',
            req.body.organization_id,
            req.body.manager_id,
            [req.body.user_id],
            req.body.phase_id,
            req.body.project_id,
            req.body.task_id,
            req.body.message
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

