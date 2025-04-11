// React / NextJs components
import cn from 'classnames';
import { useState, useContext, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
// Global / Page / Layout components
import LayoutComponentLoggedinPage from '../../../components/Layouts/LoggedinPage';
import AppContext from '../../../helpers/AppContext';
import { 
    FUNC__GetCustomers,
    FUNC__CreateCustomer
} from './Controller.js';
import VIEW__SectionOverview__Header from './VIEW__SectionOverview__Header.js';
import VIEW__SectionOverview from './VIEW__SectionOverview.js';
import PopupComponentConfirm from '../../../components/Global/Sidebar/Popup/Confirm.js';
// Page styles
import globalStyles from '../../../styles/global.module.scss';


const Index = () => {
    const appContext = useContext(AppContext);
    const searchParams = useSearchParams();
    const router = useRouter();
    const [dataHasLoaded, setDataHasLoaded] = useState(false);
    const [loadingMoreData, setLoadingMoreData] = useState(false);
    const [customersObject, setCustomersObject] = useState([]);
    const [lastVisible, setLastVisible] = useState(null);
    useEffect(() => {
        if(dataHasLoaded){
            setDataHasLoaded(false);
        }
        let oldLastVisible = lastVisible;
        if(lastVisible != null){
            setLastVisible(null);
            oldLastVisible = null;
        }
        FUNC__GetCustomers(
            appContext.globalContext.authenticate.user.organization_id,
            setCustomersObject,
            setDataHasLoaded,
            oldLastVisible,
            setLastVisible
        );
    },[]);
    useEffect(() => {
        const action = searchParams.get('action');
        if(action == 'create-customer'){
            FUNC__CreateCustomer(
                appContext,
                customersObject,
                setCustomersObject
            )
            router.replace('', undefined, { shallow: true });
        }
    },[searchParams]);
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
                        {/* Header */}
                        <VIEW__SectionOverview__Header 
                            customersObject={customersObject}
                            setCustomersObject={setCustomersObject}
                            appContext={appContext}/>

                        {/* Content */}
                        <VIEW__SectionOverview 
                            customersObject={customersObject}
                            setCustomersObject={setCustomersObject}
                            loadingMoreData={loadingMoreData}
                            setLoadingMoreData={setLoadingMoreData}
                            appContext={appContext}
                            dataHasLoaded={dataHasLoaded}
                            lastVisible={lastVisible}
                            setLastVisible={setLastVisible}/>
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