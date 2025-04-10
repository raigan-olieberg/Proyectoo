// Global / Page / Layout components
import { 
    GLOBALFUNC__POSTREQUEST,
    GLOBALFUNC__SelectItemForSidebar
} from '../../../helpers/GlobalFunctions';
import { 
    getWeek
} from 'date-fns';

export const FUNC__GetWeeks = () => {
    let weeks = [];
    for(let i=1;i<=52;i++){
        weeks.push(i);
    };
    return weeks;
}

export const FUNC__GetMonths = () => {
    let months = [];
    for(let i=0;i<=11;i++){
        months.push(i);
    };
    return months;
}

export const FUNC__ChangeCurrentView = (
    currentView,
    setCurrentView
) => {
    setCurrentView(currentView == 'overview' ? 'analytics' : 'overview');
}

export const FUNC__GetResourcesWorkedHours = async (
    organization_id,
    setResourcesWorkedHoursObject,
    setDataHasLoaded,
    keyFilter,
    currentYear,
    overviewSortFilter,
    lastVisible,
    setLastVisible,
    manager_id,
    loggedin_user_role
) => {
    console.log(manager_id);
    let APIUrl = '';
    if(loggedin_user_role == 'Admin'){
        APIUrl = 'http://localhost:6001/api/admin/workedhour/get-resources-workedhours'
    } else {
        APIUrl = 'http://localhost:6001/api/manager/workedhour/get-resources-workedhours'
    }
    const result = await GLOBALFUNC__POSTREQUEST(
        APIUrl,
        {
            organization_id: organization_id,
            key_filter: keyFilter,
            current_year: currentYear,
            sort_filter: overviewSortFilter,
            last_visible: lastVisible,
            manager_id: manager_id
        }
    );
    console.log(result);
    if(result.response == 'successfull'){
        if(result.message.items != null){
            setResourcesWorkedHoursObject(result.message.items);
        } else {
            setResourcesWorkedHoursObject([]);
        }
        setLastVisible(result.message.last_visible);
    } else {
        /*setErrorMessage({
            field_id: "user-empty",
            message: "Oeps, er gaat iets mis. Probeer het a.u.b. nog een keer of neem contact met ons op."
        });*/
    }
    setDataHasLoaded(true);
}

export const FUNC__LoadMoreResourcesWorkedHoursData = async (
    params
) => {
    const setLoadingMoreData = params[0] != undefined ? params[0] : null;
    const organization_id = params[1] != undefined ? params[1] : null;
    const resourcesWorkedHoursObject = params[2] != undefined ? params[2] : null;
    const setResourcesWorkedHoursObject = params[3] != undefined ? params[3] : null;
    const keyFilter = params[4] != undefined ? params[4] : null;
    const currentYear = params[5] != undefined ? params[5] : null;
    const overviewSortFilter = params[6] != undefined ? params[6] : null;
    const lastVisible = params[7] != undefined ? params[7] : null;
    const setLastVisible = params[8] != undefined ? params[8] : null;
    const manager_id = params[9] != undefined ? params[9] : null;
    const loggedin_user_role = params[10] != undefined ? params[10] : null;
    
    setLoadingMoreData(true);

    let APIUrl = '';
    if(loggedin_user_role == 'Admin'){
        APIUrl = 'http://localhost:6001/api/admin/workedhour/get-resources-workedhours'
    } else {
        APIUrl = 'http://localhost:6001/api/manager/workedhour/get-resources-workedhours'
    }
    const result = await GLOBALFUNC__POSTREQUEST(
        APIUrl,
        {
            organization_id: organization_id,
            key_filter: keyFilter,
            current_year: currentYear,
            sort_filter: overviewSortFilter,
            last_visible: lastVisible,
            manager_id: manager_id
        }
    );
    if(result.response == 'successfull'){
        if(result.message.items != null){
            const newResourcesWorkedhoursObject = [...resourcesWorkedHoursObject];
            result.message.items.map(item => (
                newResourcesWorkedhoursObject.push(item)
            ));
            setResourcesWorkedHoursObject(newResourcesWorkedhoursObject);
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

export const FUNC__EditOverviewWorkedHour = (
    appContext,
    resourcesWorkedHoursObject,
    setResourcesWorkedHoursObject,
    workedHour
) => {
    GLOBALFUNC__SelectItemForSidebar(
        appContext, 
        null, 
        "right", 
        {
            page: 'workedhours/manager/edit', 
            title: 'Gewerkte uren inzien / aanpassen',
            data: {
                appContext,
                resourcesWorkedHoursObject,
                setResourcesWorkedHoursObject,
                workedHour
            }
        }
    );
}

export const FUNC__TranslateWorkedHoursStatus = (
    status
) => {
    let translatedStatus = '';
    switch(status){
        case 'not_filled':
            translatedStatus = 'Nog niet ingevuld';
            break;
        case 'open':
            translatedStatus = 'Nog niet beoordeeld';
            break;
        case 'rejected':
            translatedStatus = 'Afgekeurd';
            break;
        case 'approved':
            translatedStatus = 'Goedgekeurd';
            break;
        case 'exported':
            translatedStatus = 'Geëxporteerd';
            break;
    }
    return translatedStatus;
}

export const FUNC__ChangeOverviewSortFilter = async (
    type,
    value,
    sortFilter,
    setSortFilter
) => {
    if(type == 'key'){
        let defaultValue = '';
        if(value == 'show_all'){
            defaultValue = '';
        } else {
            defaultValue = 'open';
        }
        setSortFilter({
            key: value,
            value: defaultValue
        });
    } else {
        setSortFilter({
            ...sortFilter,
            value: value
        });
    }
}

export const FUNC__GetResourcesWorkedHoursAnalytics = async (
    organization_id,
    setResourcesWorkedHoursAnalyticsObject,
    setOrganizationWorkedHoursAnalyticsObject,
    setDataHasLoaded,
    currentYear,
    lastVisible,
    setLastVisible,
    keyFilter,
    manager_id,
    loggedin_user_role
) => {
    let APIUrl = '';
    if(loggedin_user_role == 'Admin'){
        APIUrl = 'http://localhost:6001/api/admin/workedhour/get-resources-analytics'
    } else {
        APIUrl = 'http://localhost:6001/api/manager/workedhour/get-resources-analytics'
    }
    const result = await GLOBALFUNC__POSTREQUEST(
        APIUrl,
        {
            organization_id: organization_id,
            current_year: currentYear,
            include_organization_analytics: true,
            last_visible: lastVisible,
            type: keyFilter.key,
            month_or_week_value: keyFilter.value,
            manager_id: manager_id
        }
    );
    console.log(result);
    if(result.response == 'successfull'){
        if(result.message != null){
            if(result.message.resources != undefined){
                setResourcesWorkedHoursAnalyticsObject(result.message.resources);
            } else {
                setResourcesWorkedHoursAnalyticsObject([]);
            }
            if(result.message.organization != undefined){
                setOrganizationWorkedHoursAnalyticsObject(result.message.organization);
            } else {
                setOrganizationWorkedHoursAnalyticsObject(null);
            }
            setLastVisible(result.message.last_visible);
        }
    } else {
        /*etErrorMessage({
            field_id: "user-empty",
            message: "Oeps, er gaat iets mis. Probeer het a.u.b. nog een keer of neem contact met ons op."
        });*/
    }
    setDataHasLoaded(true);
}

export const FUNC__LoadMoreResourcesWorkedHoursAnalyticsData = async (
    params
) => {
    const setLoadingMoreData = params[0] != undefined ? params[0] : null;
    const organization_id = params[1] != undefined ? params[1] : null;
    const resourcesWorkedHoursAnalyticsObject = params[2] != undefined ? params[2] : null;
    const setResourcesWorkedHoursAnalyticsObject = params[3] != undefined ? params[3] : null;
    const currentYear = params[4] != undefined ? params[4] : null;
    const lastVisible = params[5] != undefined ? params[5] : null;
    const setLastVisible = params[6] != undefined ? params[6] : null;
    const manager_id = params[7] != undefined ? params[7] : null;
    const loggedin_user_role = params[10] != undefined ? params[10] : null;

    setLoadingMoreData(true);

    let APIUrl = '';
    if(loggedin_user_role == 'Admin'){
        APIUrl = 'http://localhost:6001/api/admin/workedhour/get-resources-analytics'
    } else {
        APIUrl = 'http://localhost:6001/api/manager/workedhour/get-resources-analytics'
    }
    const result = await GLOBALFUNC__POSTREQUEST(
        APIUrl,
        {
            organization_id: organization_id,
            current_year: currentYear,
            include_organization_analytics: false,
            last_visible: lastVisible,
            manager_id: manager_id
        }
    );
    if(result.response == 'successfull'){
        if(result.message.resources != null){
            const newResourcesWorkedHoursAnalyticsObject = [...resourcesWorkedHoursAnalyticsObject];
            result.message.resources.map(item => (
                newResourcesWorkedHoursAnalyticsObject.push(item)
            ));
            setResourcesWorkedHoursAnalyticsObject(newResourcesWorkedHoursAnalyticsObject);
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

export const FUNC__FilterResourceAnalytics = (
    analytics,
    type
) => {
    let value = 0;
    if(analytics != undefined
        && analytics != null){
        if(analytics[type] != undefined){
            value =+ analytics[type];
        }
    }
    return value;
} 

export const FUNC__ShowOrOpenAnalyticsGraph = (
    showAnalyticsGraph,
    setShowAnalyticsGraph
) => {
    setShowAnalyticsGraph(showAnalyticsGraph ? false : true);
}

export const FUNC__ChangeKeyFilter = async (
    type,
    value,
    keyFilter,
    setKeyFilter
) => {
    const dateToday = new Date();
    const currentMonth = dateToday.getMonth();

    if(type == 'key'){
        let defaultValue = '';
        if(value == 'monthsview'){
            defaultValue = currentMonth;
        } else {
            defaultValue = getWeek(dateToday);
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