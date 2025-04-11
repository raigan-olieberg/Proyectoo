// React / NextJs components
import { useState, useEffect, useContext } from 'react';
import cn from 'classnames';
import * as featherIcon from 'feather-icons';
// Global / Page / Layout components
import SidebarComponentFieldsInputText from '../../../../../components/Global/Sidebar/Fields/InputText';
import SidebarComponentFieldsSelect from '../../../../../components/Global/Sidebar/Fields/Select';
import SidebarComponentFieldsInputNumber from '../../../../../components/Global/Sidebar/Fields/InputNumber';
//import SidebarComponentFieldsFileSetProfilePhoto from '../../../../../components/Global/Sidebar/Fields/FileSetProfilePhoto';
import GlobalComponentLoadingData from '../../../../../components/Global/Loaders/LoadingData';
import SidebarComponentDialogConfirmDelete from '../../../../../components/Global/Sidebar/Dialog/ConfirmDelete';
import SidebarComponentDialogConfirm from '../../../../../components/Global/Sidebar/Dialog/Confirm';
import { 
    FUNC__CreateObject,
    FUNC__EditObject__SendObjectToServer,
    FUNC__DeleteObject,
    FUNC__UpdateUserStatus,
    FUNC__ResendActivationMail,
    FUNC__GetAdminsAndManagers,
    FUNC__TranslateManagerIdToNAW,
    FUNC__FetchResourceFromServer,
    FUNC__FormatLeaveOfAbsence
} from './Controller';
import AppContext from '../../../../../helpers/AppContext';
import { 
    GLOBALFUNC__isWhitespaceString,
    GLOBALFUNC__ValidateEmail,
    GLOBALFUNC__DifferenceBetweenObjects,
    GLOBALFUNC__TranslateUserStatus,
    GLOBALFUNC__TranslateUserRole
} from '../../../../../helpers/GlobalFunctions';
// Page styles
import globalStyles from '../../../../../styles/global.module.scss';


const ResourcesManagerSidebar__VIEW__SectionUserInfo = (props) => {
    const appContext = useContext(AppContext);
    const [dataIsLoading, setDataIsLoading] = useState(false);
    const [dataHasLoaded, setDataHasLoaded] = useState(false);
    const [showSubmitButton, setShowSubmitButton] = useState(false);
    const [adminsAndManagersObject, setAdminsAndManagersObject] = useState(false);
    const [adminsOnlyObject, setAdminsOnlyObject] = useState(null);
    const [fetchResourceFromServer, setFetchResourceFromServer] = useState(props.data.fetchResourceFromServer);
    const [error, setError] = useState({
        show: false,
        message: '',
        id: ''
    });
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState({
        show: false,
        message: '',
        submitMessage: '',
        data: null
    });
    const [editField, setEditField] = useState('');
    const [itemObject, setItemObject] = useState(!fetchResourceFromServer ? props.data.resource : null);
    const [oldItemObject, setOldItemObject] = useState(!fetchResourceFromServer ? {...props.data.resource} : null);
    useEffect(() => {
        if(fetchResourceFromServer){
            FUNC__FetchResourceFromServer(
                appContext.globalContext.authenticate.user.organization_id,
                props.data.user_id,
                appContext.globalContext.authenticate.user.role,
                setItemObject,
                setOldItemObject,
                setAdminsAndManagersObject,
                setAdminsOnlyObject,
                setError,
                setDataHasLoaded
            );
        }
    }, [fetchResourceFromServer]);
    useEffect(() => {
        if(!fetchResourceFromServer){
            FUNC__GetAdminsAndManagers(
                appContext.globalContext.authenticate.user.organization_id,
                appContext.globalContext.authenticate.user.user_id,
                setAdminsAndManagersObject,
                setAdminsOnlyObject,
                setError,
                setDataHasLoaded
            );
        }
    }, []);
    useEffect(() => {
        let value = false;
        if(itemObject && GLOBALFUNC__DifferenceBetweenObjects(itemObject, oldItemObject)){
            if(!GLOBALFUNC__isWhitespaceString(itemObject.firstname)
                && !GLOBALFUNC__isWhitespaceString(itemObject.lastname)
                && GLOBALFUNC__ValidateEmail(itemObject.email)
                && !GLOBALFUNC__isWhitespaceString(itemObject.label)
                && !GLOBALFUNC__isWhitespaceString(itemObject.hourly_rate)
                && !GLOBALFUNC__isWhitespaceString(itemObject.hours_per_week)){
                value = true;
            } else {
                value = false;
            }
        } else {
            value = false;
        }
        setShowSubmitButton(value);     
    }, [itemObject]);
    useEffect(() => {
        if(itemObject && GLOBALFUNC__DifferenceBetweenObjects(itemObject, oldItemObject)){
            setItemObject({
                ...itemObject,
                manager_id: appContext.globalContext.authenticate.user.user_id
            });
        }
    }, [itemObject ? itemObject.role : null]);
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
            {
                dataHasLoaded
                &&
                <>
                    {/*<SidebarComponentFieldsFileSetProfilePhoto
                        title={'Profiel foto'}
                        id={"profile_photo"}
                        FUNC__CreateObject={FUNC__CreateObject}
                        itemObject={itemObject}
                        setItemObject={setItemObject}/>*/}
                    <SidebarComponentFieldsInputText
                        firstItem={true} 
                        title={"Voornaam"} 
                        id={"firstname"} 
                        value={itemObject.firstname}
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
                        title={"Achternaam"} 
                        id={"lastname"} 
                        value={itemObject.lastname}
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
                        required={false}
                        FUNC__CreateObject={FUNC__CreateObject}
                        itemObject={itemObject}
                        setItemObject={setItemObject}
                        editField={{
                            get: editField,
                            set: setEditField
                        }}/>
                    <SidebarComponentFieldsInputNumber
                        firstItem={false} 
                        title={"Werkuren per week"} 
                        subTitle={'Dit is nodig om realtime een accuraat beeld te geven over de bezetting en werkdruk.'}
                        id={"hours_per_week"} 
                        value={itemObject.hours_per_week}
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
                    <SidebarComponentFieldsInputNumber
                        firstItem={false} 
                        title={"Uurtarief / loon per uur"} 
                        subTitle={'Dit is nodig om de voor -en nacalculatie, voor de categorie "Gewerkte uren" binnen projecten, automatisch te kunnen berekenen.'}
                        id={"hourly_rate"} 
                        value={itemObject.hourly_rate}
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
                    {
                        appContext.globalContext.authenticate.user.role == "Manager"
                        &&
                        <>
                            <SidebarComponentFieldsInputText
                                firstItem={false} 
                                title={"Rol"} 
                                id={"role"} 
                                value={'Medewerker'}
                                type={"readonly"}/>
                            <SidebarComponentFieldsInputText
                                firstItem={false} 
                                title={"Manager"} 
                                id={"manager_id"} 
                                value={'Ik'}
                                type={"readonly"}/>
                        </>
                    }
                    {
                        appContext.globalContext.authenticate.user.role == "Admin"
                        &&
                        <>
                            <SidebarComponentFieldsSelect 
                                firstItem={false} 
                                title={'Rol'}
                                subTitleList={[
                                    {
                                        show: itemObject.role == 'Admin',
                                        title: 'Een gebruiker met de rol "Beheerder"',
                                        content: [
                                            'Kan alles binnen deze organisatie inzien, creëren en beheren.',
                                            'Kan van alle gebruikers een manager zijn.',
                                            'Heeft toegang tot zowel de mobiele app als de dashboard.'
                                        ]
                                    },
                                    {
                                        show: itemObject.role == 'Projectleader',
                                        title: 'Een gebruiker met de rol "Projectleider"',
                                        content: [
                                            'Kan projecten inzien, creëren en beheren.',
                                            'Kan alles wat met zijn/haar projecten te maken heeft, inzien, creëren en beheren.',
                                            'Kan alles wat met gebruikers die hem/haar als manager hebben te maken heeft, inzien, creëren en beheren.',
                                            'Heeft toegang tot zowel de mobiele app als de dashboard.'
                                        ]
                                    },
                                    {
                                        show: itemObject.role == 'Manager',
                                        title: 'Een gebruiker met de rol "Teamleider"',
                                        content: [
                                            'Kan alleen een manager zijn van gebruikers met de rol "Medewerker".',
                                            'Kan alles wat met gebruikers die hem/haar als manager hebben te maken heeft, inzien, creëren en beheren.',
                                            'Heeft toegang tot zowel de mobiele app als de dashboard.'
                                        ]
                                    },
                                    {
                                        show: itemObject.role == 'Member',
                                        title: 'Een gebruiker met de rol "Medewerker"',
                                        content: [
                                            'Kan alleen zaken inzien, creëren en beheren die met hem/haar te maken heeft.',
                                            'Heeft alleen toegang tot de mobiele app.'
                                        ]
                                    },
                                ]}
                                id={'role'} 
                                label={GLOBALFUNC__TranslateUserRole(itemObject.role)}
                                value={itemObject.role}
                                type={'edit'}
                                error={error}
                                options={[
                                    {
                                        key: "Beheerder",
                                        value: "Admin"
                                    },
                                    {
                                        key: "Projectleider",
                                        value: "Projectleader"
                                    },
                                    {
                                        key: "Teamleider",
                                        value: "Manager"
                                    },
                                    {
                                        key: "Medewerker",
                                        value: "Member"
                                    }
                                ]}
                                required={true}
                                FUNC__CreateObject={FUNC__CreateObject}
                                itemObject={itemObject}
                                setItemObject={setItemObject}
                                editField={{
                                    get: editField,
                                    set: setEditField
                                }}/>
                            <SidebarComponentFieldsSelect 
                                firstItem={false} 
                                title={'Manager'}
                                subTitle={itemObject.role == 'Admin' || itemObject.role == 'Manager' ? 'Deze gebruiker kan alleen een Projectleider als manager hebben.' : ''}
                                id={'manager_id'} 
                                label={FUNC__TranslateManagerIdToNAW(
                                    appContext,
                                    itemObject.manager_id,
                                    adminsAndManagersObject
                                )}
                                value={itemObject.manager_id}
                                type={'edit'}
                                error={error}
                                options={itemObject.role == 'Admin' || itemObject.role == 'Manager' ? adminsOnlyObject.filter(x => x.value !== itemObject.user_id) : adminsAndManagersObject.filter(x => x.value !== itemObject.user_id)}
                                required={true}
                                FUNC__CreateObject={FUNC__CreateObject}
                                itemObject={itemObject}
                                setItemObject={setItemObject}
                                editField={{
                                    get: editField,
                                    set: setEditField
                                }}/>
                        </>
                    }
                    <SidebarComponentFieldsInputText
                        firstItem={false} 
                        title={"Functie"} 
                        id={"label"} 
                        value={itemObject.label}
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
                    <div className={cn([
                        globalStyles['bodysection-field'],
                        globalStyles['global-margin-top']
                    ])}>
                        <div className={globalStyles['bodysection-field__label']}>Status</div>
                        <div className={cn({
                            [globalStyles['global-status']]:true,
                            [globalStyles['global-margin-top-item']]:true,
                            [globalStyles['global-backgroundcolor-lightslategrey']]:itemObject.status == 'Leave_of_absence',
                            [globalStyles['global-backgroundcolor-orange']]:itemObject.status == 'Sick',
                            [globalStyles['global-backgroundcolor-red']]:itemObject.status  == 'Inactive',
                            [globalStyles['global-backgroundcolor-lightgreen']]:itemObject.status == 'Active'
                        })}>{
                                itemObject.status != 'Leave_of_absence'
                                &&
                                GLOBALFUNC__TranslateUserStatus(itemObject.status)
                            }
                            {
                                itemObject.status == 'Leave_of_absence'
                                &&
                                FUNC__FormatLeaveOfAbsence(itemObject.leave_of_absence)
                            }
                        </div>
                    </div>
                </>
            }

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
                && dataHasLoaded
                && !showDeleteConfirm
                && !confirmDialog.show
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
                                oldItemObject,
                                props.data.resourcesObject,
                                props.data.setResourcesObject,
                                adminsAndManagersObject,
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
                        itemObject.status == 'Inactive'
                        &&
                        <button className={cn([
                            globalStyles['global-button'],
                            globalStyles['global-button-hover'],
                            globalStyles['global-transition-duration'],
                            globalStyles['global-display-flex'],
                            globalStyles['global-width-100'],
                            globalStyles['global-margin-bottom']
                        ])} onClick={() => FUNC__ResendActivationMail(
                                itemObject,    
                                appContext,
                                setDataIsLoading,
                                setError
                            )}>
                            <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['send'].toSvg({height: "1vw", width: "1vw"})}}></i>
                            Account activatie e-mail opnieuw versturen
                        </button>
                    }
                    {
                        (itemObject.status == 'Active'
                        || itemObject.status == 'Leave_of_absence')
                        &&
                        <button className={cn([
                            globalStyles['global-button'],
                            globalStyles['global-button-hover-orange'],
                            globalStyles['global-transition-duration'],
                            globalStyles['global-display-flex'],
                            globalStyles['global-width-100'],
                            globalStyles['global-margin-bottom']
                        ])} onClick={() => FUNC__UpdateUserStatus(
                                "showDialog",
                                'Ziek',
                                confirmDialog,
                                setConfirmDialog,
                                setDataIsLoading
                            )}>
                            <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['user-x'].toSvg({height: "1vw", width: "1vw"})}}></i>
                            Zet status op "Ziek"
                        </button>
                    }
                    {
                        (itemObject.status == 'Sick'
                        || itemObject.status == 'Leave_of_absence')
                        &&
                        <button className={cn([
                            globalStyles['global-button'],
                            globalStyles['global-button-hover-lightgreen'],
                            globalStyles['global-transition-duration'],
                            globalStyles['global-display-flex'],
                            globalStyles['global-width-100'],
                            globalStyles['global-margin-bottom']
                        ])} onClick={() => FUNC__UpdateUserStatus(
                                "showDialog",
                                'Beschikbaar',
                                confirmDialog,
                                setConfirmDialog,
                                setDataIsLoading
                            )}>
                            <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['user-check'].toSvg({height: "1vw", width: "1vw"})}}></i>
                            Zet status op "Beschikbaar"
                        </button>
                    }
                    <button className={cn([
                        globalStyles['global-button'],
                        globalStyles['global-button-cancel-hover'],
                        globalStyles['global-transition-duration'],
                        globalStyles['global-display-flex'],
                        globalStyles['global-width-100']
                    ])} onClick={() => FUNC__DeleteObject(
                            "showDialog",
                            setShowDeleteConfirm
                        )}>
                        <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['trash-2'].toSvg({height: "1vw", width: "1vw"})}}></i>
                        Gebruiker verwijderen
                    </button>  
                </div>
            }

            {/* Loaders */}
            {
                !dataHasLoaded
                &&
                <GlobalComponentLoadingData 
                    type={'firstTimeLoading'}/>
            }
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
                showDeleteConfirm
                &&
                <SidebarComponentDialogConfirmDelete 
                    message={"deze gebruiker"}
                    FUNC__DeleteObject={FUNC__DeleteObject}
                    setShowDeleteConfirm={setShowDeleteConfirm}/>
            }

            {/* Confirm status update dialog */}
            {
                confirmDialog.show
                &&
                <SidebarComponentDialogConfirm
                    confirmDialog={confirmDialog}
                    setConfirmDialog={setConfirmDialog}
                    setDataIsLoading={setDataIsLoading}
                    appContext={appContext}
                    params={[
                        itemObject,
                        props.data.resourcesObject,
                        props.data.setResourcesObject,
                        setError
                    ]}
                    FUNC__Confirm={FUNC__UpdateUserStatus}/>
            }
        </div>
    );
}
export default ResourcesManagerSidebar__VIEW__SectionUserInfo;