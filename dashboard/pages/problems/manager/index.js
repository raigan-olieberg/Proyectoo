// React / NextJs components
import cn from 'classnames';
import { useState, useContext, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
// Global / Page / Layout components
import LayoutComponentLoggedinPage from '../../../components/Layouts/LoggedinPage';
import AppContext from '../../../helpers/AppContext';
import { 
    FUNC__GetProblems,
    FUNC__LoadMoreProblemsData
} from './Controller.js';
import VIEW__SectionOverview__Header from './VIEW__SectionOverview__Header.js';
import VIEW__SectionOverview from './VIEW__SectionOverview.js';
import PopupComponentConfirm from '../../../components/Global/Sidebar/Popup/Confirm.js';
// Page styles
import globalStyles from '../../../styles/global.module.scss';;


const Index = () => {
    const appContext = useContext(AppContext);
    const [dataHasLoaded, setDataHasLoaded] = useState(false);
    const [currentlyLoadingMoreOverviewData, setCurrentlyLoadingMoreOverviewData] = useState(false);
    const {ref: loadingMoreOverviewData, inView} = useInView();
    const [problemsObject, setProblemsObject] = useState([]);
    const [lastVisible, setLastVisible] = useState(null);
    const [searchFilterActive, setSearchFilterActive] = useState('');
    const [searchingFor, setSearchingFor] = useState('problems');
    const [overviewSortFilter, setOverviewSortFilter] = useState({
        key: 'show_all',
        value: ''
    });
    useEffect(() => {
        if(dataHasLoaded){
            setDataHasLoaded(false);
        }
        let oldLastVisible = lastVisible;
        if(lastVisible != null){
            setLastVisible(null);
            oldLastVisible = null;
        }
        FUNC__GetProblems(
            appContext.globalContext.authenticate.user.organization_id,
            setProblemsObject,
            setDataHasLoaded,
            overviewSortFilter,
            oldLastVisible,
            setLastVisible,
            appContext.globalContext.authenticate.user.user_id,
            appContext.globalContext.authenticate.user.role,
            searchFilterActive,
            searchingFor
        );
    },[overviewSortFilter, searchFilterActive]);
    useEffect(() => {
        if (inView) {
            if(dataHasLoaded
                && !currentlyLoadingMoreOverviewData){
                setCurrentlyLoadingMoreOverviewData(true);
                console.log('visible');
                FUNC__LoadMoreProblemsData(
                    setCurrentlyLoadingMoreOverviewData,
                    appContext.globalContext.authenticate.user.organization_id,
                    problemsObject,
                    setProblemsObject,
                    overviewSortFilter,
                    lastVisible,
                    setLastVisible,
                    appContext.globalContext.authenticate.user.user_id,
                    appContext.globalContext.authenticate.user.role,
                    searchFilterActive,
                    searchingFor
                )
            }
        }
    },[inView]);
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
        <>
            <section className={globalStyles['global-container']}>
                <div className={globalStyles['global-container__content']}>
                    <div className={cn([
                        globalStyles['global-border-column'],
                        globalStyles['global-border-radius'],
                        globalStyles['content-body-with-header']
                    ])}>
                        <VIEW__SectionOverview__Header
                            appContext={appContext}
                            overviewSortFilter={overviewSortFilter}
                            setOverviewSortFilter={setOverviewSortFilter}
                            dataHasLoaded={dataHasLoaded}
                            problemsObject={problemsObject}
                            setProblemsObject={setProblemsObject}
                            searchFilterActive={searchFilterActive}
                            setSearchFilterActive={setSearchFilterActive}
                            searchingFor={searchingFor}
                            setSearchingFor={setSearchingFor}/>
                        <VIEW__SectionOverview
                            problemsObject={problemsObject}
                            setProblemsObject={setProblemsObject}
                            appContext={appContext}
                            dataHasLoaded={dataHasLoaded}
                            lastVisible={lastVisible}
                            setLastVisible={setLastVisible}
                            overviewSortFilter={overviewSortFilter}
                            loadingMoreData={loadingMoreOverviewData}/>
                    </div>
                </div>
            </section> 
            {
                appContext.globalContext.popup.show
                &&
                <PopupComponentConfirm 
                    appContext={appContext}/> 
            }
        </>
    );
};
Index.getLayout = (page) => {
    return (
        <LayoutComponentLoggedinPage>{page}</LayoutComponentLoggedinPage>
    );
};

export default Index;