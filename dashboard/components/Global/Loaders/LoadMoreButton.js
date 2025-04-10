// React / NextJs components
import * as featherIcon from 'feather-icons';
// Page styles
import globalStyles from '../../../styles/global.module.scss';
/*
*
*
* 
* 
    REF:GlobalComponentLoadMoreButton
    WHAT IS IT: 
        The generated view for the load more button
*
*
* 
* 
*/
export function GlobalComponentLoadMoreButton(props){
    return(
        <div className={globalStyles['global-loader-button']}>
            <button
                className={globalStyles['global-transition-duration']}
                onClick={() => props.FUNC__LoadMoreData(
                    props.params
                )}>
                <i dangerouslySetInnerHTML={{__html: featherIcon.icons['refresh-cw'].toSvg({height: "1vw", width: "1vw"})}}></i>
                <div className={globalStyles['global-fontsize-subtext']}>Meer {props.value == undefined ? "items" : props.value} laden</div>
            </button>
        </div>
    );
}