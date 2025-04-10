// React / NextJs components
import cn from 'classnames';
import * as featherIcon from 'feather-icons';
import { useContext } from 'react';
// Global / Page / Layout components
import SidebarComponentDashboardPage from './DashboardPage';
import SidebarComponentMemberAndTeams from './Resources';

import ResourcesManagerSidebar__VIEW__SectionAddUser from '../../../pages/resources/manager/Sidebar/User/VIEW__SectionAddUser';
import ResourcesManagerSidebar__VIEW__SectionUserInfo from '../../../pages/resources/manager/Sidebar/User/VIEW__SectionUserInfo';
import ProblemsManagerSidebar__VIEW__SectionOverviewProblemInfo from '../../../pages/problems/manager/Sidebar/VIEW__SectionOverviewProblemInfo';
import WorkedHoursManagerSidebar__VIEW__SectionOverviewWorkedHourInfo from '../../../pages/worked-hours/manager/sidebar/VIEW__SectionOverviewWorkedhourInfo';
import CustomersManagerSidebar__VIEW__SectionAddCustomer from '../../../pages/customers/manager/Sidebar/VIEW__SectionAddCustomer';
import CustomersManagerSidebar__VIEW__SectionCustomerInfo from '../../../pages/customers/manager/Sidebar/VIEW__SectionCustomerInfo';
import TasksManagerSidebar__VIEW__SectionOverviewTaskInfo from '../../../pages/tasks/manager/sidebar/VIEW__SectionOverviewTaskInfo';
import ResourcePlanningManagerSidebar__VIEW__SectionPlanningInfo from '../../../pages/resource-planning/manager/sidebar/VIEW__SectionPlanningInfo';
import HeaderManagerSidebar__VIEW__Activities from '../HeaderSidebarForActivities';
import AppContext from '../../../helpers/AppContext';
import { 
    GLOBALFUNC__CloseSidebar
} from '../../../helpers/GlobalFunctions';
// Page styles
import globalStyles from '../../../styles/global.module.scss';

const GlobalComponentSidebar = (props) => {
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
            -> direction
            -> payload
        VIEWS
            -> REF:VIEW__Vertical
            -> REF:VIEW__Horizontal
            -> REF:generated view

    */
    const appContext = useContext(AppContext);
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
        <section className={globalStyles['global-sidebar']}>
            <div className={cn({
                [globalStyles['global-sidebar__content']]:true,
                [globalStyles['global-sidebar__content__extra-wide']]:props.payload.extraWide,
                [globalStyles['global-sidebar__content-left-boxshadow']]:props.direction == "left",
                [globalStyles['global-sidebar__content-right-boxshadow']]:props.direction == "right",
                [globalStyles['global-sidebar__left']]:props.direction == "left",
                [globalStyles['global-sidebar__right']]:props.direction == "right"
            })}>
                <div className={globalStyles['content-header__standard']}>
                    <div className={cn([
                        globalStyles['title'],
                        globalStyles['global-fontsize-header']
                    ])}>
                        {props.payload.title}
                    </div>
                    <div className={globalStyles['buttons']}>
                        {
                            props.showHeaderButton != null
                            &&
                            <button className={cn([
                                globalStyles['global-button'],
                                globalStyles['global-button-hover'],
                                globalStyles['global-transition-duration'],
                                globalStyles['global-animation-fadein']
                            ])}>
                                <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['check'].toSvg({height: "1vw", width: "1vw"})}}></i>
                                Wijzigingen opslaan
                            </button>
                        }
                        <button className={cn([
                            globalStyles['buttons__close'],
                            globalStyles['global-hover-standard'],
                            globalStyles['global-transition-duration']
                        ])} onClick={() => GLOBALFUNC__CloseSidebar(appContext, false)}>
                            <i dangerouslySetInnerHTML={{__html: featherIcon.icons['x'].toSvg({height: "1.2vw", widfth: "1.2vw"})}}></i>
                        </button>
                    </div>
                </div>
                <div className={cn([
                    globalStyles['content-inner'],
                    globalStyles['content-inner__standard']
                ])}>
                    {
                        props.payload.page == "resources/manager/user/add"
                        &&
                        <ResourcesManagerSidebar__VIEW__SectionAddUser 
                            data={props.payload.data}/>
                    }
                    {
                        props.payload.page == "resources/manager/user/edit"
                        &&
                        <ResourcesManagerSidebar__VIEW__SectionUserInfo 
                            data={props.payload.data}/>
                    }
                    {
                        props.payload.page == "problems/manager/edit"
                        &&
                        <ProblemsManagerSidebar__VIEW__SectionOverviewProblemInfo
                            data={props.payload.data}/>
                    }
                    {
                        props.payload.page == "workedhours/manager/edit"
                        &&
                        <WorkedHoursManagerSidebar__VIEW__SectionOverviewWorkedHourInfo
                            data={props.payload.data}/>
                    }
                    {
                        props.payload.page == "customers/manager/add"
                        &&
                        <CustomersManagerSidebar__VIEW__SectionAddCustomer
                            data={props.payload.data}/>
                    }
                    {
                        props.payload.page == "customers/manager/edit"
                        &&
                        <CustomersManagerSidebar__VIEW__SectionCustomerInfo
                            data={props.payload.data}/>
                    }
                    {
                        props.payload.page == "tasks/manager/edit"
                        &&
                        <TasksManagerSidebar__VIEW__SectionOverviewTaskInfo
                            data={props.payload.data}/>
                    }
                    {
                        props.payload.page == "resource-planning/manager/edit"
                        &&
                        <ResourcePlanningManagerSidebar__VIEW__SectionPlanningInfo
                            data={props.payload.data}/>
                    }
                    {
                        props.payload.page == "dashboard/manager"
                        &&
                        <SidebarComponentDashboardPage view={props.payload.view} data={props.payload.data} fetchFromServer={props.payload.fetchFromServer} currentUser={appContext.globalContext.current_user} sidebarExpanded={appContext.globalContext.sidebarExpanded.show}/>
                    }
                    {
                        props.payload.page == "memberandteams/manager"
                        &&
                        <SidebarComponentMemberAndTeams view={props.payload.view} data={props.payload.data} fetchFromServer={props.payload.fetchFromServer} currentUser={appContext.globalContext.current_user} sidebarExpanded={appContext.globalContext.sidebarExpanded.show}/>
                    }
                    {
                        props.payload.page == "activities/manager"
                        &&
                        <HeaderManagerSidebar__VIEW__Activities view={props.payload.view} data={props.payload.data} fetchFromServer={props.payload.fetchFromServer} sidebarExpanded={appContext.globalContext.sidebarExpanded.show}/>
                    }
                </div>
            </div>
        </section>
    );
}
export default GlobalComponentSidebar;
