// React / NextJs components
import { useState, useEffect, useContext } from 'react';
import cn from 'classnames';
import * as featherIcon from 'feather-icons';
import { useRouter } from 'next/navigation';
// Global / Page / Layout components
import SidebarComponentFieldsInputText from '../../../../components/Global/Sidebar/Fields/InputText';
import GlobalComponentLoadingData from '../../../../components/Global/Loaders/LoadingData';
import { 
    FUNC__CreateObject,
    FUNC__CreateObject__SendObjectToServer
} from './Controller';
import AppContext from '../../../../helpers/AppContext';
import { 
    GLOBALFUNC__isWhitespaceString,
    GLOBALFUNC__ValidateEmail
} from '../../../../helpers/GlobalFunctions';
// Page styles
import globalStyles from '../../../../styles/global.module.scss';

const CustomersManagerSidebar__VIEW__SectionAddCustomer = (props) => {
    const appContext = useContext(AppContext);
    const router = useRouter();
    const [dataIsLoading, setDataIsLoading] = useState(false);
    const [showSubmitButton, setShowSubmitButton] = useState(false);
    const [error, setError] = useState({
        show: false,
        message: '',
        id: ''
    });
    const [itemObject, setItemObject] = useState({
        customer_id: '',
        name: '',
        contactperson: '',
        email: '',
        phonenumber: '',
        linked_projects: [],
        date_added: new Date()
    });
    useEffect(() => {
        let value = false;
        if(!GLOBALFUNC__isWhitespaceString(itemObject.name)
        && !GLOBALFUNC__isWhitespaceString(itemObject.contactperson)
        && GLOBALFUNC__ValidateEmail(itemObject.email)){
            value = true;
        } else {
            value = false;
        }
        setShowSubmitButton(value);
    }, [itemObject]);
    const createAnotherCustomer = () => {
        router.push('?action=create-customer');
    }
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
    return(
        <div className={globalStyles['content-inner__bodysection']}>
            <SidebarComponentFieldsInputText
                firstItem={true} 
                title={"Naam"} 
                id={"name"} 
                value={itemObject.name}
                type={"create"}
                upperCase={true}
                error={error}
                showIndicator={false}
                required={true}
                FUNC__CreateObject={FUNC__CreateObject}
                itemObject={itemObject}
                setItemObject={setItemObject}/>
            <SidebarComponentFieldsInputText
                firstItem={false} 
                title={"Contactpersoon"} 
                id={"contactperson"} 
                value={itemObject.contactperson}
                type={"create"}
                upperCase={true}
                error={error}
                showIndicator={false}
                required={true}
                FUNC__CreateObject={FUNC__CreateObject}
                itemObject={itemObject}
                setItemObject={setItemObject}/>
            <SidebarComponentFieldsInputText
                firstItem={false} 
                title={"E-mail"} 
                id={"email"} 
                value={itemObject.email}
                type={"create"}
                upperCase={false}
                error={error}
                showIndicator={false}
                required={true}
                FUNC__CreateObject={FUNC__CreateObject}
                itemObject={itemObject}
                setItemObject={setItemObject}/>
            <SidebarComponentFieldsInputText
                firstItem={false} 
                title={"Telefoonnummer"} 
                id={"phonenumber"} 
                value={itemObject.phonenumber}
                type={"create"}
                upperCase={false}
                error={error}
                showIndicator={false}
                required={true}
                FUNC__CreateObject={FUNC__CreateObject}
                itemObject={itemObject}
                setItemObject={setItemObject}/>
                    
            {
                error.show
                && error.id == 'API_ERROR'
                &&
                <div className={cn([
                    globalStyles['bodysection-field__error'],
                    globalStyles['global-display-flex'],
                    globalStyles['global-margin-top-x2']
                ])}>
                    <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['alert-octagon'].toSvg({height: "1vw", width: "1vw"})}}></i>
                    {error.message}
                </div>
            }
            {
                !dataIsLoading
                &&
                <div className={cn([
                    globalStyles['global-margin-top-x2'],
                    globalStyles['bodysection-buttons']
                ])}>
                    <div className={cn([
                        globalStyles['global-seperator__horizontal'],
                        globalStyles['global-margin-bottom-x2'],
                    ])}></div>
                    {
                        showSubmitButton
                        &&
                        <>
                            <button className={cn([
                                globalStyles['global-button'],
                                globalStyles['global-button-hover'],
                                globalStyles['global-transition-duration'],
                                globalStyles['global-display-flex'],
                                globalStyles['global-width-100'],
                                globalStyles['global-margin-bottom']
                            ])} onClick={() => FUNC__CreateObject__SendObjectToServer(
                                appContext,
                                itemObject,
                                props.data.customersObject,
                                props.data.setCustomersObject,
                                setDataIsLoading,
                                setError,
                                null
                            )}>
                                <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['check'].toSvg({height: "1vw", width: "1vw"})}}></i>
                                Aanmaken en sluiten
                            </button>
                            <button className={cn([
                                    globalStyles['global-button'],
                                    globalStyles['global-button-hover'],
                                    globalStyles['global-transition-duration'],
                                    globalStyles['global-display-flex'],
                                    globalStyles['global-width-100'],
                                    globalStyles['global-margin-bottom']
                            ])} onClick={() => FUNC__CreateObject__SendObjectToServer(
                                appContext,
                                itemObject,
                                props.data.customersObject,
                                props.data.setCustomersObject,
                                setDataIsLoading,
                                setError,
                                createAnotherCustomer
                            )}>
                                <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['refresh-cw'].toSvg({height: "1vw", width: "1vw"})}}></i>
                                Aanmaken en nog een klant aanmaken
                            </button>
                        </>
                        ||
                        <>
                            <div className={cn([
                                globalStyles['global-button'],
                                globalStyles['global-button__inactive'],
                                globalStyles['global-display-flex'],
                                globalStyles['global-text-align-center'],
                                globalStyles['global-margin-bottom']
                            ])}>
                                <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['check'].toSvg({height: "1vw", width: "1vw"})}}></i>
                                Aanmaken en sluiten
                            </div>
                            <div className={cn([
                                globalStyles['global-button'],
                                globalStyles['global-button__inactive'],
                                globalStyles['global-display-flex'],
                                globalStyles['global-text-align-center'],
                                globalStyles['global-margin-bottom']
                            ])}>
                                <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['refresh-cw'].toSvg({height: "1vw", width: "1vw"})}}></i>
                                Aanmaken en nog een klant aanmaken
                            </div>
                        </>
                    }
                </div>
            }
            {
                dataIsLoading
                &&
                <div className={cn([
                    globalStyles['global-margin-top-x2'],
                    globalStyles['global-padding-bottom-x2']
                ])}>
                    <GlobalComponentLoadingData 
                        type={"loadMore"} />
                </div>
            }
        </div>
    );
}
export default CustomersManagerSidebar__VIEW__SectionAddCustomer;