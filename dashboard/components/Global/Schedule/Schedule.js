// React / NextJs components
import cn from 'classnames';
import { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
// Global / Page / Layout components
import LayoutComponentLoggedinPage from '../../Layouts/LoggedinPage';
import ProjectPageLayout from '../../Layouts/ProjectPage';
import AppContext from '../../../helpers/AppContext';
import VIEW__SectionHeader from './VIEW__SectionHeader';
import VIEW__SectionDayview from './VIEW__SectionDayview';
import VIEW__SectionWeekview from './VIEW__SectionWeekview';
import { FUNC__Navigate__Dayview } from './Navigation/FUNC__Dayview';
import { FUNC__Navigate__Weekview } from './Navigation/FUNC__Weekview';
import { FUNC__Navigate__Monthview } from './Navigation/FUNC__Monthview';
import { 
    GLOBALFUNC__SelectItemForSidebar,
    GLOBALFUNC__SelectItemForSidebarBoth,
    GLOBALFUNC__GetCurrentProject,
    GLOBALFUNC__EditCurrentProject,
    GLOBALFUNC__DayNames,
    GLOBALFUNC__MonthNames
} from '../../../helpers/GlobalFunctions';
import { useInView } from 'react-intersection-observer'
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
// Page styles
import globalStyles from '../../../styles/global.module.scss';

const Schedule = (props) => {
    console.log(props.weekviewLastVisible);
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
            -> REF:VIEW__SectionDayview
            -> REF:VIEW__SectionMonthview
            -> REF:VIEW__SectionWeekview
            -> REF:VIEW__DayviewIndicator
            -> REF:generated view
        FUNCTIONS
            -> REF:FUNC__SearchParams__ForFilter
    
    */
    /*
    *
    *
    * 
    * 
        REF:States and contexts
    *
    *
    * 
    * 
    */
    const router = useRouter();
    const searchParams = useSearchParams();
    const appContext = useContext(AppContext);
    const {ref: loadingMoreData, inView} = useInView();
    const [loadmoreWeekviewData, setLoadmoreWeekviewData] = useState(false);
    const [currentView, setCurrentView] = useState("weekview");
    const [dayviewDate, setDayviewDate] = useState(new Date());
    const [dayviewObject, setDayviewObject] = useState(props.dayviewObject);
    const [weekviewDate, setWeekviewDate] = useState(new Date());
    const [weekviewObject, setWeekviewObject] = useState(props.weekviewObject);
    const [monthviewDate, setMonthviewDate] = useState(new Date());
    const [monthviewObject, setMonthviewObject] = useState(props.monthviewObject);
    const [listviewObject, setListviewObject] = useState(props.listviewObject);
    const [dayViewDataHasLoaded, setDayViewDataHasLoaded] = useState(true);
    const [monthViewDataHasLoaded, setMonthViewDataHasLoaded] = useState(false);
    /*
    *
    *
    * 
    * 
        REF:FUNC__SearchParams__ForFilter
        WHAT IS IT: 
            The generated view for the section Header
    *
    *
    * 
    * 
    */
    const [filterKey, setFilterKey] = useState("task_description");
    const [filterValue, setFilterValue] = useState("");
    const [filterActive, setFilterActive] = useState(false);
    /*
    *
    *
    * 
    * 
        REF:FUNC__SearchParams__ForFilter
        WHAT IS IT: 
            The generated view for the section Header
    *
    *
    * 
    * 
    */
    useEffect(() => {
        const action = searchParams.get('action');
        const phase = searchParams.get('phase');
        const phase_id = searchParams.get('phase_id');
        const task = searchParams.get('task');
        const task_id = searchParams.get('task_id');
        const startdate = searchParams.get('startdate');
        const deadline = searchParams.get('deadline');
        switch(action){
            case "create-planning":
                if(phase != undefined
                    && task != undefined){
                        setFilterValue(task);
                    }
                if(phase != undefined
                    && phase_id != undefined
                    && task != undefined
                    && task_id != undefined
                    && startdate != undefined
                    && deadline != undefined){
                        FUNC__AddPlanningFromSearchParams(
                            phase,
                            phase_id,
                            task,
                            task_id,
                            startdate,
                            deadline
                        );
                    }
                router.replace('', undefined, { shallow: true });
                break;
            case "create-new-planning":
                FUNC__AddPlanning();
                router.replace('', undefined, { shallow: true });
                break;
            case "show-planning":
                if(phase != undefined
                    && task != undefined){
                        setFilterValue(task);
                    }
                break;
        }
        /*setCurrentView(view != null ? view : "phases_overview");

        // 
        const filterKey = searchParams.get('filter-key');
        console.log(filterKey);
        setFilterKey(filterKey != null ? filterKey : "phase_description");

        // 
        const filterValue = searchParams.get('filter-value');
        console.log(filterValue);
        setFilterValue(filterValue != null ? filterValue : "");

        if(view != null
            || filterKey != null
            || filterValue != null){
                setFilterActive(true);
        } else {
            setFilterActive(false);
        }*/
    }, [searchParams]);
    /*
    *
    *
    * 
    * 
        REF:FUNC__AddPlanning
        WHAT IS IT: 
            Add a new planning
    *
    *
    * 
    * 
    */
    const FUNC__AddPlanning = () => {
        GLOBALFUNC__SelectItemForSidebarBoth(
            appContext,
            {
                selectedItemID: null, 
                direction: "right", 
                payload: {
                    page: "project/manager/info/planning", 
                    title: "Planning aanmaken", 
                    view: "VIEW__Manager__ProjectPlanningAdd", 
                    data: {}
                }
            },
            {
                headerType: "with-subheader",
                headerAction: "select-task", 
                selectedItemID: null, 
                direction: "right", 
                payload: {
                    page: "project/manager/info/planning", 
                    title: "Kies een taak", 
                    view: "VIEW__Manager__ProjectPlanningViewTasks", 
                    data: {
                        selectTask: {
                            currentView: "phases",
                        }
                    }
                }
            }
        );
    }
    const FUNC__AddPlanningFromSearchParams = ( 
        phase,
        phase_id, 
        description,
        task_id,
        startdate,
        deadline) => {
            GLOBALFUNC__SelectItemForSidebar(
                appContext,
                null,
                "right",
                {
                    page: "project/manager/info/planning", 
                    title: "Planning aanmaken", 
                    view: "VIEW__Manager__ProjectPlanningAdd", 
                    data: {
                        selectTask: {
                            selectedTask: {
                                project_id: GLOBALFUNC__GetCurrentProject(appContext).id,
                                phase: phase,
                                phase_id: phase_id,
                                task_id: task_id,
                                description: description,
                                startdate: startdate,
                                deadline: deadline
                            } 
                        }
                    }
                }
            );
    }

    const FUNC__ResetWeekView = () => {
        props.setWeekviewObject([]);
        props.setWeekviewDataHasLoaded(false);
        props.setWeekviewLastVisible(null);
        setLoadmoreWeekviewData(false);
        props.FUNC__GetWeekviewResourcePlanning(
            props.organization_id,
            props.setWeekviewObject,
            props.weekviewObject,
            props.setWeekviewDataHasLoaded,
            26,
            props.weekviewLastVisible,
            props.setWeekviewLastVisible,
            appContext.globalContext.authenticate.user.user_id,
            appContext.globalContext.authenticate.user.role
        );
    }
    /*
    *
    *
    * 
    * 
        REF:FUNC__FetchData__Dayview
            -> WHAT IS IT / WHAT DOES IT DO: 
                ---> Fetch data from server
    *
    *
    * 
    * 
    */
    const FUNC__FetchData__Dayview = () => {
        setDayViewDataHasLoaded(false);
    }
    useEffect(() => {
        setTimeout(() => {
            setDayViewDataHasLoaded(true);
        }, 5000);
    },[dayViewDataHasLoaded]);
    /*
    *
    *
    * 
    * 
        REF:FUNC__FetchData__Weekview
            -> WHAT IS IT / WHAT DOES IT DO: 
                ---> Fetch data from server
    *
    *
    * 
    * 
    */
    /*const FUNC__FetchData__Weekview = () => {
        setWeekViewDataHasLoaded(false);
    }*/
    /*useEffect(() => {
        setTimeout(() => {
            setWeekViewDataHasLoaded(true);
        }, 5000);
    },[props.weekViewDataHasLoaded]);*/

    const FUNC__ReturnDay = (
        type,
        date,
        day
    ) => {
        let value = '';
        const dayDate = new Date(date.getFullYear(), date.getMonth(), day);
        if(type == 'title'){
            value = GLOBALFUNC__DayNames[dayDate.getDay()];
        } else {
            value = dayDate.getDate() + ' ' + GLOBALFUNC__MonthNames[dayDate.getMonth()];
        }
        return value;
    }
     /*
    *
    *
    * 
    * 
        REF:VIEW__DayviewIndicator
            -> WHAT IS IT / WHAT DOES IT DO: 
                ---> The view for the dayview current time indicator
    *
    *
    * 
    * 
    */
    function VIEW__DayviewIndicator(){
        // Function to create margin
        const FUNC__CalculateIndicatorMargin = () => {
            let dateNow = new Date();
            let starttimeNum = dateNow.getHours() * 3600 + dateNow.getMinutes() * 60 + 0;
            let endtimeNum = 24 * 3600 + 0 * 60 + 0;

            console.log((100 * starttimeNum / endtimeNum).toFixed(2));
            return (100 * starttimeNum / endtimeNum).toFixed(2) + "%";
        };

        // State to update margin
        const [indicatorMargin, setIndicatorMargin] = useState(FUNC__CalculateIndicatorMargin());

        // Interval to update margin after every minuut
        const FUNC__UpdateIndicatorMargin = () => {
            useEffect(() => {
                var timer = setInterval(() => {
                    setIndicatorMargin(FUNC__CalculateIndicatorMargin());
                }, 60 * 1000);
                return () => clearInterval(timer);
            }, []);
        };

        // Start update function on init
        FUNC__UpdateIndicatorMargin();

        // View
        return(
            <div className={globalStyles['now-indicator']} style={{left: "calc("+indicatorMargin+" - .5vw)"}}>
                <div className={globalStyles['top']}></div>
                <div className={globalStyles['line']}></div>
            </div>
        );
    }
    useEffect(() => {
        if (inView) {
            switch(currentView){
                case "dayview":
            
                    break;
                case "weekview":
                    if(props.weekviewDataHasLoaded
                        && !loadmoreWeekviewData){
                        setLoadmoreWeekviewData(true);
                        props.FUNC__LoadMoreWeekviewResourcePlanning(
                            props.organization_id,
                            props.setWeekviewObject,
                            props.weekviewObject,
                            props.week,
                            props.weekviewLastVisible,
                            props.setWeekviewLastVisible,
                            appContext.globalContext.authenticate.user.user_id,
                            appContext.globalContext.authenticate.user.role,
                            setLoadmoreWeekviewData
                        );
                    }
                    break;
            }
        }
      }, [inView])
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
        <section className={globalStyles['global-container']}>
            <div className={globalStyles['global-container__content']}>
                <div className={cn({
                    [globalStyles['global-border-column']]:props.globalBorderColumn,
                    [globalStyles['global-border-radius']]:true,
                    [globalStyles['content-body-with-header']]:true
                })}>
                    <div className={cn([
                        globalStyles['content-body-with-header__header'],
                        globalStyles['global-margin-top']
                    ])}>
                        <div className={globalStyles['global-schedule']}>
                            <VIEW__SectionHeader 
                                currentView={currentView}
                                setCurrentView={setCurrentView}
                                filterActive={filterActive}
                                filterKey={filterKey}
                                setFilterKey={setFilterKey}
                                filterValue={filterValue}
                                setFilterValue={setFilterValue}
                                dayviewObjectItemsTotal={props.dayviewObject.length}
                                //listviewObjectItemsTotal={listviewObject.length}
                                dayViewDataHasLoaded={dayViewDataHasLoaded}
                                FUNC__AddPlanning={FUNC__AddPlanning}
                                FUNC__Navigate__Dayview={FUNC__Navigate__Dayview}
                                FUNC__FetchData__Dayview={FUNC__FetchData__Dayview}
                                dayviewDate={dayviewDate}
                                setDayviewDate={setDayviewDate}
                                FUNC__Navigate__Weekview={FUNC__Navigate__Weekview}
                                weekviewDate={weekviewDate}
                                setWeekviewDate={setWeekviewDate}
                                FUNC__Navigate__Monthview={FUNC__Navigate__Monthview}
                                monthviewDate={monthviewDate}
                                setMonthviewDate={setMonthviewDate}
                                projectObj={GLOBALFUNC__GetCurrentProject(appContext)}

                                FUNC__ResetWeekView={FUNC__ResetWeekView}
                                organization_id={props.organization_id}
                                setWeekviewObject={props.setWeekviewObject}
                                weekviewObject={props.weekviewObject}
                                week={26}
                                weekviewLastVisible={props.weekviewLastVisible}
                                setWeekviewLastVisible={props.setWeekviewLastVisible}
                                setLoadmoreWeekviewData={setLoadmoreWeekviewData}/>
                        </div>
                    </div>
                    <div className={globalStyles['content-body-with-header__body']}>
                        <div className={globalStyles['global-schedule']}>
                            { 
                                currentView == "dayview"
                                && 
                                <div className={globalStyles['global-schedule__content-dayview']}> 
                                    <VIEW__SectionDayview 
                                        appContext={appContext}
                                        dayviewObject={props.dayviewObject}
                                        dayViewDataHasLoaded={dayViewDataHasLoaded}
                                        FUNC__AddPlanning={FUNC__AddPlanning}/>
                                </div>
                            }
                            {
                                currentView == "weekview"
                                && 
                                <div className={globalStyles['global-schedule__content-weekview']}>

                                    <VIEW__SectionWeekview 
                                        appContext={appContext}
                                        weekviewObject={props.weekviewObject}
                                        weekviewDataHasLoaded={props.weekviewDataHasLoaded}
                                        loadingMoreData={loadingMoreData}
                                        weekviewLastVisible={props.weekviewLastVisible}
                                        weekviewDate={weekviewDate}
                                        FUNC__ReturnDay={FUNC__ReturnDay}
                                        FUNC__AddPlanning={FUNC__AddPlanning}
                                        VIEW__DayviewIndicator={VIEW__DayviewIndicator}/>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
Schedule.getLayout = (page) => {
  return (
        <LayoutComponentLoggedinPage>
            <ProjectPageLayout>{page}</ProjectPageLayout>
        </LayoutComponentLoggedinPage>
    );
};

export default Schedule;