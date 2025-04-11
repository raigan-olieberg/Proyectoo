// React / NextJs components
import cn from 'classnames';
import * as featherIcon from 'feather-icons';
// Global / Page / Layout components
import { 
    FUNC__GetWeeks,
    FUNC__GetMonths,
    FUNC__ChangeKeyFilter,
    FUNC__ChangeOverviewSortFilter,
    FUNC__ChangeCurrentView
} from './Controller.js';
import { 
    GLOBALFUNC__MonthNames
 } from '../../../helpers/GlobalFunctions.js';
// Page styles
import globalStyles from '../../../styles/global.module.scss';


const VIEW__SectionOverview__Header = (props) => {
    return(
        <div className={globalStyles['content-body-with-header__header']}>
            <div className={cn([
                globalStyles['header-top-workedhours-overview'],
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
                    placeholder="Zoek gebruiker..."
                    value={props.filterValue}
                    disabled={props.filterActive ? true : false}
                    onKeyDown={
                        (e) => {
                            FUNC__OnKeyDown(e);
                        }
                    }
                    onChange={e => {FUNC__ChangeFilterValue(e.target.value, "text")}}/>
                <div className={cn([
                    globalStyles['global-select-with-sort-and-button'],
                    globalStyles['global-grid-gap-column']
                ])}>
                    <div className={globalStyles['global-select-with-sort-and-button__left']}>
                        <div>
                            <label className={globalStyles['global-margin-right-item']} htmlFor="sortby">Filteren op:</label>
                            <select className={cn([
                                globalStyles['global-select__standard'],
                                globalStyles['global-transition-duration']
                            ])} 
                            value={props.overviewSortFilter.key}
                            onChange={e => {FUNC__ChangeOverviewSortFilter(
                                'key', 
                                e.target.value,
                                props.overviewSortFilter,
                                props.setOverviewSortFilter
                            )}}>
                                <option value="show_all">Toon alles</option>
                                <option value="status">Status</option>
                            </select>
                        </div>
                        {
                            props.overviewSortFilter.key != 'show_all'
                            &&
                            <div className={globalStyles['global-select__with-icon']}>
                                <select className={cn([
                                    globalStyles['global-select__standard'],
                                    globalStyles['global-transition-duration']
                                ])}
                                value={props.overviewSortFilter.value}
                                onChange={e => {FUNC__ChangeOverviewSortFilter(
                                    'value',
                                    e.target.value,
                                    props.overviewSortFilter,
                                    props.setOverviewSortFilter
                                )}}>
                                    <option value="not_filled">Nog niet ingevuld</option>
                                    <option value="open">Nog niet beoordeeld</option>
                                    <option value="rejected">Afgekeurd</option>
                                    <option value="approved">Goedgekeurd</option>
                                    <option value="exported">Geëxporteerd</option>
                                </select>
                            </div>
                            ||
                            <div></div>
                        }
                    </div>
                    <div className={globalStyles['global-seperator__vertical']}></div>
                    <div>
                        <button href="projects/add" className={cn([
                            globalStyles['global-button'],
                            globalStyles['global-button-hover'],
                            globalStyles['global-transition-duration'],
                        ])} onClick={() => FUNC__ShowOrOpenAnalyticsGraph(
                            props.showAnalyticsGraph,
                            props.setShowAnalyticsGraph
                        )}>
                            Goedgekeurde exporteren naar boekhoudsysteem
                            <i className={globalStyles['global-button__icon-end']} dangerouslySetInnerHTML={{__html: featherIcon.icons['external-link'].toSvg({height: '1vw', width: '1vw'})}}></i>
                        </button>
                    </div>
                </div>
            </div>
            <div className={globalStyles['header-bottom']}>
                <div className={cn([
                    globalStyles['global-column-header'],
                    globalStyles['global-column-header__standard-grid'],
                    globalStyles['global-margin-top-x2'],
                    globalStyles['global-grid-8']
                ])}>
                    <div className={globalStyles['global-text-align-start']}>Resource</div>
                    <div>Datum</div>
                    <div>Project</div>
                    <div>Phase</div>
                    <div>Taak</div>
                    <div>Gewerkte uren</div>
                    <div>Afgelegde kilometers</div>
                    <div>Status</div>
                </div>
            </div>
        </div>
    );
}
export default VIEW__SectionOverview__Header;