// React / NextJs components
import cn from 'classnames';
import * as featherIcon from 'feather-icons';
// Page styles
import globalStyles from '../../../styles/global.module.scss';

const GlobalComponentEmptyMessage = (props) => {
    return (
        <section className={cn([
            globalStyles['global-emptymessage'],
            globalStyles['global-margin-top-x2']
        ])}>
            <div className={globalStyles['global-emptymessage__content']}>
                <div className={globalStyles['global-emptymessage__message']}>
                    <div>Hier is nog niks te zien.</div>
                    <div className={globalStyles['global-margin-top-item']}>Klik op de knop hieronder om dit te veranderen.</div>
                </div>
                <button className={cn([
                    globalStyles['global-button'],
                    globalStyles['global-button-hover'],
                    globalStyles['global-transition-duration'],
                    globalStyles['global-display-flex'],
                    globalStyles['global-margin-top']
                ])} onClick={() => props.FUNC__OnclickAction()}>
                    <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['check'].toSvg({height: "1vw", width: "1vw"})}}></i>
                    {props.buttonTitle}
                </button>
            </div>
        </section>
    );
}
export default GlobalComponentEmptyMessage;