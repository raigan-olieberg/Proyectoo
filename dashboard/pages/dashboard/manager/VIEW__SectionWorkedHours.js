// React / NextJs components
import cn from 'classnames';
import * as featherIcon from 'feather-icons';
import Link from 'next/link';
// Global / Page / Layout components
import LayoutComponentLoggedinPage from '../../../components/Layouts/LoggedinPage';
import { GLOBALFUNC__CalculatePercentage } from '../../../helpers/GlobalFunctions';
// Page styles
import globalStyles from '../../../styles/global.module.scss';


const VIEW__SectionWorkedHours = (props) => {
    return (
        <div className={cn([
            globalStyles['top-left'],
            globalStyles['dashboardview-content']
        ])}>
            {/* Header */}
            <div className={globalStyles['dashboardview-content__header']}>
                <i className={globalStyles['global-button__icon']} dangerouslySetInnerHTML={{__html: featherIcon.icons['clock'].toSvg({height: '1vw', width: '1vw'})}}></i>
                Gewerkte uren
            </div>

            {/* Content */}
            <div className={globalStyles['dashboardview-content__content']}>
                <div className={cn([
                    globalStyles['content-wrapper'],
                    globalStyles['content-wrapper__workedhours']
                ])}>
                    {/* Workedhours this month */}
                    <Link href="../worked-hours/manager?month=current-month" className={globalStyles['workedhours-item']}>
                        <div className={globalStyles['single-chart']}>
                            <svg viewBox="0 0 36 36" className={cn([
                                globalStyles['circular-chart'],
                                globalStyles['green']
                            ])}>
                            <path className={cn([
                                globalStyles['circle'],
                                globalStyles['global-transition-duration']
                            ])}
                                strokeDasharray={
                                    GLOBALFUNC__CalculatePercentage(props.workedhoursObject.analytics.months['1'].filled, 
                                    props.workedhoursObject.analytics.months['1'].total
                                )+", 100"}
                                d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <text x="18" y="20.35" className={globalStyles['percentage']}>
                                {GLOBALFUNC__CalculatePercentage(props.workedhoursObject.analytics.months['1'].filled, props.workedhoursObject.analytics.months['1'].total)}%
                            </text>
                            </svg>
                        </div>
                        <div className={globalStyles['workedhours-item']}>{props.workedhoursObject.month}</div>
                    </Link>

                    {/* Seperator */}
                    <div className={globalStyles['global-seperator__horizontal']}></div>

                    {/* Workedhours this week */}
                    <Link href="../worked-hours/manager?week=current-week" className={globalStyles['workedhours-item']}>
                        <div className={globalStyles['single-chart']}>
                            <svg viewBox="0 0 36 36" className={cn([
                                globalStyles['circular-chart'],
                                globalStyles['green']
                            ])}>
                            <path className={cn([
                                globalStyles['circle'],
                                globalStyles['global-transition-duration']
                            ])}
                                strokeDasharray={
                                    GLOBALFUNC__CalculatePercentage(props.workedhoursObject.analytics.weeks['1'].filled, 
                                    props.workedhoursObject.analytics.weeks['1'].total
                                )+", 100"}
                                d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <text x="18" y="20.35" className={globalStyles['percentage']}>{GLOBALFUNC__CalculatePercentage(props.workedhoursObject.analytics.weeks['1'].filled, props.workedhoursObject.analytics.weeks['1'].total)}%</text>
                            </svg>
                        </div>
                        <div className={globalStyles['workedhours-item__title']}>{props.workedhoursObject.week}</div>
                    </Link>
                </div>
            </div>
        </div>
    );
};
VIEW__SectionWorkedHours.getLayout = (page) => {
    return (
        <LayoutComponentLoggedinPage>{page}</LayoutComponentLoggedinPage>
    );
};

export default VIEW__SectionWorkedHours;