// React / NextJs components
import cn from 'classnames';
// Global / Page / Layout components
import GlobalComponentLoadingData from '../../../components/Global/Loaders/LoadingData';
import GlobalComponentDynamicMessage from '../../../components/Global/Alerts/DynamicMessage';
import { 
    GLOBALFUNC__CalculatePercentage,
    GLOBALFUNC__CalculateProblemsAnalyticsTotal
} from '../../../helpers/GlobalFunctions';
import { FUNC__LoadMoreAnalyticsData } from './Controller';
// Page styles
import globalStyles from '../../../styles/global.module.scss';

const VIEW__SectionAnalytics = (props) => {
    return(
        <div className={globalStyles['content-body-with-header__body']}>
            {
                props.dataHasLoaded
                && props.problemsAnalyticsObject.length > 0
                &&
                props.problemsAnalyticsObject.map(item => (
                    <button 
                        key={item.project_id} 
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
                            props.problemsAnalyticsObject,
                            props.setProblemsAnalyticsObject,
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
                        ])}>{item.analytics.priority_high}</div>
                        <div className={cn([
                            globalStyles['item'],
                            globalStyles['global-display-flex-center'],
                            globalStyles['global-text-align-center']
                        ])}>{item.analytics.priority_medium}</div>
                        <div className={cn([
                            globalStyles['item'],
                            globalStyles['global-display-flex-center'],
                            globalStyles['global-text-align-center']
                        ])}>{item.analytics.priority_low}</div>
                        <div className={cn([
                            globalStyles['item'],
                            globalStyles['global-display-flex-center'],
                            globalStyles['global-text-align-center']
                        ])}>{item.analytics.status_resolved} ({GLOBALFUNC__CalculatePercentage(
                            item.analytics.status_resolved,
                            GLOBALFUNC__CalculateProblemsAnalyticsTotal(
                                item.analytics
                            ))}%)</div>
                    </button>
                ))
            }
            {
                props.dataHasLoaded
                && props.problemsAnalyticsObject.length == 0
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
                            props.problemsAnalyticsObject,
                            props.setProblemsAnalyticsObject,
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