import firebase from '../../firebase.js';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  limit,
  query as firestoreQuery,
  where,
  orderBy,
  startAfter,
  Timestamp
} from 'firebase/firestore';
import { 
    GLOBALFUNC__Task__ValidateName,
    GLOBALFUNC__Task__UpdateStatusToStuck,
    GLOBALFUNC__UpdateAnalyticsForOrganization__Tasks,
    GLOBALFUNC__UpdateAnalyticsForManager__Tasks,
    GLOBALFUNC__UpdateAnalyticsForProject__Tasks,
    GLOBALFUNC__UpdateAlgoliaSearch,
    GLOBALFUNC__UpdateAlgoliaSearch__Description,
    GLOBALFUNC__DeleteAlgoliaSearch,
    GLOBALFUNC__CreateActivity,
    GLOBALFUNC__GetAnArrayOfTasks__WithAllData,
    GLOBALFUNC__GetASingleTask__WithAllData
} from '../../Global/GlobalFunctions.js';

const db = getFirestore(firebase);

export const getTasksForManager = async (req, res, next) => {
    let tasksData = {};
    tasksData['tasks'] = [];
    tasksData['last_visible'] = null;
    let tasksQuery = null;
    const dateToday = new Date(req.body.date_today);
    dateToday.setHours(0, 0, 0, 0);

    try {
        if(req.body.sort_filter.key == 'show_all_from_me'){
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
                        where('manager_id', '==', req.body.manager_id),
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
                        where('manager_id', '==', req.body.manager_id),
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
                        where('manager_id', '==', req.body.manager_id),
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
                        where('manager_id', '==', req.body.manager_id),
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

export const updateTaskForManager = async (req, res, next) => {
    let responseSuccess = 'successfull';
    let responseMesssage = '';
    let promises = [];
    let activityObject = {};

    try {
        const formattedDeadline = new Date(req.body.task.formatted_deadline);
        formattedDeadline.setHours(0, 0, 0, 0);
        const dateToday = new Date(req.body.date_today);
        dateToday.setHours(0, 0, 0, 0);

        if(formattedDeadline < dateToday){
            responseSuccess = 'unsuccessfull';
            responseMesssage = 'date_before_today';
        }

        if(req.body.old_name != req.body.task.name){
            const validateName = await GLOBALFUNC__Task__ValidateName(
                req.body.task.name,
                req.body.task.project_id
            );
            if(!validateName){
                responseSuccess = 'unsuccessfull';
                responseMesssage = 'name_already_exists';
            }
        }

        if(responseSuccess == 'successfull'){
            const data = {
                name: req.body.task.name,
                deadline: Timestamp.fromDate(formattedDeadline),
                hours_budgeted: req.body.task.hours_budgeted
            };
            const updateTask = updateDoc(
                doc(
                    db,
                    'tasks',
                    req.body.task.task_id
                ), 
                data
            );
            promises.push(updateTask);

            if(req.body.old_name != req.body.task.name){
                const updateAlgoliaSearch = GLOBALFUNC__UpdateAlgoliaSearch(
                    req.body.task.task_id,
                    {
                        name: req.body.task.name
                    }
                );
                const updateAlgoliaSearchDescription = GLOBALFUNC__UpdateAlgoliaSearch__Description(
                    req.body.task.task_id,
                    'task',
                    req.body.task.name
                );
                promises.push(
                    updateAlgoliaSearch,
                    updateAlgoliaSearchDescription
                );
                activityObject['name_changed'] = `${req.body.old_name}|${req.body.task.name}`;
            } 

            if(req.body.old_deadline != req.body.task.formatted_deadline){
                activityObject['deadline_changed'] = `${req.body.old_deadline_translated}|${req.body.new_deadline_translated}`;
            }

            if(req.body.old_hours_budgeted != req.body.task.hours_budgeted){
                activityObject['hours_budgeted_changed'] = `${req.body.old_hours_budgeted}|${req.body.task.hours_budgeted}`;
            }

            if(req.body.added_item_object_files.length > 0){
                activityObject['files_added'] = [];
                req.body.added_item_object_files.map(file => {
                    activityObject.files_added.push(file.name);
                });
            }

            if(req.body.deleted_item_object_files.length > 0){
                activityObject['files_deleted'] = [];
                req.body.deleted_item_object_files.map(file => {
                    activityObject.files_deleted.push(file.name);
                });
            }

            const createActivity = GLOBALFUNC__CreateActivity(
                req.body.dateForActivity,
                'task_changed',
                req.body.organization_id,
                req.body.task.manager_id,
                [req.body.user_id],
                req.body.task.phase_id,
                req.body.task.project_id,
                req.body.task.task_id,
                activityObject
            );
            promises.push(createActivity);

            await Promise.all(promises);

            responseMesssage = Timestamp.fromDate(formattedDeadline);
        }
        res.status(200).send({
            response: responseSuccess,
            message: responseMesssage
        });

    } catch (error) {
        res.status(400).send({
            response: 'error',
            message: error.message 
        });
    }
}

export const updateStatusForManager = async (req, res, next) => {
    let promises = [];
    let callBack = null;
    
    try {
        const organizationDoc = GLOBALFUNC__UpdateAnalyticsForOrganization__Tasks(
            req.body.organization_id,
            req.body.old_status,
            req.body.new_status,
            'update'
        );
        const managerDoc = GLOBALFUNC__UpdateAnalyticsForManager__Tasks(
            req.body.manager_id,
            req.body.old_status,
            req.body.new_status,
            'update'
        );
        const projectDoc = GLOBALFUNC__UpdateAnalyticsForProject__Tasks(
            req.body.project_id,
            req.body.old_status,
            req.body.new_status,
            'update'
        );
        promises = [
            organizationDoc,
            managerDoc,
            projectDoc
        ];
        switch(req.body.new_status){
            case 'stuck':
                callBack = await GLOBALFUNC__Task__UpdateStatusToStuck(
                    req.body.dateForActivity,
                    req.body.organization_id,
                    req.body.manager_id,
                    req.body.phase_id,
                    req.body.project_id,
                    req.body.task_id,
                    req.body.stuck_comment.comment,
                    req.body.project_manager_id,
                    req.body.assigned_to,
                    promises,
                    req.body.project_name,
                    req.body.phase_name,
                    req.body.task_name,
                    req.body.dateToday,
                    req.body.user_id
                );
                break;
            case 'in_progress':
                if(req.body.old_status == 'stuck'){
                    await GLOBALFUNC__Task__UpdateStatusToUnStuck(
                        req.body.task_id,
                        req.body.stuck_comment.related_problem_solved_comment,
                        req.body.stuck_comment.related_problem_id,
                        promises,
                        req.body.dateToday,
                        req.body.user_id
                    );
                }
                break;
            case 'completed':

                break;
        }

        res.status(200).send({
            response: 'successfull',
            message: req.body.new_status == 'stuck' ? {
                date_added: Timestamp.fromDate(new Date(req.body.dateToday)),
                related_problem_id: callBack
            } : null
        });
    } catch (error) {
        res.status(400).send({
            response: 'error',
            message: error.message 
        });
    }
}

export const deleteTaskForManager = async (req, res, next) => {
    try {
        const taskDoc = deleteDoc(
            doc(
                db,
                'tasks',
                req.body.task_id
            )
        );
        const organizationDoc = GLOBALFUNC__UpdateAnalyticsForOrganization__Tasks(
            req.body.organization_id,
            req.body.old_status,
            req.body.new_status,
            'delete'
        );
        const managerDoc = GLOBALFUNC__UpdateAnalyticsForManager__Tasks(
            req.body.manager_id,
            req.body.old_status,
            req.body.new_status,
            'delete'
        );
        const projectDoc = GLOBALFUNC__UpdateAnalyticsForProject__Tasks(
            req.body.project_id,
            req.body.old_status,
            req.body.new_status,
            'delete'
        );
        const algoliaSearchDoc = GLOBALFUNC__DeleteAlgoliaSearch(
            req.body.task_id,
        );

        await Promise.all([
            taskDoc,
            organizationDoc,
            managerDoc,
            projectDoc,
            algoliaSearchDoc
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

export const getSpecificTask = async (req, res, next) => {
    let taskData = {};
  
    try {
        const taskDoc = await getDoc(
            doc(
                db, 
                'tasks',
                req.body.task_id
            )
        );

        taskData = await GLOBALFUNC__GetASingleTask__WithAllData(
            taskDoc,
            taskData,
            {
                date_today: req.body.date_today
            }
        );
  
        res.status(200).send({
            response: 'successfull',
            message: taskData
        });
    } catch (error) {
        res.status(400).send({
            response: 'error',
            message: error.message 
        });
    }
}

export const getTasksForSpecificProject = async (req, res, next) => {
    let tasksData = {};
    tasksData['tasks'] = [];
    tasksData['last_visible'] = null;
    let tasksQuery = null;
    const dateToday = new Date(req.body.date_today);
    dateToday.setHours(0, 0, 0, 0);

    try {
        if(req.body.sort_filter.key == 'show_all'){
            if(req.body.last_visible == null){
                tasksQuery = firestoreQuery(
                    collection(
                        db, 
                        'tasks'
                    ),
                    where('project_id', '==', req.body.search_filter_value),
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
                    where('project_id', '==', req.body.search_filter_value),
                    orderBy('date_added', 'desc'),
                    startAfter(Timestamp.fromMillis(req.body.last_visible.seconds * 1000)),
                    limit(20)
                )
            }
        } else if(req.body.sort_filter.key == 'show_all_from_me'
            || req.body.sort_filter.key == 'show_all_from_project'){
            if(req.body.last_visible == null){
                tasksQuery = firestoreQuery(
                    collection(
                        db, 
                        'tasks'
                    ),
                    where('project_id', '==', req.body.search_filter_value),
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
                    where('project_id', '==', req.body.search_filter_value),
                    where('manager_id', '==', req.body.manager_id),
                    orderBy('date_added', 'desc'),
                    startAfter(Timestamp.fromMillis(req.body.last_visible.seconds * 1000)),
                    limit(20)
                )
            }
        } else if(req.body.sort_filter.key == 'show_all_assigned_to_me'){
            if(req.body.last_visible == null){
                tasksQuery = firestoreQuery(
                    collection(
                        db, 
                        'tasks'
                    ),
                    where('project_id', '==', req.body.search_filter_value),
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
                    where('project_id', '==', req.body.search_filter_value),
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
                        where('project_id', '==', req.body.search_filter_value),
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
                        where('project_id', '==', req.body.search_filter_value),
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
                        where('project_id', '==', req.body.search_filter_value),
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
                        where('project_id', '==', req.body.search_filter_value),
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

export const getTasksForSpecificPhase = async (req, res, next) => {
    let tasksData = {};
    tasksData['tasks'] = [];
    tasksData['last_visible'] = null;
    let tasksQuery = null;
    const dateToday = new Date(req.body.date_today);
    dateToday.setHours(0, 0, 0, 0);

    try {
        if(req.body.sort_filter.key == 'show_all'){
            if(req.body.last_visible == null){
                tasksQuery = firestoreQuery(
                    collection(
                        db, 
                        'tasks'
                    ),
                    where('phase_id', '==', req.body.search_filter_value),
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
                    where('phase_id', '==', req.body.search_filter_value),
                    orderBy('date_added', 'desc'),
                    startAfter(Timestamp.fromMillis(req.body.last_visible.seconds * 1000)),
                    limit(20)
                )
            }
        } else if(req.body.sort_filter.key == 'show_all_from_me'
            || req.body.sort_filter.key == 'show_all_from_project'){
            if(req.body.last_visible == null){
                tasksQuery = firestoreQuery(
                    collection(
                        db, 
                        'tasks'
                    ),
                    where('phase_id', '==', req.body.search_filter_value),
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
                    where('phase_id', '==', req.body.search_filter_value),
                    where('manager_id', '==', req.body.manager_id),
                    orderBy('date_added', 'desc'),
                    startAfter(Timestamp.fromMillis(req.body.last_visible.seconds * 1000)),
                    limit(20)
                )
            }
        } else if(req.body.sort_filter.key == 'show_all_assigned_to_me'){
            if(req.body.last_visible == null){
                tasksQuery = firestoreQuery(
                    collection(
                        db, 
                        'tasks'
                    ),
                    where('phase_id', '==', req.body.search_filter_value),
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
                    where('phase_id', '==', req.body.search_filter_value),
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
                        where('phase_id', '==', req.body.search_filter_value),
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
                        where('phase_id', '==', req.body.search_filter_value),
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
                        where('phase_id', '==', req.body.search_filter_value),
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
                        where('phase_id', '==', req.body.search_filter_value),
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