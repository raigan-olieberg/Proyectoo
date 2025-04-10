// React / NextJs components
import cn from 'classnames';
import * as featherIcon from 'feather-icons';
// Global / Page / Layout components
import { 
    //FUNC__GetWeeks,
    //FUNC__GetMonths,
    //FUNC__ChangeKeyFilter,
    FUNC__ShowOrOpenAnalyticsGraph,
    //FUNC__FilterResourceAnalytics,
    FUNC__ChangeCurrentView
} from './Controller.js';
import { 
    GLOBALFUNC__CalculateTasksAnalyticsTotal
} from '../../../helpers/GlobalFunctions.js';
import GlobalComponentChart from '../../../components/Global/Analytics/Chart';
// Page styles
import globalStyles from '../../../styles/global.module.scss';
/*
*
*
* 
* 
    REF:VIEW__SectionHeader
    WHAT IS IT: 
        The generated view for the header section
*
*
* 
* 
*/
const VIEW__SectionAnalytics__Header = (props) => {
    return(
        <div className={globalStyles['content-body-with-header__header']}>
            <div className={cn([
                globalStyles['header-top-tasks-analytics'],
                globalStyles['global-margin-top']
            ])}>
                <div className={cn([
                    globalStyles['global-display-flex'],
                    globalStyles['global-grid-gap-column']
                ])}>
                    <div className={cn([
                        globalStyles['global-select__with-icon'],
                        globalStyles['global-select__with-border']
                    ])}>
                        {props.currentView == "overview" && <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['list'].toSvg({height: "1vw", with: "1vw"})}}></i>}
                        {props.currentView == "analytics" && <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['pie-chart'].toSvg({height: "1vw", with: "1vw"})}}></i>}
                        <select className={cn([
                                globalStyles['global-select__standard'],
                                globalStyles['global-transition-duration']
                            ])}
                            value={props.currentView}
                            onChange={e => {FUNC__ChangeCurrentView(
                                props.currentView,
                                props.setCurrentView
                            )}}>
                            <option value="overview">Overzicht</option>
                            <option value="analytics">Statistieken</option>
                        </select>
                    </div>
                </div>
                <input 
                    className={globalStyles['global-search']}
                    type="text" 
                    placeholder="Zoek project..."
                    value={props.filterValue}
                    disabled={props.filterActive ? true : false}
                    onKeyDown={
                        (e) => {
                            FUNC__OnKeyDown(e);
                        }
                    }
                    onChange={e => {FUNC__ChangeFilterValue(e.target.value, "text")}}/>
                <div className={globalStyles['global-display-flex-end']}>
                    <button href="projects/add" className={cn({
                        [globalStyles['global-button']]:true,
                        [globalStyles['global-button__filter-active']]:props.showAnalyticsGraph,
                        [globalStyles['global-button-hover-3']]:true,
                        [globalStyles['global-transition-duration']]:true
                    })} onClick={() => FUNC__ShowOrOpenAnalyticsGraph(
                        props.showAnalyticsGraph,
                        props.setShowAnalyticsGraph
                    )}>
                        {props.showAnalyticsGraph && <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['eye-off'].toSvg({height: '1vw', width: '1vw'})}}></i>}
                        {!props.showAnalyticsGraph && <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['eye'].toSvg({height: '1vw', width: '1vw'})}}></i>}
                        Grafiek {props.showAnalyticsGraph ? 'verbergen' : 'tonen'}
                    </button>
                </div>
            </div>
            {
                props.dataHasLoaded
                &&
                <div className={cn({
                    [globalStyles['header-middle-tasks']]:true,
                    [globalStyles['header-middle-tasks__show']]:props.showAnalyticsGraph,
                    [globalStyles['header-middle-tasks__hide']]:!props.showAnalyticsGraph
                })}>
                    <GlobalComponentChart 
                        type={"vertical"} 
                        fill={"global-backgroundcolor-lightslategrey"} 
                        label={"Nog niet toegewezen"} 
                        min={props.organizationTasksAnalyticsObject.unasigned != undefined ? props.organizationTasksAnalyticsObject.unasigned : 0} 
                        total={GLOBALFUNC__CalculateTasksAnalyticsTotal(
                            props.organizationTasksAnalyticsObject,
                        )} sidebar={props.sidebar}
                        FUNC__OnClickHref={"?filterkey=status&filtervalue=unasigned"}/>
                    <GlobalComponentChart 
                        type={"vertical"} 
                        fill={"global-backgroundcolor-blue"} 
                        label={"Nog niet gestart"} 
                        min={props.organizationTasksAnalyticsObject.open != undefined ? props.organizationTasksAnalyticsObject.open : 0} 
                        total={GLOBALFUNC__CalculateTasksAnalyticsTotal(
                            props.organizationTasksAnalyticsObject,
                        )} sidebar={props.sidebar}
                        FUNC__OnClickHref={"?filterkey=status&filtervalue=open"}/>
                    <GlobalComponentChart 
                        type={"vertical"} 
                        fill={"global-backgroundcolor-purple"} 
                        label={"In behandeling"} 
                        min={props.organizationTasksAnalyticsObject.in_progress != undefined ? props.organizationTasksAnalyticsObject.in_progress : 0} 
                        total={GLOBALFUNC__CalculateTasksAnalyticsTotal(
                            props.organizationTasksAnalyticsObject,
                        )} sidebar={props.sidebar}
                        FUNC__OnClickHref={"?filterkey=status&filtervalue=in_progress"}/>
                    <GlobalComponentChart 
                        type={"vertical"} 
                        fill={"global-backgroundcolor-orange"} 
                        label={"Te laat"} 
                        min={props.organizationTasksAnalyticsObject.overdue != undefined ? props.organizationTasksAnalyticsObject.overdue : 0} 
                        total={GLOBALFUNC__CalculateTasksAnalyticsTotal(
                            props.organizationTasksAnalyticsObject,
                        )} sidebar={props.sidebar}
                        FUNC__OnClickHref={"?filterkey=status&filtervalue=overdue"}/>
                    <GlobalComponentChart 
                        type={"vertical"} 
                        fill={"global-backgroundcolor-red"} 
                        label={"Vastgelopen"} 
                        min={props.organizationTasksAnalyticsObject.stuck != undefined ? props.organizationTasksAnalyticsObject.stuck : 0} 
                        total={GLOBALFUNC__CalculateTasksAnalyticsTotal(
                            props.organizationTasksAnalyticsObject,
                        )} sidebar={props.sidebar}
                        FUNC__OnClickHref={"?filterkey=status&filtervalue=stuck"}/>
                    <GlobalComponentChart 
                        type={"vertical"} 
                        fill={"global-backgroundcolor-lightgreen"} 
                        label={"Voltooid"} 
                        min={props.organizationTasksAnalyticsObject.completed != undefined ? props.organizationTasksAnalyticsObject.completed : 0} 
                        total={GLOBALFUNC__CalculateTasksAnalyticsTotal(
                            props.organizationTasksAnalyticsObject,
                        )} sidebar={props.sidebar}
                        FUNC__OnClickHref={"?filterkey=status&filtervalue=completed"}/>
                </div>
            }
            <div className={globalStyles['header-bottom']}>
                <div className={cn([
                    globalStyles['global-column-header'],
                    globalStyles['global-column-header__standard-grid'],
                    globalStyles['global-margin-top-x2'],
                    globalStyles['global-grid-7']
                ])}>
                    <div>Project</div>
                    <div>Nog niet toegewezen</div>
                    <div>Nog niet gestart</div>
                    <div>In behandeling</div>
                    <div>Te laat</div>
                    <div>Vastgelopen</div>
                    <div className={cn([
                        globalStyles['global-color-lightgreen'],
                        globalStyles['global-display-flex-center']
                    ])}>
                        <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['check-circle'].toSvg({height: '1vw', width: '1vw'})}}></i>
                        Voltooide taken
                    </div>
                </div>
            </div>
        </div>
    );
}
export default VIEW__SectionAnalytics__Header;