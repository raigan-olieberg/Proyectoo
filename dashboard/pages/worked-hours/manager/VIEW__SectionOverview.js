// React / NextJs components
import cn from 'classnames';
// Global / Page / Layout components
import UserComponentInsideList from '../../../components/Global/Resources/User/InsideList';
import { 
    FUNC__TranslateWorkedHoursStatus,
    FUNC__LoadMoreResourcesWorkedHoursData,
    FUNC__EditOverviewWorkedHour
} from './Controller';
import GlobalComponentDynamicMessage from '../../../components/Global/Alerts/DynamicMessage';
import { GLOBALFUNC__TranslateSecondsToDate } from '../../../helpers/GlobalFunctions';
import { GlobalComponentLoadMoreButton } from '../../../components/Global/Loaders/LoadMoreButton';
import GlobalComponentLoadingData from '../../../components/Global/Loaders/LoadingData';

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
                && props.resourcesWorkedHoursObject.length > 0
                &&
                props.resourcesWorkedHoursObject.map(item => (
                    <button 
                        key={item.workedhour_id} 
                        className={cn([
                            globalStyles['global-item'],
                            globalStyles['global-item__standard-grid'],
                            globalStyles['global-hover-standard'],
                            globalStyles['global-margin-bottom-item'],
                            globalStyles['global-transition-duration'],
                            globalStyles['global-grid-8']
                    ])} onClick={() => FUNC__EditOverviewWorkedHour(
                            props.appContext,
                            props.resourcesWorkedHoursObject,
                            props.setResourcesWorkedHoursObject,
                            item
                        )}>  
                        <UserComponentInsideList
                            user={item.resource[0]}/>
                        <div className={cn([
                            globalStyles['item'],
                            globalStyles['global-display-flex-center'],
                            globalStyles['global-text-align-center']
                        ])}>{GLOBALFUNC__TranslateSecondsToDate(new Date(item.date.seconds * 1000))}</div>
                        <div className={cn([
                            globalStyles['item'],
                            globalStyles['global-display-flex-center'],
                            globalStyles['global-text-align-center']
                        ])}>{item.project}</div>
                        <div className={cn([
                            globalStyles['item'],
                            globalStyles['global-display-flex-center'],
                            globalStyles['global-text-align-center']
                        ])}>{item.phase}</div>
                        <div className={cn([
                            globalStyles['item'],
                            globalStyles['global-display-flex-center'],
                            globalStyles['global-text-align-center']
                        ])}>{item.task}</div>
                        <div className={cn([
                            globalStyles['item'],
                            globalStyles['global-display-flex-center'],
                            globalStyles['global-text-align-center']
                        ])}>{item.hours}</div>
                        <div className={cn([
                            globalStyles['item'],
                            globalStyles['global-display-flex-center'],
                            globalStyles['global-text-align-center']
                        ])}>{item.kilometers_traveled}</div>
                        <div className={cn({
                            [globalStyles['global-status']]:true,
                            [globalStyles['global-backgroundcolor-lightslategrey']]:item.status == 'not_filled',
                            [globalStyles['global-backgroundcolor-blue']]:item.status == 'open',
                            [globalStyles['global-backgroundcolor-red']]:item.status == 'rejected',
                            [globalStyles['global-backgroundcolor-lightgreen']]:item.status == 'approved',
                            [globalStyles['global-backgroundcolor-purple']]:item.status == 'exported'
                        })}>{FUNC__TranslateWorkedHoursStatus(item.status)}</div>
                    </button>
                ))
            }
            {
                props.dataHasLoaded
                && props.resourcesWorkedHoursObject.length == 0
                &&
                <GlobalComponentDynamicMessage
                    showTitle={true}
                    message={"Er zijn voor de geselecteerde filters geen gewerkte uren gevonden."}/>
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
                        value={'problemen'}
                        FUNC__LoadMoreData={FUNC__LoadMoreResourcesWorkedHoursData}
                        params={[
                            props.setLoadingMoreData,
                            props.appContext.globalContext.authenticate.user.organization_id,
                            props.resourcesWorkedHoursObject,
                            props.setResourcesWorkedHoursObject,
                            props.keyFilter,
                            props.currentYear,
                            props.overviewSortFilter,
                            props.lastVisible,
                            props.setLastVisible,
                            props.appContext.globalContext.authenticate.user.user_id,
                            props.appContext.globalContext.authenticate.user.role
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
export default VIEW__SectionOverview;