// Global / Page / Layout components
import { 
    GLOBALFUNC__POSTREQUEST,
    GLOBALFUNC__SelectItemForSidebar
} from '../../../helpers/GlobalFunctions';
import {algoliasearch} from 'algoliasearch';

const algolia_appID = "A9215M41YD";
const algolia_apiKey = "4228058aa9788d14620738f811390357";
const algolia_client = algoliasearch(
  algolia_appID,
  algolia_apiKey
);
//const algolia_index = algolia_client.initIndex('algolia_search');

export const FUNC__GetProblems = async (
    organization_id,
    setProblemsObject,
    setDataHasLoaded,
    overviewSortFilter,
    lastVisible,
    setLastVisible,
    manager_id,
    loggedin_user_role,
    searchFilterActive,
    searchingFor
) => {
    let APIUrl = '';
    if(searchFilterActive == ''){
        APIUrl = `http://localhost:6001/api/${loggedin_user_role.toLowerCase()}/problem/get-problems`
    } else {
        APIUrl = `http://localhost:6001/api/manager/problem/get-problems-for-specific-${searchingFor.slice(0, -1)}`
    }
    const result = await GLOBALFUNC__POSTREQUEST(
        APIUrl,
        {
            organization_id: organization_id,
            sort_filter: overviewSortFilter,
            last_visible: lastVisible,
            manager_id: manager_id,
            search_filter_value: searchFilterActive
        }
    );
    console.log(result);
    if(result.response == 'successfull'){
        if(result.message.problems){
            setProblemsObject(result.message.problems);
        } else {
            setProblemsObject([]);
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

export const FUNC__LoadMoreProblemsData = async (
    setCurrentlyLoadingMoreOverviewData,
    organization_id,
    problemsObject,
    setProblemsObject,
    overviewSortFilter,
    lastVisible,
    setLastVisible,
    manager_id,
    loggedin_user_role,
    searchFilterActive,
    searchingFor
) => { 
    let APIUrl = '';
    if(searchFilterActive == ''){
        APIUrl = `http://localhost:6001/api/${loggedin_user_role.toLowerCase()}/problem/get-problems`
    } else {
        APIUrl = `http://localhost:6001/api/manager/problem/get-problems-for-specific-${searchingFor.slice(0, -1)}`
    }
    const result = await GLOBALFUNC__POSTREQUEST(
        APIUrl,
        {
            organization_id: organization_id,
            sort_filter: overviewSortFilter,
            last_visible: lastVisible,
            manager_id: manager_id,
            search_filter_value: searchFilterActive
        }
    );
    if(result.response == 'successfull'){
        if(result.message.problems){
            const newProblemsObject = [...problemsObject];
            result.message.problems.map(item => (
                newProblemsObject.push(item)
            ));
            setProblemsObject(newProblemsObject);
        }
        setLastVisible(result.message.last_visible);
    } else {
        /*etErrorMessage({
            field_id: "user-empty",
            message: "Oeps, er gaat iets mis. Probeer het a.u.b. nog een keer of neem contact met ons op."
        });*/
    }
    setCurrentlyLoadingMoreOverviewData(false);
}

export const FUNC__TranslateProblemsStatus = (
    status
) => {
    let translatedStatus = '';
    switch(status){
        case 'open':
            translatedStatus = 'Open';
            break;
        case 'in_progress':
            translatedStatus = 'In behandeling';
            break;
        case 'resolved':
            translatedStatus = 'Opgelost';
            break;
    }
    return translatedStatus;
}

export const FUNC__TranslateProblemsPriority = (
    priority
) => {
    let translatedStatus = '';
    switch(priority){
        case 'high':
            translatedStatus = 'Hoog';
            break;
        case 'medium':
            translatedStatus = 'Medium';
            break;
        case 'low':
            translatedStatus = 'Laag';
            break;
    }
    return translatedStatus;
}

export const FUNC__ChangeCurrentView = (
    currentView,
    setCurrentView
) => {
    setCurrentView(currentView == 'overview' ? 'analytics' : 'overview');
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
        } else if(value == 'priority') {
            defaultValue = 'high';
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

export const FUNC__EditOverviewProblem = (
    appContext,
    problemsObject,
    setProblemsObject,
    problem
) => {
    GLOBALFUNC__SelectItemForSidebar(
        appContext, 
        problem.problem_id, 
        "right", 
        {
            page: 'problems/manager/edit', 
            title: 'Probleem inzien / aanpassen',
            data: {
                problemsObject: problemsObject,
                setProblemsObject: setProblemsObject,
                problem: problem
            }
        }
    );
}

export const FUNC__SearchProblems = async (
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
            setAlgoliaSearchObject(hits);
        });
    } catch (error) {
        console.log(error);
    }
}

export const FUNC__SelectSearchedProblems = (
    item_id,
    appContext,
    problemsObject,
    setProblemsObject,
    setShowAlgoliaSearchResults,
    setSearchInputValue,
    searchFor,
    setSearchFilterActive,
    selectedItemName
) => {
    setShowAlgoliaSearchResults(false);
    switch(searchFor){
        case 'projects':
            setSearchInputValue(`Problemen binnen het project '${selectedItemName}'`);
            setSearchFilterActive(item_id);
            break;
        case 'problems':
            console.log(problemsObject);
            setSearchInputValue('');
            GLOBALFUNC__SelectItemForSidebar(
                appContext, 
                item_id, 
                "right", 
                {
                    page: 'problems/manager/edit', 
                    title: 'Probleem inzien / aanpassen',
                    data: {
                        problemsObject: problemsObject,
                        setProblemsObject: setProblemsObject,
                        problem_id: item_id,
                        fetchProblemFromServer: true
                    }
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
        case 'problems':
            value = 'problemen';
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
        case 'problems':
            value = 'Zoek probleem...';
            break;
    }
    return value;
}