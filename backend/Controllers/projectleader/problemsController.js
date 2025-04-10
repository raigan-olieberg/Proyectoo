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
    GLOBALFUNC__GetAnArrayOfProblems
} from '../../Global/GlobalFunctions.js';

const db = getFirestore(firebase);


export const getProblemsForProjectleader = async (req, res, next) => {
    let problemsData = {};
    problemsData['problems'] = null;
    problemsData['last_visible'] = null;
    let prolemsQuery = null;

    try {
        if(req.body.sort_filter.key == 'show_all'){
            if(req.body.last_visible == null){
                prolemsQuery = firestoreQuery(
                    collection(
                        db, 
                        'problems'
                    ),
                    where('organization_id', '==', req.body.organization_id),
                    where('project_manager_id', '==', req.body.manager_id),
                    orderBy('date_added', 'desc'),
                    limit(20)
                )
            } else {
                prolemsQuery = firestoreQuery(
                    collection(
                        db, 
                        'problems'
                    ),
                    where('organization_id', '==', req.body.organization_id),
                    where('project_manager_id', '==', req.body.manager_id),
                    orderBy('date_added', 'desc'),
                    startAfter(Timestamp.fromMillis(req.body.last_visible.seconds * 1000)),
                    limit(20)
                )
            }
        } else if(req.body.sort_filter.key == 'priority') {
            if(req.body.last_visible == null){
                prolemsQuery = firestoreQuery(
                    collection(
                        db, 
                        'problems'
                    ),
                    where('organization_id', '==', req.body.organization_id),
                    where('priority', '==', req.body.sort_filter.value),
                    where('project_manager_id', '==', req.body.manager_id),
                    orderBy('date_added', 'desc'),
                    limit(20)
                )
            } else {
                prolemsQuery = firestoreQuery(
                    collection(
                        db, 
                        'problems'
                    ),
                    where('organization_id', '==', req.body.organization_id),
                    where('priority', '==', req.body.sort_filter.value),
                    where('project_manager_id', '==', req.body.manager_id),
                    orderBy('date_added', 'desc'),
                    startAfter(Timestamp.fromMillis(req.body.last_visible.seconds * 1000)),
                    limit(20)
                )
            }
        } else {
            if(req.body.last_visible == null){
                prolemsQuery = firestoreQuery(
                    collection(
                        db,
                        'problems'
                    ),
                    where('organization_id', '==', req.body.organization_id),
                    where('project_manager_id', '==', req.body.manager_id),
                    where('status', '==', req.body.sort_filter.value),
                    orderBy('date_added', 'desc'),
                    limit(20)
                )
            } else {
                prolemsQuery = firestoreQuery(
                    collection(
                        db,
                        'problems'
                    ),
                    where('organization_id', '==', req.body.organization_id),
                    where('project_manager_id', '==', req.body.manager_id),
                    where('status', '==', req.body.sort_filter.value),
                    orderBy('date_added', 'desc'),
                    startAfter(Timestamp.fromMillis(req.body.last_visible.seconds * 1000)),
                    limit(20)
                )
            }
        }
        
        const problemsSnap = await getDocs(prolemsQuery);
        problemsData = await GLOBALFUNC__GetAnArrayOfProblems(
            problemsSnap,
            problemsData
        );

        res.status(200).send({
            response: 'successfull',
            message: problemsData
        });

    } catch (error) {
        res.status(400).send({
            response: 'error',
            message: error.message 
        });
    }
}