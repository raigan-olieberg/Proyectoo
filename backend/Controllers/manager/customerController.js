import firebase from '../../firebase.js';
import {
  getFirestore,
  collection,
  doc,
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
    GLOBALFUNC__CreateCustomer,
    GLOBALFUNC__Customer__ValidateEmail,
    GLOBALFUNC__Customer__CheckForLinkedProjects
} from '../../Global/GlobalFunctions.js';

const db = getFirestore(firebase);

export const getCustomersForManager = async (req, res, next) => {
    let customerData = {};
    customerData['last_visible'] = null;
    customerData['customers'] = null;
    let customersQuery = null;
  
    try {
        if(req.body.last_visible == null){
            customersQuery = firestoreQuery(
                collection(
                    db, 
                    'customers'
                ),
                where('organization_id', '==', req.body.organization_id),
                orderBy('date_added', 'desc'),
                limit(20)
            );
        } else {
            customersQuery = firestoreQuery(
                collection(
                    db, 
                    'customers'
                ),
                where('organization_id', '==', req.body.organization_id),
                orderBy('date_added', 'desc'),
                startAfter(Timestamp.fromMillis(req.body.last_visible.seconds * 1000)),
                limit(20)
            );
        }
        const customersSnap = await getDocs(customersQuery);
  
        if(!customersSnap.empty){
            customerData.customers = [];
            customersSnap.forEach(doc => {
                if(req.body.manager_id != doc.id){
                    customerData.customers.push({
                        customer_id: doc.id,
                        name: doc.data().name,
                        contactperson: doc.data().contactperson,
                        phonenumber: doc.data().phonenumber,
                        email: doc.data().email,
                        linked_projects: doc.data().linked_projects,
                        date_added: doc.data().date_added
                    });
                }
            });

            if(customerData.customers.length == 20){
                customerData.last_visible = customerData.customers[customerData.customers.length - 1].date_added;
            } else {
                customerData.last_visible = null;
            }
        }

        res.status(200).send({
            response: 'successfull',
            message: customerData
        });
    } catch (error) {
        res.status(400).send({
            response: 'error',
            message: error.message 
        });
    }
}

export const createCustomer = async (req, res, next) => {
    let responseSuccess = 'unsuccessfull';
    let responseMessage = null;
    let customer_id = null;
  
    try {
      const validateEmail = await GLOBALFUNC__Customer__ValidateEmail(
        req.body.customer.email.trim(),
        req.body.organization_id
      );
  
      if(validateEmail){
        const customer = await GLOBALFUNC__CreateCustomer(
          req.body.organization_id,
          req.body.customer
        );
  
        customer_id = customer.id;
  
        responseMessage = customer.id;
        responseSuccess = 'successfull';
      } else {
        responseMessage = 'invalid_email';
      }
  
      res.status(200).send({
        response: responseSuccess,
        message: responseMessage
      });
    } catch (error) {
      if(customer_id != null){
        await deleteDoc(doc(
          db, 
          'customers', 
           customer_id
        ));
      }
      res.status(400).send({
        response: 'error',
        message: error.message 
      });
    }
}

export const updateCustomer = async (req, res, next) => {
    try {
      const data = {
        name: req.body.customer.name,
        contactperson: req.body.customer.contactperson,
        email: req.body.customer.email,
        phonenumber: req.body.customer.phonenumber
      };
      await updateDoc(
        doc(
          db, 
          'customers', 
          req.body.customer.customer_id
        ), 
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

export const deleteCustomer = async (req, res, next) => {
    let responseSuccess = 'unsuccessfull';
   
    try {
        const validateLinkedProjects = await GLOBALFUNC__Customer__CheckForLinkedProjects(
            req.body.customer_id
        );

        if(validateLinkedProjects){
            await deleteDoc(doc(
                db, 
                'customers', 
                req.body.customer_id
            ));

            responseSuccess = 'successfull';
        }

        res.status(200).send({
            response: responseSuccess,
            message: ''
        });
    } catch (error) {
        res.status(400).send({
            response: 'error',
            message: error.message 
        });
    }
}