// React / NextJs components
import cn from 'classnames';
import * as featherIcon from 'feather-icons';
// Global / Page / Layout components
import { 
    FUNC__GetWeeks,
    FUNC__GetMonths,
    FUNC__ChangeKeyFilter,
    FUNC__ShowOrOpenAnalyticsGraph,
    FUNC__FilterResourceAnalytics,
    FUNC__ChangeCurrentView
} from './Controller.js';
import { 
    GLOBALFUNC__MonthNames,
    GLOBALFUNC__CalculateWorkedHoursAnalyticsTotal
 } from '../../../helpers/GlobalFunctions.js';
 import GlobalComponentChart from '../../../components/Global/Analytics/Chart';
// Page styles
import globalStyles from '../../../styles/global.module.scss';
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
const VIEW__SectionAnalytics__Header = (props) => {
    return(
        <div className={globalStyles['content-body-with-header__header']}>
            <div className={cn([
                globalStyles['header-top-workedhours-analytics'],
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
                            <option value="overview">Declaraties</option>
                            <option value="analytics">Statistieken</option>
                        </select>
                    </div>
                    <div className={globalStyles['global-select-double']}>
                        <select className={cn([
                                globalStyles['global-select__standard'],
                                globalStyles['global-transition-duration']
                            ])}
                            value={props.keyFilter.key}
                            onChange={e => {FUNC__ChangeKeyFilter(
                                'key', 
                                e.target.value,
                                props.keyFilter,
                                props.setKeyFilter
                            )}}>
                            <option value="monthsview">Per maand</option>
                            <option value="weeksview">Per week</option>
                        </select>
                        <select className={cn([
                            globalStyles['global-select__standard'],
                            globalStyles['global-transition-duration']
                        ])}
                        value={props.keyFilter.value}
                        onChange={e => {FUNC__ChangeKeyFilter(
                            'value', 
                            e.target.value,
                            props.keyFilter,
                            props.setKeyFilter
                        )}}>
                            {
                                props.keyFilter.key == 'weeksview'
                                &&
                                FUNC__GetWeeks().map(week => (
                                    <option key={week} value={week}>Week {week}</option>
                                ))
                            }
                            {
                                props.keyFilter.key == 'monthsview'
                                &&
                                FUNC__GetMonths().map(month => (
                                    <option key={month} value={month}>{GLOBALFUNC__MonthNames[month]}</option>
                                ))
                            }
                        </select>
                    </div>
                </div>
                <input 
                    className={globalStyles['global-search']}
                    type="text" 
                    placeholder="Zoek resource..."
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
                    [globalStyles['header-middle-workedhours']]:true,
                    [globalStyles['header-middle-workedhours__show']]:props.showAnalyticsGraph,
                    [globalStyles['header-middle-workedhours__hide']]:!props.showAnalyticsGraph
                })}>
                    <GlobalComponentChart 
                        type={"vertical"} 
                        fill={"global-backgroundcolor-lightslategrey"} 
                        label={"Nog niet ingevulde declaraties"} 
                        min={FUNC__FilterResourceAnalytics(
                            props.organizationWorkedHoursAnalyticsObject,
                            'not_filled'
                        )} 
                        total={GLOBALFUNC__CalculateWorkedHoursAnalyticsTotal(
                            props.organizationWorkedHoursAnalyticsObject
                        )} sidebar={props.sidebar}
                        FUNC__OnClickHref={"?filterkey=status&filtervalue=not_filled"}/>
                    <GlobalComponentChart 
                        type={"vertical"} 
                        fill={"global-backgroundcolor-blue"} 
                        label={"Nog niet beoordeelde declaraties"} 
                        min={FUNC__FilterResourceAnalytics(
                            props.organizationWorkedHoursAnalyticsObject,
                            'open'
                        )} 
                        total={GLOBALFUNC__CalculateWorkedHoursAnalyticsTotal(
                            props.organizationWorkedHoursAnalyticsObject
                        )} sidebar={props.sidebar}
                        FUNC__OnClickHref={"?filterkey=status&filtervalue=open"}/>
                    <GlobalComponentChart 
                        type={"vertical"} 
                        fill={"global-backgroundcolor-red"} 
                        label={"Afgekeurde declaraties"} 
                        min={FUNC__FilterResourceAnalytics(
                            props.organizationWorkedHoursAnalyticsObject,
                            'rejected'
                        )} 
                        total={GLOBALFUNC__CalculateWorkedHoursAnalyticsTotal(
                            props.organizationWorkedHoursAnalyticsObject
                        )} sidebar={props.sidebar}
                        FUNC__OnClickHref={"?filterkey=status&filtervalue=rejected"}/>
                    <GlobalComponentChart 
                        type={"vertical"} 
                        fill={"global-backgroundcolor-lightgreen"} 
                        label={"Goedgekeurde declaraties"} 
                        min={FUNC__FilterResourceAnalytics(
                            props.organizationWorkedHoursAnalyticsObject,
                            'approved'
                        )} 
                        total={GLOBALFUNC__CalculateWorkedHoursAnalyticsTotal(
                            props.organizationWorkedHoursAnalyticsObject
                        )} sidebar={props.sidebar}
                        FUNC__OnClickHref={"?filterkey=status&filtervalue=approved"}/>
                </div>
            }
            <div className={globalStyles['header-bottom']}>
                <div className={cn([
                    globalStyles['global-column-header'],
                    globalStyles['global-column-header__standard-grid'],
                    globalStyles['global-margin-top-x2'],
                    globalStyles['global-grid-5']
                ])}>
                    <div className={globalStyles['global-text-align-start']}>Resource</div>
                    <div>Nog niet ingevulde declaraties</div>
                    <div>Nog niet beoordeelde declaraties</div>
                    <div>Afgekeurde declaraties</div>
                    <div className={cn([
                        globalStyles['global-color-lightgreen'],
                        globalStyles['global-display-flex-center']
                    ])}>
                        <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['check-circle'].toSvg({height: '1vw', width: '1vw'})}}></i>
                        Goedgekeurde declaraties
                    </div>
                </div>
            </div>
        </div>
    );
}
export default VIEW__SectionAnalytics__Header;