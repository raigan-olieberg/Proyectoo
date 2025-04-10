// React / NextJs components
import cn from 'classnames';
import * as featherIcon from 'feather-icons';
import { usePathname } from 'next/navigation'
import { useContext, useState, useEffect } from 'react';
// Global / Page / Layout components
import AppContext from '../../helpers/AppContext';
import { 
    GLOBALFUNC__UserInitials,
    GLOBALFUNC__DifferenceBetweenObjects,
    GLOBALFUNC__GetActivities,
    GLOBALFUNC__SelectItemForSidebar
} from '../../helpers/GlobalFunctions';
import { 
    getFirestore
} from "firebase/firestore";
import firebase_app from '../../firebase/Config';
// Page styles
import globalStyles from '../../styles/global.module.scss';

const GlobalComponentHeader = () => {
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
    const appContext = useContext(AppContext);
    const firebaseDb = getFirestore(firebase_app);
    const currentPage = usePathname();
    const [activities, setActivities] = useState([]);
    const [oldActivities, setOldActivities] = useState([]);
    const [activityButtonText, setActivityButtonText] = useState('Activiteiten');
    const [activitiesObjectLastVisible, setActivitiesObjectLastVisible] = useState(null);
    const [activitiesHasLoaded, setActivitiesHasLoaded] = useState(false);
    const [messages, setMessages] = useState([]);
    const [oldMessages, setOldMessages] = useState([]);
    const [messagesButtonText, setMessagesButtonText] = useState('Berichten');
    const [messagesObjectLastVisible, setMessagesObjectLastVisible] = useState(null);
    const [messagesHasLoaded, setMessagesHasLoaded] = useState(false);

    useEffect(() => {
        GLOBALFUNC__GetActivities(
            firebaseDb,
            appContext.globalContext.authenticate.user.organization_id,
            setActivities,
            setActivitiesObjectLastVisible,
            setActivitiesHasLoaded,
            setMessages,
            setMessagesObjectLastVisible,
            setMessagesHasLoaded
        );
    }, []);
    useEffect(() => {
        if(activitiesHasLoaded
            && GLOBALFUNC__DifferenceBetweenObjects(activities, oldActivities)){
            if(activities.length > 0){
                setActivityButtonText(
                    (activities.length - oldActivities.length) + ' ' + ((activities.length - oldActivities.length) == 1 ? 'nieuwe activiteit' : 'nieuwe activiteiten')
                );
            } else {
                setActivityButtonText('Activiteiten');
            }
        }
    }, [activities]);

    const FUNC__ShowActivities = () => {
        GLOBALFUNC__SelectItemForSidebar(
            appContext, 
            null, 
            "right", 
            {
                page: 'activities/manager', 
                title: 'Activiteiten van vandaag',
                data: {
                    activities: activities,
                    setActivities: setActivities,
                    messagesObject: messages,
                    setMessages: setMessages
                }
            }
        );
    } 
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
        <header className={globalStyles['global-header']}>
            <div className={globalStyles['global-header__logo']}>
                <img src="../../../img/proyectoo-logo-150.png" alt="Proyectoo favicon"/>
            </div>
            <div className={globalStyles['global-header__content']}>
                <div className={globalStyles['content-nav']}>
                    <div>
                        {
                            appContext.globalContext.authenticate.user.role == "Admin"
                            &&
                            'Beheerderview'
                        }
                        {
                            appContext.globalContext.authenticate.user.role == "Projectleader"
                            &&
                            'Projectleiderview'
                        }
                        {
                            appContext.globalContext.authenticate.user.role == "Manager"
                            &&
                            'Teamleiderview'
                        }
                    </div>
                    <i className={globalStyles['content-nav__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['chevron-right'].toSvg({height: '1.5vw', width: '1.5vw'})}}></i>
                    <div>
                        {currentPage.includes("dashboard") && "Dashboard"}
                        {currentPage.includes("projects") && "Alle projecten waar jij lid van bent"}
                        {currentPage.includes("worked-hours") && "Gewerkte uren"}
                        {currentPage.includes("resource-planning") && "Resource planning"}
                        {currentPage.includes("resources") && "Resources"}
                        {
                            currentPage.includes("problems")
                            && appContext.globalContext.authenticate.user.role == "Manager"
                            &&
                            "Problemen binnen jouw taken"
                        }
                        {
                            currentPage.includes("problems")
                            && appContext.globalContext.authenticate.user.role == "Admin"
                            &&
                            "Problemen binnen deze organisatie"
                        }
                        {
                            currentPage.includes("problems")
                            && appContext.globalContext.authenticate.user.role == "Projectleader"
                            &&
                            "Problemen binnen jouw projecten"
                        }
                        {
                            currentPage.includes("tasks")
                            && appContext.globalContext.authenticate.user.role == "Manager"
                            &&
                            "Jouw aangemaakte taken"
                        }
                        {
                            currentPage.includes("tasks")
                            && appContext.globalContext.authenticate.user.role == "Admin"
                            &&
                            "Taken binnen deze organisatie"
                        }
                        {
                            currentPage.includes("tasks")
                            && appContext.globalContext.authenticate.user.role == "Projectleader"
                            &&
                            "Taken binnen jouw projecten"
                        }
                        {currentPage.includes("customers") && "Klanten"}
                    </div>
                    {
                        appContext.globalContext.current_project != null
                        && currentPage.includes("/projects/manager/info/")
                        &&
                        <>
                            <i className={globalStyles['content-nav__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['chevron-right'].toSvg({height: '1.5vw', width: '1.5vw'})}}></i>
                            <div>{appContext.globalContext.current_project.description}</div>
                        </>
                    }
                    {
                        currentPage.includes("worked-hours")
                        &&
                        <>
                            <i className={globalStyles['content-nav__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['chevron-right'].toSvg({height: '1.5vw', width: '1.5vw'})}}></i>
                            2025
                        </>
                    }
                </div>
                <button className={cn({
                    [globalStyles['content-messages']]:true,
                    [globalStyles['content-messages-empty']]:messagesButtonText == 'Berichten',
                    [globalStyles['content-messages-not-empty']]:messagesButtonText != 'Berichten',
                    [globalStyles['global-transition-duration']]:true
                })} onClick={() => FUNC__ShowActivities()}>
                    <div className={cn({
                        [globalStyles['content-messages__icon']]:true,
                        [globalStyles['content-messages-empty__icon']]:messagesButtonText == 'Berichten',
                        [globalStyles['content-messages-not-empty__icon']]:messagesButtonText != 'Berichten',
                    })}><i dangerouslySetInnerHTML={{__html: featherIcon.icons['message-circle'].toSvg({height: "1vw", width: "1vw", fill: "#ffffff"})}}></i></div>
                    <div>{messagesButtonText}</div>
                </button>
                <button className={cn({
                    [globalStyles['content-notifications']]:true,
                    [globalStyles['content-notifications-empty']]:activityButtonText == 'Activiteiten',
                    [globalStyles['content-notifications-not-empty']]:activityButtonText != 'Activiteiten',
                    [globalStyles['global-transition-duration']]:true
                })} onClick={() => FUNC__ShowActivities()}>
                    <div className={cn({
                        [globalStyles['content-notifications__icon']]:true,
                        [globalStyles['content-notifications-empty__icon']]:activityButtonText == 'Activiteiten',
                        [globalStyles['content-notifications-not-empty__icon']]:activityButtonText != 'Activiteiten',
                    })}><i dangerouslySetInnerHTML={{__html: featherIcon.icons['bell'].toSvg({height: "1vw", width: "1vw", fill: "#ffffff"})}}></i></div>
                    <div>{activityButtonText}</div>
                </button>
                <button className={cn([
                    globalStyles['content-user'],
                    globalStyles['global-transition-duration']
                ])}>
                    <div className={globalStyles['content-user__role']}>
                        <div className={globalStyles['global-fontweight-bold']}>
                            {appContext.globalContext.authenticate.user.firstname} {appContext.globalContext.authenticate.user.lastname}
                        </div>
                    </div>
                    <div className={globalStyles['global-photo-thumbnail-wrapper__single']}>
                        {GLOBALFUNC__UserInitials(
                            appContext.globalContext.authenticate.user.firstname,
                            appContext.globalContext.authenticate.user.lastname
                        )}
                    </div>
                </button>
            </div>
            {/*<div className={styles['header__search']}>
                <div className={styles['icon']}><i dangerouslySetInnerHTML={{__html: featherIcon.icons['search'].toSvg()}}></i></div>
                <input type="text" placeholder="Zoeken..."/>
            </div>
            <div className={styles['header__user']}>
                <button className={cn([
                    styles['button'],
                    styles['mention'],
                    globalStyles['global-transition-duration']
                ])}>
                    <div><i dangerouslySetInnerHTML={{__html: featherIcon.icons['at-sign'].toSvg({height: '1vw', width: '1vw'})}} className={cn([
                        styles['button__icon'],
                        styles['mention__icon'],
                        globalStyles['global-transition-duration']
                    ])}></i></div>
                    <div>3 mentions</div>
                </button>
                <button className={styles['button']}>
                    <div><i dangerouslySetInnerHTML={{__html: featherIcon.icons['user'].toSvg({height: '1vw', width: '1vw'})}} className={styles['button__icon']}></i></div>
                    <div><span>Mijn rol:</span> Manager</div>
                </button>
                <div className={styles['user']}></div>
            </div>*/}
        </header>
    );
}
export default GlobalComponentHeader;