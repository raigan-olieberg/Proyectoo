// React / NextJs components
import cn from 'classnames';
import * as featherIcon from 'feather-icons';
// Global / Page / Layout components
import { 
    FUNC__ShowOrOpenAnalyticsGraph,
    FUNC__ChangeCurrentView
} from './Controller.js';
import { 
    GLOBALFUNC__CalculateProblemsAnalyticsTotal
} from '../../../helpers/GlobalFunctions.js';
import GlobalComponentChart from '../../../components/Global/Analytics/Chart';
// Page styles
import globalStyles from '../../../styles/global.module.scss';

const VIEW__SectionAnalytics__Header = (props) => {
    return(
        <div className={globalStyles['content-body-with-header__header']}>
            <div className={cn([
                globalStyles['header-top-problems-analytics'],
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
                    [globalStyles['header-middle-problems']]:true,
                    [globalStyles['header-middle-problems__show']]:props.showAnalyticsGraph,
                    [globalStyles['header-middle-problems__hide']]:!props.showAnalyticsGraph
                })}>
                    <div className={globalStyles['header-middle-problems__column-chart']}>
                        <GlobalComponentChart 
                            type={"vertical"} 
                            fill={"global-backgroundcolor-red"} 
                            label={"Hoge prioriteit"} 
                            min={props.organizationProblemsAnalyticsObject.priority_high != undefined ? props.organizationProblemsAnalyticsObject.priority_high : 0} 
                            total={GLOBALFUNC__CalculateProblemsAnalyticsTotal(
                                props.organizationProblemsAnalyticsObject,
                            )} sidebar={props.sidebar}
                            FUNC__OnClickHref={"?filterkey=priority&filtervalue=high"}/>
                        <GlobalComponentChart 
                            type={"vertical"} 
                            fill={"global-backgroundcolor-orange"} 
                            label={"Medium prioriteit"} 
                            min={props.organizationProblemsAnalyticsObject.priority_medium != undefined ? props.organizationProblemsAnalyticsObject.priority_medium : 0} 
                            total={GLOBALFUNC__CalculateProblemsAnalyticsTotal(
                                props.organizationProblemsAnalyticsObject,
                            )} sidebar={props.sidebar}
                            FUNC__OnClickHref={"?filterkey=priority&filtervalue=medium"}/>
                        <GlobalComponentChart 
                            type={"vertical"} 
                            fill={"global-backgroundcolor-yellow"} 
                            label={"Lage prioriteit"} 
                            min={props.organizationProblemsAnalyticsObject.priority_low != undefined ? props.organizationProblemsAnalyticsObject.priority_low : 0} 
                            total={GLOBALFUNC__CalculateProblemsAnalyticsTotal(
                                props.organizationProblemsAnalyticsObject,
                            )} sidebar={props.sidebar}
                            FUNC__OnClickHref={"?filterkey=priority&filtervalue=low"}/>
                    </div>
                    <div className={globalStyles['global-seperator__vertical']}></div>
                    <div className={globalStyles['header-middle-problems__column-chart']}>
                        <GlobalComponentChart 
                            type={"vertical"} 
                            fill={"global-backgroundcolor-blue"} 
                            label={"Open"} 
                            min={props.organizationProblemsAnalyticsObject.status_open != undefined ? props.organizationProblemsAnalyticsObject.status_open : 0} 
                            total={GLOBALFUNC__CalculateProblemsAnalyticsTotal(
                                props.organizationProblemsAnalyticsObject,
                            )} sidebar={props.sidebar}
                            FUNC__OnClickHref={"?filterkey=status&filtervalue=open"}/>
                        <GlobalComponentChart 
                            type={"vertical"} 
                            fill={"global-backgroundcolor-purple"} 
                            label={"In behandeling"} 
                            min={props.organizationProblemsAnalyticsObject.status_in_progress != undefined ? props.organizationProblemsAnalyticsObject.status_in_progress : 0} 
                            total={GLOBALFUNC__CalculateProblemsAnalyticsTotal(
                                props.organizationProblemsAnalyticsObject,
                            )} sidebar={props.sidebar}
                            FUNC__OnClickHref={"?filterkey=status&filtervalue=in_progress"}/>
                        <GlobalComponentChart 
                            type={"vertical"} 
                            fill={"global-backgroundcolor-lightgreen"} 
                            label={"Opgelost"} 
                            min={props.organizationProblemsAnalyticsObject.status_resolved != undefined ? props.organizationProblemsAnalyticsObject.status_resolved : 0} 
                            total={GLOBALFUNC__CalculateProblemsAnalyticsTotal(
                                props.organizationProblemsAnalyticsObject,
                            )} sidebar={props.sidebar}
                            FUNC__OnClickHref={"?filterkey=status&filtervalue=resolved"}/>
                    </div>
                </div>
            }
            <div className={globalStyles['header-bottom']}>
                <div className={cn([
                    globalStyles['global-column-header'],
                    globalStyles['global-column-header__standard-grid'],
                    globalStyles['global-margin-top-x2'],
                    globalStyles['global-grid-5']
                ])}>
                    <div>Project</div>
                    <div>Met de prioriteit 'Hoog'</div>
                    <div>Met de prioriteit 'Medium'</div>
                    <div>Met de prioriteit 'Laag'</div>
                    <div className={cn([
                        globalStyles['global-color-lightgreen'],
                        globalStyles['global-display-flex-center']
                    ])}>
                        <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['check-circle'].toSvg({height: '1vw', width: '1vw'})}}></i>
                        Opgeloste problemen
                    </div>
                </div>
            </div>
        </div>
    );
}
export default VIEW__SectionAnalytics__Header;