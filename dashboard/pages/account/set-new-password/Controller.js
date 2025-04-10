// Global / Page / Layout components
import { GLOBALFUNC__isWhitespaceString } from "../../../helpers/GlobalFunctions";

export const FUNC__CreateObject = (
    key, 
    value, 
    itemObject,
    setItemObject
) => {
    setItemObject({
        ...itemObject,
        [key]: value
    });
}

export const FUNC__Submit = (
    itemObject,
    setErrorMessage,
    setDataIsLoading,
    setSuccesMessage
) => {
    if(GLOBALFUNC__isWhitespaceString(itemObject.password)
    || GLOBALFUNC__isWhitespaceString(itemObject.password_repeat)){
        setErrorMessage({
            field_id: "user-empty",
            message: "Niet alle velden zijn gevuld."
        });
        return;
    } else {
        setErrorMessage({
            field_id: "",
            message: ""
        });
    }
    if(itemObject.password.length < 8){
        setErrorMessage({
            field_id: "password",
            message: "Jouw wachtwoord moet minimaal 8 tekens lang zijn."
        });
        return;
    } else {
        setErrorMessage({
            field_id: "",
            message: ""
        });
    }
    if(itemObject.password != itemObject.password_repeat){
        setErrorMessage({
            field_id: "password-repeat",
            message: "Jouw wachtwoorden komen niet overeen."
        });
        return;
    } else {
        setErrorMessage({
            field_id: "",
            message: ""
        });
    }
    FUNC__SetPassword(
        setErrorMessage,
        setDataIsLoading,
        itemObject,
        setSuccesMessage
    );
}

const FUNC__SetPassword = async (
    setErrorMessage,
    setDataIsLoading,
    itemObject,
    setSuccesMessage
) => {
    setDataIsLoading(true);
    const response = await fetch('http://localhost:6001/api/account/set-new-password', {
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
            message: "Je bent niet geautoriseerd om deze actie uit te voeren. Vraag een nieuwe wachtwoord herstel verzoek aan via de link hieronder of neem contact met ons op."
        });
    } else {
        setErrorMessage({
            field_id: "user-empty",
            message: "Oeps, er gaat iets mis. Probeer het a.u.b. nog een keer of neem contact met ons op."
        });
    }
};
