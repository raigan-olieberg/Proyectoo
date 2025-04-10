import firebase from '../../firebase.js';
import {
  getFirestore,
  collection,
  getDocs,
  limit,
  query as firestoreQuery,
  where,
  orderBy,
  startAfter,
  Timestamp
} from 'firebase/firestore';
import { 
    GLOBALFUNC__GetUser,
    GLOBALFUNC__GetProject,
    GLOBALFUNC__GetPhase,
    GLOBALFUNC__GetTask
} from '../../Global/GlobalFunctions.js';

const db = getFirestore(firebase);


export const getDayviewResourcePlanningForAdmin = async (req, res, next) => {
    let planningData = {};
    planningData['planning'] = null;
    planningData['last_visible'] = null;
    let planningQuery = null;

    try {
        planningQuery = firestoreQuery(
            collection(
                db, 
                'resource_planning'
            ),
            where('organization_id', '==', req.body.organization_id),
            where('day', '==', req.body.day),
            orderBy('date_added', 'desc'),
            limit(20)
        );
        const planningSnap = await getDocs(planningQuery);

        if(!planningSnap.empty){
            planningData.planning = [];
            planningSnap.forEach(doc => {
                planningData.planning.push({
                    planning_id: doc.id,
                    organization_id: doc.data().organization_id,
                    day: doc.data().day,
                    endtime: doc.data().endtime,
                    month: doc.data().month,
                    phase_id: doc.data().phase_id,
                    project_id: doc.data().project_id,
                    starttime: doc.data().starttime,
                    task_id: doc.data().task_id,
                    week: doc.data().week,
                    year: doc.data().year,
                    manager_id: doc.data().manager_id,
                    date_added: doc.data().date_added,
                    assigned_to: doc.data().assigned_to
                });
            });

            if(planningData.planning.length == 20){
                planningData.last_visible = planningData.planning[planningData.planning.length - 1].date_added;
            } else {
                planningData.last_visible = null;
            }

            await Promise.all(
                planningData.planning.map(planning => {
                    return Promise.all([
                        GLOBALFUNC__GetProject (
                            planning.project_id
                        ),
                        GLOBALFUNC__GetPhase(
                            planning.phase_id
                        ),
                        GLOBALFUNC__GetTask(
                            planning.task_id
                        ),
                        GLOBALFUNC__GetUser(
                            planning.assigned_to
                        )
                    ]).then(data => {
                        planning['project'] = data[0].data().name;
                        planning['phase'] = data[1].data().name;
                        planning['task'] = data[2].data().name;
                        planning['assigned_to'] = data[3];
                    });
                })
            );
        }

        res.status(200).send({
            response: 'successfull',
            message: planningData
        });

    } catch (error) {
        res.status(400).send({
            response: 'error',
            message: error.message 
        });
    }
}

export const getWeekviewResourcePlanningForAdmin = async (req, res, next) => {
    let planningData = {};
    planningData['planning'] = null;
    planningData['last_visible'] = null;
    let planningQuery = null;


    try {
        if(req.body.last_visible == null){
            planningQuery = firestoreQuery(
                collection(
                    db, 
                    'resource_planning'
                ),
                where('organization_id', '==', req.body.organization_id),
                where('week', '==', req.body.week),
                orderBy('date', 'asc'),
                limit(5)
            );
        } else {
            planningQuery = firestoreQuery(
                collection(
                    db, 
                    'resource_planning'
                ),
                where('organization_id', '==', req.body.organization_id),
                where('week', '==', req.body.week),
                orderBy('date', 'asc'),
                startAfter(Timestamp.fromMillis(req.body.last_visible.seconds * 1000)),
                limit(5)
            );
        }
        const planningSnap = await getDocs(planningQuery);

        if(!planningSnap.empty){
            planningData.planning = [];
            planningSnap.forEach(doc => {
                planningData.planning.push({
                    planning_id: doc.id,
                    organization_id: doc.data().organization_id,
                    day: doc.data().day,
                    endtime: doc.data().endtime,
                    month: doc.data().month,
                    phase_id: doc.data().phase_id,
                    project_id: doc.data().project_id,
                    starttime: doc.data().starttime,
                    task_id: doc.data().task_id,
                    week: doc.data().week,
                    year: doc.data().year,
                    manager_id: doc.data().manager_id,
                    date_added: doc.data().date_added,
                    assigned_to: doc.data().assigned_to,
                    date: doc.data().date
                });
            });

            if(planningData.planning.length == 5){
                planningData.last_visible = planningData.planning[planningData.planning.length - 1].date;
            } else {
                planningData.last_visible = 'end_has_been_reached';
            }

            await Promise.all(
                planningData.planning.map(planning => {
                    return Promise.all([
                        GLOBALFUNC__GetProject (
                            planning.project_id
                        ),
                        GLOBALFUNC__GetPhase(
                            planning.phase_id
                        ),
                        GLOBALFUNC__GetTask(
                            planning.task_id
                        ),
                        GLOBALFUNC__GetUser(
                            planning.assigned_to
                        )
                    ]).then(data => {
                        planning['project'] = data[0].data().name;
                        planning['phase'] = data[1].data().name;
                        planning['task'] = {
                            name: data[2].data().name,
                            status: data[2].data().status
                        };
                        planning['assigned_to'] = data[3];
                    });
                })
            );
        }

        res.status(200).send({
            response: 'successfull',
            message: planningData
        });

    } catch (error) {
        res.status(400).send({
            response: 'error',
            message: error.message 
        });
    }
}