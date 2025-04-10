// React / NextJs components
import { useState, useEffect, useContext } from 'react';
import cn from 'classnames';
import * as featherIcon from 'feather-icons';
import { useRouter } from 'next/navigation';
// Global / Page / Layout components
import SidebarComponentFieldsInputText from '../../../../../components/Global/Sidebar/Fields/InputText';
import SidebarComponentFieldsInputNumber from '../../../../../components/Global/Sidebar/Fields/InputNumber';
import SidebarComponentFieldsSelect from '../../../../../components/Global/Sidebar/Fields/Select';
import GlobalComponentLoadingData from '../../../../../components/Global/Loaders/LoadingData';
import { 
    FUNC__CreateObject,
    FUNC__CreateObject__SendObjectToServer,
    FUNC__GetAdminsAndManagers
} from './Controller';
import AppContext from '../../../../../helpers/AppContext';
import { 
    GLOBALFUNC__isWhitespaceString,
    GLOBALFUNC__ValidateEmail
} from '../../../../../helpers/GlobalFunctions';
// Page styles
import globalStyles from '../../../../../styles/global.module.scss';
/*
*
*
* 
* 
    REF:SIDEBAR__VIEW__SectionAddUser
    WHAT IS IT: 
        The generated view for the content section
*
*
* 
* 
*/
const ResourcesManagerSidebar__VIEW__SectionAddUser = (props) => {
    /* ========================================
    ===========================================
    ===========================================
    ===========================================
    ===========================================

        References

    ===========================================
    ===========================================
    ===========================================
    ===========================================
    =========================================== 

        VIEWS
            -> REF:VIEW__SectionHeader
            -> REF:VIEW__SectionContent
            -> REF:generated view
        FUNCTIONS
            -> REF:FUNC__FetchProjects
            -> REF:GLOBALFUNC__ReturnProjectStatus
        VARS
            -> REF:States, contexts and searchparams

    */
    const appContext = useContext(AppContext);
    const router = useRouter();
    const [dataIsLoading, setDataIsLoading] = useState(false);
    const [dataHasLoaded, setDataHasLoaded] = useState(false);
    const [showSubmitButton, setShowSubmitButton] = useState(false);
    const [adminsAndManagersObject, setAdminsAndManagersObject] = useState(false);
    const [adminsOnlyObject, setAdminsOnlyObject] = useState(null);
    const [error, setError] = useState({
        show: false,
        message: '',
        id: ''
    });
    const [itemObject, setItemObject] = useState({
        user_id: '',
        firstname: '',
        lastname: '',
        profile_photo: {
            thumbnail: '',
            medium: '',
            big: '',
            file: null
        },
        email: '',
        phonenumber: '',
        status: 'Inactive',
        role: 'Member',
        label: '',
        account_status: 'inactive',
        manager_id: appContext.globalContext.authenticate.user.user_id,
        manager: [],
        resources_under_management: 0,
        hours_per_week: '',
        hourly_rate: '',
        date_added: new Date()
    });
    useEffect(() => {
        FUNC__GetAdminsAndManagers(
            appContext.globalContext.authenticate.user.organization_id,
            appContext.globalContext.authenticate.user.user_id,
            setAdminsAndManagersObject,
            setAdminsOnlyObject,
            setError,
            setDataHasLoaded
        );
    }, []);
    useEffect(() => {
        let value = false;
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
        setShowSubmitButton(value);
    }, [itemObject]);
    useEffect(() => {
        setItemObject({
            ...itemObject,
            manager_id: appContext.globalContext.authenticate.user.user_id
        });
    }, [itemObject.role]);
    const createAnotherUser = () => {
        router.push('?action=create-user');
    }
    /*
    *
    *
    * 
    * 
        REF:generated view
        WHAT IS IT: 
            The generated view for this page
    *
    *
    * 
    * 
    */
    return(
        <div className={globalStyles['content-inner__bodysection']}>
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
                        type={"create"}
                        upperCase={true}
                        error={error}
                        showIndicator={false}
                        required={true}
                        FUNC__CreateObject={FUNC__CreateObject}
                        itemObject={itemObject}
                        setItemObject={setItemObject}/>
                    <SidebarComponentFieldsInputText
                        firstItem={false} 
                        title={"Achternaam"} 
                        id={"lastname"} 
                        value={itemObject.lastname}
                        type={"create"}
                        upperCase={true}
                        error={error}
                        showIndicator={false}
                        required={true}
                        FUNC__CreateObject={FUNC__CreateObject}
                        itemObject={itemObject}
                        setItemObject={setItemObject}/>
                    <SidebarComponentFieldsInputText
                        firstItem={false} 
                        title={"E-mail"} 
                        subTitle={'Wordt gebruikt om deze gebruiker uit te nodigen.'}
                        id={"email"} 
                        value={itemObject.email}
                        type={"create"}
                        upperCase={false}
                        error={error}
                        showIndicator={false}
                        required={true}
                        FUNC__CreateObject={FUNC__CreateObject}
                        itemObject={itemObject}
                        setItemObject={setItemObject}/>
                    <SidebarComponentFieldsInputText
                        firstItem={false} 
                        title={"Telefoonnummer"} 
                        id={"phonenumber"} 
                        value={itemObject.phonenumber}
                        type={"create"}
                        upperCase={false}
                        error={error}
                        showIndicator={false}
                        required={false}
                        FUNC__CreateObject={FUNC__CreateObject}
                        itemObject={itemObject}
                        setItemObject={setItemObject}/>
                    <SidebarComponentFieldsInputNumber
                        firstItem={false} 
                        title={"Contracturen / werkuren per week"} 
                        subTitle={'Dit is nodig om realtime een accuraat beeld te geven over de bezetting en werkdruk.'}
                        id={"hours_per_week"} 
                        value={itemObject.hours_per_week}
                        type={"create"}
                        error={error}
                        required={true}
                        FUNC__CreateObject={FUNC__CreateObject}
                        itemObject={itemObject}
                        setItemObject={setItemObject}/>
                    <SidebarComponentFieldsInputNumber
                        firstItem={false} 
                        title={"Uurtarief / loon per uur"} 
                        subTitle={'Dit is nodig om de voor -en nacalculatie, voor de categorie "Gewerkte uren" binnen projecten, automatisch te kunnen berekenen.'}
                        id={"hourly_rate"} 
                        value={itemObject.hourly_rate}
                        type={"create"}
                        error={error}
                        required={true}
                        FUNC__CreateObject={FUNC__CreateObject}
                        itemObject={itemObject}
                        setItemObject={setItemObject}/>
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
                                value={itemObject.role}
                                type={'create'}
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
                                setItemObject={setItemObject}/>
                            <SidebarComponentFieldsSelect 
                                firstItem={false} 
                                title={'Manager'}
                                subTitle={itemObject.role == 'Admin' || itemObject.role == 'Manager' ? 'Deze gebruiker kan alleen een Projectleider als manager hebben.' : ''}
                                id={'manager_id'} 
                                value={itemObject.manager_id}
                                type={'create'}
                                error={error}
                                options={itemObject.role == 'Admin' || itemObject.role == 'Manager' ? adminsOnlyObject : adminsAndManagersObject}
                                required={true}
                                FUNC__CreateObject={FUNC__CreateObject}
                                itemObject={itemObject}
                                setItemObject={setItemObject}/>
                        </>
                    }
                    <SidebarComponentFieldsInputText
                        firstItem={false} 
                        title={"Functie"} 
                        id={"label"} 
                        value={itemObject.label}
                        type={"create"}
                        upperCase={true}
                        error={error}
                        showIndicator={false}
                        required={true}
                        FUNC__CreateObject={FUNC__CreateObject}
                        itemObject={itemObject}
                        setItemObject={setItemObject}/>
                </>
            }
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
            {
                !dataIsLoading
                && dataHasLoaded
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
                            ])} onClick={() => FUNC__CreateObject__SendObjectToServer(
                                appContext,
                                itemObject,
                                props.data.resourcesObject,
                                props.data.setResourcesObject,
                                adminsAndManagersObject,
                                setDataIsLoading,
                                setError,
                                null
                            )}>
                                <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['check'].toSvg({height: "1vw", width: "1vw"})}}></i>
                                Uitnodigen en sluiten
                            </button>
                            <button className={cn([
                                    globalStyles['global-button'],
                                    globalStyles['global-button-hover'],
                                    globalStyles['global-transition-duration'],
                                    globalStyles['global-display-flex'],
                                    globalStyles['global-width-100'],
                                    globalStyles['global-margin-bottom']
                            ])} onClick={() => FUNC__CreateObject__SendObjectToServer(
                                appContext,
                                itemObject,
                                props.data.resourcesObject,
                                props.data.setResourcesObject,
                                adminsAndManagersObject,
                                setDataIsLoading,
                                setError,
                                createAnotherUser
                            )}>
                                <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['refresh-cw'].toSvg({height: "1vw", width: "1vw"})}}></i>
                                Uitnodigen en nog een gebruiker aanmaken
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
                                Uitnodigen en sluiten
                            </div>
                            <div className={cn([
                                globalStyles['global-button'],
                                globalStyles['global-button__inactive'],
                                globalStyles['global-display-flex'],
                                globalStyles['global-text-align-center'],
                                globalStyles['global-margin-bottom']
                            ])}>
                                <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['refresh-cw'].toSvg({height: "1vw", width: "1vw"})}}></i>
                                Uitnodigen en nog een gebruiker aanmaken
                            </div>
                        </>
                    }
                </div>
            }
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
                    <GlobalComponentLoadingData 
                        type={"loadMore"} />
                </div>
            }
        </div>
    );
}
export default ResourcesManagerSidebar__VIEW__SectionAddUser;