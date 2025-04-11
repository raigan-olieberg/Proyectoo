import { 
    GLOBALFUNC__CloseSidebar,
    GLOBALFUNC__POSTREQUEST,
    GLOBALFUNC__EditObjectInArray
} from "../../../../helpers/GlobalFunctions";

export const FUNC__CreateObject = (
    itemObject,
    setItemObject,
    key, 
    value, 
    upperCase,
    action=null
) => {
    let upperCaseValue = key != 'status' ? value.charAt(0).toUpperCase() + value.slice(1) : value;
    let hasBrackets = key.match(/\[(.*?)\]/);
    if(hasBrackets){
        let parent = key.split("[")[0];
        let child = hasBrackets[1];
        setItemObject({
            ...itemObject,
            [parent]: {
                ...itemObject[parent],
                [child]: upperCaseValue
            }
        });
    } else {
        setItemObject({
            ...itemObject,
            [key]: upperCase ? upperCaseValue : value
        });
    }
}

export const FUNC__EditObject__SendObjectToServer = async (
    appContext,
    oldItemObject,
    itemObject,
    problemsObject,
    setProblemsObject,
    setDataIsLoading,
    setError,
    setEditField
) => {
    setDataIsLoading(true);
    setEditField('');

    const result = await GLOBALFUNC__POSTREQUEST(
        'http://localhost:6001/api/problem/update-problem',
        {
            problem: itemObject,
            old_short_description: oldItemObject.short_description
        }
    );
    console.log(itemObject);
    if(result.response == 'successfull'){
        GLOBALFUNC__EditObjectInArray(
            'problem_id',
            itemObject.problem_id,
            problemsObject,
            setProblemsObject,
            'replace',
            itemObject,
        );
        GLOBALFUNC__CloseSidebar(appContext, false);
    } else {
        setDataIsLoading(false);
        setError({
            show: true,
            id: 'API_ERROR',
            message: 'Oeps, er gaat iets mis. Probeer het a.u.b. nog een keer of neem contact met ons op.'
        });
    }
}

export const FUNC__DeleteObject = async (
    action,
    deleteDialog,
    setDeleteDialog,
    setDataIsLoading = null,
    appContext = null,
    params = null
) => {
    let itemObject = params && params[0] ? params[0] : null;
    let problemsObject = params && params[1] ? params[1] : null;
    let setProblemsObjectObject = params && params[2] ? params[2] : null;
    let setError = params && params[3] ? params[3] : null;

    if(action == "showDialog"){
        setDeleteDialog({
            data: null,
            show: true
        });
    } else {
        if(action == "confirm"){
            const result = await GLOBALFUNC__POSTREQUEST(
                'http://localhost:6001/api/problem/delete-problem',
                {
                    problem_id: itemObject.problem_id,
                    organization_id: appContext.globalContext.authenticate.user.organization_id,
                    old_status: itemObject.status,
                    manager_id: itemObject.manager_id,
                    project_id: itemObject.project_id,
                    priority: itemObject.priority
                }
            );
            if(result.response == 'successfull'){
                GLOBALFUNC__EditObjectInArray(
                    'problem_id',
                    itemObject.problem_id,
                    problemsObject,
                    setProblemsObjectObject,
                    'delete'
                );
                GLOBALFUNC__CloseSidebar(appContext, false);
            } else {
                setDataIsLoading(false);
                setError({
                    show: true,
                    id: 'API_ERROR',
                    message: 'Oeps, er gaat iets mis. Probeer het a.u.b. nog een keer of neem contact met ons op.'
                });
            }
        }
        setDeleteDialog({
            data: null,
            show: false
        });
    }
}

export const FUNC__UpdateProblemStatus = async (
    action,
    status,
    confirmDialog,
    setConfirmDialog,
    setDataIsLoading = null,
    appContext = null,
    params = null,
) => {
    const itemObject = params != null && params[0] != undefined ? params[0] : null;
    const problemsObject = params != null && params[1] != undefined ? params[1] : null;
    const setProblemsObjectObject = params != null && params[2] != undefined ? params[2] : null;
    const setError = params != null && params[3] != undefined ? params[3] : null;
    const user_id = params != null && params[4] != undefined ? params[4] : null;

    if(action == "showDialog"){
        setConfirmDialog({
            message: `Weet je zeker dat je de status van dit probleem op "${status}" wilt zetten?`,
            submitMessage: 'aanpassen',
            data: {
                status: status
            },
            show: true
        });
    } else {
        if(action == "confirm"){
            setDataIsLoading(true);

            let tranlatedStatus = '';
            const dateToday = new Date();
            const dateForActivity = `${dateToday.getDate()}-${(dateToday.getMonth() + 1)}-${dateToday.getFullYear()}`;
            switch(confirmDialog.data.status){
                case 'Open':
                    tranlatedStatus = 'open';
                    break;
                case 'In behandeling':
                    tranlatedStatus = 'in_progress';
                    break;
                case 'Opgelost':
                    tranlatedStatus = 'resolved';
                    break;
            }
            const result = await GLOBALFUNC__POSTREQUEST(
                'http://localhost:6001/api/manager/problem/update-problem-status',
                {
                    problem_id: itemObject.problem_id,
                    organization_id: appContext.globalContext.authenticate.user.organization_id,
                    old_status: itemObject.status,
                    new_status: tranlatedStatus,
                    manager_id: itemObject.manager_id,
                    project_id: itemObject.project_id,
                    task_id: itemObject.task_id,
                    phase_id: itemObject.phase_id,
                    dateForActivity: dateForActivity,
                    resolved_comment: {
                        comment: tranlatedStatus == 'resolved' ? itemObject.resolved_comment.comment : '',
                        user_id: tranlatedStatus == 'resolved' ? user_id : '',
                        date_added: tranlatedStatus == 'resolved' ? dateToday : null
                    }
                }
            );
            console.log(result);
            if(result.response == 'successfull'){
                GLOBALFUNC__EditObjectInArray(
                    'problem_id',
                    itemObject.problem_id,
                    problemsObject,
                    setProblemsObjectObject,
                    'edit_key',
                    [
                        {
                            key: 'status',
                            value: tranlatedStatus
                        },
                        {
                            key: 'resolved_comment',
                            value: {
                                comment: tranlatedStatus == 'resolved' ? itemObject.resolved_comment.comment : '',
                                user_id: tranlatedStatus == 'resolved' ? user_id : '',
                                date_added: tranlatedStatus == 'resolved' ? result.message : null,
                                user: tranlatedStatus == 'resolved' ? [{
                                    firstname: appContext.globalContext.authenticate.user.firstname,
                                    lastname: appContext.globalContext.authenticate.user.lastname,
                                }] : null
                            }
                        }
                    ],
                );
                GLOBALFUNC__CloseSidebar(appContext, false);
            } else {
                setDataIsLoading(false);
                setError({
                    show: true,
                    id: 'API_ERROR',
                    message: 'Oeps, er gaat iets mis. Probeer het a.u.b. nog een keer of neem contact met ons op.'
                });
            }
        }
        setConfirmDialog({
            message: '',
            submitMessage: '',
            data: null,
            show: false
        });
    }
}

export const FUNC__CancelResolved = (
    setShowResolvedField,
    itemObject,
    setItemObject,
    setShowResolvedSubmitButton
) => {
    setItemObject({
        ...itemObject,
        resolved_comment: ''
    });
    setShowResolvedField(false);
    setShowResolvedSubmitButton(false);
}

export const FUNC__FetchProblemFromServer = async (
    organization_id,
    problem_id,
    setItemObject,
    setOldItemObject,
    setError,
    setDataHasLoaded
) => {
    const result = await GLOBALFUNC__POSTREQUEST(
        'http://localhost:6001/api/manager/problem/get-specific-problem',
        {
            organization_id: organization_id,
            problem_id: problem_id
        }
    );
    if(result.response == 'successfull'){
        if(result.message != null){
            setItemObject(result.message);
            setOldItemObject({...result.message});
        }
    } else {
        setError({
            show: true,
            id: 'API_ERROR',
            message: 'Oeps, er gaat iets mis. Probeer het a.u.b. nog een keer of neem contact met ons op.'
        });
    }
    setDataHasLoaded(true);
}