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
    /* Step 3: Update project */
    FUNC__UpdateProject(tempDate, "monthview")
}