import firebase from '../firebase.js';
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  limit,
  query as firestoreQuery,
  where,
  Timestamp,
  getCountFromServer
} from 'firebase/firestore';
import { randomBytes } from 'crypto';

const db = getFirestore(firebase);

/* ========================================
===========================================
===========================================
===========================================
===========================================

    References

===========================================
===========================================
===========================================
===========================================
=========================================== 

    -> REF: Date related functions
        ---> REF: GLOBALFUNC__MonthNames 

    -> REF: Resource related functions
        ---> REF: GLOBALFUNC__GetUser
        ---> REF: GLOBALFUNC__GetResourceOccupation
        ---> REF: GLOBALFUNC__ResourceHasLeaveOfAbsence
        ---> REF: GLOBALFUNC__TranslateUserRole
        ---> REF: GLOBALFUNC__Resource__UpdateManager__ResourcesUnderManagement
        ---> REF: GLOBALFUNC__Resource__UpdateManager__UpdateWorkedHours
        ---> REF: GLOBALFUNC__Resource__CheckForResourcesUnderManagement
        ---> REF: GLOBALFUNC__Resource__CheckForOwnedProjects
        ---> REF: GLOBALFUNC__Resource__CheckForActiveProblemsUnderCurrentManager
        ---> REF: GLOBALFUNC__Resource__CheckForActiveTasksUnderCurrentManager

    -> REF: Account related functions
        ---> REF: GLOBALFUNC__CreateUser
        ---> REF: GLOBALFUNC__CreateToken
        ---> REF: GLOBALFUNC__SendEmail__EmailBody
        ---> REF: GLOBALFUNC__SendEmail
        ---> REF: GLOBALFUNC__ValidateEmail
        ---> REF: GLOBALFUNC__LoggedinUser__GetManagerId
        ---> REF: GLOBALFUNC__GetAdminsAndManagersForAdmin

    -> REF: Task related functions
        ---> REF: GLOBALFUNC__GetFile
        ---> REF: GLOBALFUNC__GetTask
        ---> REF: GLOBALFUNC__GetProject
        ---> REF: GLOBALFUNC__GetPhase
        ---> REF: GLOBALFUNC__Task__ValidateName
        ---> REF: GLOBALFUNC__Task__CheckIfStatusIsOverdue
        ---> REF: GLOBALFUNC__Task__UpdateStatusToStuck
        ---> REF: GLOBALFUNC__Task__UpdateStatusToUnStuck
        ---> REF: GLOBALFUNC__UpdateTask
        ---> REF: GLOBALFUNC__GetAnArrayOfTasks__WithAllData
        ---> REF: GLOBALFUNC__GetASingleTask__WithAllData

    -> REF: Activity related functions
        ---> REF: GLOBALFUNC__CreateActivity
        ---> REF: GLOBALFUNC__GetActivities
        ---> REF: GLOBALFUNC__CompleteActivityData
    
    -> REF: Analytics related functions
        ---> REF: GLOBALFUNC__GetAnalyticsForOrganization__WorkedHours
        ---> REF: GLOBALFUNC__GetAnalyticsForManager__WorkedHours
        ---> REF: GLOBALFUNC__GetAnalyticsForOrganization__Problems
        ---> REF: GLOBALFUNC__GetAnalyticsForOrganization__Tasks
        ---> REF: GLOBALFUNC__GetAnalyticsForOrganization__Tasks__Overdue
        ---> REF: GLOBALFUNC__GetAnalyticsForManager__Problems
        ---> REF: GLOBALFUNC__GetAnalyticsForManager__Tasks
        ---> REF: GLOBALFUNC__GetAnalyticsForManager__Tasks__Overdue
        ---> REF: GLOBALFUNC__GetAnalytics__Projects
        ---> REF: GLOBALFUNC__GetAnalytics__Tasks
            -----> Comment: Need to check if this a reduntant function
        ---> REF: GLOBALFUNC__GetAnalytics__problems
            -----> Comment: Need to check if this a reduntant function
        ---> REF: GLOBALFUNC__GetAnalyticsForResource__WorkedHours
        ---> REF: GLOBALFUNC__Projects__GetProblemsAnalytics
        ---> REF: GLOBALFUNC__Projects__GetTasksAnalytics
        ---> REF: GLOBALFUNC__Projects__GetTasksAnalytics__Overdue
        ---> REF: GLOBALFUNC__UpdateMonthAnalyticsForOrganization__WorkedHours
        ---> REF: GLOBALFUNC__UpdateWeekAnalyticsForOrganization__WorkedHours
        ---> REF: GLOBALFUNC__UpdateMonthAnalyticsForManager__WorkedHours
        ---> REF: GLOBALFUNC__UpdateWeekAnalyticsForManager__WorkedHours
        ---> REF: GLOBALFUNC__UpdateMonthAnalyticsForResource__WorkedHours
        ---> REF: GLOBALFUNC__UpdateWeekAnalyticsForResource__WorkedHours
        ---> REF: GLOBALFUNC__UpdateAnalyticsForOrganization__Problems
        ---> REF: GLOBALFUNC__UpdateAnalyticsForManager__Problems
        ---> REF: GLOBALFUNC__UpdateAnalyticsForProject__Problems
        ---> REF: GLOBALFUNC__UpdateAnalyticsForOrganization__Tasks
        ---> REF: GLOBALFUNC__UpdateAnalyticsForManager__Tasks
        ---> REF: GLOBALFUNC__UpdateAnalyticsForProject__Tasks

    -> REF: Customer related functions
        ---> REF: GLOBALFUNC__Customer__ValidateEmail
        ---> REF: GLOBALFUNC__Customer__CheckForLinkedProjects

    -> REF: Algolia related functions
        ---> REF: GLOBALFUNC__CreateAlgoliaSearch
        ---> REF: GLOBALFUNC__UpdateAlgoliaSearch
        ---> REF: GLOBALFUNC__UpdateAlgoliaSearch__Description
        ---> REF: GLOBALFUNC__DeleteAlgoliaSearch
    
    -> REF: Problem related functions
        ---> REF: GLOBALFUNC__GetProblem
        ---> REF: GLOBALFUNC__CreateProblem
        ---> REF: GLOBALFUNC__UpdateProblem
        ---> REF: GLOBALFUNC__GetAnArrayOfProblems

*/


/*
*
*
*
*
    REF: Date related functions
*
*
*
*
*/
/*
    REF: GLOBALFUNC__MonthNames
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> An array to return a specific month
*/
export const GLOBALFUNC__MonthNames = [
    "januari",
    "februari",
    "maart",
    "april",
    "mei",
    "juni",
    "juli",
    "augustus",
    "september",
    "oktober",
    "november",
    "december"
];
/*
*
*
*
*
    REF: Resource related functions
*
*
*
*
*/
/*
    REF: GLOBALFUNC__GetUser
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> Get data from a specific user
*/
export const GLOBALFUNC__GetUser = async (
    user_ids,
    get_full_data = false,
    include_leave_of_absence = false
) => {
    let promise = [];
    let users = [];

    user_ids.map(user_id => {
        const user = doc(
            db, 
            'users',
            user_id
        );
        promise.push(getDoc(user));
    });

    await Promise.all(promise)
    .then(data => {
        data.map(user => {
            let fetchedUser = null;
            if(!get_full_data){
                fetchedUser = {
                    user_id: user.id,
                    firstname: user.data().firstname,
                    lastname: user.data().lastname,
                    label: user.data().label,
                    role: user.data().role
                };
            } else {
                fetchedUser = {
                    user_id: user.id,
                    firstname: user.data().firstname,
                    lastname: user.data().lastname,
                    profile_photo: user.data().profile_photo,
                    email: user.data().email,
                    phonenumber: user.data().phonenumber,
                    status: !include_leave_of_absence ? user.data().status : "Leave_of_absence",
                    role: user.data().role,
                    label: user.data().label,
                    admin: user.data().admin,
                    manager_id: user.data().manager_id,
                    date_added: user.data().date_added,
                    resources_under_management: user.data().resources_under_management,
                    hourly_rate: user.data().hourly_rate,
                    hours_per_week: user.data().hours_per_week,
                    leave_of_absence: !include_leave_of_absence ? null : include_leave_of_absence
                }
            }
            users.push(fetchedUser);
        });
    });

    return users;
}
/*
    REF: GLOBALFUNC__GetResourceOccupation
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> Get the occupation from a specific user
*/
export const GLOBALFUNC__GetResourceOccupation = async (
    user_id,
    day,
    week,
    year
) => {
    let promise = [];
    let occupation = {};

    const dayOccupationQuery = firestoreQuery(
        collection(
          db, 
          'users', 
          user_id,
          'occupation'
        ),
        where('type', '==', 'day'),
        where('date', '==', day)
    );
    promise.push(getDocs(dayOccupationQuery));

    const weekOccupationQuery = firestoreQuery(
        collection(
          db, 
          'users', 
          user_id,
          'occupation'
        ),
        where('type', '==', 'week'),
        where('week', '==', week),
        where('year', '==', year)
    );
    promise.push(getDocs(weekOccupationQuery));

    await Promise.all(promise)
    .then(data => {
        occupation = {
            day: getDayData(data[0]),
            week: getWeekData(data[1])
        };
    });

    function getDayData(daySnap){
        let day = null;
        if(!daySnap.empty){
            daySnap.forEach(doc => {
                day = doc.data();
            });
        }
        return day
    }

    function getWeekData(weekSnap){
        let week = null;
        if(!weekSnap.empty){
            weekSnap.forEach(doc => {
                week = doc.data();
            });
        }
        return week;
    }

    return occupation;
}
/*
    REF: GLOBALFUNC__ResourceHasLeaveOfAbsence
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> Check if a user has leave of obsence
*/
export const GLOBALFUNC__ResourceHasLeaveOfAbsence = async (
    user_id,
    UTC_date
) => {
    //Timestamp.fromDate(today);
    let value = null;

    const leaveOfAbsenceQuery = firestoreQuery(
        collection(
            db, 
            'leave_of_absences'
        ), 
        where("user_id", "==", user_id),
        where("startdate", "<", UTC_date),
        where("enddate", ">", UTC_date),
        where("status", "==", "approved")
    );
    
    const leaveOfAbsenceSnap = await getDocs(leaveOfAbsenceQuery);
    if(!leaveOfAbsenceSnap.empty){
        leaveOfAbsenceSnap.forEach(doc => {
            value = {
                startdate: doc.data().startdate,
                enddate: doc.data().enddate
            }
        });
    }
    return value;
}
/*
    REF: GLOBALFUNC__TranslateUserRole
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> 
*/
export const GLOBALFUNC__TranslateUserRole = (
    role
) => {
    let response = '';
    switch(role){
        case 'Admin':
            response = 'Projectleider';
            break;
        case 'Manager':
            response = 'Teamleider';
            break;
        case 'Member':
            response = 'Medewerker';
            break;
    }
    return response;
}
/*
    REF: GLOBALFUNC__Resource__UpdateManager__ResourcesUnderManagement
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> Update the analytics for users with the role 'manager' or 'admin' or 'projectleader' when adding or removing a user under their management
*/
export const GLOBALFUNC__Resource__UpdateManager__ResourcesUnderManagement = async (
    manager_id,
    type
) => {
    let newAnalyticsDoc = null;

    const analyticsDoc = await getDoc(
        doc(
            db, 
            'users',
            manager_id
        )
    );

    if(analyticsDoc.exists()){
        newAnalyticsDoc = analyticsDoc.data();
    }

    if(newAnalyticsDoc != null){
        if(type == 'add'){
            newAnalyticsDoc.resources_under_management += 1;
        } else {
            newAnalyticsDoc.resources_under_management -= 1;
        }

        await updateDoc(
            doc(
                db, 
                'users',
                manager_id
            ), 
            newAnalyticsDoc
        );
    }

    return;
}
/*
    REF: GLOBALFUNC__Resource__UpdateManager__UpdateWorkedHours
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> Update the worked hours for users with the role 'manager' or 'admin' or 'projectleader' when adding or removing a user under their management
*/
export const GLOBALFUNC__Resource__UpdateManager__UpdateWorkedHours = async (
    old_manager_id,
    new_manager_id,
    user_id
) => {
    let docIDs = null;

    const workedHoursQuery = firestoreQuery(
        collection(
            db, 
            'worked_hours'
        ), 
        where("user_id", "==", user_id),
        where("manager_id", "==", old_manager_id),
    );
    const workedHoursSnap = await getDocs(workedHoursQuery);
    if(!workedHoursSnap.empty){
        docIDs = [];
        workedHoursSnap.forEach(doc => {
            docIDs.push(doc.id);
        });
    }

    console.log(docIDs);

    if(docIDs != null){
        const workedHoursData = {
            manager_id: new_manager_id
        }
        await Promise.all(docIDs.map((id) => {
            updateDoc(
                doc(
                  db, 
                  'worked_hours', 
                  id
                ), 
                workedHoursData
            );
        }));
    }
    
    return;
}
/*
    REF: GLOBALFUNC__Resource__CheckForResourcesUnderManagement
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> Check if a resource is the manager of antoher resource
*/
export const GLOBALFUNC__Resource__CheckForResourcesUnderManagement = async (
    user_id
  ) => {
    let valid = true;

    const usersQuery = firestoreQuery(
        collection(
            db, 
            'users'
        ), 
        where("manager_id", "==", user_id),
        limit(1)
    );
    const usersSnap = await getDocs(usersQuery);
    if(!usersSnap.empty){
        valid = false;
    }

    return valid;
}
/*
    REF: GLOBALFUNC__Resource__CheckForOwnedProjects
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> Check if a resource is the owner of a project
*/
export const GLOBALFUNC__Resource__CheckForOwnedProjects = async (
    user_id
  ) => {
    let valid = true;

    const projectsQuery = firestoreQuery(
        collection(
            db, 
            'projects'
        ), 
        where("manager_id", "==", user_id),
        limit(1)
    );
    const projectsSnap = await getDocs(projectsQuery);
    if(!projectsSnap.empty){
        valid = false;
    }

    return valid;
}
/*
    REF: GLOBALFUNC__Resource__CheckForActiveProblemsUnderCurrentManager
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> Check if a resource is the owner of a reported active problem
*/
export const GLOBALFUNC__Resource__CheckForActiveProblemsUnderCurrentManager = async (
    user_id,
    old_manager_id
) => {
    let valid = true;

    const projectsQuery = firestoreQuery(
        collection(
            db, 
            'problems'
        ), 
        where("manager_id", "==", old_manager_id),
        where("user_id", "==", user_id),
        where("status", "in", ['in_progress', 'open']),
        limit(1)
    );
    const projectsSnap = await getDocs(projectsQuery);
    if(!projectsSnap.empty){
        valid = false;
    }

    return valid;
}
/*
    REF: GLOBALFUNC__Resource__CheckForActiveTasksUnderCurrentManager
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> Check if a resource is the owner of an active task
*/
export const GLOBALFUNC__Resource__CheckForActiveTasksUnderCurrentManager = async (
    user_id,
    old_manager_id
) => {
    let valid = true;

    let arr = [];
    arr.push(user_id);

    const projectsQuery = firestoreQuery(
        collection(
            db, 
            'tasks'
        ), 
        where("manager_id", "==", old_manager_id),
        where("assigned_to", "array-contains-any", arr),
        where("status", "in", ['in_progress', 'open', 'stuck', 'overdue']),
        limit(1)
    );
    const projectsSnap = await getDocs(projectsQuery);
    if(!projectsSnap.empty){
        valid = false;
    }

    return valid;
}
/*
*
*
*
*
    REF: Account related functions
*
*
*
*
*/
/*
    REF: GLOBALFUNC__CreateUser
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> Create a user
*/
export const GLOBALFUNC__CreateUser = async (
    organization_id,
    user
) => {
    const userData = {
        firstname: user.firstname.trim(),
        lastname: user.lastname.trim(),
        role: user.role,
        label: user.label.trim(),
        email: user.email.trim(),
        manager_id: user.manager_id,
        phonenumber: user.phonenumber.trim(),
        profile_photo: {
            thumbnail: '',
            medium: '',
            big: ''
        },
        password: '',
        organization_id: organization_id,
        status: user.status,
        resources_under_management: 0,
        hours_per_week: parseFloat(user.hours_per_week),
        hourly_rate: parseFloat(user.hourly_rate),
        date_added: Timestamp.fromDate(new Date(user.date_added))
    };

    const userDoc = await addDoc(
        collection(
          db, 
          'users'
        ), 
        userData
    );

    GLOBALFUNC__CreateAlgoliaSearch(
        'users',
        user.label,
        userDoc.id,
        `${user.firstname} ${user.lastname}`,
        organization_id,
        user.manager_id
    );
    return userDoc;
}
/*
    REF: GLOBALFUNC__CreateToken
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> Create a token after registration to activate an account via email
*/
export const GLOBALFUNC__CreateToken = async (
    user_id,
    organization_id,
    subject
) => {
    let token = `${randomBytes(64).toString('hex')}.${user_id}.${organization_id}`;
    const tokenData = {
        user_id: user_id,
        token: token,
        subject: subject
    }
    const tokenDoc = await addDoc(
        collection(
          db, 
          'organizations', 
          organization_id, 
          'tokens'
        ), 
        tokenData
    );
    let token_id = tokenDoc.id;
    token = `${token}.${token_id}`;
    return {
        id: token_id,
        token: token
    };
}
/*
    REF: GLOBALFUNC__SendEmail__EmailBody
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> The body for the registration email
*/
export const GLOBALFUNC__SendEmail__EmailBody = (
    type,
    user,
    manager,
    token
) => {
    let emailBody = null;
    switch(type){
        case 'reset_password':
            emailBody = `
                <p>Hi ${user.firstname},</p>
                <p>Problemen met inloggen?<br>Er is een verzoek ontvangen om jouw wachtwoord te herstellen.</p>
                <p>Als je dit verzoek niet hebt gedaan, dan kan je deze e-mail negeren.</p>
                <p>Mocht je dit verzoek wel hebben gedaan, klik dan op de link hieronder:</p>
                <a href='https://app.proyectoo.com/account/set-new-password?t=${token}'>Wachtwoord herstellen</a>
                <p>Met vriendelijke groet,</p>
                <br><br><br>
                ${GLOBALFUNC__SendEmail__EmailFooter}
            `;
            break;
        case 'activate_account':
            emailBody = `
                <p>Hi ${user.firstname},</p>
                <p>Welkom aan boord!</p>
                <p>Je bent door ${manager.firstname} ${manager.lastname} uitgenodigd om lid te worden van Proyectoo.</p>
                <p>Klik op de link hieronder om jouw account te activeren en om jouw wachtwoord in te stellen:</p>
                <a href='https://app.proyectoo.com/account/activate?t=${token}'>Account activeren</a>
                <p>Met vriendelijke groet,</p>
                <br><br><br>
                ${GLOBALFUNC__SendEmail__EmailFooter}
            `;
            break;
    }
    return emailBody;
}

export const GLOBALFUNC__SendEmail__EmailFooter = `
<table cellpadding="0" cellspacing="0" border="0" globalstyles="[object Object]" class="table__StyledTable-sc-1avdl6r-0 gZiJTA" style="vertical-align: -webkit-baseline-middle; font-size: medium; font-family: Arial;">
  <tbody>
    <tr>
        <td color="#f86295" direction="horizontal" width="auto" height="1" class="color-divider__Divider-sc-1h38qjv-0 icFEOy" style="width: 100%; border-bottom: 1px solid rgb(248, 98, 149); border-left: none; display: block;"></td>
    </tr>
    <tr>
        <td height="30"></td>
    </tr>
    <tr>
        <td style="vertical-align: middle;">
          <table cellpadding="0" cellspacing="0" border="0" globalstyles="[object Object]" class="table__StyledTable-sc-1avdl6r-0 gZiJTA" style="vertical-align: -webkit-baseline-middle; font-size: medium; font-family: Arial;">
              <tbody>
                <tr>
                    <td>
                      <h2 color="#000000" class="name__NameContainer-sc-1m457h3-0 gsCpOr" style="margin: 0px; font-size: 18px; color: rgb(0, 0, 0); font-weight: 600;"><span>Klantenservice |</span><span>&nbsp;</span><span>Proyectoo</span></h2>
                      <p color="#000000" font-size="medium" class="company-details__CompanyContainer-sc-j5pyy8-0 eYVggq" style="margin: 0px; font-weight: 500; color: rgb(0, 0, 0); font-size: 14px; line-height: 22px;"><span>Onderdeel van Partum Interactive B.V.</span></p>
                    </td>
                    <td width="15">
                      <div></div>
                    </td>
                    <td color="#f86295" direction="vertical" width="1" height="auto" class="color-divider__Divider-sc-1h38qjv-0 icFEOy" style="width: 1px; border-bottom: none; border-left: 1px solid rgb(248, 98, 149);"></td>
                    <td width="15">
                      <div></div>
                    </td>
                    <td>
                      <table cellpadding="0" cellspacing="0" border="0" globalstyles="[object Object]" class="table__StyledTable-sc-1avdl6r-0 gZiJTA" style="vertical-align: -webkit-baseline-middle; font-size: medium; font-family: Arial;">
                          <tbody>
                            <tr height="25" style="vertical-align: middle;">
                                <td width="30" style="vertical-align: middle;">
                                  <table cellpadding="0" cellspacing="0" border="0" globalstyles="[object Object]" class="table__StyledTable-sc-1avdl6r-0 gZiJTA" style="vertical-align: -webkit-baseline-middle; font-size: medium; font-family: Arial;">
                                      <tbody>
                                        <tr>
                                            <td style="vertical-align: bottom;"><span color="#f86295" width="11" class="contact-info__IconWrapper-sc-mmkjr6-1 brbfIW" style="display: inline-block; background-color: rgb(248, 98, 149);"><img src="https://cdn2.hubspot.net/hubfs/53/tools/email-signature-generator/icons/phone-icon-2x.png" color="#f86295" alt="mobilePhone" width="13" class="contact-info__ContactLabelIcon-sc-mmkjr6-0 kInyhW" style="display: block; background-color: rgb(248, 98, 149);"></span></td>
                                        </tr>
                                      </tbody>
                                  </table>
                                </td>
                                <td style="padding: 0px; color: rgb(0, 0, 0);"><a href="tel:085 - 06 08 127" color="#000000" class="contact-info__ExternalLink-sc-mmkjr6-2 dExxuU" style="text-decoration: none; color: rgb(0, 0, 0); font-size: 12px;"><span>085 - 06 08 127</span></a></td>
                            </tr>
                            <tr height="25" style="vertical-align: middle;">
                                <td width="30" style="vertical-align: middle;">
                                  <table cellpadding="0" cellspacing="0" border="0" globalstyles="[object Object]" class="table__StyledTable-sc-1avdl6r-0 gZiJTA" style="vertical-align: -webkit-baseline-middle; font-size: medium; font-family: Arial;">
                                      <tbody>
                                        <tr>
                                            <td style="vertical-align: bottom;"><span color="#f86295" width="11" class="contact-info__IconWrapper-sc-mmkjr6-1 brbfIW" style="display: inline-block; background-color: rgb(248, 98, 149);"><img src="https://cdn2.hubspot.net/hubfs/53/tools/email-signature-generator/icons/email-icon-2x.png" color="#f86295" alt="emailAddress" width="13" class="contact-info__ContactLabelIcon-sc-mmkjr6-0 kInyhW" style="display: block; background-color: rgb(248, 98, 149);"></span></td>
                                        </tr>
                                      </tbody>
                                  </table>
                                </td>
                                <td style="padding: 0px;"><a href="mailto:support@proyectoo.com" color="#000000" class="contact-info__ExternalLink-sc-mmkjr6-2 dExxuU" style="text-decoration: none; color: rgb(0, 0, 0); font-size: 12px;"><span>support@proyectoo.com</span></a></td>
                            </tr>
                            <tr height="25" style="vertical-align: middle;">
                                <td width="30" style="vertical-align: middle;">
                                  <table cellpadding="0" cellspacing="0" border="0" globalstyles="[object Object]" class="table__StyledTable-sc-1avdl6r-0 gZiJTA" style="vertical-align: -webkit-baseline-middle; font-size: medium; font-family: Arial;">
                                      <tbody>
                                        <tr>
                                            <td style="vertical-align: bottom;"><span color="#f86295" width="11" class="contact-info__IconWrapper-sc-mmkjr6-1 brbfIW" style="display: inline-block; background-color: rgb(248, 98, 149);"><img src="https://cdn2.hubspot.net/hubfs/53/tools/email-signature-generator/icons/link-icon-2x.png" color="#f86295" alt="website" width="13" class="contact-info__ContactLabelIcon-sc-mmkjr6-0 kInyhW" style="display: block; background-color: rgb(248, 98, 149);"></span></td>
                                        </tr>
                                      </tbody>
                                  </table>
                                </td>
                                <td style="padding: 0px;"><a href="https://proyectoo.com" color="#000000" class="contact-info__ExternalLink-sc-mmkjr6-2 dExxuU" style="text-decoration: none; color: rgb(0, 0, 0); font-size: 12px;"><span>https://proyectoo.com</span></a></td>
                            </tr>
                          </tbody>
                      </table>
                    </td>
                </tr>
              </tbody>
          </table>
        </td>
    </tr>
    <tr>
        <td height="30"></td>
    </tr>
    <tr>
        <td color="#f86295" direction="horizontal" width="auto" height="1" class="color-divider__Divider-sc-1h38qjv-0 icFEOy" style="width: 100%; border-bottom: 1px solid rgb(248, 98, 149); border-left: none; display: block;"></td>
    </tr>
  </tbody>
</table>
`;
/*
    REF: GLOBALFUNC__SendEmail
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> Sends an email to activate an acount
*/
export const GLOBALFUNC__SendEmail = async (
    type,
    user,
    manager,
    token
) => {
    const emailData = {
        to: ['raigan@partuminteractive.com'],
        message: {
          subject: `${user.firstname}, activeer jouw Proyectoo account`,
          text: "",
          html: GLOBALFUNC__SendEmail__EmailBody(
            type,
            user,
            manager,
            token
          )
        }
    }
    return await addDoc(collection(db, 'mail'), emailData);;
}
/*
    REF: GLOBALFUNC__ValidateEmail
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> Validate an email when signing up for a new account
*/
export const GLOBALFUNC__ValidateEmail = async (
    email,
    organization_id = null
  ) => {
    let usersQuery = null;
    let usersSnap = null;
    if(organization_id == null){
        usersQuery = firestoreQuery(
            collection(
                db, 
                'users'
            ), 
            where("email", "==", email),
            limit(1)
        );
        usersSnap = await getDocs(usersQuery);
    } else {
        usersQuery = firestoreQuery(
            collection(
                db, 
                'users'
            ), 
            where("email", "==", email),
            where("organization_id", "==", organization_id),
            limit(1)
        );
        usersSnap = await getDocs(usersQuery);
    }
    return usersSnap.empty;
}
/*
    REF: GLOBALFUNC__LoggedinUser__GetManagerId
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> Fetch the manager from the currently loggedin user
*/
export const GLOBALFUNC__LoggedinUser__GetManagerId = async (
    user_id
  ) => {
    let manager_id = null;

    const userDoc = await getDoc(
        doc(
            db, 
            'users',
            user_id
        )
    );

    if(userDoc.exists()){
        manager_id = userDoc.data().manager_id;
    }

    return manager_id;
}
/*
    REF: GLOBALFUNC__GetAdminsAndManagersForAdmin
        -> WHAT IS IT / WHAT DOES IT DO: 
            --->  
*/
export const GLOBALFUNC__GetAdminsAndManagersForAdmin = async (
    organization_id,
    user_id
) => {
    let userData = null;
    const resourcesQuery = firestoreQuery(
        collection(
            db, 
            'users'
        ),
        where('organization_id', '==', organization_id),
        where('role', '!=', 'Member')
    );

    const usersSnap = await getDocs(resourcesQuery);

    if(!usersSnap.empty){
        userData = [];
        usersSnap.forEach(doc => {
            userData.push({
                key: user_id == doc.id ? 'Ik' : `${doc.data().firstname} ${doc.data().lastname} (${GLOBALFUNC__TranslateUserRole(doc.data().role)})`,
                value: doc.id,
                firstname: doc.data().firstname,
                lastname: doc.data().lastname,
                label: doc.data().label,
                role: doc.data().role
            });
        });
    }
    console.log(userData);
    return userData;
}
/*
*
*
*
*
    REF: Task related functions
*
*
*
*
*/
/*
    REF: GLOBALFUNC__GetFile
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> Get a file (appendix) belonging to a task
*/
export const GLOBALFUNC__GetFile = async (
    task_id,
    type
) => {
    let q = null;
    let res = null;
    let files = [];

    switch(type){
        case 'task':
            q = firestoreQuery(
                collection(
                  db, 
                  'files'
                ),
                where('task_id', '==', task_id)
            );
            res = await getDocs(q);
            break;
    }

    if(!res.empty){
        res.forEach(doc => {
            const fileData = {
                file_id: doc.id,
                name: doc.data().name,
                size: doc.data().size,
                url: doc.data().url,
                path: doc.data().path,
                lastModified: doc.data().lastModified
            }
            files.push(fileData);
        });
    }

    return files;
}
/*
    REF: GLOBALFUNC__GetTask
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> 
*/
export const GLOBALFUNC__GetTask = async (
    task_id
) => {
    const analyticsDoc = doc(
        db,
        'tasks',
        task_id
    );
    return getDoc(analyticsDoc);
}
/*
    REF: GLOBALFUNC__GetProject
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> 
*/
export const GLOBALFUNC__GetProject = async (
    project_id
) => {
    const analyticsDoc = doc(
        db,
        'projects',
        project_id
    );
    return getDoc(analyticsDoc);
}
/*
    REF: GLOBALFUNC__GetPhase
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> 
*/
export const GLOBALFUNC__GetPhase = async (
    phase_id
) => {
    const analyticsDoc = doc(
        db,
        'phases',
        phase_id
    );
    return getDoc(analyticsDoc);
}
/*
    REF: GLOBALFUNC__Task__ValidateName
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> Check if the selected name already exsists
*/
export const GLOBALFUNC__Task__ValidateName = async (
    name,
    project_id
  ) => {
    let valid = true;

    const projectsQuery = firestoreQuery(
        collection(
            db, 
            'tasks'
        ), 
        where("name", "==", name),
        where('project_id', '==', project_id),
        limit(1)
    );
    const projectsSnap = await getDocs(projectsQuery);
    if(!projectsSnap.empty){
        valid = false;
    }

    return valid;
}
/*
    REF: GLOBALFUNC__Task__CheckIfStatusIsOverdue
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> 
*/
export const GLOBALFUNC__Task__CheckIfStatusIsOverdue = (
    status,
    deadline,
    dateToday
  ) => {
    let newStatus = status;
    const d1 = new Date(deadline.seconds * 1000);
    d1.setHours(0, 0, 0, 0);
    const d2 = new Date(dateToday);
    d2.setHours(0, 0, 0, 0);

    if(d1 < d2){
        newStatus = 'overdue';
    }
    console.log(dateToday);
    return newStatus;
}
/*
    REF: GLOBALFUNC__Task__UpdateStatusToStuck
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> 
*/
export const GLOBALFUNC__Task__UpdateStatusToStuck = async (
    dateForActivity,
    organization_id,
    manager_id,
    phase_id,
    project_id,
    task_id,
    stuck_comment,
    project_manager_id,
    assigned_to,
    promises,
    project_name,
    phase_name,
    task_name,
    dateToday,
    user_id
) => {
    let related_problem_id = null;
    let userIdsForActivity = [];

    if(assigned_to.length > 0){
        assigned_to.map(user => {
            userIdsForActivity.push(user.user_id);
        });
    }
    const activityDoc = GLOBALFUNC__CreateActivity(
        dateForActivity,
        'task_stuck',
        organization_id,
        manager_id,
        userIdsForActivity,
        phase_id,
        project_id,
        task_id,
        ''
    );
    const problemDoc = GLOBALFUNC__CreateProblem(
        stuck_comment,
        manager_id,
        project_manager_id,
        organization_id,
        task_id,
        phase_id,
        'high',
        project_id,
        'task',
        'Taak is vastgelopen',
        manager_id
    );
    const organizationAnalyticsDoc = GLOBALFUNC__UpdateAnalyticsForOrganization__Problems(
       organization_id,
        '',
        'open',
        '',
        'high'
    );
    const managerAnalyticsDoc = GLOBALFUNC__UpdateAnalyticsForManager__Problems(
        manager_id,
        '',
        'open',
        '',
        'high'
    );
    const projectAnalyticsDoc = GLOBALFUNC__UpdateAnalyticsForProject__Problems(
        manager_id,
        '',
        'open',
        '',
        'high'
    );
    promises.push(
        activityDoc,
        problemDoc,
        organizationAnalyticsDoc,
        managerAnalyticsDoc,
        projectAnalyticsDoc
    );

    await Promise.all(promises).then(data => {
        related_problem_id = data[4];
    });

    if(related_problem_id != undefined
        && related_problem_id != null){
        let newTaskDoc = null;

        const taskDoc = await getDoc(
            doc(
                db, 
                'tasks',
                task_id
            )
        );
    
        if(taskDoc.exists()){
            newTaskDoc = taskDoc.data();
            newTaskDoc.status = 'stuck';
            newTaskDoc.stuck_comment['comment'] = stuck_comment;
            newTaskDoc.stuck_comment['related_problem_id'] = related_problem_id;
            newTaskDoc.stuck_comment['date_added'] = Timestamp.fromDate(new Date(dateToday));
            newTaskDoc.stuck_comment['user_id'] = user_id;

            updateDoc(
                doc(
                    db, 
                    'tasks',
                    task_id
                ), 
                newTaskDoc
            );

            GLOBALFUNC__CreateAlgoliaSearch(
                'problems',
                `${project_name} &rarr; ${phase_name} &rarr; ${task_name}`,
                related_problem_id,
                'Taak is vastgelopen',
                organization_id,
                project_manager_id,
                manager_id,
                '',
                project_id,
                phase_id,
                task_id
            );
        }
    } 
    return related_problem_id;
}
/*
    REF: GLOBALFUNC__Task__UpdateStatusToUnStuck
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> 
*/
export const GLOBALFUNC__Task__UpdateStatusToUnStuck = async (
    task_id,
    related_problem_solved_comment,
    related_problem_id,
    promises,
    dateToday,
    user_id
) => {
    const taskDoc = GLOBALFUNC__UpdateTask(
        task_id,
        {
            status: 'in_progress'
        }
    );

    if(related_problem_id != ''){
        const resolvedProblemData = {
            status: 'resolved',
            resolved_comment: {
                comment: related_problem_solved_comment,
                date_added: Timestamp.fromDate(new Date(dateToday)),
                user_id: user_id
            }
        };
        const relatedProblemDoc = await GLOBALFUNC__GetProblem(
            related_problem_id
        );
        if(relatedProblemDoc != null){
            const problemDoc = GLOBALFUNC__UpdateProblem(
                related_problem_id,
                resolvedProblemData
            );
            const organizationAnalyticsDoc = GLOBALFUNC__UpdateAnalyticsForOrganization__Problems(
                req.body.organization_id,
                relatedProblemDoc.data().status,
                'resolved',
                'update'
            );
            const managerAnalyticsDoc = GLOBALFUNC__UpdateAnalyticsForManager__Problems(
                req.body.manager_id,
                relatedProblemDoc.data().status,
                'resolved',
                'update'
            );
            const projectAnalyticsDoc = GLOBALFUNC__UpdateAnalyticsForProject__Problems(
                req.body.manager_id,
                relatedProblemDoc.data().status,
                'resolved',
                'update'
            );
            promises.push(
                problemDoc,
                organizationAnalyticsDoc,
                managerAnalyticsDoc,
                projectAnalyticsDoc
            );
        }
    }


}
/*
    REF: GLOBALFUNC__UpdateTask
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> 
*/
export const GLOBALFUNC__UpdateTask = async (
    task_id,
    data,
    fetchTaskDataFirst = false
) => {
    if(!fetchTaskDataFirst){
        await updateDoc(
            doc(
                db, 
                'tasks',
                task_id
            ), 
            data
        );
    } else {
        let newTaskDoc = null;

        const taskDoc = await getDoc(
            doc(
                db, 
                'tasks',
                task_id
            )
        );
    
        if(taskDoc.exists()){
            newTaskDoc = taskDoc.data();

            newTaskDoc.data

            updateDoc(
                doc(
                    db, 
                    'tasks',
                    task_id
                ), 
                newTaskDoc
            );
        } 
    }
    return;
}
/*
    REF: GLOBALFUNC__GetAnArrayOfTasks__WithAllData
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> 
*/
export const GLOBALFUNC__GetAnArrayOfTasks__WithAllData = async (
    tasksSnap,
    tasksData,
    params
) => {
    if(!tasksSnap.empty){
        tasksSnap.forEach(doc => {
            let stuckComment = doc.data().stuck_comment;
            stuckComment['related_problem_solved_comment'] = '';
            tasksData.tasks.push({
                task_id: doc.id,
                name: doc.data().name,
                date_added: doc.data().date_added,
                hours_budgeted: doc.data().hours_budgeted,
                worked_hours: doc.data().worked_hours,
                status: GLOBALFUNC__Task__CheckIfStatusIsOverdue(
                    doc.data().status,
                    doc.data().deadline,
                    params.date_today
                ),
                original_status: doc.data().status,
                project_id: doc.data().project_id,
                phase_id: doc.data().phase_id,
                assigned_to: doc.data().assigned_to,
                manager_id: doc.data().manager_id,
                deadline: doc.data().deadline,
                stuck_comment: stuckComment,
                project_manager_id: doc.data().project_manager_id
            });
        });

        if(tasksData.tasks.length == 20){
            tasksData.last_visible = tasksData.tasks[tasksData.tasks.length - 1].date_added;
        } else {
            tasksData.last_visible = 'end_has_been_reached';
        }

        await Promise.all(
            tasksData.tasks.map(task => {
                let promises = [
                    GLOBALFUNC__GetProject (
                        task.project_id
                    ),
                    GLOBALFUNC__GetPhase(
                        task.phase_id
                    ),
                    GLOBALFUNC__GetUser(
                        [task.manager_id]
                    ),
                    GLOBALFUNC__GetFile(
                        task.task_id,
                        'task'
                    )
                ];
                if(task.stuck_comment.user_id != ''){
                    promises.push(
                        GLOBALFUNC__GetUser(
                            [task.stuck_comment.user_id]
                        )
                    );
                } else {
                    promises.push(
                        Promise.resolve()
                    );
                }
                if(task.assigned_to.length > 0){
                    promises.push(
                        GLOBALFUNC__GetUser(
                            task.assigned_to
                        )
                    );
                }
                return Promise.all(promises).then(data => {
                    task['project'] = {
                        name: data[0].data().name,
                        deadline: data[0].data().deadline
                    };
                    task['phase'] = data[1].data().name;
                    task['owner'] = data[2];
                    task['files'] = data[3];
                    if(task.stuck_comment.user_id != ''){
                        task.stuck_comment['user'] = data[4];
                    }
                    task['assigned_to'] = task.assigned_to.length > 0 ? data[5] : [];
                });
            })
        );
    }

    return tasksData;
}
/*
    REF: GLOBALFUNC__GetASingleTask__WithAllData
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> 
*/
export const GLOBALFUNC__GetASingleTask__WithAllData = async (
    taskDoc,
    taskData,
    params
) => {
    if(taskDoc.exists()){
        let stuckComment = taskDoc.data().stuck_comment;
        stuckComment['related_problem_solved_comment'] = '';
        taskData = {
            task_id: taskDoc.id,
            name: taskDoc.data().name,
            date_added: taskDoc.data().date_added,
            hours_budgeted: taskDoc.data().hours_budgeted,
            worked_hours: taskDoc.data().worked_hours,
            status: GLOBALFUNC__Task__CheckIfStatusIsOverdue(
                taskDoc.data().status,
                taskDoc.data().deadline,
                params.date_today
            ),
            original_status: taskDoc.data().status,
            project_id: taskDoc.data().project_id,
            phase_id: taskDoc.data().phase_id,
            assigned_to: taskDoc.data().assigned_to,
            manager_id: taskDoc.data().manager_id,
            deadline: taskDoc.data().deadline,
            stuck_comment: stuckComment,
            project_manager_id: taskDoc.data().project_manager_id
        }

        let promises = [
            GLOBALFUNC__GetProject (
                taskData.project_id
            ),
            GLOBALFUNC__GetPhase(
                taskData.phase_id
            ),
            GLOBALFUNC__GetUser(
                [taskData.manager_id]
            ),
            GLOBALFUNC__GetFile(
                taskData.task_id,
                'task'
            )
        ];
        if(taskData.stuck_comment.user_id != ''){
            promises.push(
                GLOBALFUNC__GetUser(
                    [taskData.stuck_comment.user_id]
                )
            );
        } else {
            promises.push(
                Promise.resolve()
            );
        }
        if(taskData.assigned_to.length > 0){
            promises.push(
                GLOBALFUNC__GetUser(
                    taskData.assigned_to
                )
            );
        }
        await Promise.all(promises).then(data => {
            taskData['project'] = {
                name: data[0].data().name,
                deadline: data[0].data().deadline
            };
            taskData['phase'] = data[1].data().name;
            taskData['owner'] = data[2];
            taskData['files'] = data[3];
            if(taskData.stuck_comment.user_id != ''){
                taskData.stuck_comment['user'] = data[4];
            }
            taskData['assigned_to'] = taskData.assigned_to.length > 0 ? data[5] : [];
        });
    }

    return taskData;
}
/*
*
*
*
*
    REF: Activity related functions
*
*
*
*
*/
/*
    REF: GLOBALFUNC__CreateActivity
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> 
*/
export const GLOBALFUNC__CreateActivity = async (
    dateForActivity,
    activity,
    organization_id,
    manager_id,
    user_ids,
    phase_id,
    project_id,
    task_id,
    comment
) => {
    const docData = {
        activity: activity,
        date: dateForActivity,
        date_added: Timestamp.fromDate(new Date()),
        organization_id: organization_id,
        manager_id: manager_id,
        phase_id: phase_id,
        project_id: project_id,
        task_id: task_id,
        user_ids: user_ids,
        comment: comment
    };

    console.log(docData);

    await addDoc(
        collection(
          db, 
          'activities'
        ), 
        docData
    );
    return;
}
/*
    REF: GLOBALFUNC__GetActivities
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> 
*/
export const GLOBALFUNC__GetActivities = async (
    organization_id,
    today
) => {
    const activitiesQuery = firestoreQuery(
        collection(
          db, 
          'organizations', 
          organization_id,
          'activities'
        ),
        where('date', '==', today),
        orderBy('date_created', 'desc'),
        limit(10)
      );
      return getDocs(activitiesQuery);
}
/*
    REF: GLOBALFUNC__CompleteActivityData
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> Filling the activities fetched via GLOBALFUNC__GetActivities with addictional data
*/
export const GLOBALFUNC__CompleteActivityData = async (
    oldActivities,
    organization_id
) => {
    let newActivities = [];
    await Promise.all(
        oldActivities.map(activity => {
          return Promise.all([
            GLOBALFUNC__GetUser__NAW(
              activity.user_ids
            ),
            GLOBALFUNC__GetProject(
              organization_id,
              activity.project_id
            ),
            GLOBALFUNC__GetPhase(
              organization_id,
              activity.project_id,
              activity.phase_id
            ),
            GLOBALFUNC__GetTask(
              organization_id,
              activity.project_id,
              activity.phase_id,
              activity.task_id
            )
          ]).then(data => {
            activity['users'] = data[0];
            activity['project'] = data[1].data().name;
            activity['phase'] = data[2].data().name;
            activity['task'] = data[3].data().name;
            newActivities.push(activity);
          });
        })
    );
    return newActivities;
}
/*
*
*
*
*
    REF: Analytics related functions
*
*
*
*
*/
/*
    REF: GLOBALFUNC__GetAnalyticsForOrganization__WorkedHours
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> Get analytics for the worked hours within the whole organization
*/
export const GLOBALFUNC__GetAnalyticsForOrganization__WorkedHours = async (
    organization_id,
    currentYear,
    type,
    monthOrWeekValue
) => {
    let analyticsDoc = null;

    if(type == 'monthsview'){
        analyticsDoc = doc(
            db, 
            'organizations', 
            organization_id,
            `worked_hours_analytics_${currentYear}`,
            `month_${parseInt(monthOrWeekValue) + 1}`
        );
    } else {
        analyticsDoc = doc(
            db, 
            'organizations', 
            organization_id,
            `worked_hours_analytics_${currentYear}`,
            `week_${monthOrWeekValue}`
        );
    }

    return getDoc(analyticsDoc);
}
/*
    REF: GLOBALFUNC__GetAnalyticsForManager__WorkedHours
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> Get analytics for the worked hours for users with te role 'manager' or 'admin' or 'projectleader'
*/
export const GLOBALFUNC__GetAnalyticsForManager__WorkedHours = async (
    manager_id,
    currentYear,
    type,
    monthOrWeekValue
) => {
    let analyticsDoc = null;

    if(type == 'monthsview'){
        analyticsDoc = doc(
            db, 
            'users', 
            manager_id,
            `my_resources_worked_hours_analytics_${currentYear}`,
            `month_${parseInt(monthOrWeekValue) + 1}`
        );
    } else {
        analyticsDoc = doc(
            db, 
            'users', 
            manager_id,
            `my_resources_worked_hours_analytics_${currentYear}`,
            `week_${parseInt(monthOrWeekValue)}`
        );
    }

    return getDoc(analyticsDoc);
}
/*
    REF: GLOBALFUNC__GetAnalyticsForOrganization__Problems
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> Get analytics for the problems within the whole organization
*/
export const GLOBALFUNC__GetAnalyticsForOrganization__Problems = async (
    organization_id
) => {
    let analyticsDoc = null;

    analyticsDoc = doc(
        db, 
        'organizations', 
        organization_id,
        'analytics',
        'problems'
    );

    return getDoc(analyticsDoc);
}
/*
    REF: GLOBALFUNC__GetAnalyticsForOrganization__Tasks
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> Get analytics for the tasks within the whole organization
*/
export const GLOBALFUNC__GetAnalyticsForOrganization__Tasks = async (
    organization_id
) => {
    let analyticsDoc = null;

    analyticsDoc = doc(
        db, 
        'organizations', 
        organization_id,
        'analytics',
        'tasks'
    );

    return getDoc(analyticsDoc);
}
/*
    REF: GLOBALFUNC__GetAnalyticsForOrganization__Tasks__Overdue
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> Get analytics for the tasks with the status 'overdue' within the whole organization
*/
export const GLOBALFUNC__GetAnalyticsForOrganization__Tasks__Overdue = async (
    organization_id,
    dateToday
) => {
    let value = 0;
    const tasksQuery = firestoreQuery(
        collection(
            db, 
            'tasks'
        ), 
        where("organization_id", "==", organization_id),
        where('deadline', '<', dateToday)
    );
    const tasksSnap = await getCountFromServer(tasksQuery);
    value = tasksSnap.data().count;

    return value;
}
/*
    REF: GLOBALFUNC__GetAnalyticsForManager__Problems
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> Get analytics for the problems for users with the role 'manager' or 'admin' or 'projectleader'
*/
export const GLOBALFUNC__GetAnalyticsForManager__Problems = async (
    manager_id
) => {
    let analyticsDoc = null;

    analyticsDoc = doc(
        db, 
        'users', 
        manager_id,
        'analytics',
        'problems'
    );

    return getDoc(analyticsDoc);
}
/*
    REF: GLOBALFUNC__GetAnalyticsForManager__Tasks
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> Get analytics for the tasks for users with the role 'manager' or 'admin' or 'projectleader'
*/
export const GLOBALFUNC__GetAnalyticsForManager__Tasks = async (
    manager_id
) => {
    let analyticsDoc = null;

    analyticsDoc = doc(
        db, 
        'users', 
        manager_id,
        'analytics',
        'tasks'
    );

    return getDoc(analyticsDoc);
}
/*
    REF: GLOBALFUNC__GetAnalyticsForManager__Tasks__Overdue
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> Get analytics for the tasks with the status 'overdue' for users with the role 'manager' or 'admin' or 'projectleader'
*/
export const GLOBALFUNC__GetAnalyticsForManager__Tasks__Overdue = async (
    manager_id,
    dateToday
) => {
    let value = 0;
    const tasksQuery = firestoreQuery(
        collection(
            db, 
            'tasks'
        ), 
        where("manager_id", "==", manager_id),
        where('deadline', '<', dateToday)
    );
    const tasksSnap = await getCountFromServer(tasksQuery);
    value = tasksSnap.data().count;

    return value;
}
/*
    REF: GLOBALFUNC__GetAnalytics__Projects
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> Get analytics for the projects within the whole organization
*/
export const GLOBALFUNC__GetAnalytics__Projects = async (
    organization_id
) => {
    const analyticsDoc = doc(
        db, 
        'organizations', 
        organization_id,
        'analytics',
        'projects'
    );
    return getDoc(analyticsDoc);
}
/*
    REF: GLOBALFUNC__GetAnalytics__Tasks
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> Get analytics for the tasks within the whole organization
*/
export const GLOBALFUNC__GetAnalytics__Tasks = async (
    organization_id
) => {
    const analyticsDoc = doc(
        db, 
        'organizations', 
        organization_id,
        'analytics',
        'tasks'
    );
    return getDoc(analyticsDoc);
}
/*
    REF: GLOBALFUNC__GetAnalytics__problems
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> Get analytics for the problems within the whole organization
*/
export const GLOBALFUNC__GetAnalytics__problems = async (
    organization_id
) => {
    const analyticsDoc = doc(
        db, 
        'organizations', 
        organization_id,
        'analytics',
        'problems'
    );
    return getDoc(analyticsDoc);
}
/*
    REF: GLOBALFUNC__GetAnalyticsForResource__WorkedHours
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> Get analytics for the workedhours of a specific user
*/
export const GLOBALFUNC__GetAnalyticsForResource__WorkedHours = async (
    user_id,
    currentYear,
    type,
    monthOrWeekValue
) => {
    let analyticsDoc = null;

    if(type == 'monthsview'){
        analyticsDoc = doc(
            db, 
            'users', 
            user_id,
            `worked_hours_analytics_${currentYear}`,
            `month_${(parseInt(monthOrWeekValue) + 1)}`
        );
    } else {
        analyticsDoc = doc(
            db, 
            'users', 
            user_id,
            `worked_hours_analytics_${currentYear}`,
            `week_${parseInt(monthOrWeekValue)}`
        );
    }

    return getDoc(analyticsDoc);
}
/*
    REF: GLOBALFUNC__Projects__GetProblemsAnalytics
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> Get analytics for the problems of a specific project
*/
export const GLOBALFUNC__Projects__GetProblemsAnalytics = async (
    project_id
) => {
    let analyticsData = null;
    const analytics = doc(
        db,
        'projects',
        project_id,
        'analytics',
        'problems'
    );
    const analyticsDoc = await getDoc(analytics);

    if (analyticsDoc.exists()) {
        analyticsData = analyticsDoc.data();
    }
    return analyticsData;
}
/*
    REF: GLOBALFUNC__Projects__GetTasksAnalytics
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> Get analytics for the tasks within a project
*/
export const GLOBALFUNC__Projects__GetTasksAnalytics = async (
    project_id
) => {
    let analyticsData = null;
    const analytics = doc(
        db,
        'projects',
        project_id,
        'analytics',
        'tasks'
    );
    const analyticsDoc = await getDoc(analytics);

    if (analyticsDoc.exists()) {
        analyticsData = analyticsDoc.data();
    }
    return analyticsData;
}
/*
    REF: GLOBALFUNC__Projects__GetTasksAnalytics__Overdue
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> Get analytics for the tasks with the status 'overdue' within a project
*/
export const GLOBALFUNC__Projects__GetTasksAnalytics__Overdue = async (
    project_id,
    dateToday
) => {
    let value = 0;
    const tasksQuery = firestoreQuery(
        collection(
            db, 
            'tasks'
        ), 
        where("project_id", "==", project_id),
        where('deadline', '<', dateToday)
    );
    const tasksSnap = await getCountFromServer(tasksQuery);
    value = tasksSnap.data().count;

    return value;
}
/*
    REF: GLOBALFUNC__UpdateMonthAnalyticsForOrganization__WorkedHours
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> Update the analytics for the worked hours for a specific month within the organization
*/
export const GLOBALFUNC__UpdateMonthAnalyticsForOrganization__WorkedHours = async (
    organization_id,
    year,
    month,
    old_status,
    new_status
) => {
    let newAnalyticsMonthDoc = null;

    // Month doc
    const analyticsMonthDoc = await getDoc(
        doc(
            db, 
            'organizations',
            organization_id,
            `worked_hours_analytics_${year}`,
            `month_${month}`
        )
    );

    if(analyticsMonthDoc.exists()){
        newAnalyticsMonthDoc = analyticsMonthDoc.data();
    }

    if(newAnalyticsMonthDoc != null){
        newAnalyticsMonthDoc[old_status] -= 1;
        newAnalyticsMonthDoc[new_status] += 1;

        await updateDoc(
            doc(
                db, 
                'organizations',
                organization_id,
                `worked_hours_analytics_${year}`,
                `month_${month}`
            ), 
            newAnalyticsMonthDoc
        );
    }

    return;
}
/*
    REF: GLOBALFUNC__UpdateWeekAnalyticsForOrganization__WorkedHours
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> Update the analytics for the worked hours for a specific week within the organization
*/
export const GLOBALFUNC__UpdateWeekAnalyticsForOrganization__WorkedHours = async (
    organization_id,
    year,
    week,
    old_status,
    new_status
) => {
    let newAnalyticsWeekDoc = null;

    // Week doc
    const analyticsWeekDoc = await getDoc(
        doc(
            db, 
            'organizations',
            organization_id,
            `worked_hours_analytics_${year}`,
            `week_${week}`
        )
    );

    if(analyticsWeekDoc.exists()){
        newAnalyticsWeekDoc = analyticsWeekDoc.data();
    }

    if(newAnalyticsWeekDoc != null){
        newAnalyticsWeekDoc[old_status] -= 1;
        newAnalyticsWeekDoc[new_status] += 1;

        await updateDoc(
            doc(
                db, 
                'organizations',
                organization_id,
                `worked_hours_analytics_${year}`,
                `week_${week}`
            ), 
            newAnalyticsWeekDoc
        );
    }

    return;
}
/*
    REF: GLOBALFUNC__UpdateMonthAnalyticsForManager__WorkedHours
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> Update the analytics for the worked hours for a specific month for users with the role 'manager' or 'admin' or 'projectleader'
*/
export const GLOBALFUNC__UpdateMonthAnalyticsForManager__WorkedHours = async (
    manager_id,
    year,
    month,
    old_status,
    new_status
) => {
    let newAnalyticsMonthDoc = null;

    // Month doc
    const analyticsMonthDoc = await getDoc(
        doc(
            db, 
            'users',
            manager_id,
            `my_resources_worked_hours_analytics_${year}`,
            `month_${month}`
        )
    );

    if(analyticsMonthDoc.exists()){
        newAnalyticsMonthDoc = analyticsMonthDoc.data();
    }

    if(newAnalyticsMonthDoc != null){
        newAnalyticsMonthDoc[old_status] -= 1;
        newAnalyticsMonthDoc[new_status] += 1;

        await updateDoc(
            doc(
                db, 
                'users',
                manager_id,
                `my_resources_worked_hours_analytics_${year}`,
                `month_${month}`
            ), 
            newAnalyticsMonthDoc
        );
    }

    return;
}
/*
    REF: GLOBALFUNC__UpdateWeekAnalyticsForManager__WorkedHours
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> Update the analytics for the worked hours for a specific week for users with the role 'manager' or 'admin' or 'projectleader'
*/
export const GLOBALFUNC__UpdateWeekAnalyticsForManager__WorkedHours = async (
    manager_id,
    year,
    week,
    old_status,
    new_status
) => {
    let newAnalyticsWeekDoc = null;

    // Week doc
    const analyticsWeekDoc = await getDoc(
        doc(
            db, 
            'users',
            manager_id,
            `my_resources_worked_hours_analytics_${year}`,
            `week_${week}`
        )
    );

    if(analyticsWeekDoc.exists()){
        newAnalyticsWeekDoc = analyticsWeekDoc.data();
    }

    if(newAnalyticsWeekDoc != null){
        newAnalyticsWeekDoc[old_status] -= 1;
        newAnalyticsWeekDoc[new_status] += 1;

        await updateDoc(
            doc(
                db, 
                'users',
                manager_id,
                `my_resources_worked_hours_analytics_${year}`,
                `week_${week}`
            ), 
            newAnalyticsWeekDoc
        );
    }

    return;
}
/*
    REF: GLOBALFUNC__UpdateMonthAnalyticsForResource__WorkedHours
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> Update the analytics for the worked hours for a specific month for users without the role 'manager' or 'admin' or 'projectleader'
*/
export const GLOBALFUNC__UpdateMonthAnalyticsForResource__WorkedHours = async (
    user_id,
    year,
    month,
    old_status,
    new_status,
    hours
) => {
    let newAnalyticsMonthDoc = null;

    // Month doc
    const analyticsMonthDoc = await getDoc(
        doc(
            db, 
            'users',
            user_id,
            `worked_hours_analytics_${year}`,
            `month_${month}`
        )
    );

    if(analyticsMonthDoc.exists()){
        newAnalyticsMonthDoc = analyticsMonthDoc.data();
    }

    if(newAnalyticsMonthDoc != null){
        newAnalyticsMonthDoc[old_status] -= 1;
        newAnalyticsMonthDoc[new_status] += 1;

        if(new_status == 'approved'){
            newAnalyticsMonthDoc['approved_hours'] += hours;
        }

        if(new_status == 'open'){
            newAnalyticsMonthDoc['approved_hours'] -= hours;
        }

        await updateDoc(
            doc(
                db, 
                'users',
                user_id,
                `worked_hours_analytics_${year}`,
                `month_${month}`
            ), 
            newAnalyticsMonthDoc
        );
    }

    return;
}
/*
    REF: GLOBALFUNC__UpdateWeekAnalyticsForResource__WorkedHours
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> Update the analytics for the worked hours for a specific week for users without the role 'manager' or 'admin' or 'projectleader'
*/
export const GLOBALFUNC__UpdateWeekAnalyticsForResource__WorkedHours = async (
    user_id,
    year,
    week,
    old_status,
    new_status,
    hours
) => {
    let newAnalyticsWeekDoc = null;

    // Week doc
    const analyticsWeekDoc = await getDoc(
        doc(
            db, 
            'users',
            user_id,
            `worked_hours_analytics_${year}`,
            `week_${week}`
        )
    );

    if(analyticsWeekDoc.exists()){
        newAnalyticsWeekDoc = analyticsWeekDoc.data();
    }

    if(newAnalyticsWeekDoc != null){
        newAnalyticsWeekDoc[old_status] -= 1;
        newAnalyticsWeekDoc[new_status] += 1;

        if(new_status == 'approved'){
            newAnalyticsWeekDoc['approved_hours'] += hours;
        }

        if(new_status == 'open'){
            newAnalyticsWeekDoc['approved_hours'] -= hours;
        }

        await updateDoc(
            doc(
                db, 
                'users',
                user_id,
                `worked_hours_analytics_${year}`,
                `week_${week}`
            ), 
            newAnalyticsWeekDoc
        );
    }

    return;
}
/*
    REF: GLOBALFUNC__UpdateAnalyticsForOrganization__Problems
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> Update the analytics for the problems within the organization
*/
export const GLOBALFUNC__UpdateAnalyticsForOrganization__Problems = async (
    organization_id,
    old_status,
    new_status,
    type,
    priority = null
) => {
    console.log('GLOBALFUNC__UpdateAnalyticsForOrganization__Problems activated');
    let newAnalyticsDoc = null;

    // Month doc
    const analyticsDoc = await getDoc(
        doc(
            db, 
            'organizations',
            organization_id,
            'analytics',
            'problems'
        )
    );

    if(analyticsDoc.exists()){
        newAnalyticsDoc = analyticsDoc.data();
    }

    if(newAnalyticsDoc != null){
        if(old_status != ''){
            newAnalyticsDoc[`status_${old_status}`] -= 1;
            if(type == 'update'){
                newAnalyticsDoc[`status_${new_status}`] += 1;
            } else {
                newAnalyticsDoc[`priority_${priority}`] -= 1;
            }
        } else {
            newAnalyticsDoc[`status_${new_status}`] += 1;
            newAnalyticsDoc[`priority_${priority}`] += 1;
        }

        await updateDoc(
            doc(
                db, 
                'organizations',
                organization_id,
                'analytics',
                'problems'
            ), 
            newAnalyticsDoc
        );
    }

    return;
}
/*
    REF: GLOBALFUNC__UpdateAnalyticsForManager__Problems
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> Update the analytics for the problems for users with the role 'manager' or 'admin' or 'projectleader'
*/
export const GLOBALFUNC__UpdateAnalyticsForManager__Problems = async (
    manager_id,
    old_status,
    new_status,
    type,
    priority = null
) => {
    console.log('GLOBALFUNC__UpdateAnalyticsForManager__Problems activated');
    let newAnalyticsDoc = null;

    // Month doc
    const analyticsDoc = await getDoc(
        doc(
            db, 
            'users',
            manager_id,
            'analytics',
            'problems'
        )
    );

    if(analyticsDoc.exists()){
        newAnalyticsDoc = analyticsDoc.data();
    }

    if(newAnalyticsDoc != null){
        if(old_status != ''){
            newAnalyticsDoc[`status_${old_status}`] -= 1;
            if(type == 'update'){
                newAnalyticsDoc[`status_${new_status}`] += 1;
            } else {
                newAnalyticsDoc[`priority_${priority}`] -= 1;
            }
        } else {
            newAnalyticsDoc[`status_${new_status}`] += 1;
            newAnalyticsDoc[`priority_${priority}`] += 1;
        }

        await updateDoc(
            doc(
                db, 
                'users',
                manager_id,
                'analytics',
                'problems'
            ), 
            newAnalyticsDoc
        );
    }

    return;
}
/*
    REF: GLOBALFUNC__UpdateAnalyticsForProject__Problems
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> Update the analytics for the problems within a specific project
*/
export const GLOBALFUNC__UpdateAnalyticsForProject__Problems = async (
    project_id,
    old_status,
    new_status,
    type,
    priority = null
) => {
    console.log('GLOBALFUNC__UpdateAnalyticsForProject__Problems activated');
    let newAnalyticsDoc = null;

    const analyticsDoc = await getDoc(
        doc(
            db, 
            'projects',
            project_id,
            'analytics',
            'problems'
        )
    );

    if(analyticsDoc.exists()){
        newAnalyticsDoc = analyticsDoc.data();
    }

    if(newAnalyticsDoc != null){
        if(old_status != ''){
            newAnalyticsDoc[`status_${old_status}`] -= 1;
            if(type == 'update'){
                newAnalyticsDoc[`status_${new_status}`] += 1;
            } else {
                newAnalyticsDoc[`priority_${priority}`] -= 1;
            }
        } else {
            newAnalyticsDoc[`status_${new_status}`] += 1;
            newAnalyticsDoc[`priority_${priority}`] += 1;
        }

        await updateDoc(
            doc(
                db, 
                'projects',
                project_id,
                'analytics',
                'problems'
            ), 
            newAnalyticsDoc
        );
    }

    return;
}
/*
    REF: GLOBALFUNC__UpdateAnalyticsForOrganization__Tasks
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> Update the analytics for the tasks within the organization
*/
export const GLOBALFUNC__UpdateAnalyticsForOrganization__Tasks = async (
    organization_id,
    old_status,
    new_status,
    type
) => {
    let newAnalyticsDoc = null;

    // Month doc
    const analyticsDoc = await getDoc(
        doc(
            db, 
            'organizations',
            organization_id,
            'analytics',
            'tasks'
        )
    );

    if(analyticsDoc.exists()){
        newAnalyticsDoc = analyticsDoc.data();
    }

    if(newAnalyticsDoc != null){
        newAnalyticsDoc[old_status] -= 1;
        if(type == 'update'){
            newAnalyticsDoc[new_status] += 1;
        }
        console.log('GLOBALFUNC__UpdateAnalyticsForOrganization__Tasks activated');

        await updateDoc(
            doc(
                db, 
                'organizations',
                organization_id,
                'analytics',
                'tasks'
            ), 
            newAnalyticsDoc
        );
    }

    return;
}
/*
    REF: GLOBALFUNC__UpdateAnalyticsForManager__Tasks
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> Update the analytics for the tasks for users with the role 'manager' or 'admin' or 'projectleader'
*/
export const GLOBALFUNC__UpdateAnalyticsForManager__Tasks = async (
    manager_id,
    old_status,
    new_status,
    type
) => {
    let newAnalyticsDoc = null;

    const analyticsDoc = await getDoc(
        doc(
            db, 
            'users',
            manager_id,
            'analytics',
            'tasks'
        )
    );

    if(analyticsDoc.exists()){
        newAnalyticsDoc = analyticsDoc.data();
    }

    if(newAnalyticsDoc != null){
        newAnalyticsDoc[old_status] -= 1;
        if(type == 'update'){
            newAnalyticsDoc[new_status] += 1;
        }
        console.log('GLOBALFUNC__UpdateAnalyticsForManager__Tasks activated');

        await updateDoc(
            doc(
                db, 
                'users',
                manager_id,
                'analytics',
                'tasks'
            ), 
            newAnalyticsDoc
        );
    }

    return;
}
/*
    REF: GLOBALFUNC__UpdateAnalyticsForProject__Tasks
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> Update the analytics for the tasks within a specific project
*/
export const GLOBALFUNC__UpdateAnalyticsForProject__Tasks = async (
    project_id,
    old_status,
    new_status,
    type
) => {
    let newAnalyticsDoc = null;

    const analyticsDoc = await getDoc(
        doc(
            db, 
            'projects',
            project_id,
            'analytics',
            'tasks'
        )
    );

    if(analyticsDoc.exists()){
        newAnalyticsDoc = analyticsDoc.data();
    }

    if(newAnalyticsDoc != null){
        newAnalyticsDoc[old_status] -= 1;
        if(type == 'update'){
            newAnalyticsDoc[new_status] += 1;
        }

        console.log('GLOBALFUNC__UpdateAnalyticsForProject__Tasks activated');

        await updateDoc(
            doc(
                db, 
                'projects',
                project_id,
                'analytics',
                'tasks'
            ), 
            newAnalyticsDoc
        );
    }

    return;
}
/*
*
*
*
*
    REF: Customer related functions
*
*
*
*
*/
/*
    REF: GLOBALFUNC__Customer__ValidateEmail
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> Check if the email of a customer doesnt already exists within the organization
*/
export const GLOBALFUNC__Customer__ValidateEmail = async (
    email,
    organization_id = null
  ) => {
    const customersQuery = firestoreQuery(
        collection(
            db, 
            'customers'
        ), 
        where("email", "==", email),
        where("organization_id", "==", organization_id),
        limit(1)
    );
    const customersSnap = await getDocs(customersQuery);
    return customersSnap.empty;
}
/*
    REF: GLOBALFUNC__Customer__ValidateEmail
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> 
*/
export const GLOBALFUNC__CreateCustomer = async (
    organization_id,
    customer
) => {
    console.log(customer);
    const customerData = {
        name: customer.name,
        contactperson: customer.contactperson,
        email: customer.email,
        phonenumber: customer.phonenumber,
        organization_id: organization_id,
        linked_projects: [],
        date_added: Timestamp.fromDate(new Date(customer.date_added))
    };

    const customerDoc = await addDoc(
        collection(
          db, 
          'customers'
        ), 
        customerData
    );
    return customerDoc;
}
/*
    REF: GLOBALFUNC__Customer__CheckForLinkedProjects
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> Check if a customer has any projects linked to them
*/
export const GLOBALFUNC__Customer__CheckForLinkedProjects = async (
    customer_id
  ) => {
    let valid = true;

    const projectsQuery = firestoreQuery(
        collection(
            db, 
            'projects'
        ), 
        where("customer_id", "==", customer_id),
        limit(1)
    );
    const projectsSnap = await getDocs(projectsQuery);
    if(!projectsSnap.empty){
        valid = false;
    }

    return valid;
}
/*
*
*
*
*
    REF: Algolia related functions
*
*
*
*
*/
/*
    REF: GLOBALFUNC__CreateAlgoliaSearch
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> 
*/
export const GLOBALFUNC__CreateAlgoliaSearch = async (
    document_collection,
    description,
    document_id,
    name,
    organization_id,
    project_manager_id = '',
    manager_id = '',
    status = '',
    project_id = '',
    phase_id = '',
    task_id = '',
    members = []
) => {
    const algoliaData = {
        collection: document_collection.trim(),
        description: description.trim(),
        document_id: document_id.trim(),
        name: name.trim(),
        organization_id: organization_id.trim(),
        status: status.trim(),
        manager_id: manager_id.trim(),
        project_id: project_id.trim(),
        phase_id: phase_id.trim(),
        task_id: task_id.trim(),
        project_manager_id: project_manager_id.trim(),
        members: members
    };

    await addDoc(
        collection(
          db, 
          'algolia_search'
        ), 
        algoliaData
    );
    return;
}
/*
    REF: GLOBALFUNC__UpdateAlgoliaSearch
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> 
*/
export const GLOBALFUNC__UpdateAlgoliaSearch = async (
    document_id,
    data
) => {
    let relevantDocID = null;
    const relevantDocQuery = firestoreQuery(
        collection(
            db, 
            'algolia_search'
        ), 
        where("document_id", "==", document_id)
    );
    const relevantDocSnap = await getDocs(relevantDocQuery);
    if(!relevantDocSnap.empty){
        relevantDocSnap.forEach(doc => {
            relevantDocID = doc.id
        });
        
        await updateDoc(
            doc(
                db, 
                'algolia_search', 
                relevantDocID
            ), 
            data
        );
    }
    return;
}
/*
    REF: GLOBALFUNC__UpdateAlgoliaSearch__Description
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> Update the description of an algolia document
*/
export const GLOBALFUNC__UpdateAlgoliaSearch__Description = async (
    document_id,
    type,
    data
) => {
    let relevantDocsQuery = null;
    let promises = [];

    switch(type){
        case 'task':
            relevantDocsQuery = firestoreQuery(
                collection(
                    db, 
                    'algolia_search'
                ), 
                where("task_id", "==", document_id)
            );
            break;
    }
    const relevantDocsSnap = await getDocs(relevantDocsQuery);
    if(!relevantDocsSnap.empty){
        relevantDocsSnap.forEach(document => {
            if(document.data().collection != ''){
                let updatedAlgoliaDoc = null;
                let oldDescription = '';
                let newDescription = '';
                let insertData = null;

                switch(document.data().collection){
                    case 'problem':
                        oldDescription = document.data().description.split('&rarr;');
                        newDescription = `${oldDescription[0].trim()} &rarr; ${oldDescription[1].trim()} &rarr; ${data.trim()}`;
                        insertData = {
                            description: newDescription
                        }

                        updatedAlgoliaDoc = updateDoc(
                            doc(
                                db, 
                                'algolia_search', 
                                document.id
                            ), 
                            insertData
                        );
                        promises.push(updatedAlgoliaDoc);
                        break;
                }   
            }
        });

        await Promise.all(promises);
    }
    return;
}
/*
    REF: GLOBALFUNC__DeleteAlgoliaSearch
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> Update the description of an algolia document
*/
export const GLOBALFUNC__DeleteAlgoliaSearch = async (
    document_id
) => {
    let relevantDocID = null;
    const relevantDocQuery = firestoreQuery(
        collection(
            db, 
            'algolia_search'
        ), 
        where("document_id", "==", document_id)
    );
    const relevantDocSnap = await getDocs(relevantDocQuery);
    if(!relevantDocSnap.empty){
        relevantDocSnap.forEach(doc => {
            relevantDocID = doc.id
        });

        await deleteDoc(
            doc(
                db,
                'algolia_search',
                relevantDocID
            )
        );
    }
    return;
}
/*
*
*
*
*
    REF: Problem related functions
*
*
*
*
*/
/*
    REF: GLOBALFUNC__GetProblem
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> 
*/
export const GLOBALFUNC__GetProblem = async (
    problem_id
) => {
    let returnedProblemDoc = null;
    const problemDoc = await getDoc(
        doc(
            db, 
            'problems',
            problem_id
        )
    );

    if(problemDoc.exists()){
        returnedProblemDoc = problemDoc;
    }

    return returnedProblemDoc;
}
/*
    REF: GLOBALFUNC__CreateProblem
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> 
*/
export const GLOBALFUNC__CreateProblem = async (
    long_description,
    manager_id,
    project_manager_id,
    organization_id,
    task_id,
    phase_id,
    priority,
    project_id,
    related_component_type,
    short_description,
    user_id
) => {
    const docData = {
        date_added: Timestamp.fromDate(new Date()),
        long_description: long_description,
        manager_id: manager_id,
        project_manager_id: project_manager_id,
        organization_id: organization_id,
        task_id: task_id,
        phase_id: phase_id,
        priority: priority,
        project_id: project_id,
        related_component_type: related_component_type,
        resolved_comment: {
            comment: '',
            date_added: null,
            user_id: ''
        },
        short_description: short_description,
        status: 'open',
        user_id: user_id,
    };

    const problemDoc = await addDoc(
        collection(
          db, 
          'problems'
        ), 
        docData
    );
    return problemDoc.id;
}
/*
    REF: GLOBALFUNC__UpdateProblem
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> 
*/
export const GLOBALFUNC__UpdateProblem = async (
    document_id,
    data
) => {
    await updateDoc(
        doc(
            db, 
            'problems', 
            document_id
        ), 
        data
    );
    return;
}
/*
    REF: GLOBALFUNC__GetAnArrayOfProblems
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> Fetching an array of problems
*/
export const GLOBALFUNC__GetAnArrayOfProblems = async (
    problemsSnap,
    problemsData
) => {
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
                resolved_comment: doc.data().resolved_comment,
                project_manager_id: doc.data().project_manager_id
            });
        });

        if(problemsData.problems.length == 20){
            problemsData.last_visible = problemsData.problems[problemsData.problems.length - 1].date_added;
        } else {
            problemsData.last_visible = 'end_has_been_reached';
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

    return problemsData;
}