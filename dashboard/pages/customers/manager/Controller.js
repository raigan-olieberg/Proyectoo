// Global / Page / Layout components
import { 
    GLOBALFUNC__POSTREQUEST,
    GLOBALFUNC__SelectItemForSidebar
} from '../../../helpers/GlobalFunctions';

export const FUNC__GetCustomers = async (
    organization_id,
    setCustomersObject,
    setDataHasLoaded,
    lastVisible,
    setLastVisible
) => {
    const result = await GLOBALFUNC__POSTREQUEST(
        'http://localhost:6001/api/manager/customer/get-customers',
        {
            organization_id: organization_id,
            lastVisible: lastVisible
        }
    );
    console.log(result);
    if(result.response == 'successfull'){
        if(result.message.customers != null){
           setCustomersObject(result.message.customers);
        } else {
            setCustomersObject([]);
        }
        setLastVisible(result.message.last_visible);
    } else {
        /*etErrorMessage({
            field_id: "user-empty",
            message: "Oeps, er gaat iets mis. Probeer het a.u.b. nog een keer of neem contact met ons op."
        });*/
    }
    setDataHasLoaded(true);
}

export const FUNC__CreateCustomer = (
    appContext,
    customersObject,
    setCustomersObject
) => {
    GLOBALFUNC__SelectItemForSidebar(
        appContext, 
        null, 
        "right", 
        {
            page: 'customers/manager/add', 
            title: 'Klant aanmaken',  
            data: {
                customersObject: customersObject,
                setCustomersObject: setCustomersObject
            }
        }
    );
}

export const FUNC__LoadMoreCustomers = async (
    params
) => {
    console.log(params);
    const setLoadingMoreData = params[0] != undefined ? params[0] : null;
    const organization_id = params[1] != undefined ? params[1] : null;
    const customersObject = params[2] != undefined ? params[2] : null;
    const setCustomersObject = params[3] != undefined ? params[3] : null;
    const lastVisible = params[4] != undefined ? params[4] : null;
    const setLastVisible = params[5] != undefined ? params[5] : null;
    
    setLoadingMoreData(true);

    const result = await GLOBALFUNC__POSTREQUEST(
        'http://localhost:6001/api/manager/customer/get-customers',
        {
            organization_id: organization_id,
            last_visible: lastVisible,
        }
    );
    console.log(result);
    if(result.response == 'successfull'){
        if(result.message.customers != null){
            const newCustomersObject = [...customersObject];
            result.message.customers.map(item => (
                newCustomersObject.push(item)
            ));
            setCustomersObject(newCustomersObject);
        }
        setLastVisible(result.message.last_visible);
    } else {
        /*etErrorMessage({
            field_id: "user-empty",
            message: "Oeps, er gaat iets mis. Probeer het a.u.b. nog een keer of neem contact met ons op."
        });*/
    }
    setLoadingMoreData(false);
}

export const FUNC__EditCustomer = (
    appContext,
    customersObject,
    setCustomersObject,
    customer
) => {
    GLOBALFUNC__SelectItemForSidebar(
        appContext, 
        null, 
        "right", 
        {
            page: 'customers/manager/edit', 
            title: 'Klant inzien / aanpassen',  
            data: {
                customersObject: customersObject,
                setCustomersObject: setCustomersObject,
                customer: customer
            }
        }
    );
}