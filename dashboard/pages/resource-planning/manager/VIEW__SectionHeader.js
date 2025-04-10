// React / NextJs components
import cn from 'classnames';
import * as featherIcon from 'feather-icons';
import { useState } from 'react';
import { 
    addDays,
    subDays,
    isToday,
    setDate,
    addWeeks,
    getWeek,
    subWeeks,
    isThisWeek,
    startOfWeek,
    endOfWeek,
    setWeek,
    addMonths,
    subMonths,
    isThisMonth,
    setMonth
} from 'date-fns';
import { 
    GLOBALFUNC__DayNames,
    GLOBALFUNC__MonthNames,
} from '../../../helpers/GlobalFunctions';
// Page styles
import globalStyles from '../../../styles/global.module.scss';
/*
*
*
* 
* 
    REF:VIEW__SectionHeader
    WHAT IS IT: 
        The generated view for the section Header
*
*
* 
* 
*/
const VIEW__SectionHeader = (props) => {
     /*
    *
    *
    * 
    * 
        REF:FUNC__SetHeaderDate
        WHAT IS IT: 
            Set the headerdate
    *
    *
    * 
    * 
    */
    const FUNC__SetHeaderDate = (tempDate, view) => {
        let headerDateStr = "";
        let part1 = "";
        let part2 = "";
        let part3 = "";
        switch(view){
            case "dayview":
                headerDateStr = "";
                part1 = isToday(tempDate) ? "Vandaag, " : "";
                part2 = `${GLOBALFUNC__DayNames[tempDate.getDay()]} ${tempDate.getDate()} ${GLOBALFUNC__MonthNames[tempDate.getMonth()]} ${tempDate.getFullYear()}`;
                headerDateStr = part1+part2;
                break;
            case "weekview":
                headerDateStr = "";
                part1 = isThisWeek(tempDate) ? "Deze week, " : `Week ${getWeek(tempDate)}, `;
                part2 = `${startOfWeek(tempDate, { weekStartsOn: 1 }).getDate()} ${GLOBALFUNC__MonthNames[tempDate.getMonth()]} ${tempDate.getFullYear()}`;
                part3 = ` t/m ${endOfWeek(tempDate, { weekStartsOn: 1 }).getDate()} ${GLOBALFUNC__MonthNames[tempDate.getMonth()]} ${tempDate.getFullYear()}`;
                headerDateStr = part1+part2+part3;
                break;
            case "monthview":
                headerDateStr = "";
                part1 = isThisMonth(tempDate) ? "Deze maand, " : "";
                part2 = `${GLOBALFUNC__MonthNames[tempDate.getMonth()]} ${tempDate.getFullYear()}`;
                headerDateStr = part1+part2;
                break;
        }
        return headerDateStr;
    }
    const [headerDate, setHeaderDate] = useState(FUNC__SetHeaderDate(new Date(), props.currentView));
    /*
    *
    *
    * 
    * 
        REF:FUNC__CalendarView__HeaderString
        WHAT IS IT: 
            Set correct month and year at the header
    *
    *
    * 
    * 
    */
    const FUNC__ChangeView = (value) => {
        switch(value){
            case "dayview":
                setHeaderDate(FUNC__SetHeaderDate(props.dayviewDate, value));
                break;
            case "weekview":;
                setHeaderDate(FUNC__SetHeaderDate(props.weekviewDate, value));
                break;
            case "monthview":
                setHeaderDate(FUNC__SetHeaderDate(props.monthviewDate, value));
                break;
        }
        props.setCurrentView(value);
    }
    const FUNC__Navigate = (direction) => {
        switch(props.currentView){
            case "dayview":
                props.FUNC__Navigate__Dayview(
                    direction,
                    props.dayviewDate,
                    props.setDayviewDate,
                    setHeaderDate,
                    FUNC__SetHeaderDate,
                    addDays,
                    subDays,
                    setDate
                );
                props.FUNC__FetchData__Dayview();
                break;
            case "weekview":
                props.FUNC__Navigate__Weekview(
                    direction,
                    props.weekviewDate,
                    props.setWeekviewDate,
                    setHeaderDate,
                    FUNC__SetHeaderDate,
                    addWeeks,
                    getWeek,
                    subWeeks,
                    setWeek
                );
                break;
            case "monthview":
                props.FUNC__Navigate__Monthview(
                    direction,
                    props.monthviewDate,
                    props.setMonthviewDate,
                    setHeaderDate,
                    FUNC__SetHeaderDate,
                    addMonths,
                    subMonths,
                    setMonth
                );
                break;
        }
    }
    return (
        <div className={globalStyles['global-schedule__header']}>
            <div className={globalStyles['top']}>
                <div className={cn([
                    globalStyles['top__type'],
                    globalStyles['global-grid-gap-buttons']
                ])}>
                    <div className={cn([
                        globalStyles['global-select__with-icon'],
                        globalStyles['global-select__with-border']
                    ])}>
                        {props.currentView == "dayview" && <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['framer'].toSvg({height: "1vw", with: "1vw"})}}></i>}
                        {props.currentView == "weekview" && <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['grid'].toSvg({height: "1vw", with: "1vw"})}}></i>}
                        {props.currentView == "monthview" && <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['calendar'].toSvg({height: "1vw", with: "1vw"})}}></i>}
                        {props.currentView == "listview" && <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['table'].toSvg({height: "1vw", with: "1vw"})}}></i>}
                        <select className={cn([
                                globalStyles['global-select__standard'],
                                globalStyles['global-transition-duration']
                            ])}
                            value={props.currentView}
                            onChange={e => {FUNC__ChangeView(e.target.value);}}>
                            <option value="dayview">Dag planning</option>
                            <option value="weekview">Week planning</option>
                            <option value="occupationview">Bezetting</option>
                        </select>
                    </div>
                    <div>fff</div>
                    {/*<div className={globalStyles['global-filter']}>
                        <div className={cn([
                            globalStyles['global-filter__left'],
                            globalStyles['global-margin-right']
                        ])}>
                            {!props.filterActive && <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['filter'].toSvg({height: "1vw", width: "1vw"})}}></i>}
                            {props.filterActive && <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['filter'].toSvg({height: "1vw", width: "1vw", fill: "#FF5F1F"})}}></i>}
                            <label className={globalStyles['global-margin-right-item']} htmlFor="sortby">Filter op:</label>
                            <select className={cn([
                                    globalStyles['global-select__standard'],
                                    globalStyles['global-transition-duration']
                                ])}
                                value={props.filterKey}
                                onChange={e => {props.setFilterKey(e.target.value);}}>
                                <option value="task_description">Taak</option>
                                <option value="phase_description">Fase</option>
                            </select>
                        </div>
                        <div className={cn([
                            globalStyles['global-seperator__vertical'],
                            globalStyles['global-margin-right']
                        ])}></div>
                        <div className={globalStyles['global-search']}>
                            <div>
                                {   
                                    (props.filterKey == "task_description" 
                                        || props.filterKey == "phase_description")
                                    && 
                                    <input 
                                        type="text" 
                                        placeholder="Typ een naam..."
                                        value={props.filterValue}/>
                                }
                                {   
                                    props.filterKey == "status" 
                                    &&
                                    <select className={cn([
                                            globalStyles['global-select__standard'],
                                            globalStyles['global-transition-duration']
                                        ])}
                                        value={props.filterValue}
                                        onChange={e => {props.setFilterValue(e.target.value);}}>
                                        {(props.currentView == "tasks" || props.currentView == "my-tasks") && <option value="Niet toegewezen">Niet toegewezen</option>}
                                        <option value="Open">Open</option>
                                        <option value="Nu bezig">Nu bezig</option>
                                        {(props.currentView == "tasks" || props.currentView == "my-tasks") && <option value="Te laat">Te laat</option>}
                                        {(props.currentView == "tasks" || props.currentView == "my-tasks") && <option value="Vastgelopen">Vastgelopen</option>}
                                        <option value="Voltooid">Voltooid</option>
                                    </select>
                                }
                                {(props.filterKey == "startdate" || props.filterKey == "enddate") && <input type="date" placeholder="Typ een naam..."></input>}
                            </div>
                            <button className={cn({
                                [globalStyles['global-button']]:true,
                                [globalStyles['global-button__for-search']]:props.filterActive,
                                [globalStyles['global-button__full-width']]:true,
                                [globalStyles['global-button__filter-inactive']]:!props.filterActive,
                                [globalStyles['global-button-hover']]:true,
                                [globalStyles['global-transition-duration']]:true,
                                [globalStyles['global-backgroundcolor-chatbubble']]:true
                            })} onClick={() => FUNC__SelectItemForSidebarExpanded("VIEW__Manager__ProjectPhaseTaskAdd__add-button", sidebarContext.globalContext.sidebar.direction, "with-subheader", {page: "memberandteams/manager", title: "Medewerkers toevoegen", view: "VIEW__Manager__Members", data: null})}>
                                <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['search'].toSvg({height: "1vw", width: "1vw"})}}></i>
                                Zoeken
                            </button>
                        </div>
                        {
                            props.filterActive
                            &&
                            <button className={cn([
                                globalStyles['global-filter__button-close'],
                                globalStyles['global-transition-duration']
                            ])} onClick={() => FUNC_CloseSidebar()}>
                                <i dangerouslySetInnerHTML={{__html: featherIcon.icons['x-circle'].toSvg({height: "1.2vw", widfth: "1.2vw"})}}></i>
                            </button>
                        }
                    </div>*/}
                </div>
                <div className={cn([
                    globalStyles['top__navigation'],
                    globalStyles['global-grid-gap-buttons']
                ])}>
                    {
                        props.currentView != "listview"
                        &&
                        <>
                            <button className={cn([
                                globalStyles['global-button'],
                                globalStyles['global-button-hover'],
                                globalStyles['global-transition-duration']
                            ])} onClick={() => FUNC__Navigate("today")}><i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['corner-left-down'].toSvg({height: "1vw", width: "1vw"})}}></i>
                                {props.currentView == "dayview" && "Naar vandaag"}
                                {props.currentView == "weekview" && "Naar deze week"}
                                {props.currentView == "monthview" && "Naar deze maand"}
                            </button>        
                            <button className={cn([
                                globalStyles['global-button'],
                                globalStyles['global-button-hover'],
                                globalStyles['global-transition-duration'],
                                globalStyles['global-button-icon-only']
                            ])} onClick={() => FUNC__Navigate("backward")}><i dangerouslySetInnerHTML={{__html: featherIcon.icons['arrow-left'].toSvg({height: "1vw", width: "1vw"})}}></i></button>
                            <div className={globalStyles['today']}>
                                {/*
                                    props.currentView == "dayview" && <span>{props}</span>
                                }
                                {
                                    props.currentView == "weekview" && <><span>Week 3, </span>5 apr.2025 t/m 12 apr.2025</>
                                }
                                {
                                    props.currentView == "monthview" && <span>{FUNC__CalendarView__HeaderString(props.calendarDate)}</span>
                                */}

                                <span>{headerDate}</span>
                            </div>
                            <button className={cn([
                                globalStyles['global-button'],
                                globalStyles['global-button-hover'],
                                globalStyles['global-transition-duration'],
                                globalStyles['global-button-icon-only']
                            ])} onClick={() => FUNC__Navigate("forward")}><i dangerouslySetInnerHTML={{__html: featherIcon.icons['arrow-right'].toSvg({height: "1vw", width: "1vw"})}}></i></button>
                        </>
                    }
                    {
                        props.showAddButton
                        &&
                        <>
                            <div className={globalStyles['global-seperator__vertical']}></div>
                            <button className={cn([
                                globalStyles['global-button'],
                                globalStyles['global-button-hover'],
                                globalStyles['global-transition-duration']
                            ])} onClick={() => props.FUNC__AddPlanning()}>
                                <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['plus'].toSvg({height: '1vw', width: '1vw'})}}></i>
                                Planning aanmaken
                            </button>
                        </>
                    }
                </div>
            </div>
            {
                /* IF dayview */
                props.currentView == "dayview"
                && props.dayViewDataHasLoaded
                && props.dayviewObjectItemsTotal > 0
                &&
                <div className={cn([
                    globalStyles['dates'],
                    globalStyles['global-grid-24']
                ])}>
                    <div className={globalStyles['dates__item']}>00u</div>
                    <div className={globalStyles['dates__item']}>01u</div>
                    <div className={globalStyles['dates__item']}>02u</div>
                    <div className={globalStyles['dates__item']}>03u</div>
                    <div className={globalStyles['dates__item']}>04u</div>
                    <div className={globalStyles['dates__item']}>05u</div>
                    <div className={globalStyles['dates__item']}>06u</div>
                    <div className={globalStyles['dates__item']}>07u</div>
                    <div className={globalStyles['dates__item']}>08u</div>
                    <div className={globalStyles['dates__item']}>09u</div>
                    <div className={globalStyles['dates__item']}>10u</div>
                    <div className={globalStyles['dates__item']}>11u</div>
                    <div className={globalStyles['dates__item']}>12u</div>
                    <div className={globalStyles['dates__item']}>13u</div>
                    <div className={globalStyles['dates__item']}>14u</div>
                    <div className={globalStyles['dates__item']}>15u</div>
                    <div className={globalStyles['dates__item']}>16u</div>
                    <div className={globalStyles['dates__item']}>17u</div>
                    <div className={globalStyles['dates__item']}>18u</div>
                    <div className={globalStyles['dates__item']}>19u</div>
                    <div className={globalStyles['dates__item']}>20u</div>
                    <div className={globalStyles['dates__item']}>21u</div>
                    <div className={globalStyles['dates__item']}>22u</div>
                    <div className={globalStyles['dates__item']}>23u</div>
                </div>
            }
            {
                /* IF listview */
                props.currentView == "listview"
                && props.listviewObjectItemsTotal > 0
                &&
                <div className={cn([
                    globalStyles['global-column-header'],
                    globalStyles['global-column-header__standard'],
                    globalStyles['global-margin-top-x2']
                ])}>
                    <div className={cn([
                        globalStyles['global-grid-6'],
                        globalStyles['global-column-header__standard-grid']
                    ])}>
                        <div>Taak</div>
                        <div>Fase</div>
                        <div>Toegewezen resource(s)</div>
                        <div>Datum</div>
                        <div>Starttijd</div>
                        <div>Eindtijd</div>
                    </div>
                </div>
            }
        </div>
    );
}
export default VIEW__SectionHeader;