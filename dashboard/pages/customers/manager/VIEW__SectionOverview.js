// React / NextJs components
import cn from 'classnames';
// Global / Page / Layout components
import { 
    FUNC__EditCustomer,
    FUNC__LoadMoreCustomers
} from './Controller';
import GlobalComponentDynamicMessage from '../../../components/Global/Alerts/DynamicMessage';
import { GlobalComponentLoadMoreButton } from '../../../components/Global/Loaders/LoadMoreButton';
import GlobalComponentLoadingData from '../../../components/Global/Loaders/LoadingData';
// Page styles
import globalStyles from '../../../styles/global.module.scss';

const VIEW__SectionOverview = (props) => {
    return(
        <div className={globalStyles['content-body-with-header__body']}>
            {/* Content */}
            {
                props.dataHasLoaded
                && props.customersObject.length > 0
                &&
                props.customersObject.map(item => (
                    <button 
                        key={item.customer_id} 
                        className={cn([
                            globalStyles['global-item'],
                            globalStyles['global-item__standard-grid'],
                            globalStyles['global-hover-standard'],
                            globalStyles['global-margin-bottom-item'],
                            globalStyles['global-transition-duration'],
                            globalStyles['global-grid-5']
                    ])} onClick={() => FUNC__EditCustomer(
                            props.appContext,
                            props.customersObject,
                            props.setCustomersObject,
                            item
                        )}>  
                        <div className={cn([
                            globalStyles['item'],
                            globalStyles['global-display-flex-center'],
                            globalStyles['global-text-align-center']
                        ])}>{item.name}</div>
                        <div className={cn([
                            globalStyles['item'],
                            globalStyles['global-display-flex-center'],
                            globalStyles['global-text-align-center']
                        ])}>{item.contactperson}</div>
                        <div className={cn([
                            globalStyles['item'],
                            globalStyles['global-display-flex-center'],
                            globalStyles['global-text-align-center']
                        ])}>{item.email}</div>
                        <div className={cn([
                            globalStyles['item'],
                            globalStyles['global-display-flex-center'],
                            globalStyles['global-text-align-center']
                        ])}>{item.phonenumber != '' ? item.phonenumber : '-'}</div>
                        <div className={cn([
                            globalStyles['item'],
                            globalStyles['global-display-flex-center'],
                            globalStyles['global-text-align-center']
                        ])}>{item.linked_projects.length}</div>
                    </button>
                ))
            }

            {/* Empty message */}
            {
                props.dataHasLoaded
                && props.customersObject.length == 0
                &&
                <GlobalComponentDynamicMessage
                    showTitle={true}/>
            }

            {/* Loader */}
            {
                !props.dataHasLoaded
                &&
                <GlobalComponentLoadingData
                    type={'firstTimeLoading'}/>
            }

            {/* Load more customers */}
            {
                props.dataHasLoaded
                && !props.loadingMoreData
                && props.lastVisible != null
                &&
                <div className={cn([
                    globalStyles['global-margin-top-x2'],
                    globalStyles['global-padding-bottom-x2']
                ])}>
                    <GlobalComponentLoadMoreButton 
                        value={'klanten'}
                        FUNC__LoadMoreData={FUNC__LoadMoreCustomers}
                        params={[
                            props.setLoadingMoreData,
                            props.appContext.globalContext.authenticate.user.organization_id,
                            props.customersObject,
                            props.setCustomersObject,
                            props.lastVisible,
                            props.setLastVisible
                        ]}/>
                </div>
            }
            {
                props.loadingMoreData
                &&
                <div className={cn([
                    globalStyles['global-margin-top-x2'],
                    globalStyles['global-padding-bottom-x2']
                ])}>
                    <GlobalComponentLoadingData type={"loadMore"} />
                </div>
            }
        </div>
    );
}
export default VIEW__SectionOverview;