// React / NextJs components
import cn from 'classnames';
import * as featherIcon from 'feather-icons';
import { useState, useContext, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
// Global / Page / Layout components
import AppContext from '../../../helpers/AppContext';
import GlobalComponentLoadingData from '../Loaders/LoadingData';
import { 
    FUNC__GetUsers,
    FUNC__LoadMoreUsers,
    FUNC__SelectResource
} from './Controller.js';
import UserComponentInsideList from '../Resources/User/InsideList';
import GlobalComponentDynamicMessage from '../Alerts/DynamicMessage';
// Page styles
import globalStyles from '../../../styles/global.module.scss';

const SidebarComponentResources = (props) => {
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
        PROPS
            view:string
            subview:string
            data:any
            fetchFromServer:boolean
        VIEWS
            -> REF:VIEW__Manager__Members
            -> REF:generated view
        FUNCTIONS
            -> REF:FUNC__CalculatePercentage
            -> REF:FUNC__CalculateTimeExceeded
            -> REF:FUNC__AddMembersAndTeams
    */
    const appContext = useContext(AppContext);
    /*
    *
    *
    * 
    * 
        REF:VIEW__Manager__Members
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> The view for showing the selected item at page->dashboard section->tasks scheduled for today
    *
    *
    * 
    * 
    */
    function VIEW__Manager__Resources(){
        const [showErrorMessage, setShowErrorMessage] = useState(false);
        const [errorMessage, setErrorMessage] = useState("");
        const [resourcesObject, setResourcesObject] = useState([]);
        const [dataHasLoaded, setDataHasLoaded] = useState(false);
        const [lastVisible, setLastVisible] = useState(null);
        const {ref: loadMoreDataRef, inView} = useInView();
        const [loadmoreData, setLoadmoreData] = useState(false);

        useEffect(() => {
            FUNC__GetUsers(
                appContext.globalContext.authenticate.user.organization_id,
                setResourcesObject,
                setDataHasLoaded,
                {
                    key: 'status',
                    value: 'Active'
                },
                lastVisible,
                setLastVisible,
                appContext.globalContext.authenticate.user.user_id,
                appContext.globalContext.authenticate.user.role
            );
        }, []);
        useEffect(() => {
            if (inView
            && dataHasLoaded
            && !loadmoreData) {
                setLoadmoreData(true);
                FUNC__LoadMoreUsers(
                    appContext.globalContext.authenticate.user.organization_id,
                    resourcesObject,
                    setResourcesObject,
                    {
                        key: 'status',
                        value: 'Active'
                    },
                    lastVisible,
                    setLastVisible,
                    appContext.globalContext.authenticate.user.user_id,
                    appContext.globalContext.authenticate.user.role,
                    setLoadmoreData
                );
            }
        }, [inView]);
        /*
        *
        *
        * 
        * 
            REF:FUNC__AddResource
                -> WHAT IS IT / WHAT DOES IT DO: 
                    ---> Add a resource
        *
        *
        * 
        * 
        */
        const FUNC__AddResource = (value) => {
            let newSidebarExpandedContext = appContext.globalContext.sidebarExpanded;
            if(newSidebarExpandedContext.payload.data != undefined
                && newSidebarExpandedContext.payload.data.selectedResources != undefined
                && newSidebarExpandedContext.payload.data.selectedResources.length > 0){
                let alreadyExists = false;
                if(value.type == "team"){
                    alreadyExists = newSidebarExpandedContext.payload.data.selectedResources.find((element) => element.team_id == value.team_id);
                } else {
                    alreadyExists = newSidebarExpandedContext.payload.data.selectedResources.find((element) => element.user_id == value.user_id);
                }
                if(alreadyExists){
                    setErrorMessage("Oeps, deze resource is al toegevoegd.");
                    setShowErrorMessage(true);
                    return;
                } else {
                    setErrorMessage("");
                    setShowErrorMessage(false);
                }
            }
            if(newSidebarExpandedContext.payload.data == undefined){
                newSidebarExpandedContext.payload["data"] = {};
            }
            if(newSidebarExpandedContext.payload.data.selectedResources == undefined){
                newSidebarExpandedContext.payload.data["selectedResources"] = [];
            }
            newSidebarExpandedContext.payload.data.selectedResources.unshift(value);
            appContext.setGlobalContext({
                ...appContext.globalContext,
                sidebarExpanded: newSidebarExpandedContext,
            });
        }
        return (
            <>
                {
                    dataHasLoaded
                    && resourcesObject.length > 0
                    &&
                    resourcesObject.map(resource => (
                        <div 
                            key={resource.user_id} 
                            className={globalStyles['global-margin-bottom-item']}
                            onClick={() => FUNC__SelectResource(
                                props.data.planningItemObject,
                                props.data.planningSetItemObject,
                                setResourcesObject,
                                resourcesObject,
                                resource
                            )}>
                            <UserComponentInsideList
                                user={resource}
                                clickable={true}
                                showOccupation={true}/>
                        </div>
                    ))
                }
                {
                    !dataHasLoaded
                    &&
                    <GlobalComponentLoadingData
                        type={'firstTimeLoading'}/>
                }
                {
                    dataHasLoaded
                    && resourcesObject.length == 0
                    &&
                    <GlobalComponentDynamicMessage
                        showTitle={true}
                        message={"Er zijn geen beschikbare resources gevonden."}/>
                }
                {
                    dataHasLoaded
                    && resourcesObject.length > 0
                    && lastVisible != 'end_has_been_reached'
                    &&
                    <div ref={loadMoreDataRef} className={cn([
                        globalStyles['global-margin-top-x2'],
                        globalStyles['global-padding-bottom-x2']
                    ])}>
                        <GlobalComponentLoadingData type={"loadMore"} />
                    </div>
                }
                {/*
                    showErrorMessage
                    &&
                    <div className={cn([
                        globalStyles['bodysection-field__error'],
                        globalStyles['global-display-flex'],
                        globalStyles['global-margin-top-item'],
                        globalStyles['global-margin-bottom']
                    ])}>
                        <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['alert-octagon'].toSvg({height: "1vw", width: "1vw"})}}></i>
                        {errorMessage}
                    </div>
                */}
                {/*
                    props.subview == "members"
                    &&
                    members.map((member) => 
                        <button className={cn([
                            globalStyles['global-item'],
                            globalStyles['global-item__with-button-icon-right'],
                            globalStyles['global-margin-bottom-item'],
                            globalStyles['global-hover-standard']
                        ])} onClick={() => FUNC__AddResource(member)}>
                            <div className={cn([
                                globalStyles['global-member-in-list'],
                                globalStyles['global-member-in-list__standard'],
                                globalStyles['global-text-align-start']
                            ])}>
                                <img className={globalStyles['global-photo-thumbnail-wrapper__single']} src="../../../img/female1-80.jpg"/>
                                <div>
                                    <div>{member.name}</div>
                                    <div className={cn([
                                        globalStyles['global-fontsize-subtext'],
                                        globalStyles['global-margin-subtext']
                                    ])}>{member.role} { member.label != undefined && member.label != "" && " ("+member.label+")"}</div>
                                    {
                                        member.team != undefined
                                        &&
                                        <div className={cn([
                                            globalStyles['global-fontsize-subtext'],
                                            globalStyles['global-margin-subtext'],
                                            globalStyles['global-display-flex']
                                        ])}><i className={globalStyles['global-margin-right-subtext']} dangerouslySetInnerHTML={{__html: featherIcon.icons['users'].toSvg({height: '.7vw', width: '.7vw'})}}></i>{member.team}</div>
                                    }
                                </div>
                            </div>
                        </button>
                    )
                    ||
                    teams.map((team) => 
                        <button className={cn([
                            globalStyles['global-item'],
                            globalStyles['global-item__with-button-icon-right'],
                            globalStyles['global-margin-bottom-item'],
                            globalStyles['global-hover-standard']
                        ])} onClick={() => FUNC__AddResource(team)}>
                            <div className={cn([
                                globalStyles['global-member-in-list'],
                                globalStyles['global-member-in-list__standard'],
                                globalStyles['global-text-align-start']
                            ])}>
                                <i className={globalStyles['global-display-flex']} dangerouslySetInnerHTML={{__html: featherIcon.icons['users'].toSvg({height: "1.6vw", width: "1.6vw"})}}></i>
                                <div>
                                    <div>{team.description}</div>
                                </div>
                            </div>
                        </button>
                    )
                */}
            </>
        );
    }
    /*
    *
    *
    * 
    * 
        REF:generated view
        -> WHAT IS IT / WHAT DOES IT DO:  
            --> The generated view for this page
    *
    *
    * 
    * 
    */
    return (
        <div className={globalStyles['content-inner__bodysection']}>
            {
                props.view == "VIEW__Manager__Resources"
                &&
                <VIEW__Manager__Resources />
            }
        </div>
    );
}
export default SidebarComponentResources;