// React / NextJs components
import { useState, useEffect, useContext } from 'react';
import cn from 'classnames';
import * as featherIcon from 'feather-icons';
// Global / Page / Layout components
import UserComponentInsideList from '../../../../components/Global/Resources/User/InsideList';
import SidebarComponentFieldsInputText from '../../../../components/Global/Sidebar/Fields/InputText';
import SidebarComponentFieldsTextarea from '../../../../components/Global/Sidebar/Fields/Textarea';
import GlobalComponentLoadingData from '../../../../components/Global/Loaders/LoadingData';
import SidebarComponentDialogConfirm from '../../../../components/Global/Sidebar/Dialog/Confirm';
import SidebarComponentFieldsInputNumber from '../../../../components/Global/Sidebar/Fields/InputNumber';
import { 
    FUNC__CreateObject,
    FUNC__EditObject__SendObjectToServer,
    FUNC__DeleteObject,
    FUNC__UpdateWorkedHourStatus,
    FUNC__CancelRejection
} from './Controller';
import { 
    FUNC__TranslateWorkedHoursStatus
} from '../Controller';
import AppContext from '../../../../helpers/AppContext';
import { 
    GLOBALFUNC__isWhitespaceString,
    GLOBALFUNC__DifferenceBetweenObjects,
    GLOBALFUNC__TranslateSecondsToDate
} from '../../../../helpers/GlobalFunctions';
// Page styles
import globalStyles from '../../../../styles/global.module.scss';
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
const WorkedHoursManagerSidebar__VIEW__SectionOverviewWorkedHourInfo = (props) => {
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
    const [dataIsLoading, setDataIsLoading] = useState(false);
    const [showSubmitButton, setShowSubmitButton] = useState(false);
    const [error, setError] = useState({
        show: false,
        message: '',
        id: ''
    });
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState({
        show: false,
        data: null
    });
    const [confirmDialog, setConfirmDialog] = useState({
        show: false,
        message: '',
        submitMessage: '',
        data: null
    });
    const [editField, setEditField] = useState('');
    const [itemObject, setItemObject] = useState(props.data.workedHour);
    const [oldItemObject, setOldItemObject] = useState(props.data.workedHour);
    const [showRejectionField, setShowRejectionField] = useState(false);
    const [showRejectionSubmitButton, setShowRejectionSubmitButton] = useState(false);
    useEffect(() => {
        let submitButtonValue = false;
        if(!showRejectionField){
            if(GLOBALFUNC__DifferenceBetweenObjects(itemObject, oldItemObject)){
                if(!GLOBALFUNC__isWhitespaceString(itemObject.hours)
                    && !GLOBALFUNC__isWhitespaceString(itemObject.kilometers_traveled)){
                    submitButtonValue = true;
                } else {
                    submitButtonValue = false;
                }
            } else {
                submitButtonValue = false;
            }
            setShowSubmitButton(submitButtonValue); 
        } 
        
        if(showRejectionField){
            if(!GLOBALFUNC__isWhitespaceString(itemObject.rejection_reason)){
                setShowRejectionSubmitButton(true);
            } else {
                setShowRejectionSubmitButton(false);
            }
        }
    }, [itemObject]);
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
                !showRejectionField
                &&
                <>
                    <div className={cn([
                        globalStyles['bodysection-field'],
                        globalStyles['global-margin-top']
                    ])}>
                        <div className={globalStyles['bodysection-field__label']}>Resource</div>
                        <div className={globalStyles['global-margin-top-item']}>
                            <UserComponentInsideList
                                user={itemObject.resource[0]}/>
                        </div>
                    </div>
                    <SidebarComponentFieldsInputText
                        firstItem={false} 
                        title={"Datum"} 
                        id={"date"} 
                        value={GLOBALFUNC__TranslateSecondsToDate(
                            new Date(itemObject.date.seconds * 1000)
                        )}
                        type={"readonly"}/>
                    <SidebarComponentFieldsInputText
                        firstItem={false} 
                        title={"Project"} 
                        id={"project"} 
                        value={itemObject.project}
                        type={"readonly"}/>
                    <SidebarComponentFieldsInputText
                        firstItem={false} 
                        title={"Fase"} 
                        id={"phase"} 
                        value={itemObject.phase}
                        type={"readonly"}/>
                    <SidebarComponentFieldsInputText
                        firstItem={false} 
                        title={"Taak"} 
                        id={"task"} 
                        value={itemObject.task}
                        type={"readonly"}/>
                    {
                        itemObject.user_id != appContext.globalContext.authenticate.user.user_id
                        &&
                            <>
                                <SidebarComponentFieldsInputText
                                    firstItem={false} 
                                    title={"Gewerkte uren"} 
                                    id={"hours"} 
                                    value={itemObject.hours}
                                    type={"readonly"}/>
                                <SidebarComponentFieldsInputText
                                    firstItem={false} 
                                    title={"Afgelegde kilometers"} 
                                    id={"kilometers_traveled"} 
                                    value={itemObject.kilometers_traveled}
                                    type={"readonly"}/>
                            </>
                            ||
                            <>
                                <SidebarComponentFieldsInputNumber
                                    firstItem={false} 
                                    title={"Gewerkte uren"} 
                                    id={"hours"} 
                                    value={itemObject.hours}
                                    type={itemObject.status != "approved" && itemObject.status != "rejected" ? "edit" : "readonly"}
                                    error={error}
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
                                    title={"Afgelegde kilometers"} 
                                    id={"kilometers_traveled"} 
                                    value={itemObject.kilometers_traveled}
                                    type={itemObject.status != "approved" && itemObject.status != "rejected" ? "edit" : "readonly"}
                                    error={error}
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
                    <div className={cn([
                        globalStyles['bodysection-field'],
                        globalStyles['global-margin-top']
                    ])}>
                        <div className={globalStyles['bodysection-field__label']}>Status</div>
                        <div className={cn({
                            [globalStyles['global-status']]:true,
                            [globalStyles['global-margin-top-item']]:true,
                            [globalStyles['global-backgroundcolor-lightslategrey']]:itemObject.status == 'not_filled',
                            [globalStyles['global-backgroundcolor-blue']]:itemObject.status == 'open',
                            [globalStyles['global-backgroundcolor-red']]:itemObject.status == 'rejected',
                            [globalStyles['global-backgroundcolor-lightgreen']]:itemObject.status == 'approved'
                        })}>{FUNC__TranslateWorkedHoursStatus(itemObject.status)}</div>
                    </div>
                </>
            }
            {
                showRejectionField
                &&
                <SidebarComponentFieldsTextarea
                    title={"Reden voor afkeuring"} 
                    id={"rejection_reason"} 
                    value={itemObject.rejection_reason != '' ? itemObject.rejection_reason : ''}
                    type={'create'}
                    upperCase={true}
                    required={true}
                    FUNC__CreateObject={FUNC__CreateObject}
                    itemObject={itemObject}
                    setItemObject={setItemObject}/> 
            }
            {
                itemObject.status == 'rejected'
                &&
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top'],
                    globalStyles['global-indent-x2']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Reden voor afkeuring</div>
                    <div className={cn([
                        globalStyles['bodysection-field__non-input'],
                        globalStyles['global-margin-top-item'],
                        globalStyles['global-animation-fadein']
                    ])}>{itemObject.rejection_reason}</div>
                </div>
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
                && !deleteDialog.show
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
                        itemObject.user_id == appContext.globalContext.authenticate.user.user_id
                        && showSubmitButton
                        && !showRejectionField
                        &&
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
                            props.data.resourcesWorkedHoursObject,
                            props.data.setResourcesWorkedHoursObject,
                            setDataIsLoading,
                            setError,
                            setEditField
                        )}>
                            <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['check'].toSvg({height: "1vw", width: "1vw"})}}></i>
                            Wijzigingen opslaan
                        </button>
                    }
                    {
                        itemObject.user_id == appContext.globalContext.authenticate.user.user_id
                        && !showSubmitButton
                        && !showRejectionField
                        &&
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

                    }
                    {
                        (appContext.globalContext.authenticate.user.role == "Manager"
                            || appContext.globalContext.authenticate.user.role == "Admin")
                        && (itemObject.status == 'approved'
                            || itemObject.status == 'rejected')
                        &&
                        <button className={cn([
                            globalStyles['global-button'],
                            globalStyles['global-button-hover'],
                            globalStyles['global-transition-duration'],
                            globalStyles['global-display-flex'],
                            globalStyles['global-width-100'],
                            globalStyles['global-margin-bottom']
                        ])} onClick={() => FUNC__UpdateWorkedHourStatus(
                                "showDialog",
                                'Nog niet beoordeeld',
                                confirmDialog,
                                setConfirmDialog,
                                setDataIsLoading,
                                appContext.globalContext.authenticate.user.organization_id
                            )}>
                            <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['edit-3'].toSvg({height: "1vw", width: "1vw"})}}></i>
                            Heropenen
                        </button>
                    }
                    {
                        (appContext.globalContext.authenticate.user.role == "Manager"
                            || appContext.globalContext.authenticate.user.role == "Admin")
                        && itemObject.status == 'open'
                        && !showRejectionField
                        &&
                        <>
                            <button className={cn([
                                globalStyles['global-button'],
                                globalStyles['global-button-hover-lightgreen'],
                                globalStyles['global-transition-duration'],
                                globalStyles['global-display-flex'],
                                globalStyles['global-width-100'],
                                globalStyles['global-margin-bottom']
                            ])} onClick={() => FUNC__UpdateWorkedHourStatus(
                                    "showDialog",
                                    'Goedgekeurd',
                                    confirmDialog,
                                    setConfirmDialog,
                                    setDataIsLoading,
                                    appContext.globalContext.authenticate.user.organization_id
                                )}>
                                <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['thumbs-up'].toSvg({height: "1vw", width: "1vw"})}}></i>
                                Goedkeuren
                            </button>
                            <button className={cn([
                                globalStyles['global-button'],
                                globalStyles['global-button-cancel-hover'],
                                globalStyles['global-transition-duration'],
                                globalStyles['global-display-flex'],
                                globalStyles['global-width-100']
                            ])} onClick={() => setShowRejectionField(true)}>
                                <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['thumbs-down'].toSvg({height: "1vw", width: "1vw"})}}></i>
                                Afkeuren
                            </button>
                        </>
                    }
                    {
                        showRejectionField
                        &&
                        <>
                            <button className={cn([
                                globalStyles['global-button'],
                                globalStyles['global-button-back'],
                                globalStyles['global-transition-duration'],
                                globalStyles['global-display-flex'],
                                globalStyles['global-width-100'],
                                globalStyles['global-margin-bottom']
                            ])} onClick={() => FUNC__CancelRejection(
                                    setShowRejectionField,
                                    itemObject,
                                    setItemObject,
                                    setShowRejectionSubmitButton
                                )}>
                                <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['x'].toSvg({height: "1vw", width: "1vw"})}}></i>
                                Annuleren
                            </button>
                            {
                                showRejectionSubmitButton
                                &&
                                <button className={cn([
                                    globalStyles['global-button'],
                                    globalStyles['global-button-cancel-hover'],
                                    globalStyles['global-transition-duration'],
                                    globalStyles['global-display-flex'],
                                    globalStyles['global-width-100']
                                ])} onClick={() => FUNC__UpdateWorkedHourStatus(
                                        "showDialog",
                                        'Afgekeurd',
                                        confirmDialog,
                                        setConfirmDialog,
                                        setDataIsLoading,
                                        appContext.globalContext.authenticate.user.organization_id
                                    )}>
                                    <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['thumbs-down'].toSvg({height: "1vw", width: "1vw"})}}></i>
                                    Afkeuren
                                </button>
                                ||
                                <div className={cn([
                                    globalStyles['global-button'],
                                    globalStyles['global-button__inactive'],
                                    globalStyles['global-display-flex'],
                                    globalStyles['global-text-align-center'],
                                    globalStyles['global-margin-bottom']
                                ])}>
                                    <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['thumbs-down'].toSvg({height: "1vw", width: "1vw"})}}></i>
                                    Afkeuren
                                </div>
                            }
                        </>
                    }
                </div>
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
            {/*
                deleteDialog.show
                &&
                <SidebarComponentDialogConfirmDelete 
                    message={"deze gewerkte uren"}
                    deleteDialog={deleteDialog}
                    setDeleteDialog={setDeleteDialog}
                    setDataIsLoading={setDataIsLoading}
                    appContext={appContext}
                    params={[
                        itemObject,
                        props.data.resourcesWorkedHoursObject,
                        props.data.setResourcesWorkedHoursObject,
                        setError
                    ]}
                    FUNC__DeleteObject={FUNC__DeleteObject}/>
            */}
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
                        props.data.resourcesWorkedHoursObject,
                        props.data.setResourcesWorkedHoursObject,
                        setError
                    ]}
                    FUNC__Confirm={FUNC__UpdateWorkedHourStatus}/>
            }
        </div>
    );
}
export default WorkedHoursManagerSidebar__VIEW__SectionOverviewWorkedHourInfo;