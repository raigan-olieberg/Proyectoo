// React / NextJs components
import cn from 'classnames';
// Page styles
import globalStyles from '../../../styles/global.module.scss';

const GlobalComponentDynamicMessage = (props) => {
    return (
        <section className={cn([
            globalStyles['global-emptymessage'],
            //globalStyles['global-margin-top-x2'],
            globalStyles['global-width-60'],
            globalStyles['global-center-item']
        ])}>
            <div className={globalStyles['global-emptymessage__content']}>
                <div className={globalStyles['global-emptymessage__message']}>
                    {
                        props.showTitle
                        && !props.title
                        &&
                        <div>Hier is nog niks te zien.</div>
                    }
                    {
                        props.showTitle
                        && props.title
                        &&
                        <div>{props.title}</div>
                    }
                    <div className={cn({
                        [globalStyles['global-margin-top-item']]:true,
                        [globalStyles['global-fontsize-normal']]:props.messageSizeSmaller
                    })}>{props.message}</div>
                </div>
                {/*<button className={cn([
                    globalStyles['global-button'],
                    globalStyles['global-button-hover'],
                    globalStyles['global-transition-duration'],
                    globalStyles['global-display-flex'],
                    globalStyles['global-margin-top']
                ])} onClick={() => props.FUNC__OnclickAction()}>
                    <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['check'].toSvg({height: "1vw", width: "1vw"})}}></i>
                    {props.buttonTitle}
                </button>*/}
            </div>
        </section>
    );
}
export default GlobalComponentDynamicMessage;