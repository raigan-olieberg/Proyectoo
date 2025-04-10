import firebase from '../../firebase.js';
import {
  getFirestore,
  collection,
  getDocs,
  orderBy,
  startAfter,
  limit,
  query as firestoreQuery,
  where,
  Timestamp
} from 'firebase/firestore';
import { 
  GLOBALFUNC__GetUser,
  GLOBALFUNC__GetResourceOccupation,
  GLOBALFUNC__LoggedinUser__GetManagerId,
  GLOBALFUNC__GetAdminsAndManagersForAdmin,
  GLOBALFUNC__ResourceHasLeaveOfAbsence
} from '../../Global/GlobalFunctions.js';


const db = getFirestore(firebase);


export const getUsersForAdmin = async (req, res, next) => {
  let userData = {};
  userData['last_visible'] = null;
  userData['resources'] = [];
  let resourcesQuery = null;

  try {
    console.log(req.body);
    if(req.body.key_filter.key == 'show_all'){
      if(req.body.last_visible == null){
        console.log('caled here');
        resourcesQuery = firestoreQuery(
          collection(
            db, 
            'users'
          ),
          where('organization_id', '==', req.body.organization_id),
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
      const loggedinUserManagerID = await GLOBALFUNC__LoggedinUser__GetManagerId(
        req.body.manager_id
      );
      usersSnap.forEach(doc => {
          // Remove own account from list
          if(req.body.manager_id != doc.id
            && loggedinUserManagerID != doc.id){
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
                  resources_under_management: doc.data().resources_under_management,
                  hourly_rate: doc.data().hourly_rate,
                  hours_per_week: doc.data().hours_per_week,
                  leave_of_absence: null
              });
          }
      });

      if(userData.resources.length == 20){
          userData.last_visible = userData.resources[userData.resources.length - 1].date_added;
      } else {
          userData.last_visible = 'end_has_been_reached';
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

      if(req.body.get_manager){
        await Promise.all(
            userData.resources.map(user => {
                if(user.manager_id != ''){
                    return Promise.all([
                        GLOBALFUNC__GetUser(
                            [user.manager_id]
                        )
                    ]).then(data => {
                        user['manager'] = data[0];
                    });
                } else {
                    user['manager'] = null;
                }
            })
        );
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

export const getLeaveOfAbsenceUsersForAdmin = async (req, res, next) => {
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
        orderBy('date_added', 'desc'),
        startAfter(Timestamp.fromMillis(req.body.last_visible.seconds * 1000)),
        limit(20)
      );
    }
    const usersSnap = await getDocs(resourcesQuery);

    if(!usersSnap.empty){
      const loggedinUserManagerID = await GLOBALFUNC__LoggedinUser__GetManagerId(
        req.body.manager_id
      );
      usersSnap.forEach(doc => {
        if(req.body.manager_id != doc.data().user_id
          && loggedinUserManagerID != doc.data().user_id){
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

      if(req.body.get_manager){
        await Promise.all(
            userData.resources.map(user => {
                if(user.manager_id != ''){
                    return Promise.all([
                        GLOBALFUNC__GetUser(
                            [user.manager_id]
                        )
                    ]).then(data => {
                        user['manager'] = data[0];
                    });
                } else {
                    user['manager'] = null;
                }
            })
        );
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

export const getAdminsAndManagersForAdmin = async (req, res, next) => {
    let userData = null;

    try {
        userData = await GLOBALFUNC__GetAdminsAndManagersForAdmin(
          req.body.organization_id,
          req.body.user_id
        );

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
