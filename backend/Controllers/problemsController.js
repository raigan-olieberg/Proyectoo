import firebase from '../firebase.js';
import {
  getFirestore,
  collection,
  doc,
  updateDoc,
  deleteDoc,
  query as firestoreQuery,
  Timestamp
} from 'firebase/firestore';
import { 
    GLOBALFUNC__UpdateAnalyticsForOrganization__Problems,
    GLOBALFUNC__UpdateAnalyticsForManager__Problems,
    GLOBALFUNC__UpdateAnalyticsForProject__Problems,
    GLOBALFUNC__UpdateAlgoliaSearch
} from '../Global/GlobalFunctions.js';

const db = getFirestore(firebase);

export const createProblem = async (req, res, next) => {
    let data = null;
    try {
        if(req.body.problem.related_component_type == 'project'){
            data = {
                date_added: Timestamp.fromDate(req.body.problem.date_added),
                short_description: req.body.problem.short_description,
                long_description: req.body.problem.long_description,
                project_id: req.body.problem.project_id,
                related_component_type: req.body.problem.related_component_type,
                status: 'open',
                priority: req.body.problem.priority,
                user_id: req.body.problem.user_id
            };
        } else if(req.body.problem.related_component_type == 'phase'){
            data = {
                date_added: Timestamp.fromDate(req.body.problem.date_added),
                short_description: req.body.problem.short_description,
                long_description: req.body.problem.long_description,
                project_id: req.body.problem.project_id,
                phase_id: req.body.problem.phase_id,
                related_component_type: req.body.problem.related_component_type,
                status: 'open',
                priority: req.body.problem.priority,
                user_id: req.body.problem.user_id
            };
        } else {
            data = {
                date_added: Timestamp.fromDate(req.body.problem.date_added),
                short_description: req.body.problem.short_description,
                long_description: req.body.problem.long_description,
                project_id: req.body.problem.project_id,
                phase_id: req.body.problem.phase_id,
                task_id: req.body.problem.task_id,
                related_component_type: req.body.problem.related_component_type,
                status: 'open',
                priority: req.body.problem.priority,
                user_id: req.body.problem.user_id
            };
        }
        await addDocDoc(
            collection(
                db, 
                'organizations', 
                req.body.organization_id,
                'problems'
            ), 
            data
        );
  
        // Update organization analytics -> problems

        // Update projects analytics -> problems

        // Add activity

        // Send e-mail

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

export const updateProblem = async (req, res, next) => {
    let promises = [];

    try {
        const data = {
            priority: req.body.problem.priority,
            short_description: req.body.problem.short_description,
            long_description: req.body.problem.long_description
        };
        const problemDoc = updateDoc(
            doc(
                db,
                'problems',
                req.body.problem.problem_id
            ), 
            data
        );
        promises.push(problemDoc);

        if(req.body.problem.short_description != req.body.old_short_description){
            const updateAlgoliaSearch = GLOBALFUNC__UpdateAlgoliaSearch(
                req.body.problem.problem_id,
                {
                    name: req.body.problem.short_description
                }
            );
            promises.push(updateAlgoliaSearch);
        }

        await Promise.all(promises);

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

export const deleteProblem = async (req, res, next) => {
    try {
        const problemDoc = deleteDoc(
            doc(
                db,
                'problems',
                req.body.problem_id
            )
        );
        const organizationDoc = GLOBALFUNC__UpdateAnalyticsForOrganization__Problems(
            req.body.organization_id,
            req.body.old_status,
            null,
            'delete',
            req.body.priority
        );
        const managerDoc = GLOBALFUNC__UpdateAnalyticsForManager__Problems(
            req.body.manager_id,
            req.body.old_status,
            null,
            'delete',
            req.body.priority
        );
        const projectDoc = GLOBALFUNC__UpdateAnalyticsForProject__Problems(
            req.body.project_id,
            req.body.old_status,
            null,
            'delete',
            req.body.priority
        );
        await Promise.all([
            problemDoc,
            organizationDoc,
            managerDoc,
            projectDoc
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