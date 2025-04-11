// React / NextJs components
import { useState, useEffect, useContext, useRef } from 'react';
import cn from 'classnames';
import * as featherIcon from 'feather-icons';
import { useInView } from 'react-intersection-observer';
// Global / Page / Layout components
import SidebarComponentFieldsInputText from '../../../../components/Global/Sidebar/Fields/InputText';
import SidebarComponentFieldsInputNumber from '../../../../components/Global/Sidebar/Fields/InputNumber';
import SidebarComponentFieldsInputDate from '../../../../components/Global/Sidebar/Fields/InputDate';
import GlobalComponentLoadingData from '../../../../components/Global/Loaders/LoadingData';
import SidebarComponentDialogConfirmDelete from '../../../../components/Global/Sidebar/Dialog/ConfirmDelete';
import SidebarComponentDialogConfirm from '../../../../components/Global/Sidebar/Dialog/Confirm';
import SidebarComponentFieldsTextarea from '../../../../components/Global/Sidebar/Fields/Textarea';
import UserComponentInsideList from '../../../../components/Global/Resources/User/InsideList';
import GlobalComponentDynamicMessage from '../../../../components/Global/Alerts/DynamicMessage';
import SidebarComponentFieldsFileUpload from '../../../../components/Global/Sidebar/Fields/FileUpload';
import { 
    FUNC__CreateObject,
    FUNC__EditObject__SendObjectToServer,
    FUNC__DeleteObject,
    FUNC__UpdateTaskStatus,
    FUNC__CancelStuck,
    FUNC__CancelUnStuck,
    FUNC__FetchTaskFromServer,
    FUNC__GetDiscussion,
    FUNC__LoadMoreDiscussion,
    FUNC__AddMessageToDiscussion,
    FUNC__OnKeyDown
} from './Controller';
import AppContext from '../../../../helpers/AppContext';
import { 
    GLOBALFUNC__isWhitespaceString,
    GLOBALFUNC__DifferenceBetweenObjects,
    GLOBALFUNC__TranslateSecondsToDate,
    GLOBALFUNC__AddZeroBeforeDateItem,
    GLOBALFUNC__TimeAgo,
    GLOBALFUNC__TranslateTasksStatus,
    GLOBALFUNC__UserInitials,
    GLOBALFUNC__FormatBytes
} from '../../../../helpers/GlobalFunctions';
import firebase_app from '../../../../firebase/Config';
import { 
    getFirestore
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
// Page styles
import globalStyles from '../../../../styles/global.module.scss';


const TasksManagerSidebar__VIEW__SectionOverviewTaskInfo = (props) => {
    const appContext = useContext(AppContext);
    const firebaseDb = getFirestore(firebase_app);
    const firebaseStorage = getStorage(firebase_app);
    const dateToday = new Date();
    const [fetchTaskFromServer, setFetchTaskFromServer] = useState(props.data.fetchTaskFromServer);
    const [dataIsLoading, setDataIsLoading] = useState(false);
    const [dataHasLoaded, setDataHasLoaded] = useState(!fetchTaskFromServer ? true : false);
    const [showSubmitButton, setShowSubmitButton] = useState(false);
    const [error, setError] = useState({
        show: false,
        message: '',
        id: ''
    });
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
    const [itemObject, setItemObject] = useState(!fetchTaskFromServer ? props.data.task : null);
    console.log(itemObject);
    const [oldItemObject, setOldItemObject] = useState(!fetchTaskFromServer ? {...props.data.task} : null);
    const [itemObjectFiles, setItemObjectFiles] = useState(!fetchTaskFromServer ? props.data.task.files : []);
    const [addedItemObjectFiles, setAddedItemObjectFiles] = useState([]);
    const [deletedItemObjectFiles, setDeletedItemObjectFiles] = useState([]);
    const [organizationfileStorage, setOrganizationfileStorage] = useState({...appContext.globalContext.authenticate.organization.file_storage});
    const [showStuckField, setShowStuckField] = useState(false);
    const [showStuckSubmitButton, setShowStuckSubmitButton] = useState(false);
    const [showUnStuckField, setShowUnStuckField] = useState(false);
    const [showUnStuckSubmitButton, setShowUnStuckSubmitButton] = useState(false);
    const [chatHasLoaded, setChatHasLoaded] = useState(false);
    const [chatObject, setChatObject] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [chatObjectLastVisible, setChatObjectLastVisible] = useState(null);
    const [hasAccess, setHasAccess] = useState(false);
    const chatContainerRef = useRef(null);
    const {ref: loadingMoreChatdata, inView} = useInView();
    const [currentlyLoadingMoreChatData, setCurrentlyLoadingMoreChatData] = useState(false);
    const [newMessageAdded, setNewMessageAdded] = useState(0);
    useEffect(() => {
        if(fetchTaskFromServer){
            FUNC__FetchTaskFromServer(
                props.data.task_id,
                setItemObject,
                setOldItemObject,
                setError,
                setDataHasLoaded,
                firebaseDb,
                setChatHasLoaded,
                setChatObject,
                appContext,
                setChatObjectLastVisible,
                setNewMessageAdded,
                setHasAccess,
                appContext.globalContext.authenticate.user.user_id,
                appContext.globalContext.authenticate.user.role,
                setItemObjectFiles
            );
        }
    }, [fetchTaskFromServer]);
    useEffect(() => {
        if(!fetchTaskFromServer){
            setHasAccess(true);
            FUNC__GetDiscussion(
                itemObject.task_id,
                firebaseDb,
                setChatHasLoaded,
                setChatObject,
                appContext,
                setChatObjectLastVisible,
                setError,
                setNewMessageAdded
            );
        }
    }, [fetchTaskFromServer]);
    useEffect(() => {
        if((error.show && error.id == 'ADD_MESSAGE_ERROR')
            || newMessageAdded){
            const element = chatContainerRef.current;
            if (element) {
                element.scrollTop = element.scrollHeight;
            }
        }
    }, [error.show, newMessageAdded]);
    useEffect(() => {
        if (inView) {
            console.log('inview');
            if(chatHasLoaded
                && !currentlyLoadingMoreChatData){
                setCurrentlyLoadingMoreChatData(true);
                FUNC__LoadMoreDiscussion(
                    itemObject.task_id,
                    firebaseDb,
                    chatObject,
                    setChatObject,
                    appContext.globalContext.authenticate.user.user_id,
                    chatObjectLastVisible,
                    setChatObjectLastVisible,
                    setCurrentlyLoadingMoreChatData,
                    setError
                );
            }
        }
    },[inView]);
    useEffect(() => {
        let submitButtonValue = false;
        if(itemObject && !showStuckField && !showUnStuckField){
            if((GLOBALFUNC__DifferenceBetweenObjects(itemObject, oldItemObject)
            || addedItemObjectFiles.length > 0
            || deletedItemObjectFiles.length > 0)){
                if(!GLOBALFUNC__isWhitespaceString(itemObject.deadline)
                && !GLOBALFUNC__isWhitespaceString(itemObject.name)
                && !GLOBALFUNC__isWhitespaceString(itemObject.hours_budgeted)){
                    submitButtonValue = true;
                    console.log(itemObject);
                    console.log(oldItemObject);
                } else {
                    submitButtonValue = false;
                }
            } else {
                submitButtonValue = false;
            }
            setShowSubmitButton(submitButtonValue); 
        }   

        if(itemObject && showStuckField){
            if(!GLOBALFUNC__isWhitespaceString(itemObject.stuck_comment.comment)){
                setShowStuckSubmitButton(true);
            } else {
                setShowStuckSubmitButton(false);
            }
        }

        if(itemObject && showUnStuckField){
            if(!GLOBALFUNC__isWhitespaceString(itemObject.stuck_comment.related_problem_solved_comment)){
                setShowUnStuckSubmitButton(true);
            } else {
                setShowUnStuckSubmitButton(false);
            }
        }
    }, [itemObject, addedItemObjectFiles, deletedItemObjectFiles]);
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
            {
                hasAccess
                && dataHasLoaded
                && chatHasLoaded
                &&
                <div className={cn([
                    globalStyles['global-grid-2'],
                    globalStyles['global-grid-gap']
                ])}>
                    <div>
                        {/* Fields */}
                        {
                            !showStuckField
                            && !showUnStuckField
                            &&
                            <>
                                <div className={globalStyles['bodysection-field']}>
                                    <div className={globalStyles['bodysection-field__label']}>Toegewezen aan</div>
                                    <div className={globalStyles['global-margin-subtext']}>Wordt automatisch ingevuld op basis van de planning.</div>
                                    <div className={globalStyles['global-margin-top-item']}>
                                        {itemObject.assigned_to.map(resource => (
                                            <div className={globalStyles['global-margin-bottom-item']} key={resource.user_id}>
                                                <UserComponentInsideList
                                                    user={resource}/>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <SidebarComponentFieldsInputText
                                    firstItem={false} 
                                    title={"Naam"} 
                                    id={"name"} 
                                    value={itemObject.name}
                                    type={(appContext.globalContext.authenticate.user.role == "Admin"
                                        || appContext.globalContext.authenticate.user.user_id == itemObject.project_manager_id
                                        || appContext.globalContext.authenticate.user.user_id == itemObject.manager_id) ? "edit" : "readonly"}
                                    upperCase={true}
                                    error={error}
                                    showIndicator={true}
                                    required={true}
                                    FUNC__CreateObject={FUNC__CreateObject}
                                    itemObject={itemObject}
                                    setItemObject={setItemObject}
                                    editField={{
                                        get: editField,
                                        set: setEditField
                                    }}/>
                                <SidebarComponentFieldsInputText
                                    title={"Project"} 
                                    id={"project"} 
                                    value={itemObject.project.name}
                                    type={"readonly"}/> 
                                <SidebarComponentFieldsInputText
                                    title={"Fase"} 
                                    id={"phase"} 
                                    value={itemObject.phase}
                                    type={"readonly"}/> 
                                <SidebarComponentFieldsInputDate
                                    firstItem={false} 
                                    title={"Deadline"} 
                                    id={"formatted_deadline"} 
                                    value={itemObject.formatted_deadline}
                                    label={GLOBALFUNC__TranslateSecondsToDate(
                                        new Date(itemObject.formatted_deadline),
                                        false,
                                        false
                                    )}
                                    limits={{
                                        min: `${dateToday.getFullYear()}-${GLOBALFUNC__AddZeroBeforeDateItem(dateToday.getMonth() + 1)}-${dateToday.getDate()}`,
                                        max: GLOBALFUNC__TranslateSecondsToDate(
                                            new Date(itemObject.project.deadline.seconds * 1000),
                                            true,
                                            true
                                        )
                                    }}
                                    type={(appContext.globalContext.authenticate.user.role == "Admin"
                                        || appContext.globalContext.authenticate.user.user_id == itemObject.project_manager_id
                                        || appContext.globalContext.authenticate.user.user_id == itemObject.manager_id) ? 'edit' : 'readonly'}
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
                                    title={"Uren begroot"} 
                                    id={"hours_budgeted"} 
                                    value={itemObject.hours_budgeted}
                                    type={(appContext.globalContext.authenticate.user.role == "Admin"
                                        || appContext.globalContext.authenticate.user.user_id == itemObject.project_manager_id
                                        || appContext.globalContext.authenticate.user.user_id == itemObject.manager_id) ? "edit" : "readonly"}
                                    upperCase={true}
                                    error={error}
                                    showIndicator={true}
                                    required={true}
                                    FUNC__CreateObject={FUNC__CreateObject}
                                    itemObject={itemObject}
                                    setItemObject={setItemObject}
                                    editField={{
                                        get: editField,
                                        set: setEditField
                                    }}/>
                                <SidebarComponentFieldsInputText
                                    title={"Werkelijke uren"} 
                                    id={"worked_hours"} 
                                    value={itemObject.worked_hours}
                                    type={"readonly"}/> 
                                <SidebarComponentFieldsFileUpload
                                    title={"Bijlages (optioneel)"}
                                    subTitle={`Nog ${GLOBALFUNC__FormatBytes(
                                        (organizationfileStorage.total - organizationfileStorage.used)
                                    )} opslag over`}
                                    buttonText={"Uploaden"}
                                    id={"appendix"}
                                    itemObjectFiles={itemObjectFiles}
                                    setItemObjectFiles={setItemObjectFiles}
                                    addedItemObjectFiles={addedItemObjectFiles}
                                    setAddedItemObjectFiles={setAddedItemObjectFiles}
                                    deletedItemObjectFiles={deletedItemObjectFiles}
                                    setDeletedItemObjectFiles={setDeletedItemObjectFiles}
                                    organizationfileStorage={organizationfileStorage}
                                    setOrganizationfileStorage={setOrganizationfileStorage}
                                    dataIsLoading={dataIsLoading}
                                    signatureRequired={true}
                                    action={"edit"}
                                    hideButtons={itemObject.status != "Voltooid" ? false : true}/>
                                <div className={cn([
                                    globalStyles['bodysection-field'],
                                    globalStyles['global-margin-top']
                                ])}>
                                    <div className={globalStyles['bodysection-field__label']}>Aangemaakt door</div>
                                    <div className={globalStyles['global-margin-top-item']}>
                                        <div className={globalStyles['global-margin-bottom-item']}>
                                            <UserComponentInsideList
                                                user={itemObject.owner[0]}/>
                                        </div>
                                    </div>
                                </div>
                                <div className={cn([
                                    globalStyles['bodysection-field'],
                                    globalStyles['global-margin-top']
                                ])}>
                                    <div className={globalStyles['bodysection-field__label']}>Status</div>
                                    <div className={cn({
                                        [globalStyles['global-status']]:true,
                                        [globalStyles['global-margin-top-item']]:true,
                                        [globalStyles['global-backgroundcolor-lightslategrey']]:itemObject.status == 'unasigned',
                                        [globalStyles['global-backgroundcolor-blue']]:itemObject.status == 'open',
                                        [globalStyles['global-backgroundcolor-purple']]:itemObject.status == 'in_progress',
                                        [globalStyles['global-backgroundcolor-orange']]:itemObject.status == 'overdue',
                                        [globalStyles['global-backgroundcolor-red']]:itemObject.status == 'stuck',
                                        [globalStyles['global-backgroundcolor-lightgreen']]:itemObject.status == 'completed'
                                    })}>{GLOBALFUNC__TranslateTasksStatus(itemObject.status)}</div>
                                </div>
                                {
                                    itemObject.status == 'stuck'
                                    &&
                                    <div className={cn([
                                        globalStyles['bodysection-field'],
                                        globalStyles['global-margin-top'],
                                        globalStyles['global-indent-x2']
                                    ])}>
                                        <div className={globalStyles['bodysection-field__label']}>Reden voor de status 'Vastgelopen'</div>
                                        <div className={cn([
                                            globalStyles['bodysection-field__non-input'],
                                            globalStyles['global-margin-top-item'],
                                            globalStyles['global-animation-fadein']
                                        ])}>
                                            <div className={cn([
                                                globalStyles['global-grid-2'],
                                                globalStyles['global-fontweight-bold']
                                            ])}>
                                                <div>{itemObject.stuck_comment.user[0].firstname} {itemObject.stuck_comment.user[0].lastname}</div>
                                                <div className={globalStyles['global-display-flex-end']}>
                                                    {GLOBALFUNC__TimeAgo(
                                                        new Date(itemObject.stuck_comment.date_added.seconds * 1000), 
                                                        true,
                                                        true
                                                    )}
                                                </div>
                                            </div>
                                            <div className={cn([
                                                globalStyles['global-margin-top-item']
                                            ])}>{itemObject.stuck_comment.comment}</div>
                                        </div>
                                    </div>
                                }
                            </>
                        }

                        {/* Task stuck field */}
                        {
                            showStuckField
                            &&
                            <SidebarComponentFieldsTextarea
                                title={"Opmerking"} 
                                subTitle={"Wat is de reden dat deze taak is vastgelopen?"}
                                id={"stuck_comment[comment]"} 
                                value={itemObject.stuck_comment.comment != '' ? itemObject.stuck_comment.comment : ''}
                                type={confirmDialog.show ? 'readonly' : 'create'}
                                upperCase={true}
                                required={true}
                                FUNC__CreateObject={FUNC__CreateObject}
                                itemObject={itemObject}
                                setItemObject={setItemObject}/> 
                        }

                        {/* Task unstuck field */}
                        {
                            showUnStuckField
                            &&
                            <SidebarComponentFieldsTextarea
                                title={"Opmerking"} 
                                subTitle={"Wat is er gedaan om het probleem van deze 'Vastgelopen' taak op te lossen?"}
                                id={"stuck_comment[related_problem_solved_comment]"} 
                                value={itemObject.stuck_comment.related_problem_solved_comment != '' ? itemObject.stuck_comment.related_problem_solved_comment : ''}
                                type={confirmDialog.show ? 'readonly' : 'create'}
                                upperCase={true}
                                required={true}
                                FUNC__CreateObject={FUNC__CreateObject}
                                itemObject={itemObject}
                                setItemObject={setItemObject}/> 
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
                            && chatHasLoaded
                            && !deleteDialog.show
                            && !confirmDialog.show
                            &&
                            <div className={cn([
                                globalStyles['global-margin-top-x2'],
                                globalStyles['bodysection-buttons'],
                            ])}>
                                <div className={cn([
                                    globalStyles['global-seperator__horizontal'],
                                    globalStyles['global-margin-bottom-x2'],
                                ])}></div>
                                {
                                    showSubmitButton
                                    && (appContext.globalContext.authenticate.user.role == "Admin"
                                        || appContext.globalContext.authenticate.user.user_id == itemObject.project_manager_id
                                        || appContext.globalContext.authenticate.user.user_id == itemObject.manager_id)
                                    && !showStuckField
                                    && !showUnStuckField
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
                                        oldItemObject,
                                        props.data.tasksObject,
                                        props.data.setTasksObject,
                                        setDataIsLoading,
                                        setError,
                                        setEditField,
                                        appContext.globalContext.authenticate.user.user_id,
                                        itemObjectFiles,
                                        addedItemObjectFiles,
                                        deletedItemObjectFiles,
                                        firebaseStorage,
                                        firebaseDb
                                    )}>
                                        <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['check'].toSvg({height: "1vw", width: "1vw"})}}></i>
                                        Wijzigingen opslaan
                                    </button>
                                }
                                {
                                    !showSubmitButton
                                    && (appContext.globalContext.authenticate.user.role == "Admin"
                                        || appContext.globalContext.authenticate.user.user_id == itemObject.project_manager_id
                                        || appContext.globalContext.authenticate.user.user_id == itemObject.manager_id)
                                    && !showStuckField
                                    && !showUnStuckField
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
                                    (appContext.globalContext.authenticate.user.role == "Admin"
                                        || appContext.globalContext.authenticate.user.user_id == itemObject.project_manager_id
                                        || appContext.globalContext.authenticate.user.user_id == itemObject.manager_id
                                    || result.message.assigned_to.includes(appContext.globalContext.authenticate.user.user_id))
                                    && itemObject.status != 'in_progress'
                                    && itemObject.status != 'overdue'
                                    && itemObject.status != 'unasigned'
                                    && itemObject.status != 'stuck'
                                    && !showStuckField
                                    && !showUnStuckField
                                    &&
                                    <button className={cn([
                                        globalStyles['global-button'],
                                        globalStyles['global-button-hover-purple'],
                                        globalStyles['global-transition-duration'],
                                        globalStyles['global-display-flex'],
                                        globalStyles['global-width-100'],
                                        globalStyles['global-margin-bottom']
                                    ])} onClick={() => FUNC__UpdateTaskStatus(
                                            "showDialog",
                                            'In behandeling',
                                            confirmDialog,
                                            setConfirmDialog,
                                            setDataIsLoading,
                                            appContext
                                        )}>
                                        <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['loader'].toSvg({height: "1vw", width: "1vw"})}}></i>
                                        Zet status op "In behandeling"
                                    </button>
                                }
                                {
                                    (appContext.globalContext.authenticate.user.role == "Admin"
                                        || appContext.globalContext.authenticate.user.user_id == itemObject.project_manager_id
                                        || appContext.globalContext.authenticate.user.user_id == itemObject.manager_id
                                    || result.message.assigned_to.includes(appContext.globalContext.authenticate.user.user_id))
                                    && itemObject.status == 'stuck'
                                    && !showStuckField
                                    && !showUnStuckField
                                    &&
                                    <button className={cn([
                                        globalStyles['global-button'],
                                        globalStyles['global-button-hover-lightgreen'],
                                        globalStyles['global-transition-duration'],
                                        globalStyles['global-display-flex'],
                                        globalStyles['global-width-100'],
                                        globalStyles['global-margin-bottom']
                                    ])} onClick={() => setShowUnStuckField(true)}>
                                        <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['check-circle'].toSvg({height: "1vw", width: "1vw"})}}></i>
                                        Probleem opgelost
                                    </button>
                                }
                                {
                                    (appContext.globalContext.authenticate.user.role == "Admin"
                                        || appContext.globalContext.authenticate.user.user_id == itemObject.project_manager_id
                                        || appContext.globalContext.authenticate.user.user_id == itemObject.manager_id
                                    || result.message.assigned_to.includes(appContext.globalContext.authenticate.user.user_id))
                                    && itemObject.status != 'completed'
                                    && itemObject.status != 'unasigned'
                                    && itemObject.status != 'stuck'
                                    && !showStuckField
                                    && !showUnStuckField
                                    &&
                                    <button className={cn([
                                        globalStyles['global-button'],
                                        globalStyles['global-button-hover-lightgreen'],
                                        globalStyles['global-transition-duration'],
                                        globalStyles['global-display-flex'],
                                        globalStyles['global-width-100'],
                                        globalStyles['global-margin-bottom']
                                    ])} onClick={() => FUNC__UpdateTaskStatus(
                                            "showDialog",
                                            'Voltooid',
                                            confirmDialog,
                                            setConfirmDialog,
                                            setDataIsLoading,
                                            appContext
                                        )}>
                                        <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['check-circle'].toSvg({height: "1vw", width: "1vw"})}}></i>
                                        Zet status op "Voltooid"
                                    </button>
                                }
                                {
                                    (appContext.globalContext.authenticate.user.role == "Admin"
                                        || appContext.globalContext.authenticate.user.user_id == itemObject.project_manager_id
                                        || appContext.globalContext.authenticate.user.user_id == itemObject.manager_id
                                    || result.message.assigned_to.includes(appContext.globalContext.authenticate.user.user_id))
                                    && itemObject.status != 'completed'
                                    && itemObject.status != 'stuck'
                                    && itemObject.original_status != 'stuck'
                                    && itemObject.status != 'unasigned'
                                    && !showStuckField
                                    && !showUnStuckField
                                    &&
                                    <button className={cn([
                                        globalStyles['global-button'],
                                        globalStyles['global-button-cancel-hover'],
                                        globalStyles['global-transition-duration'],
                                        globalStyles['global-display-flex'],
                                        globalStyles['global-width-100'],
                                        globalStyles['global-margin-bottom']
                                    ])} onClick={() => setShowStuckField(true)}>
                                        <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['x-octagon'].toSvg({height: "1vw", width: "1vw"})}}></i>
                                        Zet status op "Vastgelopen"
                                    </button>
                                }
                                {
                                    (appContext.globalContext.authenticate.user.role == "Admin"
                                        || appContext.globalContext.authenticate.user.user_id == itemObject.project_manager_id
                                        || appContext.globalContext.authenticate.user.user_id == itemObject.manager_id)
                                    && itemObject.status != 'completed'
                                    && itemObject.status != 'unasigned'
                                    && !showStuckField
                                    && !showUnStuckField
                                    &&
                                    <button className={cn([
                                        globalStyles['global-button'],
                                        globalStyles['global-button-hover-lightgreen'],
                                        globalStyles['global-transition-duration'],
                                        globalStyles['global-display-flex'],
                                        globalStyles['global-width-100'],
                                        globalStyles['global-margin-bottom']
                                    ])} onClick={() => FUNC__UpdateTaskStatus(
                                            "showDialog",
                                            'Completed',
                                            confirmDialog,
                                            setConfirmDialog,
                                            setDataIsLoading,
                                            appContext
                                        )}>
                                        Bekijk planning voor deze taak
                                        <i className={globalStyles['global-button__icon-end']} dangerouslySetInnerHTML={{__html: featherIcon.icons['corner-down-right'].toSvg({height: "1vw", width: "1vw"})}}></i>
                                    </button>
                                }
                                {
                                    (appContext.globalContext.authenticate.user.role == "Admin"
                                        || appContext.globalContext.authenticate.user.user_id == itemObject.project_manager_id
                                        || appContext.globalContext.authenticate.user.user_id == itemObject.manager_id)
                                    && !showStuckField
                                    && !showUnStuckField
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
                                            setDataIsLoading,
                                            appContext
                                        )}>
                                        <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['trash-2'].toSvg({height: "1vw", width: "1vw"})}}></i>
                                        Taak verwijderen
                                    </button>
                                }
                                {
                                    showStuckField
                                    &&
                                    <>
                                        <button className={cn([
                                            globalStyles['global-button'],
                                            globalStyles['global-button-back'],
                                            globalStyles['global-transition-duration'],
                                            globalStyles['global-display-flex'],
                                            globalStyles['global-width-100'],
                                            globalStyles['global-margin-bottom']
                                        ])} onClick={() => FUNC__CancelStuck(
                                                setShowStuckField,
                                                itemObject,
                                                setItemObject,
                                                setShowStuckSubmitButton
                                            )}>
                                            <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['x'].toSvg({height: "1vw", width: "1vw"})}}></i>
                                            Annuleren
                                        </button>
                                        {
                                            showStuckSubmitButton
                                            &&
                                            <button className={cn([
                                                globalStyles['global-button'],
                                                globalStyles['global-button-hover-lightgreen'],
                                                globalStyles['global-transition-duration'],
                                                globalStyles['global-display-flex'],
                                                globalStyles['global-width-100'],
                                                globalStyles['global-margin-bottom']
                                            ])} onClick={() => FUNC__UpdateTaskStatus(
                                                    "showDialog",
                                                    'Vastgelopen',
                                                    confirmDialog,
                                                    setConfirmDialog,
                                                    setDataIsLoading,
                                                    appContext
                                                )}>
                                                <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['x-octagon'].toSvg({height: "1vw", width: "1vw"})}}></i>
                                                Zet status op "Vastgelopen"
                                            </button>
                                            ||
                                            <div className={cn([
                                                globalStyles['global-button'],
                                                globalStyles['global-button__inactive'],
                                                globalStyles['global-display-flex'],
                                                globalStyles['global-text-align-center'],
                                                globalStyles['global-margin-bottom']
                                            ])}>
                                                <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['x-octagon'].toSvg({height: "1vw", width: "1vw"})}}></i>
                                                Zet status op "Vastgelopen"
                                            </div>
                                        }
                                    </>
                                }
                                {
                                    showUnStuckField
                                    &&
                                    <>
                                        <button className={cn([
                                            globalStyles['global-button'],
                                            globalStyles['global-button-back'],
                                            globalStyles['global-transition-duration'],
                                            globalStyles['global-display-flex'],
                                            globalStyles['global-width-100'],
                                            globalStyles['global-margin-bottom']
                                        ])} onClick={() => FUNC__CancelUnStuck(
                                                setShowUnStuckField,
                                                itemObject,
                                                setItemObject,
                                                setShowUnStuckSubmitButton
                                            )}>
                                            <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['x'].toSvg({height: "1vw", width: "1vw"})}}></i>
                                            Annuleren
                                        </button>
                                        {
                                            showUnStuckSubmitButton
                                            &&
                                            <button className={cn([
                                                globalStyles['global-button'],
                                                globalStyles['global-button-hover-lightgreen'],
                                                globalStyles['global-transition-duration'],
                                                globalStyles['global-display-flex'],
                                                globalStyles['global-width-100'],
                                                globalStyles['global-margin-bottom']
                                            ])} onClick={() => FUNC__UpdateTaskStatus(
                                                    "showDialog",
                                                    'In behandeling',
                                                    confirmDialog,
                                                    setConfirmDialog,
                                                    setDataIsLoading,
                                                    appContext
                                                )}>
                                                <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['x-octagon'].toSvg({height: "1vw", width: "1vw"})}}></i>
                                                Zet status op "In behandeling"
                                            </button>
                                            ||
                                            <div className={cn([
                                                globalStyles['global-button'],
                                                globalStyles['global-button__inactive'],
                                                globalStyles['global-display-flex'],
                                                globalStyles['global-text-align-center'],
                                                globalStyles['global-margin-bottom']
                                            ])}>
                                                <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['x-octagon'].toSvg({height: "1vw", width: "1vw"})}}></i>
                                                Zet status op "In behandeling"
                                            </div>
                                        }
                                    </>
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
                                message={"deze taak"}
                                deleteDialog={deleteDialog}
                                setDeleteDialog={setDeleteDialog}
                                setDataIsLoading={setDataIsLoading}
                                appContext={appContext}
                                params={[
                                    itemObject,
                                    props.data.tasksObject,
                                    props.data.setTasksObject,
                                    setError
                                ]}
                                FUNC__DeleteObject={FUNC__DeleteObject}/>
                        }

                        {/* Update status confirm dialog */}
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
                                    props.data.tasksObject,
                                    props.data.setTasksObject,
                                    setError,
                                    appContext.globalContext.authenticate.user.user_id
                                ]}
                                FUNC__Confirm={FUNC__UpdateTaskStatus}/>
                        }
                    </div>

                    {/* Chat */}
                    {
                        itemObject.assigned_to.length > 0
                        &&
                        <div className={globalStyles['bodysection-task-chat']}>
                            <div className={globalStyles['bodysection-task-chat__wrapper']}>
                                <div className={cn([
                                    globalStyles['bodysection-task-chat__header'],
                                    globalStyles['global-fontsize-header']
                                ])}>Berichten</div>
                                <div ref={chatContainerRef} className={globalStyles['bodysection-task-chat__content']}>
                                    {
                                        chatHasLoaded
                                        && chatObject.length > 0
                                        && chatObjectLastVisible != 'end_has_been_reached'
                                        &&
                                        <div ref={loadingMoreChatdata} className={globalStyles['global-padding-bottom-x2']}>
                                            <GlobalComponentLoadingData type={"loadMore"} />
                                        </div>
                                    }
                                    {
                                        error.show
                                        && error.id == 'GET_DISCUSSION_ERROR'
                                        &&
                                        <div className={cn([
                                            globalStyles['bodysection-field__error'],
                                            globalStyles['global-display-flex'],
                                            globalStyles['global-margin-bottom'],
                                            globalStyles['global-margin-right']
                                        ])}>
                                            <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['alert-octagon'].toSvg({height: "1vw", width: "1vw"})}}></i>
                                            {error.message}
                                        </div>
                                    }
                                    <div className={globalStyles['content-wrapper']}>
                                        {
                                            chatObject.length > 0
                                            &&
                                            chatObject.map(message => (
                                                message.user_id == appContext.globalContext.authenticate.user.user_id
                                                &&
                                                <div key={message.message_id} className={globalStyles['content-message']}>
                                                    <div className={cn([
                                                        globalStyles['content-message__body'],
                                                        globalStyles['content-message__body-from-me']
                                                    ])}>
                                                        <div className={globalStyles['body-message']}>{message.message}</div>
                                                        <div className={cn([
                                                            globalStyles['body-time'],
                                                            globalStyles['global-margin-subtext'],
                                                            globalStyles['global-fontweight-bold'],
                                                            globalStyles['global-text-align-end'],
                                                            globalStyles['global-fontsize-subtext']
                                                        ])}>{GLOBALFUNC__TimeAgo(
                                                            new Date(message.date_added.seconds * 1000), 
                                                            true,
                                                            true
                                                        )}</div>
                                                    </div>
                                                </div>
                                                ||
                                                <div key={message.message_id} className={globalStyles['content-message']}>
                                                    <div className={cn([
                                                        globalStyles['content-message__body-from-other']
                                                    ])}>
                                                        <div className={globalStyles['body-from-other-user-photo']}>{GLOBALFUNC__UserInitials(
                                                            message.user[0].firstname,
                                                            message.user[0].lastname
                                                        )}</div>
                                                        <div className={globalStyles['body-from-other-message']}>
                                                            <div className={cn([
                                                                globalStyles['body-user'],
                                                                globalStyles['global-fontweight-bold'],
                                                                globalStyles['global-fontsize-normal']
                                                            ])}>{message.user[0].firstname} {message.user[0].lastname}</div>
                                                            <div className={cn([
                                                                globalStyles['body-message'],
                                                                globalStyles['global-margin-subtext'],
                                                                globalStyles['global-fontsize-normal']
                                                            ])}>{message.message}</div>
                                                            <div className={cn([
                                                                globalStyles['body-time'],
                                                                globalStyles['global-margin-subtext'],
                                                                globalStyles['global-fontweight-bold'],
                                                                globalStyles['global-text-align-end'],
                                                                globalStyles['global-fontsize-subtext']
                                                            ])}>{GLOBALFUNC__TimeAgo(
                                                                new Date(message.date_added.seconds * 1000), 
                                                                true,
                                                                true
                                                            )}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                    {
                                        chatObject.length == 0
                                        &&
                                        <GlobalComponentDynamicMessage
                                            showTitle={true}
                                            message={"Communiceer via deze chatfunctie met de resources die aan deze taak zijn toegewezen."}
                                            messageSizeSmaller={true}/>
                                    }
                                    {
                                        error.show
                                        && error.id == 'ADD_MESSAGE_ERROR'
                                        &&
                                        <div className={cn([
                                            globalStyles['bodysection-field__error'],
                                            globalStyles['global-display-flex'],
                                            globalStyles['global-margin-bottom'],
                                            globalStyles['global-margin-right']
                                        ])}>
                                            <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['alert-octagon'].toSvg({height: "1vw", width: "1vw"})}}></i>
                                            {error.message}
                                        </div>
                                    }
                                </div>
                                <div className={globalStyles['bodysection-task-chat__input']}>
                                    <input 
                                        className={globalStyles['global-transition-duration']}
                                        value={chatInput}
                                        type="text"
                                        placeholder='Bericht...'
                                        onChange={e => {setChatInput(
                                            e.target.value
                                        )}}
                                        onKeyDown={(e) => {FUNC__OnKeyDown(
                                            e,
                                            setChatInput,
                                            itemObject.task_id,
                                            firebaseDb,
                                            chatInput,
                                            appContext.globalContext.authenticate.user.user_id,
                                            setError,
                                            itemObject,
                                            appContext.globalContext.authenticate.user.organization_id
                                        )}}/>
                                    <button className={cn([
                                        globalStyles['global-button'],
                                        globalStyles['global-display-flex'],
                                        globalStyles['global-backgroundcolor-lightgreen'],
                                        globalStyles['global-color-white'],
                                        globalStyles['global-transition-duration'],
                                        globalStyles['global-button-hover'],
                                        globalStyles['global-border-green']
                                    ])} onClick={() => FUNC__AddMessageToDiscussion(
                                        itemObject.task_id,
                                        firebaseDb,
                                        chatInput,
                                        appContext.globalContext.authenticate.user.user_id,
                                        setChatInput,
                                        setError,
                                        itemObject,
                                        appContext.globalContext.authenticate.user.organization_id
                                    )}>
                                        Versturen
                                        <i className={globalStyles['global-button__icon-end']} dangerouslySetInnerHTML={{__html: featherIcon.icons['arrow-right-circle'].toSvg({height: "1vw", width: "1vw"})}}></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        ||
                        <div className={globalStyles['global-position-relative']}>
                            <GlobalComponentDynamicMessage
                                showTitle={true}
                                message={"Wijs resources toe aan deze taak om via de chatfuntie met hun te communiceren."}
                                messageSizeSmaller={true}/>
                        </div>
                    }
                </div>
            }

            {/* Loader */}
            {
                hasAccess
                && (!dataHasLoaded
                || !chatHasLoaded)
                &&
                <GlobalComponentLoadingData 
                    type={'firstTimeLoading'}/>
            }

            {/* No access message */}
            {
                !hasAccess
                && (dataHasLoaded
                    || chatHasLoaded)
                &&
                <div className={globalStyles['global-position-relative']}>
                    <GlobalComponentDynamicMessage
                        showTitle={true}
                        title={"Oh oh...je hebt geen toegang tot deze taak."}
                        messageSizeSmaller={true}/>
                </div>
            }
        </div>
    );
}
export default TasksManagerSidebar__VIEW__SectionOverviewTaskInfo;