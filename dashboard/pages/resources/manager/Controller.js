// Global / Page / Layout components
import { 
    GLOBALFUNC__POSTREQUEST,
    GLOBALFUNC__SelectItemForSidebar
} from '../../../helpers/GlobalFunctions';
import algoliasearch from 'algoliasearch';

const algolia_appID = "A9215M41YD";
const algolia_apiKey = "4228058aa9788d14620738f811390357";
const algolia_client = algoliasearch(
  algolia_appID,
  algolia_apiKey
);
const algolia_index = algolia_client.initIndex('algolia_search');


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
    const dateToday = new Date();
    const dateTodayUTC = Date.UTC(
        dateToday.getFullYear(), 
        dateToday.getMonth(),
        dateToday.getDate(),
        dateToday.getHours(),
        dateToday.getMinutes(),
        dateToday.getSeconds()
    );
    let apiEndPoint = keyFilter.key == 'status' && keyFilter.value == 'Leave_of_absence' ? 'get-leave-of-absence-users' : 'get-users';
    if(loggedin_user_role == 'Admin'){
        APIUrl = `http://localhost:6001/api/admin/resource/${apiEndPoint}`;
    } else {
        APIUrl = `http://localhost:6001/api/manager/resource/${apiEndPoint}`;
    }
    const result = await GLOBALFUNC__POSTREQUEST(
        APIUrl,
        {
            organization_id: organization_id,
            key_filter: keyFilter,
            last_visible: lastVisible,
            manager_id: manager_id,
            get_manager: loggedin_user_role == 'Admin',
            check_if_resource_has_absence_of_leave: dateTodayUTC
        }
    );
    if(result.response == 'successfull'){
        if(result.message.resources){
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

export const FUNC__CreateResource = (
    appContext,
    resourcesObject,
    setResourcesObject
) => {
    GLOBALFUNC__SelectItemForSidebar(
        appContext, 
        null, 
        "right", 
        {
            page: 'resources/manager/user/add', 
            title: 'Gebruiker aanmaken',  
            data: {
                resourcesObject: resourcesObject,
                setResourcesObject: setResourcesObject
            }
        }
    );
}

export const FUNC__LoadMoreUsers = async (
    setCurrentlyLoadingMoreData,
    organization_id,
    resourcesObject,
    setResourcesObject,
    keyFilter,
    lastVisible,
    setLastVisible,
    manager_id,
    loggedin_user_role
) => {    
    const dateToday = new Date();
    const dateTodayUTC = Date.UTC(
        dateToday.getFullYear(), 
        dateToday.getMonth(),
        dateToday.getDate(),
        dateToday.getHours(),
        dateToday.getMinutes(),
        dateToday.getSeconds()
    );
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
            get_manager: loggedin_user_role == 'Admin',
            check_if_resource_has_absence_of_leave: dateTodayUTC
        }
    );
    if(result.response == 'successfull'){
        if(result.message.resources){
            const newResourcesObject = [...resourcesObject];
            result.message.resources.map(item => (
                newResourcesObject.push(item)
            ));
            setResourcesObject(newResourcesObject);
        }
        setLastVisible(result.message.last_visible);
    } else {
        /*etErrorMessage({
            field_id: "user-empty",
            message: "Oeps, er gaat iets mis. Probeer het a.u.b. nog een keer of neem contact met ons op."
        });*/
    }
    setCurrentlyLoadingMoreData(false);
}

export const FUNC__SearchUsers = async (
    value,
    setSearchInputValue,
    setShowAlgoliaSearchResults,
    setAlgoliaSearchObject,
    organization_id,
    loggedin_user_role,
    manager_id
) => {
    try{
        setSearchInputValue(value);
        let filters = null;
        if(loggedin_user_role == 'Admin'){
            filters = [
                'collection:users',
                `organization_id:'${organization_id}'`
            ];
        } else {
            filters = [
                'collection:users',
                `organization_id:'${organization_id}'`,
                `manager_id:'${manager_id}'`
            ]
        }
        if(value == ''){
            setShowAlgoliaSearchResults(false);
            return;
        }
        setShowAlgoliaSearchResults(true);
        algolia_index.search(value, 
            {
                facetFilters: filters
            }
        ).then(({ hits }) => {
            setAlgoliaSearchObject(
                hits.filter((item) => item.document_id != manager_id)
            );
        });
    } catch (error) {
        //console.log(error);
    }
}

export const FUNC__SelectSearchedUser = (
    user_id,
    appContext,
    resourcesObject,
    setResourcesObject,
    setShowAlgoliaSearchResults,
    setSearchInputValue
) => {
    setShowAlgoliaSearchResults(false);
    setSearchInputValue('');
    GLOBALFUNC__SelectItemForSidebar(
        appContext, 
        user_id, 
        "right", 
        {
            page: 'resources/manager/user/edit', 
            title: 'Gebruiker inzien / aanpassen',  
            data: {
                resourcesObject: resourcesObject,
                setResourcesObject: setResourcesObject,
                user_id: user_id,
                fetchResourceFromServer: true
            }
        }
    );
}

export const FUNC__EditResource = (
    appContext,
    resourcesObject,
    setResourcesObject,
    resource
) => {
    GLOBALFUNC__SelectItemForSidebar(
        appContext, 
        resource.user_id, 
        "right", 
        {
            page: 'resources/manager/user/edit', 
            title: 'Gebruiker inzien / aanpassen',  
            data: {
                resourcesObject: resourcesObject,
                setResourcesObject: setResourcesObject,
                resource: resource,
                fetchResourceFromServer: false
            }
        }
    );
}

export const FUNC__ChangeOverviewKeyFilter = async (
    type,
    value,
    keyFilter,
    setKeyFilter
) => {
    if(type == 'key'){
        let defaultValue = '';
        if(value == 'role'){
            defaultValue = 'Member';
        } else {
            defaultValue = 'Sick';
        }
        setKeyFilter({
            key: value,
            value: defaultValue
        });
    } else {
        setKeyFilter({
            ...keyFilter,
            value: value
        });
    }
}