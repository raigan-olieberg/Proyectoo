// Global / Page / Layout components
import { GLOBALFUNC__ValidateEmail } from "../../../helpers/GlobalFunctions";
import { GLOBALFUNC__isWhitespaceString } from "../../../helpers/GlobalFunctions";

export const FUNC__CreateObject = (
    key, 
    value, 
    upperCase,
    itemObject,
    setItemObject
) => {
    let upperCaseValue = upperCase ? (value.charAt(0).toUpperCase() + value.slice(1)) : value;
    let hasBrackets = key.match(/\[(.*?)\]/);
    if(hasBrackets){
        let parent = key.split("[")[0];
        let child = hasBrackets[1];
        setItemObject({
            ...itemObject,
            [parent]: {
                ...itemObject[parent],
                [child]: upperCaseValue
            }
        });
    } else {
        setItemObject({
            ...itemObject,
            [key]: upperCaseValue
        })
    }
}

export const FUNC__Submit = (
    itemObject,
    setItemObject,
    setErrorMessage,
    setDataIsLoading,
    setUseAppMessage,
    setLoginSuccessfull
) => {
    if(GLOBALFUNC__isWhitespaceString(itemObject.user.email)
    || GLOBALFUNC__isWhitespaceString(itemObject.user.password)){
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
    if(!GLOBALFUNC__ValidateEmail(itemObject.user.email)){
        setErrorMessage({
            field_id: "user-email",
            message: "Deze e-mail is niet geldig."
        });
        return;
    } else {
        setErrorMessage({
            field_id: "",
            message: ""
        });
    }
    FUNC__Login(
        setErrorMessage,
        setDataIsLoading,
        itemObject,
        setItemObject,
        setUseAppMessage,
        setLoginSuccessfull
    );
}

const FUNC__Login = async (
    setErrorMessage,
    setDataIsLoading,
    itemObject,
    setItemObject,
    setUseAppMessage,
    setLoginSuccessfull
) => {
    setDataIsLoading(true);

    const response = await fetch('http://localhost:6001/api/account/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(itemObject),
    });
  
    const result = await response.json();

    setDataIsLoading(false);

    if(result.response == 'successfull'){
        /*setItemObject({
            user: {
                ...itemObject.user,
                user_id: result.message.user_id
            },
            organization: {
                ...itemObject.organization,
                organization_id: result.message.organization_id
            }
        });*/
        setLoginSuccessfull(true);
    } else if(result.response == 'unsuccessfull'){
        setErrorMessage({
            field_id: "user-empty",
            message: "Jouw e-mail en/of wachtwoord is incorrect."
        });
    } else if(result.response == 'not_allowed'){
        setUseAppMessage(true);
    } else {
        setErrorMessage({
            field_id: "user-empty",
            message: "Oeps, er gaat iets mis. Probeer het a.u.b. nog een keer of neem contact met ons op."
        });
    }
};
