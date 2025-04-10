import firebase from '../../firebase.js';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
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
    GLOBALFUNC__GetTask,
    GLOBALFUNC__UpdateAnalyticsForOrganization__Problems,
    GLOBALFUNC__UpdateAnalyticsForManager__Problems,
    GLOBALFUNC__UpdateAnalyticsForProject__Problems,
    GLOBALFUNC__UpdateTask,
    GLOBALFUNC__UpdateAnalyticsForOrganization__Tasks,
    GLOBALFUNC__UpdateAnalyticsForManager__Tasks,
    GLOBALFUNC__UpdateAnalyticsForProject__Tasks,
    GLOBALFUNC__CreateActivity,
    GLOBALFUNC__GetAnArrayOfProblems
} from '../../Global/GlobalFunctions.js';

const db = getFirestore(firebase);


export const getProblemsForManager = async (req, res, next) => {
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
                    where('manager_id', '==', req.body.manager_id),
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
                    where('manager_id', '==', req.body.manager_id),
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
                    where('manager_id', '==', req.body.manager_id),
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
                    where('manager_id', '==', req.body.manager_id),
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
                    where('manager_id', '==', req.body.manager_id),
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
                    where('manager_id', '==', req.body.manager_id),
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

export const updateProblemStatusForManager = async (req, res, next) => {
    let promises = [];
    let activityDoc = null;
    let userIdsForActivity = [];

    try {
        const data = {
            status: req.body.new_status,
            resolved_comment: {
                comment: req.body.resolved_comment.comment,
                user_id: req.body.resolved_comment.user_id,
                date_added: req.body.resolved_comment.date_added != null ? Timestamp.fromDate(new Date(req.body.resolved_comment.date_added)) : null
            }
        }
        const problemDoc = updateDoc(
            doc(
                db,
                'problems',
                req.body.problem_id
            ), 
            data
        );
        const organizationDoc = GLOBALFUNC__UpdateAnalyticsForOrganization__Problems(
            req.body.organization_id,
            req.body.old_status,
            req.body.new_status,
            'update'
        );
        const managerDoc = GLOBALFUNC__UpdateAnalyticsForManager__Problems(
            req.body.manager_id,
            req.body.old_status,
            req.body.new_status,
            'update'
        );
        const projectDoc = GLOBALFUNC__UpdateAnalyticsForProject__Problems(
            req.body.project_id,
            req.body.old_status,
            req.body.new_status,
            'update'
        );
        promises.push(
            problemDoc,
            organizationDoc,
            managerDoc,
            projectDoc
        );
        if(req.body.new_status != 'resolved'){
            activityDoc = GLOBALFUNC__CreateActivity(
                req.body.dateForActivity,
                `problem_${req.body.new_status}`,
                req.body.organization_id,
                req.body.manager_id,
                [],
                req.body.phase_id,
                req.body.project_id,
                req.body.task_id,
                ''
            );
        }

        if(req.body.new_status == 'resolved'){
            if(req.body.task_id == ''){
                activityDoc = GLOBALFUNC__CreateActivity(
                    req.body.dateForActivity,
                    'problem_resolved',
                    req.body.organization_id,
                    req.body.manager_id,
                    [],
                    req.body.phase_id,
                    req.body.project_id,
                    '',
                    ''
                );
            }
            if(req.body.task_id != ''){
                let taskData = {
                    status: 'in_progress',
                    stuck_comment: {
                        comment: '',
                        user_id: '',
                        date_added: null,
                        related_problem_id: ''
                    }
                };
                const taskDoc = GLOBALFUNC__UpdateTask(
                    req.body.task_id,
                    taskData
                );
                const organizationTaskDoc = GLOBALFUNC__UpdateAnalyticsForOrganization__Tasks(
                    req.body.organization_id,
                    'stuck',
                    'in_progress',
                    'update'
                );
                const managerTaskDoc = GLOBALFUNC__UpdateAnalyticsForManager__Tasks(
                    req.body.manager_id,
                    'stuck',
                    'in_progress',
                    'update'
                );
                const projectTaskDoc = GLOBALFUNC__UpdateAnalyticsForProject__Tasks(
                    req.body.project_id,
                    'stuck',
                    'in_progress',
                    'update'
                );
                const taskInfoDoc = await GLOBALFUNC__GetTask(
                    req.body.task_id
                );
                if(taskInfoDoc.exists()){
                    taskInfoDoc.data().assigned_to.map(user => {
                        userIdsForActivity.push(user);
                    });
                    activityDoc = GLOBALFUNC__CreateActivity(
                        req.body.dateForActivity,
                        'task_problem_solved_and_resumed',
                        req.body.organization_id,
                        req.body.manager_id,
                        userIdsForActivity,
                        req.body.phase_id,
                        req.body.project_id,
                        req.body.task_id,
                        req.body.problem_id
                    );
                }
                promises.push(
                    taskDoc,
                    organizationTaskDoc,
                    managerTaskDoc,
                    projectTaskDoc,
                    activityDoc
                );
            }
        }

        await Promise.all(promises);
  
        res.status(200).send({
            response: 'successfull',
            message: req.body.resolved_comment.date_added != null ? Timestamp.fromDate(new Date(req.body.resolved_comment.date_added)) : null
        });
    } catch (error) {
        res.status(400).send({
            response: 'error',
            message: error.message 
        });
    }
}

export const getSpecificProblem = async (req, res, next) => {
    let problemData = {};
  
    try {
        const problemDoc = await getDoc(
            doc(
                db, 
                'problems',
                req.body.problem_id
            )
        );
  
        if(problemDoc.exists()){
            problemData = {
                problem_id: problemDoc.id,
                date_added: problemDoc.data().date_added,
                priority: problemDoc.data().priority,
                related_component_type: problemDoc.data().related_component_type,
                short_description: problemDoc.data().short_description,
                long_description: problemDoc.data().long_description,
                status: problemDoc.data().status,
                project_id: problemDoc.data().project_id,
                phase_id: problemDoc.data().phase_id,
                task_id: problemDoc.data().task_id,
                user_id: problemDoc.data().user_id,
                manager_id: problemDoc.data().manager_id,
                resolved_comment: problemDoc.data().resolved_comment
            }

            let promises = [
                GLOBALFUNC__GetUser(
                    [problemData.user_id]
                ),
                GLOBALFUNC__GetProject (
                    problemData.project_id
                )
            ];
            if(problemData.resolved_comment.user_id != ''){
                promises.push(
                    GLOBALFUNC__GetUser(
                        [problemData.resolved_comment.user_id]
                    )
                );
            } else {
                promises.push(
                    Promise.resolve()
                );
            }
            if(problemData.phase_id != ''){
                promises.push(
                    GLOBALFUNC__GetPhase(
                        problemData.phase_id
                    )
                );
            }
            if(problemData.task_id != ''){
                promises.push(
                    GLOBALFUNC__GetTask(
                        problemData.task_id
                    )
                );
            }

            await Promise.all(promises).then(data => {
                problemData['resource'] = data[0];
                problemData['project'] = data[1].data().name;
                if(problemData.resolved_comment.user_id != ''){
                    problemData.resolved_comment['user'] = data[2];
                }
                if(problemData.phase_id != ''){
                    problemData['phase'] = data[3].data().name;
                }
                if(problemData.task_id != ''){
                    problemData['task'] = data[4].data().name;
                }
            });
        }
  
        res.status(200).send({
            response: 'successfull',
            message: problemData
        });
    } catch (error) {
        res.status(400).send({
            response: 'error',
            message: error.message 
        });
    }
}

export const getProblemsForSpecificProject = async (req, res, next) => {
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
                    where('project_id', '==', req.body.search_filter_value),
                    orderBy('date_added', 'desc'),
                    limit(20)
                )
            } else {
                prolemsQuery = firestoreQuery(
                    collection(
                        db, 
                        'problems'
                    ),
                    where('project_id', '==', req.body.search_filter_value),
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
                    where('project_id', '==', req.body.search_filter_value),
                    where('priority', '==', req.body.sort_filter.value),
                    orderBy('date_added', 'desc'),
                    limit(20)
                )
            } else {
                prolemsQuery = firestoreQuery(
                    collection(
                        db, 
                        'problems'
                    ),
                    where('project_id', '==', req.body.search_filter_value),
                    where('priority', '==', req.body.sort_filter.value),
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
                    where('project_id', '==', req.body.search_filter_value),
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
                    where('project_id', '==', req.body.search_filter_value),
                    where('status', '==', req.body.sort_filter.value),
                    orderBy('date_added', 'desc'),
                    startAfter(Timestamp.fromMillis(req.body.last_visible.seconds * 1000)),
                    limit(20)
                )
            }
        }
        const problemsSnap = await getDocs(prolemsQuery);

        if(!problemsSnap.empty){
            problemsData.problems = [];
            problemsSnap.forEach(doc => {
                problemsData.problems.push({
                    problem_id: doc.id,
                    date_added: doc.data().date_added,
                    priority: doc.data().priority,
                    related_component_type: doc.data().related_component_type,
                    short_description: doc.data().short_description,
                    long_description: doc.data().long_description,
                    status: doc.data().status,
                    project_id: doc.data().project_id,
                    phase_id: doc.data().phase_id,
                    task_id: doc.data().task_id,
                    user_id: doc.data().user_id,
                    manager_id: doc.data().manager_id,
                    resolved_comment: doc.data().resolved_comment
                });
            });

            if(problemsData.problems.length == 20){
                problemsData.last_visible = problemsData.problems[problemsData.problems.length - 1].date_added;
            } else {
                problemsData.last_visible = null;
            }

            await Promise.all(
                problemsData.problems.map(problem => {
                    let promises = [
                        GLOBALFUNC__GetUser(
                            [problem.user_id]
                        ),
                        GLOBALFUNC__GetProject (
                            problem.project_id
                        )
                    ];
                    if(problem.resolved_comment.user_id != ''){
                        promises.push(
                            GLOBALFUNC__GetUser(
                                [problem.resolved_comment.user_id]
                            )
                        );
                    } else {
                        promises.push(
                            Promise.resolve()
                        );
                    }
                    if(problem.phase_id != ''){
                        promises.push(
                            GLOBALFUNC__GetPhase(
                                problem.phase_id
                            )
                        );
                    }
                    if(problem.task_id != ''){
                        promises.push(
                            GLOBALFUNC__GetTask(
                                problem.task_id
                            )
                        );
                    }
                    return Promise.all(promises).then(data => {
                        problem['resource'] = data[0];
                        problem['project'] = data[1].data().name;
                        if(problem.resolved_comment.user_id != ''){
                            problem.resolved_comment['user'] = data[2];
                        }
                        if(problem.phase_id != ''){
                            problem['phase'] = data[3].data().name;
                        }
                        if(problem.task_id != ''){
                            problem['task'] = data[4].data().name;
                        }
                    });
                })
            );
        }

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