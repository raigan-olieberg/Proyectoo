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