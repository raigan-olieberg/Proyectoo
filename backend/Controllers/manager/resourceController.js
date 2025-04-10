import firebase from '../../firebase.js';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  orderBy,
  startAfter,
  limit,
  query as firestoreQuery,
  where,
  Timestamp
} from 'firebase/firestore';
import { 
  GLOBALFUNC__SendEmail,
  GLOBALFUNC__CreateToken,
  GLOBALFUNC__CreateUser,
  GLOBALFUNC__ValidateEmail,
  GLOBALFUNC__Resource__CheckForResourcesUnderManagement,
  GLOBALFUNC__Resource__CheckForOwnedProjects,
  GLOBALFUNC__Resource__CheckForActiveProblemsUnderCurrentManager,
  GLOBALFUNC__Resource__CheckForActiveTasksUnderCurrentManager,
  GLOBALFUNC__Resource__UpdateManager__ResourcesUnderManagement,
  GLOBALFUNC__Resource__UpdateManager__UpdateWorkedHours,
  GLOBALFUNC__UpdateAlgoliaSearch,
  GLOBALFUNC__GetAdminsAndManagersForAdmin,
  GLOBALFUNC__GetResourceOccupation,
  GLOBALFUNC__ResourceHasLeaveOfAbsence,
  GLOBALFUNC__GetUser
} from '../../Global/GlobalFunctions.js';

const db = getFirestore(firebase);


export const getUsersForManager = async (req, res, next) => {
  let userData = {};
  userData['last_visible'] = null;
  userData['resources'] = [];
  let resourcesQuery = null;

  try {
    if(req.body.key_filter.key == 'show_all'){
      if(req.body.last_visible == null){
        resourcesQuery = firestoreQuery(
          collection(
            db, 
            'users'
          ),
          where('organization_id', '==', req.body.organization_id),
          where('manager_id', '==', req.body.manager_id),
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
          where('manager_id', '==', req.body.manager_id),
          orderBy('date_added', 'desc'),
          startAfter(Timestamp.fromMillis(req.body.last_visible.seconds * 1000)),
          limit(20)
        );
      }
    } else {
      if(req.body.key_filter.key == 'role'){
        if(req.body.last_visible == null){
          resourcesQuery = firestoreQuery(
            collection(
              db, 
              'users'
            ),
            where('organization_id', '==', req.body.organization_id),
            where('manager_id', '==', req.body.manager_id),
            where('role', '==', req.body.key_filter.value),
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
            where('manager_id', '==', req.body.manager_id),
            where('role', '==', req.body.key_filter.value),
            orderBy('date_added', 'desc'),
            startAfter(Timestamp.fromMillis(req.body.last_visible.seconds * 1000)),
            limit(20)
          );
        }
      } else {
        if(req.body.last_visible == null){
          resourcesQuery = firestoreQuery(
            collection(
              db, 
              'users'
            ),
            where('organization_id', '==', req.body.organization_id),
            where('manager_id', '==', req.body.manager_id),
            where('status', '==', req.body.key_filter.value),
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
            where('manager_id', '==', req.body.manager_id),
            where('status', '==', req.body.key_filter.value),
            orderBy('date_added', 'desc'),
            startAfter(Timestamp.fromMillis(req.body.last_visible.seconds * 1000)),
            limit(20)
          );
        }
      }
    }
    const usersSnap = await getDocs(resourcesQuery);

      if(!usersSnap.empty){
        usersSnap.forEach(doc => {
          // Remove own account from list
          if(req.body.manager_id != doc.id){
            userData.resources.push({
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
                manager_id: doc.data().manager_id,
                date_added: doc.data().date_added,
                hourly_rate: doc.data().hourly_rate,
                hours_per_week: doc.data().hours_per_week
            });
          }
        });

        if(userData.resources.length == 20){
          userData.last_visible = userData.resources[userData.resources.length - 1].date_added;
        } else {
          userData.last_visible = 'end_has_been_reached';
        }
      }

      if(req.body.check_if_resource_has_absence_of_leave){
        await Promise.all(
          userData.resources.map(user => {
            return Promise.all([
              GLOBALFUNC__ResourceHasLeaveOfAbsence(
                  user.user_id,
                  req.body.check_if_resource_has_absence_of_leave
              )
            ]).then(data => {
                if(data[0] != null){
                  user.status = "Leave_of_absence";
                  user.leave_of_absence = data[0];
                }
            });
          })
        );
      }

      if(req.body.key_filter.key == 'status'){
        userData.resources = userData.resources.filter((resource) => resource.status != 'Leave_of_absence');
      }

      if(req.body.get_occupation){
        await Promise.all(
          userData.resources.map(user => {
            return Promise.all([
              GLOBALFUNC__GetResourceOccupation(
                user.user_id,
                req.body.get_occupation.day,
                req.body.get_occupation.week,
                req.body.get_occupation.year
              )
            ]).then(data => {
                user['occupation'] = data[0];
            });
          })
        );
      }

      res.status(200).send({
          response: 'successfull',
          message: userData
      });
  } catch (error) {
      res.status(400).send({
          response: 'error',
          message: error.message 
      });
  }
}

export const getLeaveOfAbsenceUsersForManager = async (req, res, next) => {
  let userData = {};
  let leaveOfAbsenceData = [];
  userData['last_visible'] = null;
  userData['resources'] = [];
  let resourcesQuery = null;

  try {
    if(req.body.last_visible == null){
      resourcesQuery = firestoreQuery(
        collection(
          db, 
          'leave_of_absences'
        ),
        where('organization_id', '==', req.body.organization_id),
        where('manager_id', '==', req.body.manager_id),
        orderBy('date_added', 'desc'),
        limit(20)
      );
    } else {
      resourcesQuery = firestoreQuery(
        collection(
          db, 
          'leave_of_absences'
        ),
        where('organization_id', '==', req.body.organization_id),
        where('manager_id', '==', req.body.manager_id),
        orderBy('date_added', 'desc'),
        startAfter(Timestamp.fromMillis(req.body.last_visible.seconds * 1000)),
        limit(20)
      );
    }
    const usersSnap = await getDocs(resourcesQuery);

    if(!usersSnap.empty){
      usersSnap.forEach(doc => {
        if(req.body.manager_id != doc.data().user_id){
          leaveOfAbsenceData.push({
            user_id: doc.data().user_id,
            startdate: doc.data().startdate,
            enddate: doc.data().enddate
          });
        }
      });

      await Promise.all(
        leaveOfAbsenceData.map(item => {
          return Promise.all([
            GLOBALFUNC__GetUser(
              [item.user_id],
              true,
              {
                startdate: item.startdate,
                enddate: item.enddate
              }
            )
          ]).then(data => {
            userData.resources = data[0];
          });
        })
      );

      if(userData.resources.length == 20){
          userData.last_visible = userData.resources[userData.resources.length - 1].date_added;
      } else {
          userData.last_visible = 'end_has_been_reached';
      }
    }

    res.status(200).send({
        response: 'successfull',
        message: userData
    });
  } catch (error) {
      res.status(400).send({
          response: 'error',
          message: error.message 
      });
  }
}

export const createUser = async (req, res, next) => {
  let responseSuccess = 'unsuccessfull';
  let responseMessage = null;
  let user_id = null;
  let token_id = null;

  try {
    const validateEmail = await GLOBALFUNC__ValidateEmail(
      req.body.user.email.trim(),
      req.body.organization_id
    );

    if(validateEmail){
      const user = await GLOBALFUNC__CreateUser(
        req.body.organization_id,
        req.body.user
      );

      const token = await GLOBALFUNC__CreateToken(
        user.id,
        req.body.organization_id,
        'activate_account'
      );

      await GLOBALFUNC__Resource__UpdateManager__ResourcesUnderManagement(
        req.body.user.manager_id,
        'add'
      );

      await GLOBALFUNC__SendEmail(
        'activate_account',
        req.body.user,
        req.body.manager,
        token.token
      );

      token_id = token.id;
      user_id = user.id;

      responseMessage = user.id;
      responseSuccess = 'successfull';
    } else {
      responseMessage = 'invalid_email';
    }

    res.status(200).send({
      response: responseSuccess,
      message: responseMessage
    });
  } catch (error) {
    if(user_id != null){
      await deleteDoc(doc(
        db, 
        'users', 
        user_id
      ));
    }
    if(token_id != null){
      await deleteDoc(doc(
        db, 
        'organizations',  
        req.body.organization_id,
        'tokens', 
        token_id
      ));
    }
    res.status(400).send({
      response: 'error',
      message: error.message 
    });
  }
}

export const updateUser = async (req, res, next) => {
  let responseSuccess = true;
  let responseMessage = '';

  try {
    if((req.body.old_role == 'Manager' || req.body.old_role == 'Admin')
      && req.body.user.role == 'Member'){
      const validateResourcesUnderManagement = await GLOBALFUNC__Resource__CheckForResourcesUnderManagement(
        req.body.user.user_id
      );

      if(validateResourcesUnderManagement){
        const validateOwningProjects = await GLOBALFUNC__Resource__CheckForOwnedProjects(
          req.body.user.user_id
        );

        if(!validateOwningProjects){
          responseSuccess = false;
          responseMessage = 'CHANGE_ROLE_ERROR__is_owning_projects';
        }
      } else {
        responseSuccess = false;
        responseMessage = 'CHANGE_ROLE_ERROR__is_managing_resources';
      }
    }

    if(responseSuccess){
      if(req.body.old_manager_id != req.body.user.manager_id){
        const validateActiveProblems = await GLOBALFUNC__Resource__CheckForActiveProblemsUnderCurrentManager(
          req.body.user.user_id,
          req.body.old_manager_id
        );
        if(validateActiveProblems){
          const validateActiveTasks = await GLOBALFUNC__Resource__CheckForActiveTasksUnderCurrentManager(
            req.body.user.user_id,
            req.body.old_manager_id
          );

          if(!validateActiveTasks){
            responseSuccess = false;
            responseMessage = 'CHANGE_MANAGER_ERROR__has_active_tasks';
          }
        } else {
          responseSuccess = false;
          responseMessage = 'CHANGE_MANAGER_ERROR__has_active_problems';
        }
      }
    }

    if(responseSuccess){
      const data = {
        email: req.body.user.email,
        firstname: req.body.user.firstname,
        label: req.body.user.label,
        lastname: req.body.user.lastname,
        phonenumber: req.body.user.phonenumber,
        profile_photo: req.body.user.profile_photo,
        role: req.body.user.role,
        manager_id: req.body.user.manager_id,
        hourly_rate: req.body.user.hourly_rate
      };
      await updateDoc(
        doc(
          db, 
          'users', 
          req.body.user.user_id
        ), 
        data
      );

      if(req.body.old_manager_id != req.body.user.manager_id){
        await Promise.all([
          GLOBALFUNC__Resource__UpdateManager__ResourcesUnderManagement(
            req.body.old_manager_id,
            'delete'
          ),
          GLOBALFUNC__Resource__UpdateManager__ResourcesUnderManagement(
            req.body.user.manager_id,
            'add'
          ),
          GLOBALFUNC__Resource__UpdateManager__UpdateWorkedHours(
            req.body.old_manager_id,
            req.body.user.manager_id,
            req.body.user.user_id
          )
        ]);
      }

      if(req.body.old_firstname != req.body.user.firstname
        || req.body.old_lastname != req.body.user.lastname
        || req.body.old_label != req.body.user.label){
        
        GLOBALFUNC__UpdateAlgoliaSearch(
          req.body.user.user_id,
          {
            description: req.body.user.label,
            name: `${req.body.user.firstname} ${req.body.user.lastname}`
          }
        );
      } 
    }

    res.status(200).send({
      response: responseSuccess ? 'successfull' : 'unsuccessfull',
      message: responseMessage
    });
  } catch (error) {
    res.status(400).send({
      response: 'error',
      message: error.message 
    });
  }
}

export const updateUserStatus = async (req, res, next) => {
  try {
    const data = {
      status: req.body.status
    }
    await updateDoc(
      doc(
        db, 
        'users', 
        req.body.user_id
      ), 
      data
    );

    GLOBALFUNC__UpdateAlgoliaSearch(
      req.body.user_id,
      data
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

export const sendActivationMail = async (req, res, next) => {
  let token_id = null;
  let token = null;

  try {
    const tokensQuery = firestoreQuery(
      collection(
          db, 
          'organizations',
          req.body.organization_id,
          'tokens'
      ), 
      where('subject', '==', 'activate_account'),
      where('user_id', '==', req.body.user.user_id)
    );
    const tokensSnap = await getDocs(tokensQuery);
    
    if(!tokensSnap.empty){
      tokensSnap.forEach(doc => {
        token = doc;
      });
    }

    if(token == null){
      token = await GLOBALFUNC__CreateToken(
        req.body.user.user_id,
        req.body.organization_id,
        'activate_account'
      );
    }

    await GLOBALFUNC__SendEmail(
      'activate_account',
      req.body.user,
      req.body.manager,
      token.token
    );

    token_id = token.id;
  
    res.status(200).send({
      response: 'successfull',
      message: ''
    });
  } catch (error) {
    if(token_id != null){
      await deleteDoc(doc(
        db, 
        'organizations',  
        req.body.organization_id,
        'tokens', 
        token_id
      ));
    }
    res.status(400).send({
      response: 'error',
      message: error.message 
    });
  }
}

export const deleteUser = async (req, res, next) => {
  try {
    
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

export const getSpecificUser = async (req, res, next) => {
  let userData = {};
  userData.user = null;
  userData.adminsAndManagers = null;

  try {
    console.log(req.body);
    const userDoc = await getDoc(
      doc(
          db, 
          'users',
          req.body.user_id
      )
    );

    if(userDoc.exists()){
      userData.user = {
        user_id: userDoc.id,
        firstname: userDoc.data().firstname,
        lastname: userDoc.data().lastname,
        profile_photo: userDoc.data().profile_photo,
        email: userDoc.data().email,
        phonenumber: userDoc.data().phonenumber,
        status: userDoc.data().status,
        role: userDoc.data().role,
        label: userDoc.data().label,
        admin: userDoc.data().admin,
        manager_id: userDoc.data().manager_id,
        date_added: userDoc.data().date_added,
        hourly_rate: userDoc.data().hourly_rate,
        hours_per_week: userDoc.data().hours_per_week,
        leave_of_absence: null
      }
    }

    if(req.body.check_if_resource_has_absence_of_leave){
      const leaveOfAbsence = await GLOBALFUNC__ResourceHasLeaveOfAbsence(
        userData.user.user_id,
        req.body.check_if_resource_has_absence_of_leave
      )

      if(leaveOfAbsence != null){
        userData.user.status = "Leave_of_absence";
        userData.user.leave_of_absence = leaveOfAbsence;
      }
    }

    if(req.body.fetchAdminsAndManagers){
      userData.adminsAndManagers = await GLOBALFUNC__GetAdminsAndManagersForAdmin(
        req.body.organization_id,
        req.body.user_id
      );
    }

    res.status(200).send({
      response: 'successfull',
      message: userData
    });
  } catch (error) {
    res.status(400).send({
      response: 'error',
      message: error.message 
    });
  }
}