// React / NextJs components
import cn from 'classnames';
// Global / Page / Layout components
import GlobalComponentLoadingData from '../../../components/Global/Loaders/LoadingData';
import GlobalComponentDynamicMessage from '../../../components/Global/Alerts/DynamicMessage';
import { 
    GLOBALFUNC__CalculatePercentage,
    GLOBALFUNC__CalculateTasksAnalyticsTotal
} from '../../../helpers/GlobalFunctions';
import { FUNC__LoadMoreAnalyticsData } from './Controller';
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
const VIEW__SectionAnalytics = (props) => {
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
                && props.tasksAnalyticsObject.length > 0
                &&
                props.tasksAnalyticsObject.map(item => (
                    <button 
                        key={item.project_id} 
                        className={cn([
                            globalStyles['global-item'],
                            globalStyles['global-item__standard-grid'],
                            globalStyles['global-hover-standard'],
                            globalStyles['global-margin-bottom-item'],
                            globalStyles['global-transition-duration'],
                            globalStyles['global-grid-7']
                    ])} onClick={() => FUNC__EditResource(
                            props.appContext,
                            props.currentView,
                            props.tasksAnalyticsObject,
                            props.setTasksAnalyticsObject,
                            item
                        )}>  
                        <div className={cn([
                            globalStyles['item'],
                            globalStyles['global-display-flex-center'],
                            globalStyles['global-text-align-center']
                        ])}>{item.name}</div>
                        <div className={cn([
                            globalStyles['item'],
                            globalStyles['global-display-flex-center'],
                            globalStyles['global-text-align-center']
                        ])}>{item.analytics.unasigned}</div>
                        <div className={cn([
                            globalStyles['item'],
                            globalStyles['global-display-flex-center'],
                            globalStyles['global-text-align-center']
                        ])}>{item.analytics.open}</div>
                        <div className={cn([
                            globalStyles['item'],
                            globalStyles['global-display-flex-center'],
                            globalStyles['global-text-align-center']
                        ])}>{item.analytics.in_progress}</div>
                        <div className={cn([
                            globalStyles['item'],
                            globalStyles['global-display-flex-center'],
                            globalStyles['global-text-align-center']
                        ])}>{item.analytics.overdue}</div>
                        <div className={cn([
                            globalStyles['item'],
                            globalStyles['global-display-flex-center'],
                            globalStyles['global-text-align-center']
                        ])}>{item.analytics.stuck}</div>
                        <div className={cn([
                            globalStyles['item'],
                            globalStyles['global-display-flex-center'],
                            globalStyles['global-text-align-center']
                        ])}>{item.analytics.completed}</div>
                    </button>
                ))
            }
            {
                props.dataHasLoaded
                && props.tasksAnalyticsObject.length == 0
                &&
                <GlobalComponentDynamicMessage
                    showTitle={true}/>
            }
            {
                !props.dataHasLoaded
                &&
                <GlobalComponentLoadingData
                    type={'firstTimeLoading'}/>
            }
            {
                props.dataHasLoaded
                && !props.loadingMoreData
                && props.lastVisible != null
                &&
                <div className={cn([
                    globalStyles['global-margin-top-x2'],
                    globalStyles['global-padding-bottom-x2']
                ])}>
                    <GlobalComponentLoadMoreButton 
                        value={'statistieken'}
                        FUNC__LoadMoreData={FUNC__LoadMoreAnalyticsData}
                        params={[
                            props.setLoadingMoreData,
                            props.appContext.globalContext.authenticate.user.organization_id,
                            props.tasksAnalyticsObject,
                            props.setTasksAnalyticsObject,
                            props.lastVisible,
                            props.setLastVisible,
                            props.appContext.globalContext.authenticate.user.user_id,
                            props.appContext.globalContext.authenticate.user.role,
                            props.dateToday
                        ]}/>
                </div>
            }
            {
                props.loadingMoreData
                &&
                <div className={cn([
                    globalStyles['global-margin-top-x2'],
                    globalStyles['global-padding-bottom-x2']
                ])}>
                    <GlobalComponentLoadingData type={"loadMore"} />
                </div>
            }
        </div>
    );
}
export default VIEW__SectionAnalytics;