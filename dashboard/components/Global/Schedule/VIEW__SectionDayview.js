// React / NextJs components
import cn from 'classnames';
import { useState, useEffect } from 'react';
// Global / Page / Layout components
import { GlobalComponentLoadMoreButton } from '../../../components/Global/Loaders/LoadMoreButton';
import GlobalComponentLoadingData from '../../../../../Loaders/LoadingData';
import GlobalComponentEmptyMessage from '../../../components/Global/Alerts/EmptyMessage';
import { AsignedResourcesComponentInsideList } from '../../../components/Global/Resources/AsignedResources';
import {
    GLOBALFUNC__SelectItemForSidebar,
    GLOBALFUNC__TranslateTasksStatus
} from '../../../helpers/GlobalFunctions';
// Page styles
import globalStyles from '../../../styles/global.module.scss';
/*
*
*
* 
* 
    REF:VIEW__SectionDayview
    WHAT IS IT: 
        The generated view for the section Dayview (NL -> Dag)
*
*
* 
* 
*/
const VIEW__SectionDayview = (props) => {
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
            -> REF:generated view
        FUNCTIONS
            -> REF:FUNC__SetSidebarDirection
            -> REF:FUNC__CalculateWidth
            -> REF:FUNC__CalculateItemMargin
        VARS
            -> REF:States, contexts and searchparams

    */
    /*
    *
    *
    * 
    * 
        REF:States, contexts and searchparams
    *
    *
    * 
    * 
    */
    const [moreDataIsLoading, setMoreDataIsLoading] = useState(false);
    /*
    *
    *
    * 
    * 
        REF:FUNC__SetSidebarDirection
            -> WHAT IS IT / WHAT DOES IT DO: 
                ---> De direction of the sidebar when clicking on item
    *
    *
    * 
    * 
    */
    const FUNC__SetSidebarDirection = (time) => {
        return (time.split(":")[0] > 16)?"left":"right";
    }
    /*
    *
    *
    * 
    * 
        REF:FUNC__CalculateWidth
            -> WHAT IS IT / WHAT DOES IT DO: 
                ---> Calculating the width of a planning item
    *
    *
    * 
    * 
    */
    const FUNC__CalculateWidth = (starttime, endtime) => {
        let dateNow = new Date();
        let date1 = new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate(), starttime.split(":")[0], starttime.split(":")[1]);
        let date2 = new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate(), endtime.split(":")[0], endtime.split(":")[1]);
        let hoursDiffNum = Math.abs(date1 - date2) / 36e5;

        function convertNumToTime(number){
            var sign = (number >= 0) ? 1 : -1;
            number = number * sign;
            var hour = Math.floor(number);
            var decpart = number - hour;
            var min = 1 / 60;
            decpart = min * Math.round(decpart / min);
            var minute = Math.floor(decpart * 60) + '';
            if (minute.length < 2) {
                minute = '0' + minute; 
            }
            sign = sign == 1 ? '' : '-';
            var time = sign + hour + ':' + minute;
            return time;
        }
        return (convertNumToTime(hoursDiffNum).split(":")[0] * 3600 + convertNumToTime(hoursDiffNum).split(":")[1] * 60 + 0) / 864; 
    };
    /*
    *
    *
    * 
    * 
        REF:FUNC__CalculateItemMargin
            -> WHAT IS IT / WHAT DOES IT DO: 
                ---> Calculating where a planning item should start
    *
    *
    * 
    * 
    */
    const FUNC__CalculateItemMargin = (time) => {
        let starttimeNum = time.split(':')[0] * 3600 + time.split(':')[1] * 60 + 0;
        let endtimeNum = 24 * 3600 + 0 * 60 + 0;
        return (100 * starttimeNum / endtimeNum).toFixed(2) + "%";
    };
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
    return (
        <>
            {
                props.dayViewDataHasLoaded
                && props.dayviewObject.length > 0
                &&
                props.dayviewObject.map(item => (
                    FUNC__CalculateWidth(item.starttime, item.endtime) > 14
                    &&
                    <div key={item.planning_id} className={cn([
                        globalStyles['day-item'],
                        globalStyles['global-margin-bottom'],
                        globalStyles['global-animation-fadein']
                    ])}>
                        <button className={cn({
                            [globalStyles['day-item__wrapper']]:true,
                            [globalStyles['global-box-shadow']]:true,
                            [globalStyles['global-side-selected-item']]:props.appContext.globalContext.sidebar.show == 1 && props.appContext.globalContext.sidebar.selectedItemID == item.key
                        })} style={{width: FUNC__CalculateWidth(item.starttime, item.endtime)+"%", marginLeft: FUNC__CalculateItemMargin(item.starttime)}}
                        onClick={() => GLOBALFUNC__SelectItemForSidebar(props.appContext, item.key, FUNC__SetSidebarDirection(item.endtime), {page: "project/manager", title: "Taak planning inzien", view: "VIEW__Manager__ProjectPhaseTask__SubtaskDetails", data: item})}>
                            <div className={cn([
                                globalStyles['wrapper-header'],
                                globalStyles['global-transition-duration']
                            ])}>
                                <div className={globalStyles['wrapper-header__start']}>{item.starttime}</div>
                                <div className={globalStyles['wrapper-header__end']}>{item.endtime}</div>
                            </div>
                            <div className={globalStyles['wrapper-body']}>
                                <div className={globalStyles['wrapper-body__info-flex']}>
                                    <span className={globalStyles['global-fontweight-bold']}>Project:</span> {item.project}
                                </div>
                                <div className={cn([
                                    globalStyles['wrapper-body__info-flex'],
                                    globalStyles['global-margin-top-item']
                                ])}>
                                    <span className={globalStyles['global-fontweight-bold']}>Fase:</span> {item.phase}
                                </div>
                                <div className={cn([
                                    globalStyles['wrapper-body__info-flex'],
                                    globalStyles['global-margin-top-item']
                                ])}>
                                    <span className={globalStyles['global-fontweight-bold']}>Taak:</span> {item.task.name}
                                </div>
                                <div className={cn([
                                    globalStyles['wrapper-body__info-flex'],
                                    globalStyles['global-margin-top-item']
                                ])}>
                                    <span className={globalStyles['global-fontweight-bold']}>Status:</span>
                                    <span className={cn({
                                        [globalStyles['global-fontweight-bold']]:true,
                                        [globalStyles['global-color-blue']]:item.task.status == "open",
                                        [globalStyles['global-color-purple']]:item.task.status == "in_progress",
                                        [globalStyles['global-color-red']]:item.task.status == "stuck",
                                        [globalStyles['global-color-orange']]:item.task.status == "overdue",
                                        [globalStyles['global-color-lightgreen']]:item.task.status == "completed"
                                    })}>{GLOBALFUNC__TranslateTasksStatus(item.task.status)}</span>
                                </div>
                                <AsignedResourcesComponentInsideList 
                                    assigned_to={item.assigned_to}
                                    addMarginTop={true}/>
                            </div>
                        </button>
                    </div>
                    ||
                    <div key={item.planning_id} className={cn([
                        globalStyles['day-item'],
                        globalStyles['global-margin-top']
                    ])}>
                        <button className={cn([
                            globalStyles['day-item__wrapper'],
                            globalStyles['day-item__matteo']
                        ])} style={{marginLeft: FUNC__CalculateItemMargin(item.starttime)}}
                        onClick={() => GLOBALFUNC__SelectItemForSidebar(props.appContext, item.key, FUNC__SetSidebarDirection(item.endtime), {page: "project/manager", title: "Taak inzien", view: "VIEW__Manager__ProjectPhaseTask__SubtaskDetails", data: item})}>
                            <div className={cn({
                                [globalStyles['wrapper-preview']]:true,
                                [globalStyles['global-transition-duration']]:true,
                                [globalStyles['global-backgroundcolor-green']]:props.appContext.globalContext.sidebar.show == 1 && props.appContext.globalContext.sidebar.selectedItemID == item.key
                            })}></div>
                            <div className={cn([
                                globalStyles['day-item__wrapper'],
                                globalStyles['global-box-shadow'],
                                globalStyles['wrapper-preview-item']
                            ])}>
                                <div className={cn([
                                    globalStyles['wrapper-header'],
                                    globalStyles['global-transition-duration']
                                ])}>
                                    <div className={globalStyles['wrapper-header__start']}>{item.starttime}</div>
                                    <div className={globalStyles['wrapper-header__end']}>{item.endtime}</div>
                                </div>
                                <div className={globalStyles['wrapper-body']}>
                                    <div className={globalStyles['wrapper-body__info-flex']}>
                                        <span className={globalStyles['global-fontweight-bold']}>Project:</span> {item.project}
                                    </div>
                                    <div className={cn([
                                        globalStyles['wrapper-body__info-flex'],
                                        globalStyles['global-margin-top-item']
                                    ])}>
                                        <span className={globalStyles['global-fontweight-bold']}>Fase:</span> {item.phase}
                                    </div>
                                    <div className={cn([
                                        globalStyles['wrapper-body__info-flex'],
                                        globalStyles['global-margin-top-item']
                                    ])}>
                                        <span className={globalStyles['global-fontweight-bold']}>Taak:</span> {item.task.name}
                                    </div>
                                    <div className={cn([
                                        globalStyles['wrapper-body__info-flex'],
                                        globalStyles['global-margin-top-item']
                                    ])}>
                                        <span className={globalStyles['global-fontweight-bold']}>Status:</span>
                                        <span className={cn({
                                            [globalStyles['global-fontweight-bold']]:true,
                                            [globalStyles['global-color-blue']]:item.task.status == "open",
                                            [globalStyles['global-color-purple']]:item.task.status == "in_progress",
                                            [globalStyles['global-color-red']]:item.task.status == "stuck",
                                            [globalStyles['global-color-orange']]:item.task.status == "overdue",
                                            [globalStyles['global-color-lightgreen']]:item.task.status == "completed"
                                        })}>{GLOBALFUNC__TranslateTasksStatus(item.task.status)}</span>
                                    </div>
                                    <AsignedResourcesComponentInsideList 
                                        assigned_to={item.assigned_to}
                                        addMarginTop={true}/>
                                </div>
                            </div>      
                        </button>
                    </div>
                ))
            }
            {/*<VIEW__DayviewIndicator />*/}
            {/*
                props.dayViewDataHasLoaded
                && props.dayviewObject.length > 0
                && !moreDataIsLoading
                &&
                <div className={globalStyles['global-margin-top-x2']}>
                    <GlobalComponentLoadMoreButton />
                </div>
            */}
            {
                !props.dayViewDataHasLoaded
                &&
                <GlobalComponentLoadingData type={"firstTimeLoading"} />
            }
            {
                moreDataIsLoading
                &&
                <div className={cn([
                    globalStyles['global-margin-top-x2'],
                    globalStyles['global-padding-bottom-x2']
                ])}>
                    <GlobalComponentLoadingData type={"loadMore"} />
                </div>
            }

            {
                props.dayviewObject.items_total == 0
                &&
                <GlobalComponentEmptyMessage
                    buttonTitle={"Planning aanmaken"}
                    FUNC__OnclickAction={props.FUNC__AddPlanning}/>
            }
        </>
    );
}
export default VIEW__SectionDayview;