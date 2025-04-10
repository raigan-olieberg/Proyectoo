// React / NextJs components
import cn from 'classnames';
import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
// Global / Page / Layout components
import GlobalComponentLoadingData from '../../../components/Global/Loaders/LoadingData';
import { 
    FUNC__CreateObject,
    FUNC__Submit
} from './Controller';
// Page styles
import globalStyles from '../../../styles/global.module.scss';

export default function Index(){
    const router = useRouter();
    const [useAppMessage, setUseAppMessage] = useState(false);
    const [dataIsLoading, setDataIsLoading] = useState(false);
    const [loginSuccessfull, setLoginSuccessfull] = useState(false);
    const [errorMessage, setErrorMessage] = useState({
        field_id: "",
        message: ""
    });
    const [itemObject, setItemObject] = useState(
        {
            user: {
                email: "",
                password: ""
            },
            organization: null
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
            <div className={globalStyles['account-authentication__login']}>
                <div className={globalStyles['container']}>
                    {
                        !useAppMessage
                        &&
                        <>
                            {/* Title */}
                            <h1 className={globalStyles['container__title']}>Welkom bij Proyectoo</h1>

                            {/* Subtitle */}
                            <h3 className={cn([
                                globalStyles['container__subtitle'],
                                globalStyles['global-margin-top-item']
                            ])}>Log in op je account</h3>

                            {/* Form */}
                            <div className={cn([
                                globalStyles['container__inputs'],
                                globalStyles['global-margin-top-x2']
                            ])}>
                                <div className={globalStyles['input-text']}>
                                    <input 
                                        type="text" 
                                        placeholder="Zakelijke e-mail" 
                                        id="email"
                                        value={itemObject.user.email}
                                        onChange={e => {
                                            FUNC__CreateObject(
                                                "user[email]", 
                                                e.target.value,
                                                false,
                                                itemObject,
                                                setItemObject
                                            ); 
                                        }}/>
                                        {
                                            errorMessage.field_id == "user-email"
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
                                        placeholder="Wachtwoord" 
                                        id="password"
                                        value={itemObject.user.password}
                                        onChange={e => {
                                            FUNC__CreateObject(
                                                "user[password]", 
                                                e.target.value,
                                                false,
                                                itemObject,
                                                setItemObject
                                            ); 
                                        }}/>
                                    {
                                        errorMessage.field_id == "user-password"
                                        &&
                                        <div className={globalStyles['container__error']}>{errorMessage.message}</div>
                                    }
                                </div>
                            </div>
                        </>
                    }

                    {/* Error messages */}
                    {
                        useAppMessage
                        &&
                        <>
                            <h1 className={globalStyles['container__title']}>Je hebt geen toegang</h1>
                            <h3 className={cn([
                                globalStyles['container__subtitle'],
                                globalStyles['global-margin-top-item']
                            ])}>Met jouw type account kan je alleen inloggen via onze mobiele app.</h3>
                            <h3 className={cn([
                                globalStyles['container__subtitle'],
                                globalStyles['global-margin-top-item']
                            ])}>Deze kan je downloaden via de <a href="">Google Play Store</a> en <a href="">Apple App Store</a>.</h3>
                        </>
                    }
                    {
                        errorMessage.field_id == "user-empty"
                        &&
                        <div className={cn([
                            globalStyles['container__error'],
                            globalStyles['global-margin-top'],
                            globalStyles['global-center-item']
                        ])}>{errorMessage.message}</div>
                    }

                    {/* Submit buttons */}
                    {
                        !dataIsLoading
                        && !useAppMessage
                        &&
                        <button className={cn([
                            globalStyles['global-button'],
                            globalStyles['global-transition-duration'],
                            globalStyles['global-fontsize-normal'],
                            globalStyles['global-margin-top-x2'],
                            globalStyles['global-button-hover']
                        ])} onClick={() => FUNC__Submit(
                            itemObject,
                            setItemObject,
                            setErrorMessage,
                            setDataIsLoading,
                            setUseAppMessage,
                            setLoginSuccessfull
                        )}>
                            Inloggen
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

                    {/* Create account & go back button */}
                    {
                        !useAppMessage
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
                                <div className={globalStyles['global-margin-top-item']}>Wachtwoord vergeten? <a href="./reset-password">Wachtwoord herstellen</a></div>
                            </div>
                        </>
                    }
                    {
                        useAppMessage
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
                                <div>Terug naar <a href="./login">inlogpagina</a></div>
                            </div>
                        </>
                    }
                </div>
            </div>
        </div>
    );
};