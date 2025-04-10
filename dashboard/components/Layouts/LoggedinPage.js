// React / NextJs components
import { useContext } from "react";
import { usePathname } from 'next/navigation'
// Global / Page / Layout components
import GlobalComponentHeader from "../Global/Header";
import GlobalComponentMenu from "../Global/Menu";
import GlobalComponentSidebar from "../Global/Sidebar";
import GlobalComponentSidebarExpanded from "../Global/Sidebar/Expanded";
import AppContext from '../../helpers/AppContext';
// Page styles
import globalStyles from '../../styles/global.module.scss';

const LayoutComponentLoggedinPage = ({ children }) => {
    const currentPage = usePathname();
    const sidebarContext = useContext(AppContext);
    return (
      <>
        {/* Header */}
        <GlobalComponentHeader />

        {
          /* Sidebar */
          sidebarContext.globalContext.sidebar.show == 1
          &&
          <GlobalComponentSidebar 
            direction={sidebarContext.globalContext.sidebar.direction} 
            payload={sidebarContext.globalContext.sidebar.payload}/>
        }

        {
          /* Sidebar expanded */
          sidebarContext.globalContext.sidebarExpanded.show == 1
          &&
          <GlobalComponentSidebarExpanded 
            direction={sidebarContext.globalContext.sidebarExpanded.direction} 
            headerType={sidebarContext.globalContext.sidebarExpanded.headerType} 
            headerAction={sidebarContext.globalContext.sidebarExpanded.headerAction} 
            payload={sidebarContext.globalContext.sidebarExpanded.payload}/>
        }

        {/* Content */}
        <section className={globalStyles['global-container']}>
          <div className={globalStyles['global-container__content']}>
            {children}
          </div>
        </section>

        {/* Menu */}
        <GlobalComponentMenu />
      </>
    );
  };
  
  export default LayoutComponentLoggedinPage;