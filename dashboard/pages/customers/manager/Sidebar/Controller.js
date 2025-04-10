import { 
    GLOBALFUNC__CloseSidebar,
    GLOBALFUNC__POSTREQUEST,
    GLOBALFUNC__EditObjectInArray,
} from "../../../../helpers/GlobalFunctions";

export const FUNC__CreateObject = (
    itemObject,
    setItemObject,
    key, 
    value, 
    upperCase,
    action=null
) => {
    let upperCaseValue = value.charAt(0).toUpperCase() + value.slice(1);
    setItemObject({
        ...itemObject,
        [key]: upperCase ? upperCaseValue : value
    });
}

export const FUNC__CreateObject__SendObjectToServer = async (
    appContext,
    itemObject,
    customersObject,
    setCustomersObject,
    setDataIsLoading,
    setError,
    actionAfterSuccess
) => {
    setError({
        show: false,
        id: '',
        message: ''
    });

    const result = await GLOBALFUNC__POSTREQUEST(
        'http://localhost:6001/api/manager/customer/create-customer',
        {
            organization_id: appContext.globalContext.authenticate.user.organization_id,
            customer: itemObject,
        }
    );
    console.log(result)
    if(result.response == 'successfull'){
        const newCustomersObject = customersObject;
        itemObject['customer_id'] = result.message;
        newCustomersObject.push(itemObject);
        setCustomersObject(
            newCustomersObject
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
            message: 'Er bestaat al een klant met deze e-mail.'
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

export const FUNC__DeleteObject = async (
    action,
    deleteDialog,
    setDeleteDialog,
    setDataIsLoading = null,
    appContext = null,
    params = null
) => {
    let itemObject = params != null && params[0] != undefined ? params[0] : null;
    let customersObject = params != null && params[1] != undefined ? params[1] : null;
    let setCustomersObject = params != null && params[2] != undefined ? params[2] : null;
    let setError = params != null && params[3] != undefined ? params[3] : null;
    
    if(action == "showDialog"){
        setDeleteDialog({
            data: null,
            show: true
        });
    } else {
        if(action == "confirm"){
            const result = await GLOBALFUNC__POSTREQUEST(
                'http://localhost:6001/api/manager/customer/delete-customer',
                {
                    customer_id: itemObject.customer_id
                }
            );
            console.log(result);
            if(result.response == 'successfull'){
                GLOBALFUNC__EditObjectInArray(
                    'customer_id',
                    itemObject.customer_id,
                    customersObject,
                    setCustomersObject,
                    'delete'
                );
                GLOBALFUNC__CloseSidebar(appContext, false);
            } else if(result.response == 'unsuccessfull'){
                setDataIsLoading(false);
                setError({
                    show: true,
                    id: 'API_ERROR',
                    message: 'Deze klant kan niet verwijderd worden omdat deze aan één of meerdere projecten gekoppeld is.'
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
        setDeleteDialog({
            data: null,
            show: false
        });
    }
}

export const FUNC__EditObject__SendObjectToServer = async (
    appContext,
    itemObject,
    customersObject,
    setCustomersObject,
    setDataIsLoading,
    setError,
    setEditField
) => {
    setDataIsLoading(true);
    setEditField('');

    const result = await GLOBALFUNC__POSTREQUEST(
        'http://localhost:6001/api/manager/customer/update-customer',
        {
            customer: itemObject
        }
    );
    console.log(result);
    if(result.response == 'successfull'){
        GLOBALFUNC__EditObjectInArray(
            'customer_id',
            itemObject.customer_id,
            customersObject,
            setCustomersObject,
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