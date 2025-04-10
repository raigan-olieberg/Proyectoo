// React / NextJs components
import cn from 'classnames';
import { useState, useContext, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
// Global / Page / Layout components
import LayoutComponentLoggedinPage from '../../../components/Layouts/LoggedinPage';
import AppContext from '../../../helpers/AppContext';
import VIEW__SectionDayview from './VIEW__SectionDayview';
import VIEW__SectionHeader from './VIEW__SectionHeader';
import VIEW__SectionWeekview from './VIEW__SectionWeekview';
import { 
    FUNC__GetDayviewResourcePlanning,
    FUNC__GetWeekviewResourcePlanning,
    FUNC__LoadMoreWeekviewResourcePlanning,
    FUNC__Navigate__Dayview,
    FUNC__Navigate__Weekview,
    FUNC__ReturnDay
} from './Controller';
import { 
    getWeek
} from 'date-fns';
// Page styles
import globalStyles from '../../../styles/global.module.scss'; 


const Index = () => {   
    const appContext = useContext(AppContext); 
    const [currentView, setCurrentView] = useState("weekview");
    const [dayviewObject, setDayviewObject] = useState([]);
    const [weekviewObject, setWeekviewObject] = useState([]);
    const [dayviewDate, setDayviewDate] = useState(new Date());
    const [weekviewDate, setWeekviewDate] = useState(new Date());
    const [dayviewDataHasLoaded, setDayviewDataHasLoaded] = useState(false);
    const {ref: loadingMoreWeekviewData, inView} = useInView();
    const [weekviewDataHasLoaded, setWeekviewDataHasLoaded] = useState(false);
    const [dayviewLastVisible, setDayviewLastVisible] = useState(null);
    const [weekviewLastVisible, setWeekviewLastVisible] = useState(null);
    const [loadmoreWeekviewData, setLoadmoreWeekviewData] = useState(false);
    const [loadingMoreDayviewData, setLoadingMoreDayviewData] = useState(false);
    useEffect(() => {
        setWeekviewDataHasLoaded(false);
        if(currentView == "dayview"){
            FUNC__GetDayviewResourcePlanning(
                appContext.globalContext.authenticate.user.organization_id,
                setDayviewObject,
                setDayviewDataHasLoaded,
                getWeek(dayviewDate),
                dayviewLastVisible,
                setDayviewLastVisible,
                appContext.globalContext.authenticate.user.user_id,
                appContext.globalContext.authenticate.user.role
            );
        } else {
            FUNC__GetWeekviewResourcePlanning(
                appContext.globalContext.authenticate.user.organization_id,
                setWeekviewObject,
                weekviewObject,
                setWeekviewDataHasLoaded,
                getWeek(weekviewDate),
                weekviewLastVisible,
                setWeekviewLastVisible,
                appContext.globalContext.authenticate.user.user_id,
                appContext.globalContext.authenticate.user.role
            );
        }
    }, [currentView, weekviewDate]);
    useEffect(() => {
        if (inView) {
            switch(currentView){
                case "dayview":
            
                    break;
                case "weekview":
                    if(weekviewDataHasLoaded
                        && !loadmoreWeekviewData){
                        setLoadmoreWeekviewData(true);
                        FUNC__LoadMoreWeekviewResourcePlanning(
                            appContext.globalContext.authenticate.user.organization_id,
                            setWeekviewObject,
                            weekviewObject,
                            getWeek(weekviewDate),
                            weekviewLastVisible,
                            setWeekviewLastVisible,
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
                <div className={cn([
                    globalStyles['global-border-column'],
                    globalStyles['global-border-radius'],
                    globalStyles['content-body-with-header']
                ])}>
                    <div className={cn([
                        globalStyles['content-body-with-header__header'],
                        globalStyles['global-margin-top']
                    ])}>
                        <div className={globalStyles['global-schedule']}>
                            <VIEW__SectionHeader 
                                currentView={currentView}
                                setCurrentView={setCurrentView}
                                FUNC__Navigate__Dayview={FUNC__Navigate__Dayview}
                                dayviewObjectItemsTotal={dayviewObject.length}
                                //listviewObjectItemsTotal={listviewObject.length}
                                dayviewDataHasLoaded={dayviewDataHasLoaded}
                                dayviewDate={dayviewDate}
                                setDayviewDate={setDayviewDate}
                                FUNC__Navigate__Weekview={FUNC__Navigate__Weekview}
                                weekviewDate={weekviewDate}
                                setWeekviewDate={setWeekviewDate}/>
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
                                        dayviewObject={dayviewObject}
                                        dayviewDataHasLoaded={dayviewDataHasLoaded}
                                        FUNC__AddPlanning={FUNC__AddPlanning}/>
                                </div>
                            }
                            {
                                currentView == "weekview"
                                && 
                                <div className={globalStyles['global-schedule__content-weekview']}>

                                    <VIEW__SectionWeekview 
                                        appContext={appContext}
                                        weekviewObject={weekviewObject}
                                        weekviewDataHasLoaded={weekviewDataHasLoaded}
                                        loadingMoreWeekviewData={loadingMoreWeekviewData}
                                        weekviewLastVisible={weekviewLastVisible}
                                        weekviewDate={weekviewDate}
                                        FUNC__ReturnDay={FUNC__ReturnDay}
                                        setDayviewObject={setDayviewObject}
                                        setWeekviewObject={setWeekviewObject}/>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
Index.getLayout = (page) => {
  return (
        <LayoutComponentLoggedinPage>
            {page}
        </LayoutComponentLoggedinPage>
    );
};

export default Index;