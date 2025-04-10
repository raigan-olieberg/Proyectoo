import '../styles/global.css';
import { useState } from "react";
import AppContext from '../helpers/AppContext';

export default function MyApp({ Component, pageProps }) {
  const [globalContext, setGlobalContext] = useState({
    authenticate:{
      logged_in: false,
      user: /*null*/{
        organization_id: 'vHLrJP8i5zM6qX48rEqu',
        user_id: '11ljDCeW3e61LEmLA0PN',
        firstname: 'Raigan',
        lastname: 'Olieberg',
        role: 'Projectleader',
        label: 'CEO'
      },
      organization: {
        file_storage: {
          total: 53687091200,
          used: 5242880
        }
      }
    }, 
    popup: {
      show: false,
      message: ''
    },
    sidebar: {
      show: 0,
      selectedItemID: null,
      direction: null,
      payload: null,
      showHeaderButton: null
    },
    sidebarExpanded: {
      show: 0,
      selectedItemID: null,
      headerType: null,
      headerAction: null,
      direction: null,
      payload: null,
    }
  });
  // If page layout is available, use it. Else return the page
  const getLayout = Component.getLayout || ((page) => page);
  return(
    <AppContext.Provider value={{globalContext, setGlobalContext}}>
      {getLayout(<Component {...pageProps} />)}
    </AppContext.Provider>
  );
}