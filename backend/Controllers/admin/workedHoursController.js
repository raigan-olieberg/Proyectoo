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
    GLOBALFUNC__GetAnalyticsForResource__WorkedHours,
    GLOBALFUNC__GetAnalyticsForOrganization__WorkedHours,
    GLOBALFUNC__GetUser,
    GLOBALFUNC__GetProject,
    GLOBALFUNC__GetPhase,
    GLOBALFUNC__GetTask
} from '../../Global/GlobalFunctions.js';

const db = getFirestore(firebase);


export const getResourcesAnalyticsForAdmin = async (req, res, next) => {
    let analyticsData = {};
    analyticsData['resources'] = null;
    analyticsData['last_visible'] = null;
    analyticsData['organization'] = null;
    let resourcesQuery = null;

    try {
        if(req.body.last_visible == null){
            resourcesQuery = firestoreQuery(
                collection(
                    db, 
                    'users'
                ),
                where('organization_id', '==', req.body.organization_id),
                //where('status', '!=', 'Inactive'),
                orderBy('date_added', 'desc'),
                limit(20)
            );
        } else {
            resourcesQuery = firestoreQuery(
                collection(
                    db, 
                    'users'
                ),
                where('organization_id', '==', req.body.organization_id),
                //where('status', '!=', 'Inactive'),
                orderBy('date_added', 'desc'),
                startAfter(Timestamp.fromMillis(req.body.last_visible.seconds * 1000)),
                limit(20)
            );
        }
        const usersSnap = await getDocs(resourcesQuery);

        if(!usersSnap.empty){
            analyticsData = {};
            analyticsData.resources = [];
            usersSnap.forEach(doc => {
                analyticsData.resources.push({
                    user_id: doc.id,
                    firstname: doc.data().firstname,
                    lastname: doc.data().lastname,
                    profile_photo: doc.data().profile_photo,
                    email: doc.data().email,
                    phonenumber: doc.data().phonenumber,
                    status: doc.data().status,
                    role: doc.data().role,
                    label: doc.data().label,
                    admin: doc.data().admin,
                    date_added: doc.data().date_added
                });
            });

            if(analyticsData.resources.length == 20){
                analyticsData.last_visible = analyticsData.resources[analyticsData.resources.length - 1].date_added;
            } else {
                analyticsData.last_visible = null;
            }

            await Promise.all(
                analyticsData.resources.map(user => {
                    return Promise.all([
                        GLOBALFUNC__GetAnalyticsForResource__WorkedHours(
                            user.user_id,
                            req.body.current_year,
                            req.body.type,
                            req.body.month_or_week_value
                        )
                    ]).then(data => {
                        if(data[0].exists()){
                            user['analytics'] = data[0].data();
                        }
                    });
                })
            );
        }

        if(req.body.include_organization_analytics){
            const organizationWorkedHoursDoc = await GLOBALFUNC__GetAnalyticsForOrganization__WorkedHours(
                req.body.organization_id,
                req.body.current_year,
                req.body.type,
                req.body.month_or_week_value
            );
            if(organizationWorkedHoursDoc.exists()){
                analyticsData.organization = organizationWorkedHoursDoc.data();
            }
        }

        res.status(200).send({
            response: 'successfull',
            message: analyticsData
        });
    } catch (error) {
        res.status(400).send({
            response: 'error',
            message: error.message 
        });
    }
}

export const getResourcesWorkedHoursForAdmin = async (req, res, next) => {
    let workedHoursData = {};
    workedHoursData['last_visible'] = null;
    workedHoursData['items'] = null;
    let workedHoursQuery = null;

    try {
        if(req.body.key_filter.key == 'monthsview'){
            if(req.body.sort_filter.key == 'show_all'){
                if(req.body.last_visible == null){
                    workedHoursQuery = firestoreQuery(
                        collection(
                            db, 
                            'worked_hours'
                        ),
                        where('organization_id', '==', req.body.organization_id),
                        where('month', '==', (parseInt(req.body.key_filter.value) + 1)),
                        where('year', '==', req.body.current_year),
                        orderBy('date', 'desc'),
                        limit(20)
                    );
                } else {
                    workedHoursQuery = firestoreQuery(
                        collection(
                            db, 
                            'worked_hours'
                        ),
                        where('organization_id', '==', req.body.organization_id),
                        where('month', '==', (parseInt(req.body.key_filter.value) + 1)),
                        where('year', '==', req.body.current_year),
                        orderBy('date', 'desc'),
                        startAfter(Timestamp.fromMillis(req.body.last_visible.seconds * 1000)),
                        limit(20)
                    );
                }
            } else {
                if(req.body.last_visible == null){
                    workedHoursQuery = firestoreQuery(
                        collection(
                            db, 
                            'worked_hours'
                        ),
                        where('organization_id', '==', req.body.organization_id),
                        where('month', '==', (parseInt(req.body.key_filter.value) + 1)),
                        where('year', '==', req.body.current_year),
                        where('status', '==', req.body.sort_filter.value),
                        orderBy('date', 'desc'),
                        limit(20)
                    );
                } else {
                    workedHoursQuery = firestoreQuery(
                        collection(
                            db, 
                            'worked_hours'
                        ),
                        where('organization_id', '==', req.body.organization_id),
                        where('month', '==', (parseInt(req.body.key_filter.value) + 1)),
                        where('year', '==', req.body.current_year),
                        where('status', '==', req.body.sort_filter.value),
                        orderBy('date', 'desc'),
                        startAfter(Timestamp.fromMillis(req.body.last_visible.seconds * 1000)),
                        limit(20)
                    );
                }
            }
        } else {
            if(req.body.sort_filter.key == 'show_all'){
                if(req.body.last_visible == null){
                    workedHoursQuery = firestoreQuery(
                        collection(
                            db, 
                            'worked_hours'
                        ),
                        where('organization_id', '==', req.body.organization_id),
                        where('week', '==', parseInt(req.body.key_filter.value)),
                        where('year', '==', req.body.current_year),
                        orderBy('date', 'desc'),
                        limit(20)
                    );
                } else {
                    workedHoursQuery = firestoreQuery(
                        collection(
                            db, 
                            'worked_hours'
                        ),
                        where('organization_id', '==', req.body.organization_id),
                        where('week', '==', parseInt(req.body.key_filter.value)),
                        where('year', '==', req.body.current_year),
                        orderBy('date', 'desc'),
                        startAfter(Timestamp.fromMillis(req.body.last_visible.seconds * 1000)),
                        limit(20)
                    );
                }
            } else {
                if(req.body.last_visible == null){
                    workedHoursQuery = firestoreQuery(
                        collection(
                            db, 
                            'worked_hours'
                        ),
                        where('organization_id', '==', req.body.organization_id),
                        where('week', '==', parseInt(req.body.key_filter.value)),
                        where('year', '==', req.body.current_year),
                        where('status', '==', req.body.sort_filter.value),
                        orderBy('date', 'desc'),
                        limit(20)
                    );
                } else {
                    workedHoursQuery = firestoreQuery(
                        collection(
                            db, 
                            'worked_hours'
                        ),
                        where('organization_id', '==', req.body.organization_id),
                        where('week', '==', parseInt(req.body.key_filter.value)),
                        where('year', '==', req.body.current_year),
                        where('status', '==', req.body.sort_filter.value),
                        orderBy('date', 'desc'),
                        startAfter(Timestamp.fromMillis(req.body.last_visible.seconds * 1000)),
                        limit(20)
                    );
                }
            }
        }
        const workedHoursSnap = await getDocs(workedHoursQuery);

        if(!workedHoursSnap.empty){
            workedHoursData['items'] = [];
            workedHoursSnap.forEach(doc => {
                workedHoursData.items.push({
                    workedhour_id: doc.id,
                    date: doc.data().date,
                    hours: doc.data().hours,
                    kilometers_traveled: doc.data().kilometers_traveled,
                    month: doc.data().month,
                    organization_id: doc.data().organization_id,
                    phase_id: doc.data().phase_id,
                    project_id: doc.data().project_id,
                    status: doc.data().status,
                    task_id: doc.data().task_id,
                    user_id: doc.data().user_id,
                    week: doc.data().week,
                    year: doc.data().year,
                    rejection_reason: doc.data().rejection_reason
                });
            });

            if(workedHoursData.items.length == 20){
                workedHoursData.last_visible = workedHoursData.items[workedHoursData.items.length - 1].date;
            } else {
                workedHoursData.last_visible = null;
            }

            await Promise.all(
                workedHoursData.items.map(workedHour => {
                    return Promise.all([
                        GLOBALFUNC__GetUser(
                            [workedHour.user_id]
                        ),
                        GLOBALFUNC__GetProject (
                            workedHour.project_id
                        ),
                        GLOBALFUNC__GetPhase(
                            workedHour.phase_id
                        ),
                        GLOBALFUNC__GetTask(
                            workedHour.task_id
                        )
                    ]).then(data => {
                        workedHour['resource'] = data[0];
                        workedHour['project'] = data[1].data().name;
                        workedHour['phase'] = data[2].data().name;
                        workedHour['task'] = data[3].data().name;
                    });
                })
            );
        }

        res.status(200).send({
            response: 'successfull',
            message: workedHoursData
        });

    } catch (error) {
        res.status(400).send({
            response: 'error',
            message: error.message 
        });
    }
}