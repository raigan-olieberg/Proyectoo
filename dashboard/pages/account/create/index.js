// React / NextJs components
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// Global / Page / Layout components
import VIEW__UserDetails from './VIEW__UserDetails';
import VIEW__OrganizationDetails from './VIEW__OrganizationDetails';
import { 
    FUNC__CreateObject,
    FUNC__Submit
} from './Controller';
import { addMonths } from 'date-fns';
// Page styles
import globalStyles from '../../../styles/global.module.scss';

export default function Index(){
    const router = useRouter();
    const [loginSuccessfull, setLoginSuccessfull] = useState(false);
    const [step, setStep] = useState(1); 
    const [dataIsLoading, setDataIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState({
        field_id: "",
        message: ""
    });
    const [itemObject, setItemObject] = useState(
        {
            user: {
                user_id: "",
                firstname: "",
                lastname: "",
                role: "Manager",
                label: "",
                email: "",
                profile_photo: "",
                password: "",
                organization_id: "",
                status: "Active",
                subscription_type: "Trial",
                subscription_enddate: addMonths(new Date(), 1)
            },
            organization: {
                organization_id: "",
                name: "",
                street: "",
                place: "",
                housenumber: "",
                zipcode: "",
                allocated_document_data: 1073741824,
                members_total: 1,
                teams_total: 0
            }
        }
    );

    useEffect(() => {
        if(loginSuccessfull){
            router.push('../dashboard/manager');
        }
    },[loginSuccessfull]);
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
        <div className={globalStyles['account-authentication']}>
            {
                step == 1 
                && 
                <VIEW__UserDetails 
                    FUNC__CreateObject={FUNC__CreateObject} 
                    FUNC__Submit={FUNC__Submit}
                    step={step}
                    setStep={setStep}
                    itemObject={itemObject}
                    setItemObject={setItemObject}
                    errorMessage={errorMessage}
                    setErrorMessage={setErrorMessage}
                    dataIsLoading={dataIsLoading}
                    setDataIsLoading={setDataIsLoading}/>
            }
            {
                step == 2 
                && 
                <VIEW__OrganizationDetails 
                    FUNC__CreateObject={FUNC__CreateObject} 
                    FUNC__Submit={FUNC__Submit}
                    step={step}
                    setStep={setStep}
                    itemObject={itemObject}
                    setItemObject={setItemObject}
                    errorMessage={errorMessage}
                    setErrorMessage={setErrorMessage}
                    dataIsLoading={dataIsLoading}
                    setDataIsLoading={setDataIsLoading}
                    setLoginSuccessfull={setLoginSuccessfull}/>
            }
            <div className={globalStyles['account-authentication__banner']}>
                <img src="../img/create-account-banner.png" alt="Kenmerken van Proyectoo"/>
            </div>
        </div>
    );
};