import { 
    GLOBALFUNC__CloseSidebar,
    GLOBALFUNC__POSTREQUEST,
    GLOBALFUNC__EditObjectInArray,
    GLOBALFUNC__TranslateSecondsToDate,
    GLOBALFUNC__GetUser,
    GLOBALFUNC__AddOnSnapListenerToSidebar,
    GLOBALFUNC__DifferenceBetweenObjects,
    GLOBALFUNC__UploadFile,
    GLOBALFUNC__DeleteFile,
    GLOBALFUNC__CreateActivity,
    GLOBALFUNC__DateForActivity
} from "../../../../helpers/GlobalFunctions";
import {  
    collection,
    onSnapshot,
    query,
    orderBy,
    limit,
    addDoc,
    Timestamp,
    startAfter,
    getDocs
} from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";

export const FUNC__GetDiscussion = async (
    task_id,
    db,
    setChatHasLoaded,
    setChatObject,
    appContext,
    setChatObjectLastVisible,
    setError,
    setNewMessageAdded
  ) => {
    let messages = [];
    let count = 0;
    let q = query(
        collection(
            db, 
            'tasks', 
            task_id,
            'discussions'
        ),
        orderBy('date_added', 'desc'),
        limit(40)
    );
    const unscubscribe = onSnapshot(q, async (querySnapshot) => {
        count++;
        querySnapshot.docChanges().forEach((change) => {
            console.log(change);
            if(change.type === 'added'){
                console.log('new doc added');
                messages.push({
                    message_id: change.doc.id,
                    date_added: change.doc.data().date_added,
                    message: change.doc.data().message,
                    user_id: change.doc.data().user_id
                });
            }
        });
        if(count === 1){
            messages = messages.reverse();
        }
        if(messages.length > 0){
            await Promise.all(
                messages.map(message => {
                    if(appContext.globalContext.authenticate.user.user_id != message.user_id){
                        return Promise.all([
                            GLOBALFUNC__GetUser(
                                db,
                                [message.user_id]
                            )
                        ]).then(data => {
                            message['user'] = data[0];
                        });
                    }
                })
            );
            setChatObject(messages);
            if(messages.length > 0){
                setChatObjectLastVisible(messages[0].date_added);
            } else {
                setChatObjectLastVisible('end_has_been_reached');
            }
        }

        setNewMessageAdded(count);
    }, (error) => {
        setError({
            show: true,
            id: 'GET_DISCUSSION_ERROR',
            message: 'Oeps, er gaat iets mis met het ophalen van de bijbehorende berichten. Probeer het a.u.b. nog een keer of neem contact met ons op.'
        });
    });

    const sideBarOnSnapListeners = appContext.globalContext.sidebar.payload.onSnapListeners;
    sideBarOnSnapListeners.push(unscubscribe);
    GLOBALFUNC__AddOnSnapListenerToSidebar(
        appContext,
        sideBarOnSnapListeners
    );
    
    setChatHasLoaded(true);
};

export const FUNC__LoadMoreDiscussion = async (
    task_id,
    db,
    chatObject,
    setChatObject,
    user_id,
    chatObjectLastVisible,
    setChatObjectLastVisible,
    setCurrentlyLoadingMoreChatData,
    setError
  ) => {
    let messages = [];

    try {
        console.log('FUNC__GetDiscussion executed');

        let q = query(
            collection(
                db, 
                'tasks', 
                task_id,
                'discussions'
            ),
            orderBy('date_added', 'desc'),
            startAfter(Timestamp.fromMillis(chatObjectLastVisible.seconds * 1000)),
            limit(40)
        );

        const querySnapshot = await getDocs(q);
        if(!querySnapshot.empty){
            querySnapshot.forEach((doc) => {
                messages.push({
                    ...doc.data(),
                    message_id: doc.id,
                    date_added: doc.data().date_added,
                    message: doc.data().message,
                    user_id: doc.data().user_id
                });
            });

            await Promise.all(
                messages.map(message => {
                    if(user_id != message.user_id){
                        return Promise.all([
                            GLOBALFUNC__GetUser(
                                db,
                                [message.user_id]
                            )
                        ]).then(data => {
                            message['user'] = data[0];
                        });
                    }
                })
            );
            

            const newChatObject = [...chatObject];
            messages.map(item => {
                newChatObject.unshift(item);
            });
            setChatObject(newChatObject);

            if(messages.length == 40){
                setChatObjectLastVisible(messages[messages.length - 1].date_added);
            } else {
                setChatObjectLastVisible('end_has_been_reached');
            }
        }
    } catch(error) {
        setError({
            show: true,
            id: 'GET_DISCUSSION_ERROR',
            message: 'Oeps, er gaat iets mis met het ophalen van de bijbehorende berichten. Probeer het a.u.b. nog een keer of neem contact met ons op.'
        });
    }
    setCurrentlyLoadingMoreChatData(false);
};

export const FUNC__AddMessageToDiscussion = async (
    task_id,
    db,
    message,
    user_id,
    setChatInput,
    setError,
    itemObject,
    organization_id
) => {
    try {
        const data = {
            message: message,
            user_id: user_id,
            date_added: Timestamp.fromDate(new Date())
        };

        await addDoc (
            collection(
                db, 
                'tasks', 
                task_id,
                'discussions'
            ), 
            data
        );

        setChatInput('');

        FUNC__CreateMessageActivity(
            itemObject,
            user_id,
            organization_id,
            message
        );
        
        return;
    } catch(error) {
        setError({
            show: true,
            id: 'ADD_MESSAGE_ERROR',
            message: 'Oeps, er gaat iets mis met het versturen van jouw bericht. Probeer het a.u.b. nog een keer of neem contact met ons op.'
        });
    };
}

const FUNC__CreateMessageActivity = async (
    itemObject,
    user_id,
    organization_id,
    message
) => {
    const APIUrl = 'http://localhost:6001/api/task/add-message-activity';
    const dateToday = new Date();
    const dateForActivity = `${dateToday.getDate()}-${(dateToday.getMonth() + 1)}-${dateToday.getFullYear()}`;

    const result = await GLOBALFUNC__POSTREQUEST(
        APIUrl,
        {
            organization_id: organization_id,
            manager_id: itemObject.manager_id,
            user_id: user_id,
            phase_id: itemObject.phase_id,
            project_id: itemObject.project_id,
            task_id: itemObject.task_id,
            message: message,
            dateForActivity: dateForActivity
        }
    );
    return;
}

export const FUNC__OnKeyDown = async (
    e,
    setChatInput,
    task_id,
    db,
    message,
    user_id,
    setError,
    itemObject,
    organization_id
) => {
    if(e.key == 'Enter'){
        FUNC__AddMessageToDiscussion(
            task_id,
            db,
            message,
            user_id,
            setChatInput,
            setError,
            itemObject,
            organization_id
        );
    }
}

export const FUNC__CreateObject = (
    itemObject,
    setItemObject,
    key, 
    value, 
    upperCase,
    action=null
) => {
    let upperCaseValue = key != 'status' ? value.charAt(0).toUpperCase() + value.slice(1) : value;
    let hasBrackets = key.match(/\[(.*?)\]/);
    if(hasBrackets){
        let parent = key.split("[")[0];
        let child = hasBrackets[1];
        setItemObject({
            ...itemObject,
            [parent]: {
                ...itemObject[parent],
                [child]: upperCaseValue
            }
        });
    } else {
        setItemObject({
            ...itemObject,
            [key]: upperCase ? upperCaseValue : value
        });
    }
}

export const FUNC__EditObject__SendObjectToServer = async (
    appContext,
    itemObject,
    oldItemObject,
    tasksObject,
    setTasksObject,
    setDataIsLoading,
    setError,
    setEditField,
    loggedin_user_id,
    itemObjectFiles,
    addedItemObjectFiles,
    deletedItemObjectFiles,
    firebaseStorage,
    firebaseDb
) => {
    setDataIsLoading(true);
    setEditField('');
    let filesPromises = [];
    let continueFileHandling = true;
    let success = true;
    let thereIsAdifferenceBetweenObjects = false;
    const newItemObject = {...itemObject};
    const dateToday = new Date();
    const dateTodayStr = `${dateToday.getFullYear()}-${(dateToday.getMonth() + 1)}-${dateToday.getDate()}`;
    const dateForActivity = `${dateToday.getDate()}-${(dateToday.getMonth() + 1)}-${dateToday.getFullYear()}`;

    /*
        If the object (not files part) has not changed
            -> then send updated data to backend
    */
    if(GLOBALFUNC__DifferenceBetweenObjects(itemObject, oldItemObject)){
        thereIsAdifferenceBetweenObjects = true;

        const result = await GLOBALFUNC__POSTREQUEST(
            'http://localhost:6001/api/manager/task/update-task',
            {
                task: itemObject,
                dateForActivity: dateForActivity,
                organization_id: appContext.globalContext.authenticate.user.organization_id,
                old_status: oldItemObject.status,
                old_name: oldItemObject.name,
                old_deadline: oldItemObject.formatted_deadline,
                old_hours_budgeted: oldItemObject.hours_budgeted,
                new_deadline_translated: GLOBALFUNC__TranslateSecondsToDate(
                    new Date(itemObject.formatted_deadline),
                    false,
                    false
                ),
                old_deadline_translated: GLOBALFUNC__TranslateSecondsToDate(
                    new Date(oldItemObject.formatted_deadline),
                    false,
                    false
                ),
                date_today: dateTodayStr,
                user_id: loggedin_user_id,
                added_item_object_files: addedItemObjectFiles,
                deleted_item_object_files: deletedItemObjectFiles
            }
        );
        console.log(result);
        if(result.response == 'successfull'){
            newItemObject.status = newItemObject.original_status;
            newItemObject.deadline = result.message;
        } else if(result.response == 'unsuccessfull') {
            switch(result.message){
                case 'date_before_today':
                    setError({
                        show: true,
                        id: 'API_ERROR',
                        message: 'De deadline datum moet later zijn dan vandaag.'
                    });
                    break;
                case 'name_already_exists':
                    setError({
                        show: true,
                        id: 'API_ERROR',
                        message: 'Deze taaknaam bestaat al binnen dit project.'
                    });
                    break;
                default:
                    setError({
                        show: true,
                        id: 'API_ERROR',
                        message: 'Oeps, er gaat iets mis met het aanpassen van deze taak. Probeer het a.u.b. nog een keer of neem contact met ons op.'
                    });
            }
            continueFileHandling = false;
            success = false;
            setDataIsLoading(false);
        }
    }

    // Push files to be added files to a promise
    if(continueFileHandling
        && addedItemObjectFiles.length > 0){
        const filePath = `organizations/ \
                ${appContext.globalContext.authenticate.user.organization_id} \
                /projects/ \
                ${itemObject.project_id} \
                /phases/ \
                ${itemObject.phase_id} \
                /tasks/ \
                ${itemObject.task_id}`;
                
        const uploadFile = GLOBALFUNC__UploadFile(
            addedItemObjectFiles,
            firebaseStorage,
            firebaseDb,
            filePath,
            appContext.globalContext.authenticate.user.organization_id,
            itemObject.project_id ,
            itemObject.phase_id,
            itemObject.task_id
        );

        filesPromises.push(uploadFile);
    }

    // Push files to delete files to a promise
    if(continueFileHandling
        && deletedItemObjectFiles.length > 0){
        const deleteFile = GLOBALFUNC__DeleteFile(
            deletedItemObjectFiles,
            firebaseStorage,
            firebaseDb
        );

        filesPromises.push(deleteFile);
    }

    // Execute the promise
    if(filesPromises.length > 0){
        await Promise.all(filesPromises).then(responses => {
            responses.map(response => {
                if(response == 'error'){
                    success = false;
                    setError({
                        show: true,
                        id: 'API_ERROR',
                        message: 'Oeps, er gaat iets mis met het toevoegen en/of verwijderen van de bijlages. Probeer het a.u.b. nog een keer of neem contact met ons op.'
                    });
                }
            });
            if(success
                && responses[0] != 'error'){
                newItemObject.files = responses[0];
            }
        });
    }

    // Update cached object and close the sidebar
    if(success){
        if(setTasksObject){
            GLOBALFUNC__EditObjectInArray(
                'task_id',
                itemObject.task_id,
                tasksObject,
                setTasksObject,
                'replace',
                newItemObject,
            );
        }

        /*
            If the object (not files part) has not changed
                -> then create an activity here
                    -> otherwise, it wil be created on the backend via /Proyectoo/dev/backend/Controllers/manager/tasksController.js in updateTaskForManager() 
        */
        if(!thereIsAdifferenceBetweenObjects){
            let activityObject = {}; 

            if(addedItemObjectFiles.length > 0){
                activityObject['files_added'] = [];
                addedItemObjectFiles.map(file => {
                    console.log(file);
                    console.log(file.name);
                    console.log(activityObject.files_added);
                    activityObject.files_added.push(file.name);
                });
            }

            if(deletedItemObjectFiles.length > 0){
                activityObject['files_deleted'] = [];
                deletedItemObjectFiles.map(file => {
                    activityObject.files_deleted.push(file.name);
                });
            }

            GLOBALFUNC__CreateActivity(
                firebaseDb,
                dateForActivity,
                'task_changed',
                appContext.globalContext.authenticate.user.organization_id,
                itemObject.manager_id,
                [loggedin_user_id],
                itemObject.phase_id,
                itemObject.project_id,
                itemObject.task_id,
                activityObject
            );
        }
        GLOBALFUNC__CloseSidebar(appContext, false);
    }
}

export const FUNC__DeleteObject = async (
    action,
    deleteDialog,
    setDeleteDialog,
    setDataIsLoading = null,
    appContext = null,
    params = null
) => {
    let itemObject = params && params[0] ? params[0] : null;
    let tasksObject = params && params[1] ? params[1] : null;
    let setTasksObject = params && params[2] ? params[2] : null;
    let setError = params && params[3] ? params[3] : null;

    if(action == "showDialog"){
        setDeleteDialog({
            data: null,
            show: true
        });
    } else {
        if(action == "confirm"){
            const result = await GLOBALFUNC__POSTREQUEST(
                'http://localhost:6001/api/manager/task/delete-task',
                {
                    task_id: itemObject.task_id,
                    organization_id: appContext.globalContext.authenticate.user.organization_id,
                    old_status: itemObject.status,
                    manager_id: itemObject.manager_id,
                    project_id: itemObject.project_id
                }
            );
            if(result.response == 'successfull'){
                if(setTasksObject){
                    GLOBALFUNC__EditObjectInArray(
                        'task_id',
                        itemObject.task_id,
                        tasksObject,
                        setTasksObject,
                        'delete'
                    );
                }
                GLOBALFUNC__CloseSidebar(appContext, false);
            } else {
                setDataIsLoading(false);
                setError({
                    show: true,
                    id: 'API_ERROR',
                    message: 'Oeps, er gaat iets mis. Probeer het a.u.b. nog een keer of neem contact met ons op.'
                });
            }
        }
        setDeleteDialog({
            data: null,
            show: false
        });
    }
}

export const FUNC__UpdateTaskStatus = async (
    action,
    status,
    confirmDialog,
    setConfirmDialog,
    setDataIsLoading = null,
    appContext = null,
    params = null,
) => {
    const itemObject = params && params[0] ? params[0] : null;
    const tasksObject = params && params[1] ? params[1] : null;
    const setTasksObject = params && params[2] ? params[2] : null;
    const setError = params && params[3] ? params[3] : null;
    const user_id = params && params[4] ? params[4] : null;

    console.log(itemObject);

    if(action == "showDialog"){
        setConfirmDialog({
            message: `Weet je zeker dat je de status van deze taak op "${status}" wilt zetten?`,
            submitMessage: 'aanpassen',
            data: {
                status: status
            },
            show: true
        });
    } else {
        if(action == "confirm"){
            setDataIsLoading(true);

            switch(confirmDialog.data.status){
                case 'Vastgelopen':
                    FUNC__UpdateTaskStatusToStuck(
                        itemObject,
                        appContext,
                        user_id,
                        tasksObject,
                        setTasksObject,
                        setError,
                        setDataIsLoading
                    );
                    break;
                case 'In behandeling':
                    if(itemObject.status == 'stuck'){
                        FUNC__UpdateTaskStatusToUnStuck(
                            itemObject,
                            appContext,
                            user_id,
                            tasksObject,
                            setTasksObject,
                            setError,
                            setDataIsLoading
                        );
                    }
                    break;
                case 'Voltooid':
                    FUNC__UpdateTaskStatusToCompleted();
                    break;
            }
        }
        setConfirmDialog({
            message: '',
            submitMessage: '',
            data: null,
            show: false
        });
    }
}

const FUNC__UpdateTaskStatusToStuck = async (
    itemObject,
    appContext,
    user_id,
    tasksObject,
    setTasksObject,
    setError,
    setDataIsLoading
) => {
    const result = await GLOBALFUNC__POSTREQUEST(
        'http://localhost:6001/api/manager/task/update-task-status',
        {
            task_id: itemObject.task_id,
            task_name: itemObject.name,
            phase_name: itemObject.phase,
            project_name: itemObject.project.name,
            organization_id: appContext.globalContext.authenticate.user.organization_id,
            old_status: itemObject.status,
            new_status: 'stuck',
            manager_id: itemObject.manager_id,
            project_manager_id: itemObject.project_manager_id,
            project_id: itemObject.project_id,
            assigned_to: itemObject.assigned_to,
            phase_id: itemObject.phase_id,
            dateForActivity: GLOBALFUNC__DateForActivity(),
            stuck_comment: itemObject.stuck_comment,
            dateToday: new Date(),
            user_id: user_id
        }
    );
    if(result.response == 'successfull'){
        GLOBALFUNC__EditObjectInArray(
            'task_id',
            itemObject.task_id,
            tasksObject,
            setTasksObject,
            'edit_key',
            [
                {
                    key: 'status',
                    value: 'stuck'
                },
                {
                    key: 'stuck_comment',
                    value: {
                        comment: itemObject.stuck_comment.comment,
                        related_problem_solved_comment: '',
                        user_id: user_id,
                        date_added: result.message.date_added,
                        related_problem_id: result.message.related_problem_id,
                        user: [{
                            firstname: appContext.globalContext.authenticate.user.firstname,
                            lastname: appContext.globalContext.authenticate.user.lastname,
                        }]
                    }
                }
            ],
        );
        GLOBALFUNC__CloseSidebar(appContext, false);
    } else {
        setDataIsLoading(false);
        setError({
            show: true,
            id: 'API_ERROR',
            message: 'Oeps, er gaat iets mis. Probeer het a.u.b. nog een keer of neem contact met ons op.'
        });
    }
}

const FUNC__UpdateTaskStatusToUnStuck = async (
    itemObject,
    appContext,
    user_id,
    tasksObject,
    setTasksObject,
    setError,
    setDataIsLoading
) => {
    const result = await GLOBALFUNC__POSTREQUEST(
        'http://localhost:6001/api/manager/task/update-task-status',
        {
            task_id: itemObject.task_id,
            task_name: itemObject.name,
            phase_name: itemObject.phase,
            project_name: itemObject.project.name,
            organization_id: appContext.globalContext.authenticate.user.organization_id,
            old_status: itemObject.status,
            new_status: 'in_progress',
            manager_id: itemObject.manager_id,
            project_manager_id: itemObject.project_manager_id,
            project_id: itemObject.project_id,
            assigned_to: itemObject.assigned_to,
            phase_id: itemObject.phase_id,
            dateForActivity: GLOBALFUNC__DateForActivity(),
            stuck_comment: itemObject.stuck_comment,
            dateToday: new Date(),
            user_id: user_id
        }
    );
    if(result.response == 'successfull'){
        GLOBALFUNC__EditObjectInArray(
            'task_id',
            itemObject.task_id,
            tasksObject,
            setTasksObject,
            'edit_key',
            [
                {
                    key: 'status',
                    value: 'in_progress'
                },
                {
                    key: 'stuck_comment',
                    value: {
                        comment: '',
                        user_id: '',
                        date_added: null,
                        related_problem_id: '',
                        related_problem_solved_comment: '',
                        user: null
                    }
                }
            ],
        );
        GLOBALFUNC__CloseSidebar(appContext, false);
    } else {
        setDataIsLoading(false);
        setError({
            show: true,
            id: 'API_ERROR',
            message: 'Oeps, er gaat iets mis. Probeer het a.u.b. nog een keer of neem contact met ons op.'
        });
    }
}

export const FUNC__CancelStuck = (
    setShowStuckField,
    itemObject,
    setItemObject,
    setShowStuckSubmitButton
) => {
    setItemObject({
        ...itemObject,
        stuck_comment: {
            user_id: '',
            comment: '',
            date_added: null,
            related_problem_solved_comment: ''
        }
    });
    setShowStuckField(false);
    setShowStuckSubmitButton(false);
}

export const FUNC__CancelUnStuck = (
    setShowUnStuckField,
    itemObject,
    setItemObject,
    setShowUnStuckSubmitButton
) => {
    setItemObject({
        ...itemObject,
        stuck_comment: {
            ...itemObject.stuck_comment,
            related_problem_solved_comment: ''
        }
    });
    setShowUnStuckField(false);
    setShowUnStuckSubmitButton(false);
}

export const FUNC__FetchTaskFromServer = async (
    task_id,
    setItemObject,
    setOldItemObject,
    setError,
    setDataHasLoaded,
    firebaseDb,
    setChatHasLoaded,
    setChatObject,
    appContext,
    setChatObjectLastVisible,
    setNewMessageAdded,
    setHasAccess,
    loggedin_user_id,
    loggedin_user_role,
    setItemObjectFiles
) => {
    const result = await GLOBALFUNC__POSTREQUEST(
        'http://localhost:6001/api/manager/task/get-specific-task',
        {
            organization_id: appContext.globalContext.authenticate.user.organization_id,
            task_id: task_id,
            date_today: new Date()
        }
    );
    console.log(result);
    if(result.response == 'successfull'){
        if(result.message.manager_id == loggedin_user_id
            || result.message.assigned_to.includes(loggedin_user_id)
            || result.message.project_manager_id == loggedin_user_id
            || loggedin_user_role == 'Admin'){
            setHasAccess(true);
        }
        if(result.message){
            setItemObject(FUNC__FormattedItem(result.message));
            setOldItemObject(FUNC__FormattedItem({...result.message}));
            setItemObjectFiles(result.message.files);

            FUNC__GetDiscussion(
                task_id,
                firebaseDb,
                setChatHasLoaded,
                setChatObject,
                appContext,
                setChatObjectLastVisible,
                setError,
                setNewMessageAdded
            );
        }
    } else {
        setError({
            show: true,
            id: 'API_ERROR',
            message: 'Oeps, er gaat iets mis. Probeer het a.u.b. nog een keer of neem contact met ons op.'
        });
    }
    setDataHasLoaded(true);
}

const FUNC__FormattedItem = (
    itemObject
) => {
    itemObject['formatted_deadline'] = GLOBALFUNC__TranslateSecondsToDate(
        new Date(itemObject.deadline.seconds * 1000),
        true,
        true
    );
    return itemObject;
}