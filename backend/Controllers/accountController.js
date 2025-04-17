import firebase from '../firebase.js';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  arrayUnion,
  query as firestoreQuery,
  where
} from 'firebase/firestore';
import {
  hashSync,
  compareSync
} from "bcrypt";
import { randomBytes } from 'crypto';
import { GLOBALFUNC__SendEmail } from '../Global/GlobalFunctions.js';

const db = getFirestore(firebase);
const saltRounds = 10;


export const createAccount = async (req, res, next) => {
    let organizationID = null;
    let userID = null;
    const currentYear = new Date().getFullYear();

    try {
      // Add organization
      const organizationData = {
        name: req.body.organization.name.trim(),
        address: {
          housenumber: req.body.organization.housenumber,
          place: req.body.organization.place.trim(),
          street: req.body.organization.street.trim(),
          zipcode: req.body.organization.housenumber,
        },
        teams_total: req.body.organization.teams_total,
        members_total: 1,
        allocated_document_data: req.body.organization.allocated_document_data,
        admins: [],
        subscription: {
          type: req.body.organization.subscription_type,
          enddate: req.body.organization.subscription_enddate,
        }
      };
      const organizationDoc = await addDoc(
        collection(
          db, 
          'organizations'
        ), 
        organizationData
      );
      organizationID = organizationDoc.id;

      // Create analytics -> worked_hours
      const analyticsWorkedhoursData = {
        months: {
          1: {
            total: 0,
            filled: 0
          }
        },
        weeks: {
          1: {
            total: 0,
            filled: 0
          }
        }
      };
      await setDoc(
        doc(
          db, 
          'organizations', 
          organizationID,
          'analytics',
          `worked_hours_${currentYear}`
        ), 
        analyticsWorkedhoursData
      );

      // Create analytics -> projects
      const analyticsProjectsData = {
        open: 0,
        on_schedule: 0,
        at_risk: 0,
        completed: 0,
        total: 0
      };
      await setDoc(
        doc(
          db, 
          'organizations', 
          organizationID,
          'analytics',
          'projects'
        ), 
        analyticsProjectsData
      );

      // Create analytics -> tasks
      const analyticsTasksData = {
        in_progress: 0,
        overdue: 0,
        stuck: 0,
        total: 0,
        completed: 0,
        unasigned: 0,
        open: 0
      };
      await setDoc(
        doc(
          db, 
          'organizations', 
          organizationID,
          'analytics',
          'tasks'
        ), 
        analyticsTasksData
      );
      
      // Create analytics -> problems
      const analyticsProblemsData = {
        priority_high: 0,
        priority_low: 0,
        priority_medium: 0,
        status_in_progress: 0,
        status_open: 0,
        status_resolved: 0,
        total: 0
      };
      await setDoc(
        doc(
          db, 
          'organizations', 
          organizationID,
          'analytics',
          'problems'
        ), 
        analyticsProblemsData
      );
      
      // Add user 
      const userData = {
        firstname: req.body.user.firstname.trim(),
        lastname: req.body.user.lastname.trim(),
        role: req.body.user.role,
        label: req.body.user.label.trim(),
        email: req.body.user.email.trim(),
        phonenumber: req.body.user.phonenumber.trim(),
        profile_photo: {
          thumbnail: '',
          medium: '',
          big: ''
        },
        password: hashSync(req.body.user.password, saltRounds),
        organization_id: organizationID,
        status: req.body.user.status,
        admin: true
      };
      const userDoc = await addDoc(
        collection(
          db, 
          'users'
        ), 
        userData
      );
      userID = userDoc.id;

      // Update organization
      const data = {
        admins: arrayUnion(userID)
      }
      await updateDoc(
        doc(
          db, 
          'organizations', 
          organizationDoc.id
        ), 
        data
      );

      res.status(200).send({
        response: 'successfull',
        message: {
          user_id: userID,
          organization_id: organizationID
        }
      });
    } catch (error) {
      // Delete organization doc
      if(organizationID != null){
        await deleteDoc(doc(db, 'organizations', organizationID));
      }
      // Delete user doc
      if(userID != null){
        await deleteDoc(doc(db, 'users', userID));
      }

      res.status(400).send({
        response: 'error',
        message: error.message 
      });
    }
};

export const validateEmail = async (req, res, next) => {
  try {
    const usersQuery = firestoreQuery(
      collection(
        db, 
        'users'
      ), 
      where("email", "==", req.body.user.email)
    );
    const usersSnap = await getDocs(usersQuery);

    res.status(200).send({
      response: usersSnap.empty ? 'successfull' : 'unsuccessfull',
      message: ''
    });
  } catch (error) {
    res.status(400).send({
      response: 'error',
      message: error.message 
    });
  }
}

export const login = async (req, res, next) => {
  try {
    // Authenticate
    let authenticate = false;
    let response = '';
    let userData = {
      user: null,
      organization: null
    }
    const usersQuery = firestoreQuery(
      collection(
        db, 
        'users'
      ), 
      where("email", "==", req.body.user.email)
    );
    const usersSnap = await getDocs(usersQuery);

    if(!usersSnap.empty){
      usersSnap.forEach((doc) => {
        if(compareSync(req.body.user.password, doc.data().password)){
          authenticate = true;
          userData.user = doc.data();
        }
      });
    }

    if(authenticate){
      if(userData.user.role == "Manager"){
        const organization = doc(
          db, 
          'organizations', 
          userData.user.organization_id
        );
        const organizationDoc = await getDoc(organization);

        if (organizationDoc.exists()) {
          userData.organization = organizationDoc.data();
        }
        response = 'successfull';
      } else {
        response = 'not_allowed';
      }
    } else {
      response = 'unsuccessfull';
    }

    res.status(200).send({
      response: response,
      message: userData
    });
  } catch (error) {
    res.status(400).send({
      response: 'error',
      message: error.message 
    });
  }
}

export const resetPassword = async (req, res, next) => {
  try {
    let token = null;
    let userID = null;
    let userData = null;
    let tokenId = null;
    let organizationID = null;

    // Authenticate
    let authenticate = false;
    const usersQuery = firestoreQuery(
      collection(db, 
        'users'
      ), 
      where("email", "==", req.body.email)
    );
    const usersSnap = await getDocs(usersQuery);

    if(!usersSnap.empty){
      usersSnap.forEach((doc) => {
        authenticate = true;
        userID = doc.id;
        userData = doc.data();
        organizationID = doc.data().organization_id;
        token = `${randomBytes(64).toString('hex')}.${userID}.${organizationID}`;
      });
    }

    if(authenticate){
      const tokenData = {
        user_id: userID,
        token: token,
        subject: "reset_password"
      }
      const tokenDoc = await addDoc(
        collection(
          db, 
          'organizations', 
          organizationID, 
          'tokens'
        ), 
        tokenData
      );
      tokenId = tokenDoc.id;
      token = `${token}.${tokenId}`;

      await GLOBALFUNC__SendEmail(
        'reset_password',
        userData,
        null,
        token
      );
    }
    
    res.status(200).send({
      response: authenticate ? 'successfull' : 'unsuccessfull',
      message: ''
    });
  } catch (error) {
    res.status(400).send({
      response: 'error',
      message: error.message 
    });
  }
}

export const setNewPassword = async (req, res, next) => {
  try {
    let authenticate = false;
    const userID = req.body.token.split('.')[1];
    const organizationID = req.body.token.split('.')[2];
    const tokenID = req.body.token.split('.')[3];

    // Check if request is coming from loggedin user
    if(tokenID != undefined
      && tokenID != ''){
      const tokensSnap = await getDoc(doc(db, 'organizations', organizationID, 'tokens', tokenID));
      if(!tokensSnap.empty){
        authenticate = true;
      }
    }

    if(authenticate){
      // Set new password
      const data = {
        password: hashSync(req.body.password, saltRounds)
      }
      await updateDoc(
        doc(
          db, 
          'users', 
          userID
        ), 
        data
      );

      // Delete token
      await deleteDoc(
        doc(
          db, 
          'organizations', 
          organizationID, 
          'tokens', 
          tokenID
        )
      );
    }

    res.status(200).send({
      response: authenticate ? 'successfull' : 'unsuccessfull',
      message: ''
    });
  } catch (error) {
    res.status(400).send({
      response: 'error',
      message: error.message 
    });
  }
} 