// Global / Page / Layout components
import { 
    GLOBALFUNC__POSTREQUEST,
    GLOBALFUNC__SelectItemForSidebar,
    GLOBALFUNC__TranslateSecondsToDate
} from '../../../helpers/GlobalFunctions';
import {algoliasearch} from 'algoliasearch';

const algolia_appID = "A9215M41YD";
const algolia_apiKey = "4228058aa9788d14620738f811390357";
const algolia_client = algoliasearch(
  algolia_appID,
  algolia_apiKey
);
//const algolia_index = algolia_client.initIndex('algolia_search');

export const FUNC__GetTasks = async (
    organization_id,
    setTasksObject,
    setDataHasLoaded,
    overviewSortFilter,
    lastVisible,
    setLastVisible,
    manager_id,
    loggedin_user_role,
    dateToday,
    searchFilterActive,
    searchingFor
) => {
    let APIUrl = '';
    if(searchFilterActive == ''){
        APIUrl = `http://localhost:6001/api/${loggedin_user_role.toLowerCase()}/task/get-tasks`
    } else {
        APIUrl = `http://localhost:6001/api/manager/task/get-tasks-for-specific-${searchingFor.slice(0, -1)}`
    }
    const result = await GLOBALFUNC__POSTREQUEST(
        APIUrl,
        {
            organization_id: organization_id,
            sort_filter: overviewSortFilter,
            last_visible: lastVisible,
            manager_id: manager_id,
            date_today: dateToday,
            search_filter_value: searchFilterActive
        }
    );
    console.log(result);
    if(result.response == 'successfull'){
        if(result.message.tasks){
            setTasksObject(result.message.tasks);
        } else {
            setTasksObject([]);
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

export const FUNC__LoadMoreTasksData = async (
    setCurrentlyLoadingMoreData,
    organization_id,
    tasksObject,
    setTasksObject,
    overviewSortFilter,
    lastVisible,
    setLastVisible,
    manager_id,
    loggedin_user_role,
    dateToday,
    searchFilterActive,
    searchingFor
) => {    
    let APIUrl = '';
    if(searchFilterActive == ''){
        APIUrl = `http://localhost:6001/api/${loggedin_user_role.toLowerCase()}/task/get-tasks`
    } else {
        APIUrl = `http://localhost:6001/api/manager/task/get-tasks-for-specific-${searchingFor.slice(0, -1)}`
    }
    const result = await GLOBALFUNC__POSTREQUEST(
        APIUrl,
        {
            organization_id: organization_id,
            sort_filter: overviewSortFilter,
            last_visible: lastVisible,
            manager_id: manager_id,
            date_today: dateToday,
            search_filter_value: searchFilterActive
        }
    );
    if(result.response == 'successfull'){
        if(result.message.tasks){
            const newTasksObject = [...tasksObject];
            result.message.tasks.map(item => (
                newTasksObject.push(item)
            ));
            setTasksObject(newTasksObject);
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

export const FUNC__ChangeCurrentView = (
    currentView,
    setCurrentView
) => {
    setCurrentView(currentView == 'overview' ? 'analytics' : 'overview');
}

export const FUNC__ShowOrOpenAnalyticsGraph = (
    showAnalyticsGraph,
    setShowAnalyticsGraph
) => {
    setShowAnalyticsGraph(showAnalyticsGraph ? false : true);
}

export const FUNC__ChangeOverviewSortFilter = async (
    type,
    value,
    sortFilter,
    setSortFilter
) => {
    if(type == 'key'){
        let defaultValue = '';
        if(value == 'status'){
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

export const FUNC__EditOverviewTask = (
    appContext,
    tasksObject,
    setTasksObject,
    task
) => {
    GLOBALFUNC__SelectItemForSidebar(
        appContext, 
        task.task_id, 
        "right", 
        {
            page: 'tasks/manager/edit', 
            title: 'Taak inzien / aanpassen',
            data: {
                tasksObject: tasksObject,
                setTasksObject: setTasksObject,
                task: task,
                fetchResourceFromServer: false
            },
            extraWide: true,
            onSnapListeners: []
        }
    );
}

export const FUNC__FormattedItem = (
    itemObject
) => {
    itemObject['formatted_deadline'] = GLOBALFUNC__TranslateSecondsToDate(
        new Date(itemObject.deadline.seconds * 1000),
        true,
        true
    );
    return itemObject;
}

export const FUNC__SearchTasks = async (
    value,
    setSearchInputValue,
    setShowAlgoliaSearchResults,
    setAlgoliaSearchObject,
    organization_id,
    loggedin_user_role,
    manager_id,
    filter
) => {
    try{
        setSearchInputValue(value);
        let filters = null;
        if(loggedin_user_role == 'Admin'){
            filters = [
                `collection:'${filter}'`,
                `organization_id:'${organization_id}'`
            ];
        } else {
            filters = [
                `collection:'${filter}'`,
                `members:'${manager_id}'`
            ];
        }
        if(value == ''){
            setShowAlgoliaSearchResults(false);
            return;
        }
        setShowAlgoliaSearchResults(true);
        algolia_client.searchSingleIndex({
            indexName: 'algolia_search',
            searchParams: { query: value, facetFilters: filters },
        }).then(({ hits }) => {
            setAlgoliaSearchObject(hits);
        });
    } catch (error) {
        console.log(error);
    }
}

export const FUNC__SelectSearchedTasks = (
    item_id,
    appContext,
    tasksObject,
    setTasksObject,
    setShowAlgoliaSearchResults,
    setSearchInputValue,
    searchFor,
    setSearchFilterActive,
    selectedItemName,
    selectedItemDescription
) => {
    setShowAlgoliaSearchResults(false);
    switch(searchFor){
        case 'projects':
            setSearchInputValue(`Taken binnen het project '${selectedItemName}'`);
            setSearchFilterActive(item_id);
            break;
        case 'phases':
            setSearchInputValue(`Taken binnen de fase '${selectedItemName}' van het project '${selectedItemDescription}'`);
            setSearchFilterActive(item_id);
            break;
        case 'tasks':
            setSearchInputValue('');
            GLOBALFUNC__SelectItemForSidebar(
                appContext, 
                item_id, 
                "right", 
                {
                    page: 'tasks/manager/edit', 
                    title: 'Taak inzien / aanpassen',
                    data: {
                        tasksObject: tasksObject,
                        setTasksObject: setTasksObject,
                        task_id: item_id,
                        fetchTaskFromServer: true,
                    },
                    extraWide: true,
                    onSnapListeners: []
                }
            );
            break;
    }
}

export const FUNC__SetSearchEmptyMessage = (
    searchFor
) => {
    let value = '';
    switch(searchFor){
        case 'projects':
            value = 'projecten';
            break;
        case 'phases':
            value = 'fases';
            break;
        case 'tasks':
            value = 'taken';
            break;
    }
    return value;
}

export const FUNC__SetSearchPlaceholder = (
    searchFor
) => {
    let value = '';
    switch(searchFor){
        case 'projects':
            value = 'Zoek project...';
            break;
        case 'phases':
            value = 'Zoek fase...';
            break;
        case 'tasks':
            value = 'Zoek taak...';
            break;
    }
    return value;
}