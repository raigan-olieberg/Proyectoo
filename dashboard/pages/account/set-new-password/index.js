// React / NextJs components
import cn from 'classnames';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
// Global / Page / Layout components
import GlobalComponentLoadingData from '../../../components/Global/Loaders/LoadingData';
import { 
    FUNC__CreateObject,
    FUNC__Submit
} from './Controller';
import * as featherIcon from 'feather-icons';
// Page styles
import globalStyles from '../../../styles/global.module.scss';

export default function Index(){
    const searchParams = useSearchParams();
    const router = useRouter();
    const [dataIsLoading, setDataIsLoading] = useState(false);
    const [succesMessage, setSuccesMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState({
        field_id: "",
        message: ""
    });
    const [itemObject, setItemObject] = useState({
        password: "",
        password_repeat: "",
        token: ""
    });
    useEffect(() => {
        const token = searchParams.get('t');
        if(token != undefined
        && token != null){
            setItemObject({
                ...itemObject,
                token: token
            })
        }
        if(succesMessage){
            setTimeout(() => {
                router.push('./login');
            }, "5000");
        }
    },[searchParams, succesMessage]);
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
            <div className={globalStyles['account-authentication__login']}>
                <div className={globalStyles['container']}>
                    {
                        !succesMessage
                        &&
                        <>
                            {/* Title */}
                            <h1 className={globalStyles['container__title']}>Nieuwe wachtwoord</h1>

                            {/* Subtitle */}
                            <h3 className={cn([
                                globalStyles['container__subtitle'],
                                globalStyles['global-margin-top-item']
                            ])}>Voer hieronder in beide velden jouw nieuwe wachtwoord in.</h3>

                            {/* Form */}
                            <div className={cn([
                                globalStyles['container__inputs'],
                                globalStyles['global-margin-top-x2']
                            ])}>
                                <div className={globalStyles['input-text']}>
                                    <input 
                                        type="password" 
                                        placeholder="Jouw nieuwe wachtwoord (minimaal 8 tekens)" 
                                        id="password"
                                        value={itemObject.password}
                                        onChange={e => {
                                            FUNC__CreateObject(
                                                "password", 
                                                e.target.value,
                                                itemObject,
                                                setItemObject
                                            ); 
                                        }}/>
                                        {
                                            errorMessage.field_id == "password"
                                            &&
                                            <div className={globalStyles['container__error']}>{errorMessage.message}</div>
                                        }
                                </div>
                                <div className={cn([
                                    globalStyles['input-text'],
                                    globalStyles['global-margin-top-item']
                                ])}>
                                    <input 
                                        type="password" 
                                        placeholder="Herhaal jouw nieuwe wachtwoord" 
                                        id="password-repeat"
                                        value={itemObject.password_repeat}
                                        onChange={e => {
                                            FUNC__CreateObject(
                                                "password_repeat", 
                                                e.target.value,
                                                itemObject,
                                                setItemObject
                                            ); 
                                        }}/>
                                        {
                                            errorMessage.field_id == "password-repeat"
                                            &&
                                            <div className={globalStyles['container__error']}>{errorMessage.message}</div>
                                        }
                                </div>
                            </div>
                        </>
                    }

                    {/* Success message */}
                    {
                        succesMessage
                        &&
                        <>
                            <div className={cn([
                                globalStyles['global-text-align-center'],
                                globalStyles['global-margin-bottom']
                            ])}>
                                <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['check-circle'].toSvg({height: '10vw', width: '10vw', color: "#009371"})}}></i>
                            </div>
                            <h1 className={globalStyles['container__title']}>Jouw wachtwoord is hersteld</h1>
                            <h3 className={cn([
                                globalStyles['container__subtitle'],
                                globalStyles['global-margin-top-item']
                            ])}>Je wordt nu doorverwezen naar de inlogpagina.</h3>
                        </>
                    }

                    {/* Error messages */}
                    {
                        errorMessage.field_id == "user-empty"
                        &&
                        <div className={cn([
                            globalStyles['container__error'],
                            globalStyles['global-margin-top'],
                            globalStyles['global-center-item']
                        ])}>{errorMessage.message}</div>
                    }

                    {/* Submit button */}
                    {
                        !dataIsLoading
                        && !succesMessage
                        &&
                        <button className={cn([
                            globalStyles['global-button'],
                            globalStyles['global-transition-duration'],
                            globalStyles['global-fontsize-normal'],
                            globalStyles['global-margin-top-x2'],
                            globalStyles['global-button-hover']
                        ])} onClick={() => FUNC__Submit(
                            itemObject,
                            setErrorMessage,
                            setDataIsLoading,
                            setSuccesMessage
                        )}>
                            Opslaan
                        </button>
                    }

                    {/* Loader */}
                    {
                        dataIsLoading
                        &&
                        <div className={cn([
                            globalStyles['global-margin-top-x2'],
                            globalStyles['global-padding-bottom-x2']
                        ])}>
                            <GlobalComponentLoadingData type={"loadMore"} />
                        </div>
                    }
                    {
                        !succesMessage
                        &&
                        <>
                            <div className={cn([
                                globalStyles['global-seperator-with-text'],
                                globalStyles['global-margin-top-x2']
                            ])}>
                                <div className={globalStyles['global-seperator-with-text__line']}></div>
                                <div className={globalStyles['global-seperator-with-text__content']}>OF</div>
                                <div className={globalStyles['global-seperator-with-text__line']}></div>
                            </div>
                            <div className={cn([
                                globalStyles['container__terms'],
                                globalStyles['global-margin-top-x2']
                            ])}>
                                <div>Heb je nog geen account? <a href="./create">Account aanmaken</a></div>
                                <div>Nieuwe verzoek aanvragen? <a href="./reset-password">Wachtwoord herstellen</a></div>
                            </div>
                        </>
                    }
                </div>
            </div>
        </div>
    );
};