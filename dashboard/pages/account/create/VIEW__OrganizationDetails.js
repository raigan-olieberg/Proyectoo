// React / NextJs components
import cn from 'classnames';
// Global / Page / Layout components
import GlobalComponentLoadingData from '../../../components/Global/Loaders/LoadingData';
// Page styles
import globalStyles from '../../../styles/global.module.scss';

const VIEW__OrganizationDetails = (props) => {
    return (
        <div className={globalStyles['account-authentication__create']}>
            <div className={globalStyles['container']}>
                {/* Title */}
                <h1 className={cn([
                    globalStyles['container__subtitle'],
                    globalStyles['global-margin-top-item']
                ])}>Vertel ons iets meer over jouw bedrijf</h1>

                {/* Form */}
                <div className={cn([
                    globalStyles['container__inputs'],
                    globalStyles['global-margin-top-x2']
                ])}>
                    <div className={globalStyles['input-text']}>
                        <input 
                            type="text" 
                            placeholder="Bedrijfsnaam" 
                            id="name"
                            value={props.itemObject.organization.name}
                            onChange={e => {
                                props.FUNC__CreateObject(
                                    "organization[name]", 
                                    e.target.value,
                                    true,
                                    props.itemObject,
                                    props.setItemObject
                                ); 
                            }}/>
                    </div>
                    <div className={cn([
                        globalStyles['global-margin-top-item'],
                        globalStyles['global-grid-2'],
                        globalStyles['global-grid-gap-column-small']
                    ])}>
                        <div className={cn([
                            globalStyles['input-text']
                        ])}>
                            <input 
                                type="text" 
                                placeholder="Straatnaam" 
                                id="street"
                                value={props.itemObject.organization.street}
                                onChange={e => {
                                    props.FUNC__CreateObject(
                                        "organization[street]", 
                                        e.target.value,
                                        true,
                                        props.itemObject,
                                        props.setItemObject
                                    ); 
                                }}/>
                        </div>
                        <div className={cn([
                            globalStyles['input-text']
                        ])}>
                            <input 
                                type="number" 
                                placeholder="Huisnummer" 
                                id="housenumber"
                                value={props.itemObject.organization.housenumber}
                                onChange={e => {
                                    props.FUNC__CreateObject(
                                        "organization[housenumber]", 
                                        e.target.value,
                                        false,
                                        props.itemObject,
                                        props.setItemObject
                                    ); 
                                }}/>
                        </div>
                    </div>
                    <div className={cn([
                       globalStyles['global-margin-top-item'],
                       globalStyles['global-grid-2'],
                       globalStyles['global-grid-gap-column-small']
                    ])}>
                        <div className={cn([
                            globalStyles['input-text']
                        ])}>
                            <input 
                                type="text" 
                                placeholder="Plaats" 
                                id="place"
                                value={props.itemObject.organization.place}
                                onChange={e => {
                                    props.FUNC__CreateObject(
                                        "organization[place]", 
                                        e.target.value,
                                        true,
                                        props.itemObject,
                                        props.setItemObject
                                    ); 
                                }}/>
                        </div>
                        <div className={cn([
                            globalStyles['input-text']
                        ])}>
                            <input 
                                type="text" 
                                placeholder="Postcode" 
                                id="zipcode"
                                value={props.itemObject.organization.zipcode}
                                onChange={e => {
                                    props.FUNC__CreateObject(
                                        "organization[zipcode]", 
                                        e.target.value,
                                        false,
                                        props.itemObject,
                                        props.setItemObject
                                    ); 
                                }}/>
                        </div>
                    </div>
                </div>

                {/* Error messages */}
                {
                    props.errorMessage.field_id == "organization-empty"
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
                        props.setDataIsLoading,
                        props.setLoginSuccessfull
                    )}>
                        Ga aan de slag
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
            </div>
        </div>
    );
}
export default VIEW__OrganizationDetails;