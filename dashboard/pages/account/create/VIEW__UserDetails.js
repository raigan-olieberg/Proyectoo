// React / NextJs components
import cn from 'classnames';
// Global / Page / Layout components
import GlobalComponentLoadingData from '../../../components/Global/Loaders/LoadingData';
// Page styles
import globalStyles from '../../../styles/global.module.scss';

const VIEW__UserDetails = (props) => {
    return (
        <div className={globalStyles['account-authentication__create']}>
            <div className={globalStyles['container']}>
                {/* Title */}
                <h1 className={globalStyles['container__title']}>Welkom bij Proyectoo</h1>

                {/* SubTitle */}
                <h3 className={cn([
                    globalStyles['container__subtitle'],
                    globalStyles['global-margin-top-item']
                ])}>Probeer het 30 dagen uit. Geen creditcard nodig.</h3>

                {/* Form */}
                <div className={cn([
                    globalStyles['container__inputs'],
                    globalStyles['global-margin-top-x2']
                ])}>
                    <div className={globalStyles['input-text']}>
                        <input 
                            type="text" 
                            placeholder="Voornaam" 
                            id="firstname"
                            value={props.itemObject.user.firstname}
                            onChange={e => {
                                props.FUNC__CreateObject(
                                    "user[firstname]", 
                                    e.target.value,
                                    true,
                                    props.itemObject,
                                    props.setItemObject
                                ); 
                            }}/>
                            {
                                props.errorMessage.field_id == "user-firstname"
                                &&
                                <div className={globalStyles['container__error']}>{props.errorMessage.message}</div>
                            }
                    </div>
                    <div className={cn([
                        globalStyles['input-text'],
                        globalStyles['global-margin-top-item']
                    ])}>
                        <input 
                            type="text" 
                            placeholder="Achternaam" 
                            id="lastname"
                            value={props.itemObject.user.lastname}
                            onChange={e => {
                                props.FUNC__CreateObject(
                                    "user[lastname]", 
                                    e.target.value,
                                    true,
                                    props.itemObject,
                                    props.setItemObject
                                ); 
                            }}/>
                            {
                                props.errorMessage.field_id == "user-lastname"
                                &&
                                <div className={globalStyles['container__error']}>{props.errorMessage.message}</div>
                            }
                        </div>
                    <div className={cn([
                        globalStyles['input-text'],
                        globalStyles['global-margin-top-item']
                    ])}>
                        <input 
                            type="text" 
                            placeholder="Zakelijke e-mail" 
                            id="email"
                            value={props.itemObject.user.email}
                            onChange={e => {
                                props.FUNC__CreateObject(
                                    "user[email]", 
                                    e.target.value,
                                    false,
                                    props.itemObject,
                                    props.setItemObject
                                ); 
                            }}/>
                            {
                                props.errorMessage.field_id == "user-email"
                                &&
                                <div className={globalStyles['container__error']}>{props.errorMessage.message}</div>
                            }
                        </div>
                    <div className={cn([
                        globalStyles['input-text'],
                        globalStyles['global-margin-top-item']
                    ])}>
                        <input 
                            type="password" 
                            placeholder="Wachtwoord (minimaal 8 tekens)" 
                            id="password"
                            value={props.itemObject.user.password}
                            onChange={e => {
                                props.FUNC__CreateObject(
                                    "user[password]", 
                                    e.target.value,
                                    false,
                                    props.itemObject,
                                    props.setItemObject
                                ); 
                            }}/>
                            {
                                props.errorMessage.field_id == "user-password"
                                &&
                                <div className={globalStyles['container__error']}>{props.errorMessage.message}</div>
                            }
                        </div>
                </div>

                {/* Error messages */}
                {
                    props.errorMessage.field_id == "user-empty"
                    &&
                    <div className={cn([
                        globalStyles['container__error'],
                        globalStyles['global-margin-top'],
                        globalStyles['global-center-item']
                    ])}>{props.errorMessage.message}</div>
                }

                {/* Submit button */}
                {
                    !props.dataIsLoading
                    &&
                    <button className={cn([
                        globalStyles['global-button'],
                        globalStyles['global-transition-duration'],
                        globalStyles['global-fontsize-normal'],
                        globalStyles['global-margin-top-x2'],
                        globalStyles['global-button-hover']
                    ])} onClick={() => props.FUNC__Submit(
                        props.step, 
                        props.setStep,
                        props.itemObject,
                        props.setItemObject,
                        props.setErrorMessage,
                        props.setDataIsLoading
                    )}>
                        Doorgaan
                    </button>
                }

                {/* Loader */}
                {
                    props.dataIsLoading
                    &&
                    <div className={cn([
                        globalStyles['global-margin-top-x2'],
                        globalStyles['global-padding-bottom-x2']
                    ])}>
                        <GlobalComponentLoadingData type={"loadMore"} />
                    </div>
                }

                {/* Privacy & terms of service */}
                <div className={cn([
                    globalStyles['container__terms'],
                    globalStyles['global-margin-top-x2']
                ])}>Door verder te gaan, ga je akkoord met de <a href="https://proyectoo.com/terms-of-use">Gebruiksvoorwaarden</a> en het <a href="https://proyectoo.com/privacy">Privacybeleid</a>.</div>
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
                    <div>Heb je al een account? <a href="./login">Inloggen</a></div>
                </div>
            </div>
        </div>
    );
}
export default VIEW__UserDetails;