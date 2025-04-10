// React / NextJs components
import cn from 'classnames';
import { useState, useEffect } from 'react';
// Global / Page / Layout components
import GlobalComponentLoadingData from '../../../components/Global/Loaders/LoadingData';
import { 
    FUNC__CreateObject,
    FUNC__Submit
} from './Controller';
// Page styles
import globalStyles from '../../../styles/global.module.scss';

export default function Index(){
    const [dataIsLoading, setDataIsLoading] = useState(false);
    const [succesMessage, setSuccesMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState({
        field_id: "",
        message: ""
    });
    const [itemObject, setItemObject] = useState(
        {
            email: ""
        }
    );
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
                            <h1 className={globalStyles['container__title']}>Wachtwoord vergeten?</h1>

                            {/* Subtitle */}
                            <h3 className={cn([
                                globalStyles['container__subtitle'],
                                globalStyles['global-margin-top-item']
                            ])}>We zullen jou een e-mail sturen om jouw wachtwoord te herstellen.</h3>

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
                                        value={itemObject.email}
                                        onChange={e => {
                                            FUNC__CreateObject(
                                                "email", 
                                                e.target.value,
                                                setItemObject
                                            ); 
                                        }}/>
                                        {
                                            errorMessage.field_id == "user-email"
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
                            <h1 className={globalStyles['container__title']}>Check jouw e-mail</h1>
                            <h3 className={cn([
                                globalStyles['container__subtitle'],
                                globalStyles['global-margin-top-item']
                            ])}>Wij hebben een e-mail verstuurd naar {itemObject.email} met daarin de instructies om jouw wachtwoord te herstellen.</h3>
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
                            Wachtwoord resetten
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

                    {/* Create account & login button*/}
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
                        <div className={globalStyles['global-margin-top-item']}>Kan je jouw wachtwoord weer herinneren? <a href="./login">Inloggen</a></div>
                    </div>
                </div>
            </div>
        </div>
    );
};