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
    FUNC__LoadMoreWeekviewResourcePlanning
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
    /* Step 3: Update project */
    FUNC__LoadMoreWeekviewResourcePlanning;
    //FUNC__UpdateProject(tempDate, "weekview")
}