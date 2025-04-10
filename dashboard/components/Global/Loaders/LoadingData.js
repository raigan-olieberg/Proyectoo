// React / NextJs components
import cn from 'classnames';
// Page styles
import globalStyles from '../../../styles/global.module.scss';

const GlobalComponentLoadingData = (props) => {
    return (
        <>
        {
            props.type == "firstTimeLoading"
            &&
            <div className={globalStyles['global-loading-data']}>
                <div className={globalStyles['global-loading-data__center']}>
                    <div className={globalStyles['loader']}></div>
                </div>
            </div>
        }
        {
            props.type == "firstTimeLoading_members-big"
            &&
            <div className={cn([
                globalStyles['global-loader'],
                globalStyles['global-loader__member-big'],
                globalStyles['global-margin-bottom']
            ])}></div>
        }
        {
            props.type == "loadMore"
            &&
            <div className={globalStyles['global-loading-data']}>
                <div className={globalStyles['global-loading-data__bottom']}>
                    <div className={globalStyles['loader']}></div>
                </div>
            </div>
        }
        </>
    );
}
export default GlobalComponentLoadingData;