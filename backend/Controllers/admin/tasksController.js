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
    GLOBALFUNC__GetAnArrayOfTasks__WithAllData
} from '../../Global/GlobalFunctions.js';

const db = getFirestore(firebase);


export const getTasksForAdmin = async (req, res, next) => {
    let tasksData = {};
    tasksData['tasks'] = [];
    tasksData['last_visible'] = null;
    let tasksQuery = null;
    const dateToday = new Date(req.body.date_today);
    dateToday.setHours(0, 0, 0, 0);

    try {
        console.log(req.body);
        if(req.body.sort_filter.key == 'show_all'){
            if(req.body.last_visible == null){
                tasksQuery = firestoreQuery(
                    collection(
                        db, 
                        'tasks'
                    ),
                    where('organization_id', '==', req.body.organization_id),
                    orderBy('date_added', 'desc'),
                    limit(20)
                )
            } else {
                tasksQuery = firestoreQuery(
                    collection(
                        db, 
                        'tasks'
                    ),
                    where('organization_id', '==', req.body.organization_id),
                    orderBy('date_added', 'desc'),
                    startAfter(Timestamp.fromMillis(req.body.last_visible.seconds * 1000)),
                    limit(20)
                )
            }
        } else if(req.body.sort_filter.key == 'show_all_from_me') {
            if(req.body.last_visible == null){
                tasksQuery = firestoreQuery(
                    collection(
                        db, 
                        'tasks'
                    ),
                    where('organization_id', '==', req.body.organization_id),
                    where('manager_id', '==', req.body.manager_id),
                    orderBy('date_added', 'desc'),
                    limit(20)
                )
            } else {
                console.log(req.body.last_visible);
                tasksQuery = firestoreQuery(
                    collection(
                        db, 
                        'tasks'
                    ),
                    where('organization_id', '==', req.body.organization_id),
                    where('manager_id', '==', req.body.manager_id),
                    orderBy('date_added', 'desc'),
                    startAfter(Timestamp.fromMillis(req.body.last_visible.seconds * 1000)),
                    limit(20)
                )
            }
        } else if(req.body.sort_filter.key == 'show_all_assigned_to_me') {
            if(req.body.last_visible == null){
                tasksQuery = firestoreQuery(
                    collection(
                        db, 
                        'tasks'
                    ),
                    where('organization_id', '==', req.body.organization_id),
                    where('assigned_to', 'array-contains', req.body.manager_id),
                    orderBy('date_added', 'desc'),
                    limit(20)
                )
            } else {
                console.log(req.body.last_visible);
                tasksQuery = firestoreQuery(
                    collection(
                        db, 
                        'tasks'
                    ),
                    where('organization_id', '==', req.body.organization_id),
                    where('assigned_to', 'array-contains', req.body.manager_id),
                    orderBy('date_added', 'desc'),
                    startAfter(Timestamp.fromMillis(req.body.last_visible.seconds * 1000)),
                    limit(20)
                )
            }
        } else {
            if(req.body.last_visible == null){
                if(req.body.sort_filter.value == 'overdue'){
                    tasksQuery = firestoreQuery(
                        collection(
                            db,
                            'tasks'
                        ),
                        where('organization_id', '==', req.body.organization_id),
                        where('deadline', '<', dateToday),
                        orderBy('date_added', 'desc'),
                        limit(20)
                    )
                } else {
                    tasksQuery = firestoreQuery(
                        collection(
                            db,
                            'tasks'
                        ),
                        where('organization_id', '==', req.body.organization_id),
                        where('status', '==', req.body.sort_filter.value),
                        where('deadline', '>', dateToday),
                        orderBy('date_added', 'desc'),
                        limit(20)
                    )
                }
            } else {
                if(req.body.sort_filter.value == 'overdue'){
                    tasksQuery = firestoreQuery(
                        collection(
                            db,
                            'tasks'
                        ),
                        where('organization_id', '==', req.body.organization_id),
                        where('deadline', '<', dateToday),
                        orderBy('date_added', 'desc'),
                        startAfter(Timestamp.fromMillis(req.body.last_visible.seconds * 1000)),
                        limit(20)
                    )
                } else {
                    tasksQuery = firestoreQuery(
                        collection(
                            db,
                            'tasks'
                        ),
                        where('organization_id', '==', req.body.organization_id),
                        where('status', '==', req.body.sort_filter.value),
                        where('deadline', '>', dateToday),
                        orderBy('date_added', 'desc'),
                        startAfter(Timestamp.fromMillis(req.body.last_visible.seconds * 1000)),
                        limit(20)
                    )
                }
            }
        }
        
        const tasksSnap = await getDocs(tasksQuery);
        tasksData = await GLOBALFUNC__GetAnArrayOfTasks__WithAllData(
            tasksSnap,
            tasksData,
            {
                date_today: dateToday
            }
        );

        res.status(200).send({
            response: 'successfull',
            message: tasksData
        });

    } catch (error) {
        res.status(400).send({
            response: 'error',
            message: error.message 
        });
    }
}