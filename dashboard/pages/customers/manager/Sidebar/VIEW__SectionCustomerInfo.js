// React / NextJs components
import { useState, useEffect, useContext } from 'react';
import cn from 'classnames';
import * as featherIcon from 'feather-icons';
// Global / Page / Layout components
import SidebarComponentFieldsInputText from '../../../../components/Global/Sidebar/Fields/InputText';
import GlobalComponentLoadingData from '../../../../components/Global/Loaders/LoadingData';
import SidebarComponentDialogConfirmDelete from '../../../../components/Global/Sidebar/Dialog/ConfirmDelete';
import { 
    FUNC__CreateObject,
    FUNC__EditObject__SendObjectToServer,
    FUNC__DeleteObject
} from './Controller';
import AppContext from '../../../../helpers/AppContext';
import { 
    GLOBALFUNC__isWhitespaceString,
    GLOBALFUNC__ValidateEmail,
    GLOBALFUNC__DifferenceBetweenObjects
} from '../../../../helpers/GlobalFunctions';
// Page styles
import globalStyles from '../../../../styles/global.module.scss';

const CustomersManagerSidebar__VIEW__SectionCustomerInfo = (props) => {
    const appContext = useContext(AppContext);
    const [dataIsLoading, setDataIsLoading] = useState(false);
    const [showSubmitButton, setShowSubmitButton] = useState(false);
    const [adminsAndManagersObject, setAdminsAndManagersObject] = useState(false);
    const [error, setError] = useState({
        show: false,
        message: '',
        id: ''
    });
    const [deleteDialog, setDeleteDialog] = useState({
        show: false,
        data: null
    });
    const [editField, setEditField] = useState('');
    const [itemObject, setItemObject] = useState(props.data.customer);
    const [oldItemObject, setOldItemObject] = useState(props.data.customer);
    console.log(itemObject);
    useEffect(() => {
        let value = false;
        if(GLOBALFUNC__DifferenceBetweenObjects(itemObject, oldItemObject)){
            if(!GLOBALFUNC__isWhitespaceString(itemObject.name)
                && !GLOBALFUNC__isWhitespaceString(itemObject.contactperson)
                && GLOBALFUNC__ValidateEmail(itemObject.email)){
                value = true;
            } else {
                value = false;
            }
        } else {
            value = false;
        }
        setShowSubmitButton(value);     
    }, [itemObject]);
    /*
    *
    *
    * 
    * 
        Content
    *
    *
    * 
    * 
    */
    return(
        <div className={globalStyles['content-inner__bodysection']}>
            {/* Fields */}
            <SidebarComponentFieldsInputText
                firstItem={true} 
                title={"Naam"} 
                id={"name"} 
                value={itemObject.name}
                type={"edit"}
                upperCase={true}
                error={error}
                showIndicator={false}
                required={true}
                FUNC__CreateObject={FUNC__CreateObject}
                itemObject={itemObject}
                setItemObject={setItemObject}
                editField={{
                    get: editField,
                    set: setEditField
                }}/>
            <SidebarComponentFieldsInputText
                firstItem={false} 
                title={"Contactpersoon"} 
                id={"contactperson"} 
                value={itemObject.contactperson}
                type={"edit"}
                upperCase={true}
                error={error}
                showIndicator={false}
                required={true}
                FUNC__CreateObject={FUNC__CreateObject}
                itemObject={itemObject}
                setItemObject={setItemObject}
                editField={{
                    get: editField,
                    set: setEditField
                }}/>
             <SidebarComponentFieldsInputText
                firstItem={false} 
                title={"E-mail"} 
                id={"email"} 
                value={itemObject.email}
                type={"edit"}
                upperCase={false}
                error={error}
                showIndicator={false}
                required={true}
                FUNC__CreateObject={FUNC__CreateObject}
                itemObject={itemObject}
                setItemObject={setItemObject}
                editField={{
                    get: editField,
                    set: setEditField
                }}/>
            <SidebarComponentFieldsInputText
                firstItem={false} 
                title={"Telefoonnummer"} 
                id={"phonenumber"} 
                value={itemObject.phonenumber}
                type={"edit"}
                upperCase={false}
                error={error}
                showIndicator={false}
                required={true}
                FUNC__CreateObject={FUNC__CreateObject}
                itemObject={itemObject}
                setItemObject={setItemObject}
                editField={{
                    get: editField,
                    set: setEditField
                }}/>

            {/* Error messages */}
            {
                error.show
                && error.id == 'API_ERROR'
                &&
                <div className={cn([
                    globalStyles['bodysection-field__error'],
                    globalStyles['global-display-flex'],
                    globalStyles['global-margin-top-x2']
                ])}>
                    <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['alert-octagon'].toSvg({height: "1vw", width: "1vw"})}}></i>
                    {error.message}
                </div>
            }

            {/* Submit buttons */}
            {
                !dataIsLoading
                && !deleteDialog.show
                &&
                <div className={cn([
                    globalStyles['global-margin-top-x2'],
                    globalStyles['bodysection-buttons']
                ])}>
                    <div className={cn([
                        globalStyles['global-seperator__horizontal'],
                        globalStyles['global-margin-bottom-x2'],
                    ])}></div>
                    {
                        showSubmitButton
                        &&
                        <>
                            <button className={cn([
                                globalStyles['global-button'],
                                globalStyles['global-button-hover'],
                                globalStyles['global-transition-duration'],
                                globalStyles['global-display-flex'],
                                globalStyles['global-width-100'],
                                globalStyles['global-margin-bottom']
                            ])} onClick={() => FUNC__EditObject__SendObjectToServer(
                                appContext,
                                itemObject,
                                props.data.customersObject,
                                props.data.setCustomersObject,
                                setDataIsLoading,
                                setError,
                                setEditField
                            )}>
                                <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['check'].toSvg({height: "1vw", width: "1vw"})}}></i>
                                Wijzigingen opslaan
                            </button>
                        </>
                        ||
                        <>
                            <div className={cn([
                                globalStyles['global-button'],
                                globalStyles['global-button__inactive'],
                                globalStyles['global-display-flex'],
                                globalStyles['global-text-align-center'],
                                globalStyles['global-margin-bottom']
                            ])}>
                                <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['check'].toSvg({height: "1vw", width: "1vw"})}}></i>
                                Wijzigingen opslaan
                            </div>
                        </>
                    }
                    {
                        (appContext.globalContext.authenticate.user.role == "Manager"
                            || appContext.globalContext.authenticate.user.role == "Admin")
                        && itemObject.linked_projects.length == 0
                        &&
                        <button className={cn([
                            globalStyles['global-button'],
                            globalStyles['global-button-cancel-hover'],
                            globalStyles['global-transition-duration'],
                            globalStyles['global-display-flex'],
                            globalStyles['global-width-100']
                        ])} onClick={() => FUNC__DeleteObject(
                                "showDialog",
                                deleteDialog,
                                setDeleteDialog,
                            )}>
                            <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['trash-2'].toSvg({height: "1vw", width: "1vw"})}}></i>
                            Klant verwijderen
                        </button>
                    }
                    {
                        (appContext.globalContext.authenticate.user.role == "Manager"
                            || appContext.globalContext.authenticate.user.role == "Admin")
                        && itemObject.linked_projects.length > 0
                        &&
                        <div className={globalStyles['global-display-flex']}>
                            <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['alert-octagon'].toSvg({height: "1vw", width: "1vw"})}}></i>
                            Deze klant kan niet verwijderd worden omdat deze aan {itemObject.linked_projects.length > 1 ? 'meerdere projecten' : 'een project'} gekoppeld is.
                        </div>
                    }
                </div>
            }

            {/* Loader */}
            {
                dataIsLoading
                &&
                <div className={cn([
                    globalStyles['global-margin-top-x2'],
                    globalStyles['global-padding-bottom-x2']
                ])}>
                    <GlobalComponentLoadingData type={"loadMore"} />
                </div>
            }

            {/* Confirm delete dialog */}
            {
                deleteDialog.show
                &&
                <SidebarComponentDialogConfirmDelete 
                    message={"deze klant"}
                    deleteDialog={deleteDialog}
                    setDeleteDialog={setDeleteDialog}
                    setDataIsLoading={setDataIsLoading}
                    appContext={appContext}
                    params={[
                        itemObject,
                        props.data.customersObject,
                        props.data.setCustomersObject,
                        setError
                    ]}
                    FUNC__DeleteObject={FUNC__DeleteObject}/>
            }
        </div>
    );
}
export default CustomersManagerSidebar__VIEW__SectionCustomerInfo;