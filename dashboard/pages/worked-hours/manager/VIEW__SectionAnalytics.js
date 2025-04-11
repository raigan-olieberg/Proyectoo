// React / NextJs components
import cn from 'classnames';
import * as featherIcon from 'feather-icons';
// Global / Page / Layout components
import UserComponentInsideList from '../../../components/Global/Resources/User/InsideList';
import { 
    FUNC__FilterResourceAnalytics,
    FUNC__LoadMoreResourcesWorkedHoursAnalyticsData
} from './Controller';
import GlobalComponentDynamicMessage from '../../../components/Global/Alerts/DynamicMessage';
import { GlobalComponentLoadMoreButton } from '../../../components/Global/Loaders/LoadMoreButton';
import GlobalComponentLoadingData from '../../../components/Global/Loaders/LoadingData';
// Page styles
import globalStyles from '../../../styles/global.module.scss';


const VIEW__SectionAnalytics = (props) => {
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
        <div className={globalStyles['content-body-with-header__body']}>
            {
                props.dataHasLoaded
                && props.resourcesWorkedHoursAnalyticsObject.length > 0
                &&
                props.resourcesWorkedHoursAnalyticsObject.map(item => (
                    <button 
                        key={item.user_id} 
                        className={cn([
                            globalStyles['global-item'],
                            globalStyles['global-item__standard-grid'],
                            globalStyles['global-hover-standard'],
                            globalStyles['global-margin-bottom-item'],
                            globalStyles['global-transition-duration'],
                            globalStyles['global-grid-5']
                    ])} onClick={() => FUNC__EditResource(
                            props.appContext,
                            props.currentView,
                            props.resourcesWorkedHoursAnalyticsObject,
                            props.setResourcesWorkedHoursAnalyticsObject,
                            item
                        )}>  
                        <UserComponentInsideList
                            user={item}/>
                        <div className={cn([
                            globalStyles['item'],
                            globalStyles['global-display-flex-center'],
                            globalStyles['global-text-align-center']
                        ])}>
                            {FUNC__FilterResourceAnalytics(
                                item.analytics,
                                'not_filled'
                            )}
                        </div>
                        <div className={cn([
                            globalStyles['item'],
                            globalStyles['global-display-flex-center'],
                            globalStyles['global-text-align-center']
                        ])}>
                            {FUNC__FilterResourceAnalytics(
                                item.analytics,
                                'open'
                            )}
                        </div>
                        <div className={cn([
                            globalStyles['item'],
                            globalStyles['global-display-flex-center'],
                            globalStyles['global-text-align-center']
                        ])}>
                            {FUNC__FilterResourceAnalytics(
                                item.analytics,
                                'rejected'
                            )}
                        </div>
                        <div className={cn([
                            globalStyles['item'],
                            globalStyles['global-display-flex-center'],
                            globalStyles['global-text-align-center']
                        ])}>
                            {FUNC__FilterResourceAnalytics(
                                item.analytics,
                                'approved'
                            )} = ({FUNC__FilterResourceAnalytics(
                                item.analytics,
                                'approved_hours'
                            )} {FUNC__FilterResourceAnalytics(
                                item.analytics,
                                'approved_hours'
                            ) > 1 && 'uren' || 'uur'})
                        </div>
                        {/*<div className={cn([
                            globalStyles['item'],
                            globalStyles['global-display-flex-center'],
                            globalStyles['global-text-align-center']
                        ])}>
                            {FUNC__FilterResourceAnalytics(
                                item.analytics,
                                props.keyFilter,
                                'approved_hours'
                            )}
                        </div>*/}
                    </button>
                ))
            }
            {
                props.dataHasLoaded
                && props.resourcesWorkedHoursAnalyticsObject.length == 0
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
                        value={'problemen'}
                        FUNC__LoadMoreData={FUNC__LoadMoreResourcesWorkedHoursAnalyticsData}
                        params={[
                            props.setLoadingMoreData,
                            props.appContext.globalContext.authenticate.user.organization_id,
                            props.resourcesWorkedHoursAnalyticsObject,
                            props.setResourcesWorkedHoursAnalyticsObject,
                            props.currentYear,
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
export default VIEW__SectionAnalytics;