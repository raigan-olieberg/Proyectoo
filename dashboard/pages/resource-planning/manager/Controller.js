// Global / Page / Layout components
import { 
    GLOBALFUNC__POSTREQUEST,
    GLOBALFUNC__SelectItemForSidebar,
    GLOBALFUNC__DayNames,
    GLOBALFUNC__MonthNames,
    GLOBALFUNC__TranslateSecondsToDate
} from '../../../helpers/GlobalFunctions';

export const FUNC__GetDayviewResourcePlanning = async (
    organization_id,
    setDayviewObject,
    setDataHasLoaded,
    day,
    lastVisible,
    setLastVisible,
    manager_id,
    loggedin_user_role
) => {
    let APIUrl = '';
    if(loggedin_user_role == 'Admin'){
        APIUrl = 'http://localhost:6001/api/admin/resource-planning/get-dayview'
    } else {
        APIUrl = 'http://localhost:6001/api/manager/resource-planning/get-dayview'
    }
    const result = await GLOBALFUNC__POSTREQUEST(
        APIUrl,
        {
            organization_id: organization_id,
            day: day,
            organization_id: organization_id,
            last_visible: lastVisible,
            manager_id: manager_id
        }
    );
    console.log(result);
    if(result.response == 'successfull'){
        if(result.message.planning){
            setDayviewObject(result.message.planning);
        } else {
            setDayviewObject([]);
        }
        setLastVisible(result.message.last_visible);
    } else {
        /*etErrorMessage({
            field_id: "user-empty",
            message: "Oeps, er gaat iets mis. Probeer het a.u.b. nog een keer of neem contact met ons op."
        });*/
    }
    setDataHasLoaded(true);
}

export const FUNC__GetWeekviewResourcePlanning = async (
    organization_id,
    setWeekviewObject,
    weekviewObject,
    setDataHasLoaded,
    week,
    lastVisible,
    setLastVisible,
    manager_id,
    loggedin_user_role
) => {
    console.log(week);
    let APIUrl = '';
    if(loggedin_user_role == 'Admin'){
        APIUrl = 'http://localhost:6001/api/admin/resource-planning/get-weekview'
    } else {
        APIUrl = 'http://localhost:6001/api/manager/resource-planning/get-weekview'
    }
    const result = await GLOBALFUNC__POSTREQUEST(
        APIUrl,
        {
            organization_id: organization_id,
            week: week,
            organization_id: organization_id,
            last_visible: lastVisible,
            manager_id: manager_id
        }
    );
    console.log(result);
    if(result.response == 'successfull'){
        if(result.message.planning){
            FUNC__GroupWeekviewObject(
                weekviewObject,
                setWeekviewObject,
                result.message.planning
            );
        } else {
            setWeekviewObject([]);
        }
        setLastVisible(result.message.last_visible);
    } else {
        /*etErrorMessage({
            field_id: "user-empty",
            message: "Oeps, er gaat iets mis. Probeer het a.u.b. nog een keer of neem contact met ons op."
        });*/
    }
    setDataHasLoaded(true);
}

export const FUNC__LoadMoreWeekviewResourcePlanning = async (
    organization_id,
    setWeekviewObject,
    weekviewObject,
    week,
    lastVisible,
    setLastVisible,
    manager_id,
    loggedin_user_role,
    setLoadmoreWeekviewData
) => {
    console.log('FUNC__LoadMoreWeekviewResourcePlanning executed');

    let APIUrl = '';
    if(loggedin_user_role == 'Admin'){
        APIUrl = 'http://localhost:6001/api/admin/resource-planning/get-weekview'
    } else {
        APIUrl = 'http://localhost:6001/api/manager/resource-planning/get-weekview'
    }
    const result = await GLOBALFUNC__POSTREQUEST(
        APIUrl,
        {
            organization_id: organization_id,
            week: week,
            organization_id: organization_id,
            last_visible: lastVisible,
            manager_id: manager_id
        }
    );
    console.log(result);
    if(result.response == 'successfull'){
        if(result.message.planning){
            FUNC__GroupWeekviewObject(
                weekviewObject,
                setWeekviewObject,
                result.message.planning,
                setLoadmoreWeekviewData
            );
        }
        setLastVisible(result.message.last_visible);
    } else {
        /*etErrorMessage({
            field_id: "user-empty",
            message: "Oeps, er gaat iets mis. Probeer het a.u.b. nog een keer of neem contact met ons op."
        });*/
    }
}

const FUNC__GroupWeekviewObject = (
    weekviewObject,
    setWeekviewObject,
    object,
    setLoadmoreWeekviewData = null
) => {
    const newWeekviewObject = [...weekviewObject];
    object.map(item => {
        if(newWeekviewObject[0] == undefined){
            newWeekviewObject.push(
                Object.groupBy(object, ({ day }) => day)
            );
        } else {
            if(newWeekviewObject[0][item.day] == undefined){
                newWeekviewObject[0][item.day] = [];
                newWeekviewObject[0][item.day].push(
                    item
                );
            } else {
                if(!newWeekviewObject[0][item.day].find(x => x.planning_id === item.planning_id)){
                    newWeekviewObject[0][item.day].push(
                        item
                    );
                }
            }
        }
    });
    setWeekviewObject(newWeekviewObject); 
    if(setLoadmoreWeekviewData){ 
        setLoadmoreWeekviewData(false);  
    }
}

export const FUNC__ReturnDay = (
    type,
    date,
    day
) => {
    let value = '';
    const dayDate = new Date(date.getFullYear(), date.getMonth(), day);
    if(type == 'title'){
        value = GLOBALFUNC__DayNames[dayDate.getDay()];
    } else {
        value = `${dayDate.getDate()} ${GLOBALFUNC__MonthNames[dayDate.getMonth()]}`;
    }
    return value;
}

export const VIEW__DayviewIndicator = () => {
    // Function to create margin
    const FUNC__CalculateIndicatorMargin = () => {
        let dateNow = new Date();
        let starttimeNum = dateNow.getHours() * 3600 + dateNow.getMinutes() * 60 + 0;
        let endtimeNum = 24 * 3600 + 0 * 60 + 0;

        console.log((100 * starttimeNum / endtimeNum).toFixed(2));
        return `${(100 * starttimeNum / endtimeNum).toFixed(2)}%`;
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
        <div className={globalStyles['now-indicator']} style={{left: `calc(${indicatorMargin} - .5vw)`}}>
            <div className={globalStyles['top']}></div>
            <div className={globalStyles['line']}></div>
        </div>
    );
}

export const FUNC__Navigate__Dayview = (
    direction,
    dayviewDate,
    setDayviewDate,
    setHeaderDate,
    FUNC__SetHeaderDate,
    addDays,
    subDays,
    setDate,
    FUNC__UpdateProject
) => {
    let tempDate = dayviewDate;
    /* Step 1: Change date */
    if(direction == "forward"){
        tempDate = addDays(tempDate, 1);
    } else if(direction == "backward") {
        tempDate = subDays(tempDate, 1);
    } else {
        tempDate = setDate(new Date(), new Date().getDate());
    }
    setDayviewDate(tempDate);
    /* Step 2: Change headerstring */
    setHeaderDate(FUNC__SetHeaderDate(tempDate, "dayview"));
    /* Step 3: Update project */
    FUNC__UpdateProject(tempDate, "dayview");
}

export const FUNC__Navigate__Monthview = (
    direction,
    monthviewDate,
    setMonthviewDate,
    setHeaderDate,
    FUNC__SetHeaderDate,
    addMonths,
    subMonths,
    setMonth,
    FUNC__UpdateProject
) => {
    let tempDate = monthviewDate;
    /* Step 1: Change date */
    if(direction == "forward"){
        tempDate = addMonths(tempDate, 1);
    } else if(direction == "backward") {
        tempDate = subMonths(tempDate, 1);
    } else {
        tempDate = setMonth(new Date(), new Date().getMonth());
    }
    setMonthviewDate(tempDate);
    /* Step 2: Change headerstring */
    setHeaderDate(FUNC__SetHeaderDate(tempDate, "monthview"));
}

export const FUNC__Navigate__Weekview = (
    direction,
    weekviewDate,
    setWeekviewDate,
    setHeaderDate,
    FUNC__SetHeaderDate,
    addWeeks,
    getWeek,
    subWeeks,
    setWeek,
    FUNC__PresetGetWeekviewResourcePlanning
) => {
    let tempDate = weekviewDate;
    /* Step 1: Change date */
    if(direction == "forward"){
        tempDate = addWeeks(tempDate, 1);
    } else if(direction == "backward") {
        tempDate = subWeeks(tempDate, 1);
    } else {
        tempDate = setWeek(new Date(), getWeek(new Date()));
    }
    setWeekviewDate(tempDate);
    /* Step 2: Change headerstring */
    setHeaderDate(FUNC__SetHeaderDate(tempDate, "weekview"));
}

export const FUNC__EditPlanning = (
    appContext,
    dayviewObject,
    setDayviewObject,
    planning
) => {
    GLOBALFUNC__SelectItemForSidebar(
        appContext, 
        null, 
        "right", 
        {
            page: 'resource-planning/manager/edit', 
            title: 'Planning inzien / aanpassen',
            data: {
                dayviewObject: dayviewObject,
                setDayviewObject: setDayviewObject,
                planning: planning
            }
        }
    );
}

export const FUNC__FormattedItem = (
    itemObject
) => {
    itemObject['formatted_date'] = GLOBALFUNC__TranslateSecondsToDate(
        new Date(itemObject.date.seconds * 1000),
        true,
        true
    );
    return itemObject;
}