// React / NextJs components
'use client';
import { useContext } from 'react';
import cn from 'classnames';
import * as featherIcon from 'feather-icons';
import { usePathname } from 'next/navigation'
import Link from 'next/link';
// Global / Page / Layout components
import AppContext from '/helpers/AppContext';
// Page styles
import globalStyles from '../../styles/global.module.scss';

const GlobalComponentMenu = () => {
    const appContext = useContext(AppContext);
    const currentPage = usePathname();
    const setActive = (item) => {
        return (currentPage.includes(item)) ? true : false;
    }
    const setIconFill = (item) => {
        return (currentPage.includes(item)) ? {height: ".9vw", with: ".9vw", color: "#00604a"} : {height: ".9vw", with: ".9vw"};
    }
    return (
        <nav className={globalStyles['global-menu']}>
            <div className={globalStyles['global-menu__top']}>
                <Link href="http://localhost:3000/dashboard/manager" className={cn({
                    [globalStyles['menu-button']]:true,
                    [globalStyles['menu-active']]:setActive('/dashboard'),
                    [globalStyles['global-transition-duration']]:true
                })}>
                    {
                        setActive('/dashboard')
                        &&
                        <div className={globalStyles['button-active-indicator']}></div>
                    }
                    {
                        !setActive('/dashboard')
                        &&
                        <div className={globalStyles['button-inactive-indicator']}></div>
                    }
                    <div className={globalStyles['button-label']}>
                        <i dangerouslySetInnerHTML={{__html: featherIcon.icons['home'].toSvg(setIconFill('/dashboard'))}}></i>
                        <div>Dashboard</div>
                    </div>
                </Link>
                <Link href="http://localhost:3000/projects/manager" className={cn({
                    [globalStyles['menu-button']]:true,
                    [globalStyles['menu-active']]:setActive('/projects'),
                    [globalStyles['global-transition-duration']]:true
                })}>
                    {
                        setActive('/projects')
                        &&
                        <div className={globalStyles['button-active-indicator']}></div>
                    }
                    {
                        !setActive('/projects')
                        &&
                        <div className={globalStyles['button-inactive-indicator']}></div>
                    }
                    <div className={globalStyles['button-label']}>
                        <i dangerouslySetInnerHTML={{__html: featherIcon.icons['folder'].toSvg(setIconFill('/projects'))}}></i>
                        <div>Projecten</div>
                    </div>
                </Link>
                <Link href="http://localhost:3000/tasks/manager" className={cn({
                    [globalStyles['menu-button']]:true,
                    [globalStyles['menu-active']]:setActive('/tasks'),
                    [globalStyles['global-transition-duration']]:true
                })}>
                    {
                        setActive('/tasks')
                        &&
                        <div className={globalStyles['button-active-indicator']}></div>
                    }
                    {
                        !setActive('/tasks')
                        &&
                        <div className={globalStyles['button-inactive-indicator']}></div>
                    }
                    <div className={globalStyles['button-label']}>
                        <i dangerouslySetInnerHTML={{__html: featherIcon.icons['clipboard'].toSvg(setIconFill('/tasks'))}}></i>
                        <div>Taken</div>
                    </div>
                </Link>
                <Link href="http://localhost:3000/problems/manager" className={cn({
                    [globalStyles['menu-button']]:true,
                    [globalStyles['menu-active']]:setActive('/problems'),
                    [globalStyles['global-transition-duration']]:true
                })}>
                    {
                        setActive('/problems')
                        &&
                        <div className={globalStyles['button-active-indicator']}></div>
                    }
                    {
                        !setActive('/problems')
                        &&
                        <div className={globalStyles['button-inactive-indicator']}></div>
                    }
                    <div className={globalStyles['button-label']}>
                        <i dangerouslySetInnerHTML={{__html: featherIcon.icons['alert-triangle'].toSvg(setIconFill('/problems'))}}></i>
                        <div>Problemen</div>
                    </div>
                </Link>
                <Link href="http://localhost:3000/resources/manager" className={cn({
                    [globalStyles['menu-button']]:true,
                    [globalStyles['menu-active']]:setActive('/resources'),
                    [globalStyles['global-transition-duration']]:true
                })}>
                    {
                        setActive('/resources')
                        &&
                        <div className={globalStyles['button-active-indicator']}></div>
                    }
                    {
                        !setActive('/resources')
                        &&
                        <div className={globalStyles['button-inactive-indicator']}></div>
                    }
                    <div className={globalStyles['button-label']}>
                        <i dangerouslySetInnerHTML={{__html: featherIcon.icons['user'].toSvg(setIconFill('/resources'))}}></i>
                        <div>Resources</div>
                    </div>
                </Link>
                {
                    appContext.globalContext.authenticate.user.role == 'Admin'
                    &&
                    <Link href="http://localhost:3000/customers/manager" className={cn({
                        [globalStyles['menu-button']]:true,
                        [globalStyles['menu-active']]:setActive('/customers'),
                        [globalStyles['global-transition-duration']]:true
                    })}>
                        {
                        setActive('/customers')
                        &&
                        <div className={globalStyles['button-active-indicator']}></div>
                    }
                    {
                        !setActive('/customers')
                        &&
                        <div className={globalStyles['button-inactive-indicator']}></div>
                    }
                        <div className={globalStyles['button-label']}>
                            <i dangerouslySetInnerHTML={{__html: featherIcon.icons['users'].toSvg(setIconFill('/customers'))}}></i>
                            <div>Klanten</div>
                        </div>
                    </Link>
                }
                <Link href="http://localhost:3000/resource-planning/manager" className={cn({
                    [globalStyles['menu-button']]:true,
                    [globalStyles['menu-active']]:setActive('/resource-planning'),
                    [globalStyles['global-transition-duration']]:true
                })}>
                    {
                        setActive('/resource-planning')
                        &&
                        <div className={globalStyles['button-active-indicator']}></div>
                    }
                    {
                        !setActive('/resource-planning')
                        &&
                        <div className={globalStyles['button-inactive-indicator']}></div>
                    }
                    <div className={globalStyles['button-label']}>
                        <i dangerouslySetInnerHTML={{__html: featherIcon.icons['calendar'].toSvg(setIconFill('/resource-planning'))}}></i>
                        <div>Resource planning</div>
                    </div>
                </Link>
                <Link href="http://localhost:3000/leave-of-absence/manager" className={cn({
                    [globalStyles['menu-button']]:true,
                    [globalStyles['menu-active']]:setActive('/leave-of-absence'),
                    [globalStyles['global-transition-duration']]:true
                })}>
                    {
                        setActive('/leave-of-absence')
                        &&
                        <div className={globalStyles['button-active-indicator']}></div>
                    }
                    {
                        !setActive('/leave-of-absence')
                        &&
                        <div className={globalStyles['button-inactive-indicator']}></div>
                    }
                    <div className={globalStyles['button-label']}>
                        <i dangerouslySetInnerHTML={{__html: featherIcon.icons['briefcase'].toSvg(setIconFill('/leave-of-absence'))}}></i>
                        <div>Verlof</div>
                    </div>
                </Link>
                <Link href="http://localhost:3000/worked-hours/manager" className={cn({
                    [globalStyles['menu-button']]:true,
                    [globalStyles['menu-active']]:setActive('/worked-hours'),
                    [globalStyles['global-transition-duration']]:true
                })}>
                    {
                        setActive('/worked-hours')
                        &&
                        <div className={globalStyles['button-active-indicator']}></div>
                    }
                    {
                        !setActive('/worked-hours')
                        &&
                        <div className={globalStyles['button-inactive-indicator']}></div>
                    }
                    <div className={globalStyles['button-label']}>
                        <i dangerouslySetInnerHTML={{__html: featherIcon.icons['clock'].toSvg(setIconFill('/worked-hours'))}}></i>
                        <div>Gewerkte uren</div>
                    </div>
                </Link>
                <Link href="http://localhost:3000/settings" className={cn({
                    [globalStyles['menu-button']]:true,
                    [globalStyles['menu-active']]:currentPage == "/settings",
                    [globalStyles['global-transition-duration']]:true
                })}>
                    {
                        setActive('/settings')
                        &&
                        <div className={globalStyles['button-active-indicator']}></div>
                    }
                    {
                        !setActive('/settings')
                        &&
                        <div className={globalStyles['button-inactive-indicator']}></div>
                    }
                    <div className={globalStyles['button-label']}>
                        <i dangerouslySetInnerHTML={{__html: featherIcon.icons['settings'].toSvg(setIconFill('/settings'))}}></i>
                        <div>Instellingen</div>
                    </div>
                </Link>
            </div>
            <div className={globalStyles['global-menu__bottom']}>
                <Link href="http://localhost:3000/dashboard" className={cn({
                    [globalStyles['menu-button']]:true,
                    [globalStyles['menu-active']]:setActive('/report-bug'),
                    [globalStyles['global-transition-duration']]:true
                })}>
                    {
                        setActive('/report-bug')
                        &&
                        <div className={globalStyles['button-active-indicator']}></div>
                    }
                    {
                        !setActive('/report-bug')
                        &&
                        <div className={globalStyles['button-inactive-indicator']}></div>
                    }
                    <div className={globalStyles['button-label']}>
                        <i dangerouslySetInnerHTML={{__html: featherIcon.icons['alert-circle'].toSvg(setIconFill('/report-bug'))}}></i>
                        <div>Fout aangeven</div>
                    </div>
                </Link>
                <Link href="http://localhost:3000/projects" className={cn({
                    [globalStyles['menu-button']]:true,
                    [globalStyles['menu-active']]:setActive('/request-feature'),
                    [globalStyles['global-transition-duration']]:true
                })}>
                    {
                        setActive('/request-feature')
                        &&
                        <div className={globalStyles['button-active-indicator']}></div>
                    }
                    {
                        !setActive('/request-feature')
                        &&
                        <div className={globalStyles['button-inactive-indicator']}></div>
                    }
                    <div className={globalStyles['button-label']}>
                        <i dangerouslySetInnerHTML={{__html: featherIcon.icons['edit-2'].toSvg(setIconFill('/request-feature'))}}></i>
                        <div>Functionaliteit aanvragen</div>
                    </div>
                </Link>
                <Link href="http://localhost:3000/projects" className={cn({
                    [globalStyles['menu-button']]:true,
                    [globalStyles['menu-active']]:setActive('/uitloggen'),
                    [globalStyles['global-transition-duration']]:true
                })}>
                    <div className={globalStyles['button-inactive-indicator']}></div>
                    <div className={globalStyles['button-label']}>
                        <i dangerouslySetInnerHTML={{__html: featherIcon.icons['power'].toSvg(setIconFill('/uitloggen'))}}></i>
                        <div>Uitloggen</div>
                    </div>
                </Link>
            </div>
        </nav>
    );
}

export default GlobalComponentMenu;