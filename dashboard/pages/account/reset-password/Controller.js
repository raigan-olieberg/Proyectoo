// Global / Page / Layout components
import { GLOBALFUNC__ValidateEmail } from "../../../helpers/GlobalFunctions";
import { GLOBALFUNC__isWhitespaceString } from "../../../helpers/GlobalFunctions";

export const FUNC__CreateObject = (
    key, 
    value, 
    setItemObject
) => {
    setItemObject({
        [key]: value
    });
}

export const FUNC__Submit = (
    itemObject,
    setErrorMessage,
    setDataIsLoading,
    setSuccesMessage
) => {
    if(GLOBALFUNC__isWhitespaceString(itemObject.email)){
        setErrorMessage({
            field_id: "user-empty",
            message: "Vul jouw zakelijke e-mail in."
        });
        return;
    } else {
        setErrorMessage({
            field_id: "",
            message: ""
        });
    }
    if(!GLOBALFUNC__ValidateEmail(itemObject.email)){
        setErrorMessage({
            field_id: "user-empty",
            message: "Deze e-mail is niet geldig."
        });
        return;
    } else {
        setErrorMessage({
            field_id: "",
            message: ""
        });
    }
    FUNC__Reset(
        setErrorMessage,
        setDataIsLoading,
        itemObject,
        setSuccesMessage
    );
}

const FUNC__Reset = async (
    setErrorMessage,
    setDataIsLoading,
    itemObject,
    setSuccesMessage
) => {
    setDataIsLoading(true);

    const response = await fetch('http://localhost:6001/api/account/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(itemObject),
    });
  
    const result = await response.json();
    console.log(result);

    setDataIsLoading(false);

    if(result.response == 'successfull'){
        setSuccesMessage(true);
    } else if(result.response == 'unsuccessfull'){
        setErrorMessage({
            field_id: "user-empty",
            message: "Er bestaat geen account met deze e-mail."
        });
    } else {
        setErrorMessage({
            field_id: "user-empty",
            message: "Oeps, er gaat iets mis. Probeer het a.u.b. nog een keer of neem contact met ons op."
        });
    }
};
