import { 
    GLOBALFUNC__CloseSidebar,
    GLOBALFUNC__POSTREQUEST,
    GLOBALFUNC__EditObjectInArray
} from "../../../../helpers/GlobalFunctions";
/*
*
*
*
* Edit object methods
*
*
*
*/
export const FUNC__CreateObject = (
    itemObject,
    setItemObject,
    key, 
    value, 
    upperCase,
    action=null
) => {
    let upperCaseValue = '';
    if(key != 'status'
        && key != 'hours'
        && key != 'kilometers_traveled'){
        upperCaseValue = value.charAt(0).toUpperCase() + value.slice(1);
    } else {
        upperCaseValue = value;
    }
    setItemObject({
        ...itemObject,
        [key]: upperCase ? upperCaseValue : value
    });
}

export const FUNC__EditObject__SendObjectToServer = async (
    appContext,
    itemObject,
    resourcesWorkedHoursObject,
    setResourcesWorkedHoursObject,
    setDataIsLoading,
    setError,
    setEditField
) => {
    setDataIsLoading(true);
    setEditField('');

    const result = await GLOBALFUNC__POSTREQUEST(
        'http://localhost:6001/api/workedhour/update-workedhour',
        {
            workedhour_id: itemObject.workedhour_id,
            hours: itemObject.hours,
            kilometers_traveled: itemObject.kilometers_traveled
        }
    );
    if(result.response == 'successfull'){
        GLOBALFUNC__EditObjectInArray(
            'workedhour_id',
            itemObject.workedhour_id,
            resourcesWorkedHoursObject,
            setResourcesWorkedHoursObject,
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

export const FUNC__UpdateWorkedHourStatus = async (
    action,
    status,
    confirmDialog,
    setConfirmDialog,
    setDataIsLoading = null,
    appContext = null,
    params = null,
) => {
    let itemObject = params != null && params[0] != undefined ? params[0] : null;
    let resourcesWorkedHoursObject = params != null && params[1] != undefined ? params[1] : null;
    let setResourcesWorkedHoursObject = params != null && params[2] != undefined ? params[2] : null;
    let setError = params != null && params[3] != undefined ? params[3] : null;

    if(action == "showDialog"){
        setConfirmDialog({
            message: 'Weet je zeker dat je de status van deze gewerkte uren op "' + status + '" wilt zetten?',
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
                case 'Nog niet beoordeeld':
                    tranlatedStatus = 'open';
                    break;
                case 'Afgekeurd':
                    tranlatedStatus = 'rejected';
                    break;
                case 'Goedgekeurd':
                    tranlatedStatus = 'approved';
                    break;
            }
    
            const result = await GLOBALFUNC__POSTREQUEST(
                'http://localhost:6001/api/workedhour/update-workedhour-status',
                {
                    workedhour_id: itemObject.workedhour_id,
                    organization_id: appContext.globalContext.authenticate.user.organization_id,
                    old_status: itemObject.status,
                    new_status: tranlatedStatus,
                    manager_id: itemObject.resource[0].manager_id,
                    month: itemObject.month,
                    week: itemObject.week,
                    user_id: itemObject.user_id,
                    year: itemObject.year,
                    hours: itemObject.hours,
                    rejection_reason: tranlatedStatus == 'rejected' ? itemObject.rejection_reason : ''
                }
            );
            if(result.response == 'successfull'){
                GLOBALFUNC__EditObjectInArray(
                    'workedhour_id',
                    itemObject.workedhour_id,
                    resourcesWorkedHoursObject,
                    setResourcesWorkedHoursObject,
                    'edit_key',
                    [
                        {
                            key: 'status',
                            value: tranlatedStatus,
                        },
                        {
                            key: 'rejection_reason',
                            value: tranlatedStatus == 'rejected' ? itemObject.rejection_reason : ''
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

export const FUNC__CancelRejection = (
    setShowRejectionField,
    itemObject,
    setItemObject,
    setShowRejectionSubmitButton
) => {
    setItemObject({
        ...itemObject,
        rejection_reason: ''
    });
    setShowRejectionField(false);
    setShowRejectionSubmitButton(false);
}