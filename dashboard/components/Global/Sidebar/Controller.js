// Global / Page / Layout components
import { 
    GLOBALFUNC__POSTREQUEST,
    GLOBALFUNC__SelectItemForSidebar,
    GLOBALFUNC__DayNames,
    GLOBALFUNC__MonthNames,
    GLOBALFUNC__TranslateSecondsToDate
} from '../../../helpers/GlobalFunctions';

export const FUNC__GetUsers = async (
    organization_id,
    setResourcesObject,
    setDataHasLoaded,
    keyFilter,
    lastVisible,
    setLastVisible,
    manager_id,
    loggedin_user_role
) => {
    let APIUrl = '';
    if(loggedin_user_role == 'Admin'){
        APIUrl = 'http://localhost:6001/api/admin/resource/get-users'
    } else {
        APIUrl = 'http://localhost:6001/api/manager/resource/get-users'
    }
    const result = await GLOBALFUNC__POSTREQUEST(
        APIUrl,
        {
            organization_id: organization_id,
            key_filter: keyFilter,
            last_visible: lastVisible,
            manager_id: manager_id,
            get_occupation: {
                day: '21-6-2025',
                week: 25,
                year: 2025
            }
        }
    );
    console.log(result);
    if(result.response == 'successfull'){
        if(result.message.resources != null){
           setResourcesObject(result.message.resources);
        } else {
            setResourcesObject([]);
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

export const FUNC__LoadMoreUsers = async (
    organization_id,
    resourcesObject,
    setResourcesObject,
    keyFilter,
    lastVisible,
    setLastVisible,
    manager_id,
    loggedin_user_role,
    setLoadmoreData
) => {
    let APIUrl = '';
    if(loggedin_user_role == 'Admin'){
        APIUrl = 'http://localhost:6001/api/admin/resource/get-users'
    } else {
        APIUrl = 'http://localhost:6001/api/manager/resource/get-users'
    }
    const result = await GLOBALFUNC__POSTREQUEST(
        APIUrl,
        {
            organization_id: organization_id,
            key_filter: keyFilter,
            last_visible: lastVisible,
            manager_id: manager_id
        }
    );
    console.log(result);
    if(result.response == 'successfull'){
        if(result.message.resources != null){
            const newResourcesObject = [...resourcesObject];
            result.message.resources.map(item => (
                newResourcesObject.push(item)
            ));
            setResourcesObject(newResourcesObject);
        }
        setLastVisible(result.message.last_visible);
        setLoadmoreData(false);
    } else {
        /*etErrorMessage({
            field_id: "user-empty",
            message: "Oeps, er gaat iets mis. Probeer het a.u.b. nog een keer of neem contact met ons op."
        });*/
    }
}

export const FUNC__SelectResource = (
    planningItemObject,
    planningSetItemObject,
    setResourcesObject,
    resourcesObject,
    resource
) => {
    const newItemObject = {...planningItemObject};
    newItemObject.assigned_to.push(resource);
    planningSetItemObject(newItemObject);
    let newResourcesObject = [...resourcesObject];
    newResourcesObject = newResourcesObject.filter(x => x.user_id != resource.user_id);
    setResourcesObject(newResourcesObject);
}

export const FUNC__DeleteResource = (
    planningItemObject,
    planningSetItemObject,
    setResourcesObject,
    resourcesObject,
    resource
) => {
    console.log('FUNC__DeleteResource activated');
    /*const newItemObject = {...planningItemObject};
    newItemObject.assigned_to.push(resource);
    planningSetItemObject(newItemObject);


    let newResourcesObject = [...resourcesObject];
    newResourcesObject = newResourcesObject.filter(x => x.user_id != resource.user_id);
    setResourcesObject(newResourcesObject);*/
}