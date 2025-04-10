// React / NextJs components
import cn from 'classnames';
import { useState, useContext, useEffect } from 'react';
// Global / Page / Layout components
import LayoutComponentLoggedinPage from '../../../components/Layouts/LoggedinPage';
import AppContext from '../../../helpers/AppContext';
import VIEW__SectionActivities from './VIEW__SectionActivities';
import VIEW__SectionProblems from './VIEW__SectionProblems';
import VIEW__SectionProjectsAndTasks from './VIEW__SectionProjectsAndTasks';
import VIEW__SectionWorkedHours from './VIEW__SectionWorkedHours';
import { FUNC__GetData } from './Controller';
import firebase_app from '../../../firebase/Config';
import { 
    getFirestore, 
    doc, 
    collection,
    onSnapshot,
    query,
    where,
    orderBy,
    limit,
    getDoc
} from "firebase/firestore";
import GlobalComponentLoadingData from '../../../components/Global/Loaders/LoadingData';
import { 
    GLOBALFUNC__MonthNames,
    GLOBALFUNC__GetUser__NAW
} from '../../../helpers/GlobalFunctions';
import { 
    getWeek,
    startOfWeek,
    endOfWeek
} from 'date-fns';
// Page styles
import globalStyles from '../../../styles/global.module.scss';


const Index = () => {
    const db = getFirestore(firebase_app);
    const appContext = useContext(AppContext);
    const dateToday = new Date();
    const currentYear = dateToday.getFullYear();
    const currentDay = dateToday.getDate();
    const currentMonth = dateToday.getMonth() + 1;
    const today = `${currentDay}-${currentMonth}-${currentYear}`;
    const [workedhoursObjectHasLoaded, setWorkedhoursObjectHasLoaded] = useState();
    const [projectsObjectHasLoaded, setProjectsObjectHasLoaded] = useState();
    const [tasksObjectHasLoaded, setTasksObjectHasLoaded] = useState();
    const [problemsObjectHasLoaded, setProblemsObjectHasLoaded] = useState();
    const [activitiesObjectHasLoaded, setActivitiesObjectHasLoaded] = useState();
    const [workedhoursObject, setWorkedhoursObject] = useState({
        analytics: {
            months: {
                1: {
                    filled: 0,
                    total: 0
                } 
            },
            weeks: {
                1: {
                    filled: 0,
                    total: 0
                } 
            }
        },
        month: `Ingevuld voor deze maand (${GLOBALFUNC__MonthNames[dateToday.getMonth()]})`,
        week: `Ingevuld voor deze week (week
        ${getWeek(dateToday)}
        , ${startOfWeek(dateToday, {weekStartsOn: 1}).getDate()}
        ${GLOBALFUNC__MonthNames[startOfWeek(dateToday, {weekStartsOn: 1}).getMonth()]}
        t/m ${endOfWeek(dateToday, {weekStartsOn: 1}).getDate()}
        ${GLOBALFUNC__MonthNames[endOfWeek(dateToday, {weekStartsOn: 1}).getMonth()]})`
    });
    const [projectsObject, setProjectsObject] = useState({
        open: 0,
        on_schedule: 0,
        at_risk: 0,
        completed: 0,
        total: 0
    });
    const [tasksObject, setTasksObject] = useState({
        in_progress: 0,
        overdue: 0,
        stuck: 0,
        total: 0,
        completed: 0,
        unasigned: 0,
        open: 0
    });
    const [problemsObject, setProblemsObject] = useState({
        priority_high: 0,
        priority_low: 0,
        priority_medium: 0,
        status_in_progress: 0,
        status_open: 0,
        status_resolved: 0,
        total: 0
    }); 
    const [activitiesObject, setActivitiesObject] = useState(null); 
    useEffect(() => {
        //firebaseMessaging = getMessaging(firebase_app);
        FUNC__GetData(
            appContext.globalContext.authenticate.user.organization_id,
            GLOBALFUNC__GetUser__NAW,
            workedhoursObject,
            setWorkedhoursObject,
            setProjectsObject,
            setTasksObject,
            setProblemsObject,
            setActivitiesObject,
            setWorkedhoursObjectHasLoaded,
            setProjectsObjectHasLoaded,
            setTasksObjectHasLoaded,
            setProblemsObjectHasLoaded,
            setActivitiesObjectHasLoaded,
            doc,
            getDoc,
            collection,
            onSnapshot,
            query,
            where,
            orderBy,
            limit,
            today,
            db
        );
    },[]); 
    /*
    *
    *
    * 
    * 
        Content
    *
    *
    * 
    * 
    */
    return (
        <section className={globalStyles['global-container']}>
            <div className={globalStyles['global-container__content']}>
                <div className={cn([
                    globalStyles['global-border-radius'],
                    globalStyles['content-body-nopadding']
                ])}>
                    {
                        (!workedhoursObjectHasLoaded
                        || !problemsObjectHasLoaded
                        || !tasksObjectHasLoaded
                        || !projectsObjectHasLoaded)
                        &&
                        <GlobalComponentLoadingData
                            type={'firstTimeLoading'}/>
                    }
                    {
                        workedhoursObjectHasLoaded
                        && problemsObjectHasLoaded
                        && tasksObjectHasLoaded
                        && projectsObjectHasLoaded
                        &&
                        <div className={globalStyles['dashboardview']}>
                            <div className={globalStyles['dashboardview__manager']}>
                                <div className={globalStyles['manager-left']}>
                                    <div className={globalStyles['manager-left__top']}>
                                        <VIEW__SectionWorkedHours 
                                            workedhoursObject={workedhoursObject} />
                                        <VIEW__SectionProjectsAndTasks 
                                            projectsObject={projectsObject} 
                                            tasksObject={tasksObject}
                                            sidebar={appContext.globalContext.sidebar}/>
                                    </div>
                                    <VIEW__SectionProblems 
                                        problemsObject={problemsObject}
                                        sidebar={appContext.globalContext.sidebar}/>
                                </div>
                                <VIEW__SectionActivities 
                                    activitiesObject={activitiesObject}
                                    sidebar={appContext.globalContext.sidebar}
                                    activitiesObjectHasLoaded={activitiesObjectHasLoaded}/>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </section>  
    );
};
Index.getLayout = (page) => {
    return (
        <LayoutComponentLoggedinPage>{page}</LayoutComponentLoggedinPage>
    );
};

export default Index;