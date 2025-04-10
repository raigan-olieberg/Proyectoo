// React / NextJs components
import cn from 'classnames';
import { useContext } from 'react';
// Global / Page / Layout components
import { AsignedResourcesComponentInsideList } from '../../../components/Global/Resources/AsignedResources';
import { 
    FUNC__EditOverviewTask,
    FUNC__FormattedItem
} from './Controller';
import GlobalComponentDynamicMessage from '../../../components/Global/Alerts/DynamicMessage';
import { 
    GLOBALFUNC__TranslateSecondsToDate,
    GLOBALFUNC__TranslateTasksStatus
} from '../../../helpers/GlobalFunctions';
import GlobalComponentLoadingData from '../../../components/Global/Loaders/LoadingData';
import AppContext from '../../../helpers/AppContext';
// Page styles
import globalStyles from '../../../styles/global.module.scss';
/*
*
*
* 
* 
    REF:VIEW__SectionContent
    WHAT IS IT: 
        The generated view for the content section
*
*
* 
* 
*/
const VIEW__SectionOverview = (props) => {
    const appContext = useContext(AppContext);
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
        <div className={globalStyles['content-body-with-header__body']}>
            {
                props.dataHasLoaded
                && props.tasksObject.length > 0
                &&
                props.tasksObject.map(item => (
                    <button 
                        key={item.task_id} 
                        className={cn({
                            [globalStyles['global-item']]:true,
                            [globalStyles['global-item__standard-grid']]:true,
                            [globalStyles['global-hover-standard']]:true,
                            [globalStyles['global-margin-bottom-item']]:true,
                            [globalStyles['global-transition-duration']]:true,
                            [globalStyles['global-grid-8']]:true,
                            [globalStyles['global-side-selected-item']]:appContext.globalContext.sidebar.show == 1 && appContext.globalContext.sidebar.selectedItemID == item.task_id,
                    })} onClick={() => FUNC__EditOverviewTask(
                            appContext,
                            props.tasksObject,
                            props.setTasksObject,
                            FUNC__FormattedItem(
                                item
                            )
                        )}>  
                        <AsignedResourcesComponentInsideList
                            assigned_to={item.assigned_to}/>
                        <div className={cn([
                            globalStyles['item'],
                            globalStyles['global-display-flex-center'],
                            globalStyles['global-text-align-center']
                        ])}>{item.name}</div>
                        <div className={cn([
                            globalStyles['item'],
                            globalStyles['global-display-flex-center'],
                            globalStyles['global-text-align-center']
                        ])}>{item.project.name}</div>
                        <div className={cn([
                            globalStyles['item'],
                            globalStyles['global-display-flex-center'],
                            globalStyles['global-text-align-center']
                        ])}>{item.phase}</div>
                        <div className={cn([
                            globalStyles['item'],
                            globalStyles['global-display-flex-center'],
                            globalStyles['global-text-align-center']
                        ])}>{GLOBALFUNC__TranslateSecondsToDate(
                                new Date(item.deadline.seconds * 1000)
                        )}</div>
                        <div className={cn([
                            globalStyles['item'],
                            globalStyles['global-display-flex-center'],
                            globalStyles['global-text-align-center']
                        ])}>{item.hours_budgeted}</div>
                        <div className={cn([
                            globalStyles['item'],
                            globalStyles['global-display-flex-center'],
                            globalStyles['global-text-align-center']
                        ])}>{item.worked_hours}</div>
                        <div className={cn({
                            [globalStyles['global-status']]:true,
                            [globalStyles['global-backgroundcolor-lightslategrey']]:item.status == 'unasigned',
                            [globalStyles['global-backgroundcolor-blue']]:item.status == 'open',
                            [globalStyles['global-backgroundcolor-purple']]:item.status == 'in_progress',
                            [globalStyles['global-backgroundcolor-orange']]:item.status == 'overdue',
                            [globalStyles['global-backgroundcolor-red']]:item.status == 'stuck',
                            [globalStyles['global-backgroundcolor-lightgreen']]:item.status == 'completed'
                        })}>{GLOBALFUNC__TranslateTasksStatus(item.status)}</div>
                    </button>
                ))
            }
            {
                props.dataHasLoaded
                && props.tasksObject.length == 0
                &&
                <GlobalComponentDynamicMessage
                    showTitle={true}
                    message={"Er zijn voor de geselecteerde filters geen taken gevonden."}/>
            }
            {
                !props.dataHasLoaded
                &&
                <GlobalComponentLoadingData
                    type={'firstTimeLoading'}/>
            }
            {/*
                props.dataHasLoaded
                && !props.loadingMoreData
                && props.lastVisible != null
                &&
                <div className={cn([
                    globalStyles['global-margin-top-x2'],
                    globalStyles['global-padding-bottom-x2']
                ])}>
                    <GlobalComponentLoadMoreButton 
                        value={'taken'}
                        FUNC__LoadMoreData={FUNC__LoadMoreTasksData}
                        params={[
                            props.setLoadingMoreData,
                            appContext.globalContext.authenticate.user.organization_id,
                            props.tasksObject,
                            props.setTasksObject,
                            props.overviewSortFilter,
                            props.lastVisible,
                            props.setLastVisible,
                            appContext.globalContext.authenticate.user.user_id,
                            appContext.globalContext.authenticate.user.role,
                            props.dateToday
                        ]}/>
                </div>
            */}
            {
                props.dataHasLoaded
                && props.tasksObject.length > 0
                && props.lastVisible != 'end_has_been_reached'
                &&
                <div ref={props.loadingMoreData} className={cn([
                    globalStyles['global-margin-top-x2'],
                    globalStyles['global-padding-bottom-x2']
                ])}>
                    <GlobalComponentLoadingData type={"loadMore"} />
                </div>
            }
        </div>
    );
}
export default VIEW__SectionOverview;