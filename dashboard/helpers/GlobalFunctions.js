// React / NextJs components
import { isEqual } from 'lodash';
import { 
    doc,
    getDoc,
    query,
    collection,
    where,
    orderBy,
    limit,
    onSnapshot,
    addDoc,
    Timestamp,
    deleteDoc
} from "firebase/firestore";
import { 
    ref, 
    uploadBytes,
    getDownloadURL,
    deleteObject
} from "firebase/storage";
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

    -> REF: Project related functions
        ---> REF: GLOBALFUNC__ReturnProjectStatus

    -> REF: Edit an object related functions
        ---> REF: GLOBALFUNC__EditObjectInArray
    
    -> REF: Validation related functions
        ---> REF: GLOBALFUNC__DifferenceBetweenObjects
        ---> REF: GLOBALFUNC__DifferenceInValuesBetweenObjects
        ---> REF: GLOBALFUNC__isWhitespaceString
            -----> Comment: Name doesn't make sense (anymore), need to change it
        ---> REF: GLOBALFUNC__ValidateEmail

    -> REF: Date related functions
        ---> REF: GLOBALFUNC__FormatDate
        ---> REF: GLOBALFUNC__DateRangeOverlaps
        ---> REF: GLOBALFUNC__MultipleDateRangeOverlaps
        ---> REF: GLOBALFUNC__CompareDates
        ---> REF: GLOBALFUNC__DayNames / GLOBALFUNC__MonthNames
        ---> REF: GLOBALFUNC__TimeAgo
        ---> REF: GLOBALFUNC__TranslateSecondsToDate
            -----> Comment: Name doesn't make sense (anymore), need to change it && Need to check if this a reduntant function
        ---> REF: GLOBALFUNC__AddZeroBeforeDateItem

    -> REF: Resource related functions
        ---> REF: GLOBALFUNC__GetUser
        ---> REF: GLOBALFUNC__TranslateUserStatus
        ---> REF: GLOBALFUNC__TranslateUserRole
        ---> REF: GLOBALFUNC__UserInitials

    -> REF: Analytics related functions
        ---> REF: GLOBALFUNC__CalculateWorkedHoursAnalyticsTotal
        ---> REF: GLOBALFUNC__CalculateProblemsAnalyticsTotal
        ---> REF: GLOBALFUNC__CalculateTasksAnalyticsTotal

    -> REF: Task related functions
        ---> REF: GLOBALFUNC__TranslateTasksStatus
        ---> REF: GLOBALFUNC__UploadFile
        ---> REF: GLOBALFUNC__UploadFile__AddFirestoreDocument
        ---> REF: GLOBALFUNC__DeleteFile
        ---> REF: GLOBALFUNC__DeleteFile__DeleteFirestoreDocument
        ---> REF: GLOBALFUNC__GetProject
        ---> REF: GLOBALFUNC__GetPhase
        ---> REF: GLOBALFUNC__GetTask

    -> REF: Activity related functions
        ---> REF: GLOBALFUNC__GetActivities
        ---> REF: GLOBALFUNC__ActivityType
        ---> REF: GLOBALFUNC__ActivityBody
        ---> REF: GLOBALFUNC__CreateActivity
        ---> REF: GLOBALFUNC__DateForActivity

    -> REF: Sidebar related functions
        ---> REF: GLOBALFUNC__SelectItemForSidebar
        ---> REF: GLOBALFUNC__CloseSidebar
        ---> REF: GLOBALFUNC__CloseExpandedSidebar
        ---> REF: GLOBALFUNC__HideExpandedSidebar
        ---> REF: GLOBALFUNC__AddOnSnapListenerToSidebar

    -> REF: Other uncategorised functions
        ---> REF: GLOBALFUNC__CalculatePercentage
        ---> REF: GLOBALFUNC__ShowOrHidePopup
        ---> REF: GLOBALFUNC__FormatNumberToLocale
        ---> REF: GLOBALFUNC__FormatBytes
        ---> REF: GLOBALFUNC__EditOrganizationBytes
        ---> REF: GLOBALFUNC__ErrorMessages

*/
/*
*
*
*
*
    REF: Project related functions
*
*
*
*
*/
/*
    REF: GLOBALFUNC__ReturnProjectStatus
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> 
*/
export const GLOBALFUNC__ReturnProjectStatus = (startdate, issues, tasks) => {
    // Step 1 -> Check if project has started first
    let currentDate = new Date();
    let projectStartDate = new Date(startdate.substring(6,10), startdate.substring(3,5), startdate.substring(0,2));
    // Step 1 -> Check if al tasks are completed
    if(GLOBALFUNC__CalculatePercentage(tasks.completed, tasks.items_total) == 100){
        return "Voltooid";
    }
    // Step 2 -> Check if startdate is already passed
    if(projectStartDate > currentDate){
        return "Open";
    }
    // Step 3 -> Check if there are issues
    if(issues > 0){
        return "Loopt risico";
    }
    // Step 4 -> Check if project is still in progress and there are no issues
    if(projectStartDate < currentDate && issues == 0 && GLOBALFUNC__CalculatePercentage(tasks.completed, tasks.total) < 100){
        return "Op schema";
    }
};
/*
*
*
*
*
    REF: Edit an object related functions
*
*
*
*
*/
/*
    REF: GLOBALFUNC__EditObjectInArray
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> 
*/
export const GLOBALFUNC__EditObjectInArray = (
    searchFilterKey,
    searchFilterValue,
    object,
    setObject,
    action,
    keysAndValues = null,
) => {
    let result = object.find(x => x[searchFilterKey] === searchFilterValue);
    if(result !== undefined){
        switch(action){
            case 'edit_key':
                keysAndValues.forEach((item) => {
                    result[item.key] = item.value
                });
                break;
            case 'increment_key':
                keysAndValues.forEach((item) => {
                    result[item.key] += item.value
                });
                console.log('key incrmented');
                break;
            case 'decrement_key':
                keysAndValues.forEach((item) => {
                    result[item.key] -= item.value
                });
                console.log('key decrmented');
                break;
            case 'replace':
                for (const key in keysAndValues) {
                    result[key] = keysAndValues[key];
                }
                break;
            case 'delete':
                object.splice(object.indexOf(result), 1);
                break;
        }
        setObject(object);
    }
}

/*
*
*
*
*
    REF: Validation related functions
*
*
*
*
*/
/*
    REF: GLOBALFUNC__DifferenceBetweenObjects
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> 
*/
export const GLOBALFUNC__DifferenceBetweenObjects = (object1, object2) => {
    const difference = Object.values(object1).filter((element) => !Object.values(object2).includes(element));
    return difference.length > 0 ? true : false;
}
/*
    REF: GLOBALFUNC__DifferenceInValuesBetweenObjects
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> 
*/
export const GLOBALFUNC__DifferenceInValuesBetweenObjects = (object1, object2, compareRef = false) => {
    return Object.keys(object1).reduce((result, key) => {
        if (!object2.hasOwnProperty(key)) {
            result.push(key);
        } else if (isEqual(object1[key], object2[key])) {
            const resultKeyIndex = result.indexOf(key);
            if (compareRef && object1[key] !== object2[key]) {
                result[resultKeyIndex] = `${key} (ref)`;
            } else {
                result.splice(resultKeyIndex, 1);
            }
        }
        return result;
    }, Object.keys(object2));
}
/*
    REF: GLOBALFUNC__isWhitespaceString
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> Check if string isn't empty
*/
export const GLOBALFUNC__isWhitespaceString = str => !str.toString().replace(/\s/g, '').length;
/*
    REF: GLOBALFUNC__ValidateEmail
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> 
*/
export const GLOBALFUNC__ValidateEmail = (value) => {
    let validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return value.match(validRegex)
}
/*
*
*
*
*
    REF: Date related functions
*
*
*
*
*/
/*
    REF: GLOBALFUNC__FormatDate
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> 
*/
export const GLOBALFUNC__FormatDate = (value, type) => {
    let newFormat = "";
    switch(type){
        case "toLocaleNL":
            let newDate = value.split("-");
            newFormat = `${newDate[2]}-${newDate[1]}-${newDate[0]}`;
            break;
    }
    return newFormat;
}  
/*
    REF: GLOBALFUNC__DateRangeOverlaps
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> Check if two dates overlap
*/
export const GLOBALFUNC__DateRangeOverlaps = (date1_start, date1_end, date2_start, date2_end) => {
    if (date1_start < date2_start && date2_start < date1_end) return true; 
    if (date1_start < date2_end && date2_end < date1_end) return true; 
    if (date2_start < date1_start && date1_end < date2_end) return true; 
    return false;
}
/*
    REF: GLOBALFUNC__MultipleDateRangeOverlaps
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> Check if multiple dates and times overlap
*/
export const GLOBALFUNC__MultipleDateRangeOverlaps = (dates) => {
    let timeIntervals = dates.filter(entry => entry.from != null && entry.to != null);
    if (timeIntervals && timeIntervals.length > 1){
        timeIntervals.forEach(time1 => {
            timeIntervals.forEach(time2 => {
                if (GLOBALFUNC__DateRangeOverlaps(
                        time1.from.getTime(), time1.to.getTime(),
                        time2.from.getTime(), time2.to.getTime()
                    )
                ) return true;
            });
        });
    }
    return false;
}
/*
    REF: GLOBALFUNC__CompareDates
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> Check if a date comes before another date
*/
export const GLOBALFUNC__CompareDates = (date1, date2, compareType) => {
    let value = false;
    switch(compareType){
        case "before":
            value = new Date(date1) < new Date(date2);
            break;
    }
    return value;
}
/*
    REF: GLOBALFUNC__DayNames / GLOBALFUNC__MonthNames
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> An array to return a specific month / day
*/
export const GLOBALFUNC__DayNames = [
    "zondag",
    "maandag",
    "dinsdag",
    "woensdag",
    "donderdag",
    "vrijdag",
    "zaterdag"
];
export const GLOBALFUNC__MonthNames = [
    "januari",
    "februari",
    "maart",
    "april",
    "mei",
    "juni",
    "juli",
    "augustus",
    "september",
    "oktober",
    "november",
    "december"
];
/*
    REF: GLOBALFUNC__TimeAgo
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> 
*/
export const GLOBALFUNC__TimeAgo = (
    date,
    showStandardDateFormat = false,
    showTime = false
) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    const years = Math.floor(seconds / 31536000);
    const months = Math.floor(seconds / 2628000);
    const days = Math.floor(seconds / 86400);

    if(!showStandardDateFormat){
        if (years > 1) {
            return `${years} jaren geleden`;
        }
        if (years === 1) {
            return `${years} jaar geleden`;
        }

        if (months > 1) {
            return `${months} maanden geleden`;
        }
        if (months === 1) {
            return `${months} maand geleden`;
        }

        if (days > 1) {
            return `${days} dagen geleden`;
        }
        if (days === 1) {
            return `${days} dag geleden`;
        }
    } else {
        let returnedDate = `${date.getDate()} ${GLOBALFUNC__MonthNames[date.getMonth()]} ${date.getFullYear()}`;
        if(showTime){
            returnedDate += `, ${date.toLocaleTimeString('nl-NL').substring(0, 2)}:${date.toLocaleTimeString('nl-NL').substring(3, 5)}`;
        }
        return returnedDate;
    }

    const hours = Math.floor(seconds / 3600);
    if (hours > 1) {
        return `${hours} uur geleden`;
    }
    if (hours === 1) {
        return `${hours} uur geleden`;
    }

    const minutes = Math.floor(seconds / 60);
    if (minutes > 1) {
        return `${minutes} minuten geleden`;
    }
    if (minutes === 1) {
        return `${minutes} minuut geleden`;
    }

    return "zonet";
}
/*
    REF: GLOBALFUNC__TranslateSecondsToDate
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> 
*/
export const GLOBALFUNC__TranslateSecondsToDate = (
    date,
    forDateInput = false,
    showMonthAsNumber = false,
    includeTime = false
) => {
    let formattedDate = '';
    if(forDateInput){
        formattedDate = `${date.getFullYear()}-${showMonthAsNumber ? GLOBALFUNC__AddZeroBeforeDateItem(date.getMonth() + 1) : GLOBALFUNC__MonthNames[date.getMonth()]}-${date.getDate()}`;
    } else {
        formattedDate = `${date.getDate()} ${showMonthAsNumber ? GLOBALFUNC__AddZeroBeforeDateItem(date.getMonth() + 1) : GLOBALFUNC__MonthNames[date.getMonth()]} ${date.getFullYear()}`;
    }
    if(includeTime){
        formattedDate = `${formattedDate}, ${date.getHours()}:${date.getMinutes()}`;
    }
    return formattedDate;
}
/*
    REF: GLOBALFUNC__AddZeroBeforeDateItem
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> Changes a date from 1-1-2025 to 01-01-2025
*/
export const GLOBALFUNC__AddZeroBeforeDateItem = (
    item
) => {
    return (`0${item}`).slice(-2);
}
/*
*
*
* 
* 
    REF:GLOBALFUNC__ReturnPhaseStatus
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> Return the status of a phase
*
*
* 
* 
*/
export const GLOBALFUNC__ReturnPhaseStatus = (item) => {
    let value = "";
    if(item.tasks.items_total > item.tasks.completed){
        if(item.tasks.items_total == item.tasks.open
            || item.tasks.items_total == item.tasks.unasigned){
            value = "Open";
        } else {
            value = "Nu bezig";
        }
    } else {
        if(item.tasks.items_total > 0){
            value = "Voltooid";
        } else {
            value = "Open";
        }
    }
    return value;
} 
/*
*
*
* 
* 
    REF:GLOBALFUNC__CalculateHoursBudgeted
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> Calculate hours in float between two times
*
*
* 
* 
*/
export const GLOBALFUNC__CalculateHoursBudgeted = (date, starttime, endtime) => {
    let dateObj = date.split("-");
    let starttimeObj = starttime.split(":");
    let endtimeObj = endtime.split(":");
    let dt1 = new Date(dateObj[2], dateObj[1], dateObj[0], starttimeObj[0], starttimeObj[1]);
    let dt2 = new Date(dateObj[2], dateObj[1], dateObj[0], endtimeObj[0], endtimeObj[1]);
    var diffMs = (dt2 - dt1);
    let diffHrs = Math.floor((diffMs % 86400000) / 3600000);
    let diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
    let diffHrsFloat = parseFloat(diffHrs);
    let diffMinsFLoat = parseFloat(diffMins/60);
    return (diffHrsFloat + diffMinsFLoat).toFixed(2);
}
/*
*
*
* 
* 
    REF:GLOBALFUNC__ReturnResourceForPost
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> Return [{user_id, type}] || [team]
*
*
* 
* 
*/
export const GLOBALFUNC__ReturnResourceForPost = (resources) => {
    let value = [];
    if(resources.length > 0){
        resources.forEach(resource => {
            value.push({
                type: resource.type,
                resource_id: resource.type === "member" ? resource.user_id : resource.team_id
            });
        });
    }
    return value;
}
/*
*
*
*
*
    REF: Resource related functions
*
*
*
*
*/
/*
    REF: GLOBALFUNC__GetUser
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> 
*/
export const GLOBALFUNC__GetUser = async (
    db,
    user_ids,
    get_full_data = false,
    include_leave_of_absence = false
  ) => {
    let promise = [];
    let users = [];

    user_ids.map(user_id => {
        const user = doc(
            db, 
            'users',
            user_id
        );
        promise.push(getDoc(user));
    });

    await Promise.all(promise)
    .then(data => {
        data.map(user => {
            let fetchedUser = null;
            if(!get_full_data){
                fetchedUser = {
                    user_id: user.id,
                    firstname: user.data().firstname,
                    lastname: user.data().lastname,
                    label: user.data().label,
                    role: user.data().role
                };
            } else {
                fetchedUser = {
                    user_id: user.id,
                    firstname: user.data().firstname,
                    lastname: user.data().lastname,
                    profile_photo: user.data().profile_photo,
                    email: user.data().email,
                    phonenumber: user.data().phonenumber,
                    status: !include_leave_of_absence ? user.data().status : "Leave_of_absence",
                    role: user.data().role,
                    label: user.data().label,
                    admin: user.data().admin,
                    manager_id: user.data().manager_id,
                    date_added: user.data().date_added,
                    resources_under_management: user.data().resources_under_management,
                    hourly_rate: user.data().hourly_rate,
                    hours_per_week: user.data().hours_per_week,
                    leave_of_absence: !include_leave_of_absence ? null : include_leave_of_absence
                }
            }
            users.push(fetchedUser);
        });
    });

    return users;
}
/*
    REF: GLOBALFUNC__TranslateUserStatus
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> 
*/
export const GLOBALFUNC__TranslateUserStatus = (value) => {
    const statusTypes = {
        Active: "Beschikbaar",
        Inactive: "Account niet geactiveerd",
        Leave_of_absence: "Verlof",
        Sick: "Ziek"
    };

    return statusTypes[value]; 
};
/*
    REF: GLOBALFUNC__TranslateUserRole
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> 
*/
export const GLOBALFUNC__TranslateUserRole = (
    value
) => {
    let roleTypes = {
        Admin: "Beheerder",
        Manager: "Manager",
        Member: "Medewerker"
    };

    return roleTypes[value];
};
/*
    REF: GLOBALFUNC__UserInitials
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> Returns the initials from a fullname
*/
export const GLOBALFUNC__UserInitials = (
    firstname,
    lastname,
    algoliaSearch = false
) => {
    let value = '';
    if(algoliaSearch){
        let name = firstname.split(' ');
        value = `${name[0].substring(0, 1)} ${name[name.length - 1].substring(0, 1)}`;
    } else {
        value = `${firstname.substring(0, 1)} ${lastname.substring(0, 1)}`;
    }
    return value;
}
/*
*
*
*
*
    REF: Analytics related functions
*
*
*
*
*/
/*
    REF: GLOBALFUNC__CalculateWorkedHoursAnalyticsTotal
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> 
*/
export const GLOBALFUNC__CalculateWorkedHoursAnalyticsTotal = (
    analytics
) => {
    let total = 0;
    if(analytics != undefined
        && analytics != null){
            if(analytics.not_filled != undefined){
                total += analytics.not_filled;
            }
            if(analytics.open != undefined){
                total += analytics.open;
            }
            if(analytics.rejected != undefined){
                total += analytics.rejected;
            }
            if(analytics.approved != undefined){
                total += analytics.approved;
            }
    }
    return total;
}
/*
    REF: GLOBALFUNC__CalculateProblemsAnalyticsTotal
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> 
*/
export const GLOBALFUNC__CalculateProblemsAnalyticsTotal = (
    analytics
) => {
    let total = 0;
    if(analytics.priority_high != undefined){
        total += analytics.priority_high;
    }
    if(analytics.priority_medium != undefined){
        total += analytics.priority_medium;
    }
    if(analytics.priority_low != undefined){
        total += analytics.priority_low;
    }
    return total;
}
/*
    REF: GLOBALFUNC__CalculateTasksAnalyticsTotal
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> 
*/
export const GLOBALFUNC__CalculateTasksAnalyticsTotal = (
    analytics
) => {
    let total = 0;
    if(analytics.unasigned != undefined){
        total += analytics.unasigned;
    }
    if(analytics.open != undefined){
        total += analytics.open;
    }
    if(analytics.in_progress != undefined){
        total += analytics.in_progress;
    }
    if(analytics.overdue != undefined){
        total += analytics.overdue;
    }
    if(analytics.stuck != undefined){
        total += analytics.stuck;
    }
    if(analytics.completed != undefined){
        total += analytics.completed;
    }
    return total;
}
/*
*
*
*
*
    REF: Task related functions
*
*
*
*
*/
/*
    REF: GLOBALFUNC__TranslateTasksStatus
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> 
*/
export const GLOBALFUNC__TranslateTasksStatus = (
    status
) => {
    const statusType = {
        unasigned: "Nog niet toegewezen",
        open: "Nog niet gestart",
        in_progress: "In behandeling",
        overdue: "Te laat",
        stuck: "Vastgelopen",
        completed: "Voltooid"
    };
    return statusType[status];
}
/*
    REF: GLOBALFUNC__UploadFile
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> 
*/
export const GLOBALFUNC__UploadFile = async (
    files,
    firebaseStorage,
    firebaseDb,
    path,
    organization_id,
    project_id = '',
    phase_id = '',
    task_id = ''
) => {
    let response = 'successfull';

    try {
        await Promise.all(
            files.map(file => {
                file['path'] = `${path}/${file.name}`;

                const fileRef = ref(
                    firebaseStorage, 
                    file.path
                );

                return Promise.all([
                    uploadBytes(
                        fileRef, 
                        file
                    )
                ]).then(data => {
                    file['getDownloadURLRef'] = data[0].ref;
                });
            })
        );

        await Promise.all(
            files.map(file => {
                return Promise.all([
                    getDownloadURL(file.getDownloadURLRef)
                ]).then(downloadURL => {
                    file['url'] = downloadURL;
                })
            })
        )

        response = await GLOBALFUNC__UploadFile__AddFirestoreDocument(
            files,
            firebaseDb,
            firebaseStorage,
            response,
            organization_id,
            project_id,
            phase_id,
            task_id
        );
    } catch (error) {
        response = 'error';
        console.log(error);
    }
    return response;
}
/*
    REF: GLOBALFUNC__UploadFile__AddFirestoreDocument
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> 
*/
const GLOBALFUNC__UploadFile__AddFirestoreDocument = async (
    files,
    db,
    firebaseStorage,
    response,
    organization_id,
    project_id = '',
    phase_id = '',
    task_id = ''
) => {
    try {
        await Promise.all(
            files.map(file => {
                const fileData = {
                    name: file.name,
                    url: file.url,
                    size: file.size,
                    organization_id: organization_id,
                    project_id: project_id,
                    phase_id: phase_id,
                    task_id: task_id,
                    path: file.path,
                    lastModified: file.lastModified,
                    date_added: Timestamp.fromDate(new Date())
                };

                return Promise.all([
                    addDoc(
                        collection(
                            db, 
                            'files'
                        ), 
                        fileData
                    )
                ]).then(data => {
                    file.file_id = data[0].id;
                });
            })
        );

        response = files;
    } catch(error) {
        response = 'error';
        GLOBALFUNC__DeleteFile(
            files,
            firebaseStorage
        );
        console.log(error);
    }
    
    return response;
}
/*
    REF: GLOBALFUNC__DeleteFile
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> 
*/
export const GLOBALFUNC__DeleteFile = async (
    files,
    firebaseStorage,
    db
) => {
    let response = 'successfull';
    let promises = [];

    try {
        files.map(file => {
            const fileRef = ref(
                firebaseStorage, 
                file.path
            );
            promises.push(deleteObject(fileRef));
        });

        await Promise.all(promises);

        response = await GLOBALFUNC__DeleteFile__DeleteFirestoreDocument(
            files,
            db,
            response
        );
    } catch(error) {
        console.log(error);
    }

    return;
}
/*
    REF: GLOBALFUNC__DeleteFile__DeleteFirestoreDocument
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> 
*/
const GLOBALFUNC__DeleteFile__DeleteFirestoreDocument = async (
    files,
    db,
    response
) => {
    let promises = [];

    try {
        files.map(file => {
            const deleteFile = deleteDoc(
                doc(
                    db,
                    'files',
                    file.file_id
                )
            )
            promises.push(deleteFile);
        });

        await Promise.all(promises);
    } catch(error) {
        response = 'error';
        console.log(error);
    }
    
    return response;
}
/*
    REF: GLOBALFUNC__GetProject
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> 
*/
export const GLOBALFUNC__GetProject = async (
    db,
    project_id
) => {
    const analyticsDoc = doc(
        db,
        'projects',
        project_id
    );
    return getDoc(analyticsDoc);
}
/*
    REF: GLOBALFUNC__GetPhase
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> 
*/
export const GLOBALFUNC__GetPhase = async (
    db,
    phase_id
) => {
    const analyticsDoc = doc(
        db,
        'phases',
        phase_id
    );
    return getDoc(analyticsDoc);
}
/*
    REF: GLOBALFUNC__GetTask
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> 
*/
export const GLOBALFUNC__GetTask = async (
    db,
    task_id
) => {
    const analyticsDoc = doc(
        db,
        'tasks',
        task_id
    );
    return getDoc(analyticsDoc);
}
/*
*
*
*
*
    REF: Activity related functions
*
*
*
*
*/
/*
    REF: GLOBALFUNC__GetActivities
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> 
*/
export const GLOBALFUNC__GetActivities = async (
    db,
    organization_id,
    setActivities,
    setActivitiesObjectLastVisible,
    setActivitiesHasLoaded,
    setMessages,
    setMessagesObjectLastVisible,
    setMessagesHasLoaded
) => {
    let activitiesCombined = [];
    let activities = [];
    let messages = [];
    const dateToday = new Date();
    const dateForActivity = `${dateToday.getDate()}-${dateToday.getMonth() + 1}-${dateToday.getFullYear()}`;
    
    let q = query(
        collection(
            db, 
            'activities'
        ),
        where('organization_id', '==', organization_id),
        where('date', '==', dateForActivity),
        orderBy('date_added', 'desc'),
        limit(20)
    );
    const unscubscribe = onSnapshot(q, async (querySnapshot) => {
        querySnapshot.docChanges().forEach((change) => {
            if(change.type === 'added'){
                console.log('new doc added');
                activitiesCombined.push({
                    activity_id: change.doc.id,
                    activity: change.doc.data().activity,
                    comment: change.doc.data().comment,
                    date_added: change.doc.data().date_added,
                    manager_id: change.doc.data().manager_id,
                    organization_id: change.doc.data().organization_id,
                    phase_id: change.doc.data().phase_id,
                    project_id: change.doc.data().project_id,
                    task_id: change.doc.data().task_id,
                    user_ids: change.doc.data().user_ids
                });
            }
        });

        if(activitiesCombined.length > 0){
            await Promise.all(
                activitiesCombined.map(activity => {
                    let promises = [];
                    if(activity.user_ids.length > 0){
                        promises.push(
                            GLOBALFUNC__GetUser(
                                db,
                                activity.user_ids
                            )
                        );
                    } else {
                        promises.push(
                            GLOBALFUNC__GetUser(
                                db,
                                [activity.manager_id]
                            )
                        );
                    }
                    if(activity.project_id != ''){
                        promises.push(
                            GLOBALFUNC__GetProject(
                                db,
                                activity.project_id
                            )
                        );
                    }
                    if(activity.phase_id != ''){
                        promises.push(
                            GLOBALFUNC__GetPhase(
                                db,
                                activity.phase_id
                            )
                        );
                    }
                    if(activity.task_id != ''){
                        promises.push(
                            GLOBALFUNC__GetTask(
                                db,
                                activity.task_id
                            )
                        );
                    }

                    return Promise.all(promises).then(data => {
                        activity['users'] = data[0];
                        activity['project'] = activity.project_id != '' ? data[1].data().name : null;
                        activity['phase'] = activity.project_id != '' ? data[2].data().name : null;
                        activity['task'] = activity.project_id != '' ? data[3].data().name : null;
                    });
                })
            );
            activitiesCombined.map(item => {
                if(item.activity == 'task_message_added'){
                    messages.push(item);
                    console.log('ysss');
                }
                if(item.activity != 'task_message_added'){
                    activities.push(item);
                }
            });

            setActivities(activities);
            if(activities.length > 0){
                setActivitiesObjectLastVisible(activities[activities.length - 1].date_added);
            } else {
                setActivitiesObjectLastVisible('end_has_been_reached');
            }

            setMessages(messages);
            if(messages.length > 0){
                setMessagesObjectLastVisible(messages[messages.length - 1].date_added);
            } else {
                setMessagesObjectLastVisible('end_has_been_reached');
            }
        }
    }, (error) => {
        console.log(error);
        /*setError({
            show: true,
            id: 'GET_DISCUSSION_ERROR',
            message: 'Oeps, er lijkt iets mis te gaan. Probeer het a.u.b. nog een keer of neem contact met ons op.'
        });*/
    });

    /*const sideBarOnSnapListeners = appContext.globalContext.sidebar.payload.onSnapListeners;
    sideBarOnSnapListeners.push(unscubscribe);
    GLOBALFUNC__AddOnSnapListenerToSidebar(
        appContext,
        sideBarOnSnapListeners
    );*/
    
    setActivitiesHasLoaded(true);
}
/*
    REF: GLOBALFUNC__ActivityType
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> Returns the corresponding view depending on the activity type
*/
export const GLOBALFUNC__ActivityType = (type) => {
    let viewTypes = {
        budget_almost_exhausted: "VIEW__Manager__Dashboard__Activity__Budget",
        budget_exhausted: "VIEW__Manager__Dashboard__Activity__Budget",
        budget_exceeded: "VIEW__Manager__Dashboard__Activity__Budget",
        budget_added: "VIEW__Manager__Dashboard__Activity__Budget",
        budget_deleted: "VIEW__Manager__Dashboard__Activity__Budget",

        // Problem related
        problem_added: "VIEW__Manager__Dashboard__Activity__ReportedAProblem",
        problem_statuschanged: "VIEW__Manager__Dashboard__Activity__ChangedProblemStatus",
        problem_deleted: "VIEW__Manager__Dashboard__Activity__DeletedAProblem",

        // Phase related
        phase_added: "VIEW__Manager__Dashboard__Activity__CreatedAPhase",
        phase_deleted: "VIEW__Manager__Dashboard__Activity__DeletedAPhase",
        phase_completed: "VIEW__Manager__Dashboard__Activity__FinishedAPhase",

        // Task related
        task_added: "VIEW__Manager__Dashboard__Activity__CreatedATask",
        task_deleted: "VIEW__Manager__Dashboard__Activity__DeletedATask",
        task_statuschanged: "VIEW__Manager__Dashboard__Activity__ChangedTaskStatus",
        task_overdue: "VIEW__Manager__Dashboard__Activity__TaskOverdue",
        task_stuck: "VIEW__Manager__Dashboard__Activity__StuckWithTask",
        task_completed: "VIEW__Manager__Dashboard__Activity__FinishedATask",

        // Document related
        document_added: "VIEW__Manager__Dashboard__Activity__Document",
        document_deleted: "VIEW__Manager__Dashboard__Activity__Document",

        // Team related
        team_added: "VIEW__Manager__Dashboard__Activity__Team",
        team_deleted: "VIEW__Manager__Dashboard__Activity__Team",
        member_added_to_team: "VIEW__Manager__Dashboard__Activity__TeamMember",
        member_removed_from_team: "VIEW__Manager__Dashboard__Activity__TeamMember",
    };

    return viewTypes[type];
}
/*
    REF: GLOBALFUNC__ActivityBody -> TODO
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> Returns the corresponding content depending on the activity type
*/
export const GLOBALFUNC__ActivityBody = (activity) => {
    let body = "";
    
    return body;
};
/*
    REF: GLOBALFUNC__CreateActivity
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> 
*/
export const GLOBALFUNC__CreateActivity = async (
    db,
    dateForActivity,
    activity,
    organization_id,
    manager_id,
    user_ids,
    phase_id,
    project_id,
    task_id,
    comment
) => {
    const docData = {
        activity: activity,
        date: dateForActivity,
        date_added: Timestamp.fromDate(new Date()),
        organization_id: organization_id,
        manager_id: manager_id,
        phase_id: phase_id,
        project_id: project_id,
        task_id: task_id,
        user_ids: user_ids,
        comment: comment
    };

    await addDoc(
        collection(
          db, 
          'activities'
        ), 
        docData
    );
    return;
}
/*
    REF: GLOBALFUNC__DateForActivity
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> 
*/
export const GLOBALFUNC__DateForActivity = () => {
    const dateToday = new Date();
    return `${dateToday.getDate()}-${dateToday.getMonth() + 1}-${dateToday.getFullYear()}`;
}
/*
*
*
*
*
    REF: Sidebar related functions
*
*
*
*
*/
/*
    REF: GLOBALFUNC__SelectItemForSidebar
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> Open the sidebar to view something
*/
export const GLOBALFUNC__SelectItemForSidebar = (
    appContext, 
    id, 
    direction, 
    payload
) => {
    appContext.setGlobalContext({
        ...appContext.globalContext,
        sidebar: {
            show: 1,
            direction: direction,
            selectedItemID: id,
            payload: payload,
            showHeaderButton: null
        }
    });
}
export const GLOBALFUNC__SelectItemForSidebarExpanded = (appContext, headerType, headerAction, id, direction, payload) => {
    appContext.setGlobalContext({
        ...appContext.globalContext,
        sidebarExpanded: {
            show: 1,
            direction: direction,
            headerType: headerType,
            headerAction: headerAction,
            selectedItemID: id,
            payload: payload
        }
    });
}
export const GLOBALFUNC__SelectItemForSidebarBoth = (appContext, sidebar, sidebarExpanded) => {
    appContext.setGlobalContext({
        ...appContext.globalContext,
        sidebar: {
            show: 1,
            direction: sidebar.direction,
            selectedItemID: sidebar.id,
            payload: sidebar.payload,
            showHeaderButton: null
        },
        sidebarExpanded: {
            show: 1,
            direction: sidebarExpanded.direction,
            headerType: sidebarExpanded.headerType,
            headerAction: sidebarExpanded.headerAction,
            selectedItemID: sidebarExpanded.id,
            payload: sidebarExpanded.payload
        }
    });
}
/*
    REF: GLOBALFUNC__CloseSidebar
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> 
*/
export const GLOBALFUNC__CloseSidebar = (appContext, deleteProject) => {
    if(appContext.globalContext.sidebar.payload.onSnapListeners != undefined
        && appContext.globalContext.sidebar.payload.onSnapListeners.length > 0){
            appContext.globalContext.sidebar.payload.onSnapListeners.map(listener => {
                listener();
            });
        }
    appContext.setGlobalContext({
        ...appContext.globalContext,
        sidebar: {
            show: 0,
            direction: null,
            selectedItemID: null,
            payload: null,
            showHeaderButton: null
        },
        sidebarExpanded: {
            show: 0,
            direction: null,
            headerType: null,
            headerAction: null,
            selectedItemID: null,
            payload: null
        }
    });
}
/*
    REF: GLOBALFUNC__CloseExpandedSidebar
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> Close the expanded sidebar
*/
export const GLOBALFUNC__CloseExpandedSidebar = (appContext, deleteProject) => {
    appContext.setGlobalContext({
        ...appContext.globalContext,
        sidebarExpanded: {
            show: 0,
            direction: null,
            headerType: null,
            headerAction: null,
            selectedItemID: null,
            payload: null
        }
    });
}
/*
    REF: GLOBALFUNC__HideExpandedSidebar
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> Hide the expandedSidebar but preserve payload
*/
export const GLOBALFUNC__HideExpandedSidebar = (appContext) => {
    appContext.setGlobalContext({
        ...appContext.globalContext,
        sidebarExpanded: {
            ...appContext.globalContext.sidebarExpanded,
            direction: null,
            headerType: null,
            selectedItemID: null,
            show: 0
        }
    });
}
/*
    REF: GLOBALFUNC__AddOnSnapListenerToSidebar
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> Add firebase / firestore onSnap listeners to the payload of the sidebar
*/
export const GLOBALFUNC__AddOnSnapListenerToSidebar = (
    appContext,
    sideBarOnSnapListeners
) => {
    appContext.setGlobalContext({
        ...appContext.globalContext,
        sidebar: {
            ...appContext.globalContext.sidebar,
            payload: {
                ...appContext.globalContext.sidebar.payload,
                onSnapListeners: sideBarOnSnapListeners
            }
        }
    });
}































/*
*
*
* 
* 
    REF:GLOBALFUNC__POSTREQUEST
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> 
*
*
* 
* 
*/
export async function GLOBALFUNC__POSTREQUEST(
    url, 
    data,
    header = 'application/json'
){
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': header,
            },
            body: JSON.stringify(data),
        });
        return await response.json();
    } catch (error) {
        console.log(error)
    }
}

/*
*
*
*
*
    REF: Other uncategorised functions
*
*
*
*
*/
/*
    REF: GLOBALFUNC__CalculatePercentage
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> 
*/
export const GLOBALFUNC__CalculatePercentage = (item, total) => {
    return item > 0 ? Math.round((item / total) * 100) : 0;
};
/*
    REF: GLOBALFUNC__ShowOrHidePopup
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> Show or hide a hovering message
*/
export const GLOBALFUNC__ShowOrHidePopup = (
    appContext,
    action,
    message = ''
) => {
    appContext.setGlobalContext({
        ...appContext.globalContext,
        popup: {
            show: action,
            message: message
        }
    });
}
/*
    REF: GLOBALFUNC__FormatNumberToLocale
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> Format a number with comma's and dots
*/
export const GLOBALFUNC__FormatNumberToLocale = (value) => {
    const options = {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    };
    return value.toLocaleString('nl-NL', options); 
}
/*
*
*
* 
* 
    REF:GLOBALFUNC__FormatBytes
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> Format bytes to mb
*
*
* 
* 
*/
/*
    REF: GLOBALFUNC__FormatBytes
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> 
*/
export const GLOBALFUNC__FormatBytes = (
    bytes,
    decimals = 2
) => {
    if (!+bytes) return '0 Bytes'

    const refernceSize = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(refernceSize))

    return `${parseFloat((bytes / Math.pow(refernceSize, i)).toFixed(dm))} ${sizes[i]}`
}
/*
    REF: GLOBALFUNC__EditOrganizationBytes
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> Edit organization file storage object
*/
export const GLOBALFUNC__EditOrganizationBytes = (
    appContext,
    bytes
) => {
    console.log(bytes);
    appContext.setGlobalContext({
        ...appContext.globalContext,
        authenticate: {
            ...appContext.globalContext.authenticate,
            organization: {
                ...appContext.globalContext.authenticate.organization,
                file_storage: {
                    ...appContext.globalContext.authenticate.organization.file_storage,
                    used: appContext.globalContext.authenticate.organization.file_storage.used = bytes
                }
            }
        }
    });
}
/*
    REF: GLOBALFUNC__ErrorMessages
        -> WHAT IS IT / WHAT DOES IT DO: 
            ---> Return an error message depending on the error type
*/
export const GLOBALFUNC__ErrorMessages = (type) => {
    let value = "";
    switch(type){
        default:
            value = "Oeps, er is iets misgegaan. Probeer het a.u.b. opnieuw of neem contact met ons op."
            break;
    }
    return value;
}