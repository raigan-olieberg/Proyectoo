// React / NextJs components
import { useState, useEffect, useContext } from 'react';
import cn from 'classnames';
import * as featherIcon from 'feather-icons';
// Global / Page / Layout components
import SidebarComponentFieldsInputText from '../../../../components/Global/Sidebar/Fields/InputText';
import SidebarComponentFieldsTextarea from '../../../../components/Global/Sidebar/Fields/Textarea';
import SidebarComponentFieldsSelect from '../../../../components/Global/Sidebar/Fields/Select';
import GlobalComponentLoadingData from '../../../../components/Global/Loaders/LoadingData';
import SidebarComponentDialogConfirmDelete from '../../../../components/Global/Sidebar/Dialog/ConfirmDelete';
import SidebarComponentDialogConfirm from '../../../../components/Global/Sidebar/Dialog/Confirm';
import UserComponentInsideList from '../../../../components/Global/Resources/User/InsideList';
import { 
    FUNC__CreateObject,
    FUNC__EditObject__SendObjectToServer,
    FUNC__DeleteObject,
    FUNC__UpdateProblemStatus,
    FUNC__CancelResolved,
    FUNC__FetchProblemFromServer
} from './Controller';
import { 
    FUNC__TranslateProblemsStatus,
    FUNC__TranslateProblemsPriority
} from '../Controller';
import AppContext from '../../../../helpers/AppContext';
import { 
    GLOBALFUNC__isWhitespaceString,
    GLOBALFUNC__DifferenceBetweenObjects,
    GLOBALFUNC__TimeAgo
} from '../../../../helpers/GlobalFunctions';
// Page styles
import globalStyles from '../../../../styles/global.module.scss';

const ProblemsManagerSidebar__VIEW__SectionOverviewProblemInfo = (props) => {
    const appContext = useContext(AppContext);
    const [fetchProblemFromServer, setFetchProblemFromServer] = useState(props.data.fetchProblemFromServer);
    const [dataIsLoading, setDataIsLoading] = useState(false);
    const [dataHasLoaded, setDataHasLoaded] = useState(!fetchProblemFromServer ? true : false);
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
    const [itemObject, setItemObject] = useState(!fetchProblemFromServer ? props.data.problem : null);
    const [oldItemObject, setOldItemObject] = useState(!fetchProblemFromServer ? {...props.data.problem} : null);
    const [showResolvedField, setShowResolvedField] = useState(false);
    const [showResolvedSubmitButton, setShowResolvedSubmitButton] = useState(false);
    useEffect(() => {
        if(fetchProblemFromServer){
            FUNC__FetchProblemFromServer(
                appContext.globalContext.authenticate.user.organization_id,
                props.data.problem_id,
                setItemObject,
                setOldItemObject,
                setError,
                setDataHasLoaded
            );
        }
    }, [fetchProblemFromServer]);
    useEffect(() => {
        let submitButtonValue = false;
        if(itemObject != null
            && !showResolvedField){
            if(GLOBALFUNC__DifferenceBetweenObjects(itemObject, oldItemObject)){
                if(!GLOBALFUNC__isWhitespaceString(itemObject.short_description)
                    && !GLOBALFUNC__isWhitespaceString(itemObject.long_description)){
                    submitButtonValue = true;
                } else {
                    submitButtonValue = false;
                }
            } else {
                submitButtonValue = false;
            }
            setShowSubmitButton(submitButtonValue);  
        }  
        
        if(itemObject != null
            && showResolvedField){
            if(!GLOBALFUNC__isWhitespaceString(itemObject.resolved_comment.comment)){
                setShowResolvedSubmitButton(true);
            } else {
                setShowResolvedSubmitButton(false);
            }
        }
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
            {
                dataHasLoaded
                && !showResolvedField
                &&
                <>
                    {
                        itemObject.user_id == appContext.globalContext.authenticate.user.user_id
                        &&
                        <SidebarComponentFieldsSelect 
                            firstItem={false} 
                            title={'Prioriteit'}
                            id={'priority'} 
                            label={FUNC__TranslateProblemsPriority(itemObject.priority)}
                            value={itemObject.priority}
                            type={'edit'}
                            error={error}
                            options={[
                                {
                                    key: "Hoog",
                                    value: "high"
                                },
                                {
                                    key: "Medium",
                                    value: "medium"
                                },
                                ,
                                {
                                    key: "Laag",
                                    value: "low"
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
                        ||
                        <div className={globalStyles['bodysection-field']}>
                            <div className={globalStyles['bodysection-field__label']}>Prioriteit</div>
                            <div className={cn({
                                [globalStyles['global-status']]:true,
                                [globalStyles['global-margin-top-item']]:true,
                                [globalStyles['global-backgroundcolor-red']]:itemObject.priority == 'high',
                                [globalStyles['global-backgroundcolor-orange']]:itemObject.priority == 'medium',
                                [globalStyles['global-backgroundcolor-yellow']]:itemObject.priority == 'low'
                            })}>{FUNC__TranslateProblemsPriority(itemObject.priority)}</div>
                        </div>
                    }
                    <SidebarComponentFieldsInputText
                        firstItem={false} 
                        title={"Korte omschrijving"} 
                        id={"short_description"} 
                        value={itemObject.short_description}
                        type={itemObject.status != "resolved" && itemObject.user_id == appContext.globalContext.authenticate.user.user_id ? "edit" : "readonly"}
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
                    <SidebarComponentFieldsTextarea
                        title={"Lange omschrijving"} 
                        id={"long_description"} 
                        value={itemObject.long_description}
                        type={itemObject.status != "resolved" && itemObject.user_id == appContext.globalContext.authenticate.user.user_id ? "edit" : "readonly"}
                        upperCase={true}
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
                        title={"Project"} 
                        id={"project"} 
                        value={itemObject.project}
                        type={"readonly"}
                        upperCase={false}/>
                    {
                        itemObject.phase != undefined
                        &&
                        <SidebarComponentFieldsInputText
                            firstItem={false} 
                            title={"Fase"} 
                            id={"phase"} 
                            value={itemObject.phase}
                            type={"readonly"}/>
                    }
                    {
                        itemObject.task != undefined
                        &&
                        <SidebarComponentFieldsInputText
                            firstItem={false} 
                            title={"Taak"} 
                            id={"task"} 
                            value={itemObject.task}
                            type={"readonly"}/>
                    }
                    <SidebarComponentFieldsInputText
                        firstItem={false} 
                        title={"Wanneer"} 
                        id={"date_added"} 
                        value={GLOBALFUNC__TimeAgo(
                            new Date(itemObject.date_added.seconds * 1000), 
                            true,
                            true
                        )}
                        type={"readonly"}/>
                    <div className={cn([
                        globalStyles['bodysection-field'],
                        globalStyles['global-margin-top']
                    ])}>
                        <div className={globalStyles['bodysection-field__label']}>Aangemeld door</div>
                        <div className={globalStyles['global-margin-top-item']}>
                            <div className={globalStyles['global-margin-bottom-item']}>
                                <UserComponentInsideList
                                    user={itemObject.resource[0]}/>
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
                            [globalStyles['global-backgroundcolor-blue']]:itemObject.status == 'open',
                            [globalStyles['global-backgroundcolor-purple']]:itemObject.status == 'in_progress',
                            [globalStyles['global-backgroundcolor-lightgreen']]:itemObject.status == 'resolved'
                        })}>{FUNC__TranslateProblemsStatus(itemObject.status)}</div>
                    </div>
                </>
            }
            {
                showResolvedField
                &&
                <SidebarComponentFieldsTextarea
                    title={"Opmerking"} 
                    subTitle={"Wat is er gedaan om dit probleem op te lossen?"}
                    id={"resolved_comment[comment]"} 
                    value={itemObject.resolved_comment.comment != '' ? itemObject.resolved_comment.comment : ''}
                    type={confirmDialog.show ? 'readonly' : 'create'}
                    upperCase={true}
                    required={true}
                    FUNC__CreateObject={FUNC__CreateObject}
                    itemObject={itemObject}
                    setItemObject={setItemObject}/> 
            }
            {
                dataHasLoaded
                && itemObject.status == 'resolved'
                &&
                <div className={cn([
                    globalStyles['bodysection-field'],
                    globalStyles['global-margin-top'],
                    globalStyles['global-indent-x2']
                ])}>
                    <div className={globalStyles['bodysection-field__label']}>Opmerking</div>
                    <div className={cn([
                        globalStyles['bodysection-field__non-input'],
                        globalStyles['global-margin-top-item'],
                        globalStyles['global-animation-fadein']
                    ])}>
                        <div className={cn([
                            globalStyles['global-grid-2'],
                            globalStyles['global-fontweight-bold']
                        ])}>
                            <div>{itemObject.resolved_comment.user[0].firstname} {itemObject.resolved_comment.user[0].lastname}</div>
                            <div className={globalStyles['global-display-flex-end']}>
                                {GLOBALFUNC__TimeAgo(
                                    new Date(itemObject.resolved_comment.date_added.seconds * 1000), 
                                    true,
                                    true
                                )}
                            </div>
                        </div>
                        <div className={cn([
                            globalStyles['global-margin-top-item']
                        ])}>{itemObject.resolved_comment.comment}</div>
                    </div>
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
                dataHasLoaded
                && !dataIsLoading
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
                        showSubmitButton
                        && !showResolvedField
                        && itemObject.user_id == appContext.globalContext.authenticate.user.user_id
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
                            oldItemObject,
                            itemObject,
                            props.data.problemsObject,
                            props.data.setProblemsObject,
                            setDataIsLoading,
                            setError,
                            setEditField
                        )}>
                            <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['check'].toSvg({height: "1vw", width: "1vw"})}}></i>
                            Wijzigingen opslaan
                        </button>
                    }
                    {
                        !showSubmitButton
                        && !showResolvedField
                        && itemObject.user_id == appContext.globalContext.authenticate.user.user_id
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
                            || appContext.globalContext.authenticate.user.role == "Admin"
                            || itemObject.project_manager_id == appContext.globalContext.authenticate.user.user_id)
                        && itemObject.status != 'resolved'
                        && itemObject.status != 'open'
                        && !showResolvedField
                        &&
                        <button className={cn([
                            globalStyles['global-button'],
                            globalStyles['global-button-hover-blue'],
                            globalStyles['global-transition-duration'],
                            globalStyles['global-display-flex'],
                            globalStyles['global-width-100'],
                            globalStyles['global-margin-bottom']
                        ])} onClick={() => FUNC__UpdateProblemStatus(
                                "showDialog",
                                'Open',
                                confirmDialog,
                                setConfirmDialog,
                                setDataIsLoading,
                                appContext
                            )}>
                            <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['circle'].toSvg({height: "1vw", width: "1vw"})}}></i>
                            Zet status op "Open"
                        </button>
                    }
                    {
                        (appContext.globalContext.authenticate.user.role == "Manager"
                            || appContext.globalContext.authenticate.user.role == "Admin"
                            || itemObject.project_manager_id == appContext.globalContext.authenticate.user.user_id)
                        && itemObject.status != 'resolved'
                        && itemObject.status != 'in_progress'
                        && !showResolvedField
                        &&
                        <button className={cn([
                            globalStyles['global-button'],
                            globalStyles['global-button-hover-purple'],
                            globalStyles['global-transition-duration'],
                            globalStyles['global-display-flex'],
                            globalStyles['global-width-100'],
                            globalStyles['global-margin-bottom']
                        ])} onClick={() => FUNC__UpdateProblemStatus(
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
                        (appContext.globalContext.authenticate.user.role == "Manager"
                            || appContext.globalContext.authenticate.user.role == "Admin"
                            || itemObject.project_manager_id == appContext.globalContext.authenticate.user.user_id)
                        && itemObject.status != 'resolved'
                        && !showResolvedField
                        &&
                        <button className={cn([
                            globalStyles['global-button'],
                            globalStyles['global-button-hover-lightgreen'],
                            globalStyles['global-transition-duration'],
                            globalStyles['global-display-flex'],
                            globalStyles['global-width-100'],
                            globalStyles['global-margin-bottom']
                        ])} onClick={() => setShowResolvedField(true)}>
                            <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['check-circle'].toSvg({height: "1vw", width: "1vw"})}}></i>
                            Probleem opgelost
                        </button>
                    }
                    {
                        (appContext.globalContext.authenticate.user.role == "Manager"
                            || appContext.globalContext.authenticate.user.role == "Admin"
                            || itemObject.project_manager_id == appContext.globalContext.authenticate.user.user_id)
                        && !showResolvedField
                        && itemObject.status == 'resolved'
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
                            Probleem verwijderen
                        </button>
                    }
                    {
                        showResolvedField
                        &&
                        <>
                            <button className={cn([
                                globalStyles['global-button'],
                                globalStyles['global-button-back'],
                                globalStyles['global-transition-duration'],
                                globalStyles['global-display-flex'],
                                globalStyles['global-width-100'],
                                globalStyles['global-margin-bottom']
                            ])} onClick={() => FUNC__CancelResolved(
                                    setShowResolvedField,
                                    itemObject,
                                    setItemObject,
                                    setShowResolvedSubmitButton
                                )}>
                                <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['x'].toSvg({height: "1vw", width: "1vw"})}}></i>
                                Annuleren
                            </button>
                            {
                                showResolvedSubmitButton
                                &&
                                <button className={cn([
                                    globalStyles['global-button'],
                                    globalStyles['global-button-hover-lightgreen'],
                                    globalStyles['global-transition-duration'],
                                    globalStyles['global-display-flex'],
                                    globalStyles['global-width-100'],
                                    globalStyles['global-margin-bottom']
                                ])} onClick={() => FUNC__UpdateProblemStatus(
                                        "showDialog",
                                        'Opgelost',
                                        confirmDialog,
                                        setConfirmDialog,
                                        setDataIsLoading,
                                        appContext
                                    )}>
                                    <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['check-circle'].toSvg({height: "1vw", width: "1vw"})}}></i>
                                    Zet status op "Opgelost"
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
                                    Zet status op "Opgelost"
                                </div>
                            }
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
                    <GlobalComponentLoadingData type={"loadMore"} />
                </div>
            }
            {
                deleteDialog.show
                &&
                <SidebarComponentDialogConfirmDelete 
                    message={"dit probleem"}
                    deleteDialog={deleteDialog}
                    setDeleteDialog={setDeleteDialog}
                    setDataIsLoading={setDataIsLoading}
                    appContext={appContext}
                    params={[
                        itemObject,
                        props.data.problemsObject,
                        props.data.setProblemsObject,
                        setError
                    ]}
                    FUNC__DeleteObject={FUNC__DeleteObject}/>
            }
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
                        props.data.problemsObject,
                        props.data.setProblemsObject,
                        setError,
                        appContext.globalContext.authenticate.user.user_id
                    ]}
                    FUNC__Confirm={FUNC__UpdateProblemStatus}/>
            }
        </div>
    );
}
export default ProblemsManagerSidebar__VIEW__SectionOverviewProblemInfo;