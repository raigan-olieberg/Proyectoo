import { 
    GLOBALFUNC__CloseSidebar,
    GLOBALFUNC__POSTREQUEST,
    GLOBALFUNC__EditObjectInArray,
    GLOBALFUNC__ShowOrHidePopup,
    GLOBALFUNC__TranslateSecondsToDate
} from "../../../../../helpers/GlobalFunctions";

export const FUNC__CreateObject = (
    itemObject,
    setItemObject,
    key, 
    value, 
    upperCase,
    action=null
) => {
    let upperCaseValue = upperCase ? value.charAt(0).toUpperCase() + value.slice(1) : value;
    setItemObject({
        ...itemObject,
        [key]: upperCaseValue
    });
}

export const FUNC__CreateObject__SendObjectToServer = async (
    appContext,
    itemObject,
    resourcesObject,
    setResourcesObject,
    adminsAndManagersObject,
    setDataIsLoading,
    setError,
    actionAfterSuccess
) => {
    setError({
        show: false,
        id: '',
        message: ''
    });

    const itemObjectForServer = {...itemObject};
    itemObjectForServer.profile_photo = null;

    const result = await GLOBALFUNC__POSTREQUEST(
        'http://localhost:6001/api/manager/resource/create-user',
        {
            organization_id: appContext.globalContext.authenticate.user.organization_id,
            user: itemObjectForServer,
            manager: {
                firstname: appContext.globalContext.authenticate.user.firstname,
                lastname: appContext.globalContext.authenticate.user.lastname
            }
        }
    );
    if(result.response == 'successfull'){
        const newResourcesObject = resourcesObject;
        const itemObjectForLocalUiUpdate = {...itemObject}
        itemObjectForLocalUiUpdate.user_id = result.message;
        itemObjectForLocalUiUpdate['manager'] = adminsAndManagersObject.filter(x => x.value === itemObject.manager_id);
        newResourcesObject.push(itemObjectForLocalUiUpdate);
        setResourcesObject(
            newResourcesObject
        );

        GLOBALFUNC__EditObjectInArray(
            'user_id',
            itemObject.manager_id,
            resourcesObject,
            setResourcesObject,
            'increment_key',
            [
                {
                    key: 'resources_under_management',
                    value: 1
                }
            ]
        );

        GLOBALFUNC__CloseSidebar(appContext, false);

        if(actionAfterSuccess != null){
            actionAfterSuccess();
        }
    } else if(result.response == 'unsuccessfull'){
        setDataIsLoading(false);
        setError({
            show: true,
            id: 'email',
            message: 'Er bestaat al een account met deze e-mail.'
        });
    } else {
        setDataIsLoading(false);
        setError({
            show: true,
            id: 'API_ERROR',
            message: 'Oeps, er gaat iets mis. Probeer het a.u.b. nog een keer of neem contact met ons op.'
        });
    }
}
/*
*
*
*
* Edit object methods
*
*
*
*/
export const FUNC__DeleteObject = async (
    action,
    setShowDeleteConfirm = null
) => {
    if(action != "confirm"){ 
        setShowDeleteConfirm(action == "showDialog" ? true : false);
        return; 
    }
}

export const FUNC__UpdateUserStatus = async (
    action,
    status,
    confirmDialog,
    setConfirmDialog,
    setDataIsLoading = null,
    appContext = null,
    params = null,
) => {
    let itemObject = params != null && params[0] != undefined ? params[0] : null;
    let resourcesObject = params != null && params[1] != undefined ? params[1] : null;
    let setResourcesObject = params != null && params[2] != undefined ? params[2] : null;
    let setError = params != null && params[3] != undefined ? params[3] : null;

    if(action == "showDialog"){
        setConfirmDialog({
            message: `Weet je zeker dat je de status van deze gebruiker op "${status}" wilt zetten?`,
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
            switch(confirmDialog.data.status){
                case 'Ziek':
                    tranlatedStatus = 'Sick';
                    break;
                case 'Verlof':
                    tranlatedStatus = 'Leave_of_absence';
                    break;
                case 'Beschikbaar':
                    tranlatedStatus = 'Active';
                    break;
            }
    
            const result = await GLOBALFUNC__POSTREQUEST(
                'http://localhost:6001/api/manager/resource/update-user-status',
                {
                    user_id: itemObject.user_id,
                    status: tranlatedStatus
                }
            );
            if(result.response == 'successfull'){
                GLOBALFUNC__EditObjectInArray(
                    'user_id',
                    itemObject.user_id,
                    resourcesObject,
                    setResourcesObject,
                    'edit_key',
                    [
                        {
                            key: 'status',
                            value: tranlatedStatus
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

export const FUNC__ResendActivationMail = async (
    itemObject,
    appContext,
    setDataIsLoading,
    setError
) => {
    const result = await GLOBALFUNC__POSTREQUEST(
        'http://localhost:6001/api/manager/resource/send-activation-mail',
        {
            user: itemObject,
            organization_id: appContext.globalContext.authenticate.user.organization_id,
            manager: {
                firstname: appContext.globalContext.authenticate.user.firstname,
                lastname: appContext.globalContext.authenticate.user.lastname
            }
        }
    );
    if(result.response == 'successfull'){
        GLOBALFUNC__ShowOrHidePopup(
            appContext,
            true,
            'Het account activatie e-mail is succesvol verzonden'
        );
        //GLOBALFUNC__CloseSidebar(appContext, false);
    } else {
        setDataIsLoading(false);
        setError({
            show: true,
            id: 'API_ERROR',
            message: 'Oeps, er gaat iets mis. Probeer het a.u.b. nog een keer of neem contact met ons op.'
        });
    }
}

export const FUNC__EditObject__SendObjectToServer = async (
    appContext,
    itemObject,
    oldItemObject,
    resourcesObject,
    setResourcesObject,
    adminsAndManagersObject,
    setDataIsLoading,
    setError,
    setEditField
) => {
    setDataIsLoading(true);
    setEditField('');

    const itemObjectForLocalUiUpdate = {...itemObject}
    itemObjectForLocalUiUpdate['manager'] = adminsAndManagersObject.filter(x => x.value === itemObject.manager_id);

    const result = await GLOBALFUNC__POSTREQUEST(
        'http://localhost:6001/api/manager/resource/update-user',
        {
            user: itemObject,
            old_manager_id: oldItemObject.manager_id,
            old_role: oldItemObject.role,
            old_firstname: oldItemObject.firstname,
            old_lastname: oldItemObject.lastname,
            old_label: oldItemObject.label,
            organization_id: appContext.globalContext.authenticate.user.organization_id
        }
    );
    if(result.response == 'successfull'){
        GLOBALFUNC__EditObjectInArray(
            'user_id',
            itemObject.user_id,
            resourcesObject,
            setResourcesObject,
            'replace',
            itemObjectForLocalUiUpdate,
        );
        if(oldItemObject.manager_id != itemObject.manager_id){
            GLOBALFUNC__EditObjectInArray(
                'user_id',
                itemObject.manager_id,
                resourcesObject,
                setResourcesObject,
                'increment_key',
                [
                    {
                        key: 'resources_under_management',
                        value: 1
                    }
                ]
            );
            GLOBALFUNC__EditObjectInArray(
                'user_id',
                oldItemObject.manager_id,
                resourcesObject,
                setResourcesObject,
                'decrement_key',
                [
                    {
                        key: 'resources_under_management',
                        value: 1
                    }
                ],
            );
        }
        GLOBALFUNC__CloseSidebar(appContext, false);
    } else if(result.response == 'unsuccessfull'){
        setDataIsLoading(false);
        switch(result.message){
            case 'CHANGE_ROLE_ERROR__is_owning_projects':
                setError({
                    show: true,
                    id: 'API_ERROR',
                    message: 'De rol van deze gebruiker kan niet worden aangepast omdat deze gebruiker de eigenaar is van één of meerdere projecten.'
                });
                break;
            case 'CHANGE_ROLE_ERROR__is_managing_resources':
                setError({
                    show: true,
                    id: 'API_ERROR',
                    message: 'De rol van deze gebruiker kan niet worden aangepast omdat één of meerdere resources deze gebruiker als manager heeft staan.'
                });
                break;
            case 'CHANGE_MANAGER_ERROR__has_active_tasks':
                setError({
                    show: true,
                    id: 'API_ERROR',
                    message: 'Deze gebruiker kan niet van manager wisselen omdat deze gebruiker één of meerdere actieve taken heeft binnen een lopend project van de huidige manager.'
                });
                break;
            case 'CHANGE_MANAGER_ERROR__has_active_problems':
                setError({
                    show: true,
                    id: 'API_ERROR',
                    message: 'Deze gebruiker kan niet van manager wisselen omdat deze gebruiker één of meerdere onopgeloste problemen heeft binnen een lopend project van de huidige manager.'
                });
                break;
            default:
                setError({
                    show: true,
                    id: 'API_ERROR',
                    message: 'Oeps, er gaat iets mis. Probeer het a.u.b. nog een keer of neem contact met ons op.'
                });
                break;
        }
    }
}

export const FUNC__GetAdminsAndManagers = async (
    organization_id,
    user_id,
    setAdminsAndManagersObject,
    setAdminsOnlyObject,
    setError,
    setDataHasLoaded
) => {
    const result = await GLOBALFUNC__POSTREQUEST(
        'http://localhost:6001/api/admin/resource/get-admins-and-managers',
        {
            organization_id: organization_id,
            user_id: user_id
        }
    );
    if(result.response == 'successfull'){
        if(result.message != null){
            setAdminsAndManagersObject(result.message);
            setAdminsOnlyObject(
                result.message.filter(x => x.role === 'Admin')
            );
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

export const FUNC__TranslateManagerIdToNAW = (
    appContext,
    manager_id,
    adminsAndManagersObject
) => {
    let value = '';
    const manager = adminsAndManagersObject.find(x => x.value === manager_id);
    if(manager.value == appContext.globalContext.authenticate.user.user_id){
        value = 'Ik';
    } else {
        value = `${manager.firstname} ${manager.lastname}`;
    }
    return value 
}

export const FUNC__FetchResourceFromServer = async (
    organization_id,
    user_id,
    loggedin_user_role,
    setItemObject,
    setOldItemObject,
    setAdminsAndManagersObject,
    setAdminsOnlyObject,
    setError,
    setDataHasLoaded
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
    const result = await GLOBALFUNC__POSTREQUEST(
        'http://localhost:6001/api/manager/resource/get-specific-user',
        {
            organization_id: organization_id,
            user_id: user_id,
            fetchAdminsAndManagers: loggedin_user_role == 'Admin',
            check_if_resource_has_absence_of_leave: dateTodayUTC
        }
    );
    if(result.response == 'successfull'){
        if(result.message.user != null){
            setItemObject(result.message.user);
            setOldItemObject({...result.message.user});
        }
        if(result.message.adminsAndManagers != null){
            setAdminsAndManagersObject(result.message.adminsAndManagers);
            setAdminsOnlyObject(
                result.message.adminsAndManagers.filter(x => x.role === 'Admin')
            );
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

export const FUNC__FormatLeaveOfAbsence = (
    leave_of_absence
) => {
    console.log(leave_of_absence);
    const date = GLOBALFUNC__TranslateSecondsToDate(
        new Date(leave_of_absence.enddate),
        false,
        false,
        true
    );
    console.log(date);
    return `Heeft verlof t/m ${date}`;
}
