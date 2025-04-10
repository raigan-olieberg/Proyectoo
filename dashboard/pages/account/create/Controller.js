// Global / Page / Layout components
import { 
    GLOBALFUNC__isWhitespaceString,
    GLOBALFUNC__ValidateEmail 
} from "../../../helpers/GlobalFunctions";

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
    step,
    setStep,
    itemObject,
    setItemObject,
    setErrorMessage,
    setDataIsLoading,
    setLoginSuccessfull
) => {
    switch(step){
        case 1:
            if(GLOBALFUNC__isWhitespaceString(itemObject.user.firstname)
            || GLOBALFUNC__isWhitespaceString(itemObject.user.lastname)
            || GLOBALFUNC__isWhitespaceString(itemObject.user.email)
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
            if(itemObject.user.password.length < 8){
                setErrorMessage({
                    field_id: "user-password",
                    message: "Jouw wachtwoord moet minimaal 8 tekens lang zijn."
                });
                return;
            } else {
                setErrorMessage({
                    field_id: "",
                    message: ""
                });

                FUNC__ValidateEmail(
                    setStep,
                    setErrorMessage,
                    itemObject,
                    setDataIsLoading
                );
            }
            break;
        case 2:
            if(GLOBALFUNC__isWhitespaceString(itemObject.organization.name)
            || GLOBALFUNC__isWhitespaceString(itemObject.organization.street)
            || GLOBALFUNC__isWhitespaceString(itemObject.organization.housenumber)
            || GLOBALFUNC__isWhitespaceString(itemObject.organization.place)
            || GLOBALFUNC__isWhitespaceString(itemObject.organization.zipcode)){
                setErrorMessage({
                    field_id: "organization-empty",
                    message: "Niet alle velden zijn gevuld."
                });
                return;
            } else {
                setErrorMessage({
                    field_id: "",
                    message: ""
                });
            }
            FUNC__CreateAccount(
                setErrorMessage,
                setDataIsLoading,
                itemObject,
                setItemObject,
                setLoginSuccessfull
            );
            break;
    }
}

const FUNC__ValidateEmail = async (
    setStep,
    setErrorMessage,
    itemObject,
    setDataIsLoading
) => {
    setDataIsLoading(true);

    const response = await fetch('http://localhost:6001/api/account/validate-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(itemObject),
    });
  
    const result = await response.json();

    setDataIsLoading(false);

    if(result.response == 'successfull'){
        setStep(2);
    } else if(result.response == 'unsuccessfull'){
        setErrorMessage({
            field_id: "user-email",
            message: "Er bestaat al een account met deze e-mail."
        });
    } else {
        setErrorMessage({
            field_id: "user-empty",
            message: "Oeps, er gaat iets mis. Probeer het a.u.b. nog een keer of neem contact met ons op."
        });
    }  
}

const FUNC__CreateAccount = async (
    setErrorMessage,
    setDataIsLoading,
    itemObject,
    setItemObject,
    setLoginSuccessfull
) => {
    setDataIsLoading(true);

    const response = await fetch('http://localhost:6001/api/account/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(itemObject),
    });
  
    const result = await response.json();

    setDataIsLoading(false);

    if(result.response == 'successfull'){
        // Go to dashboard
        
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
    } else if(result.response == 'error'){
        setErrorMessage({
            field_id: "organization-empty",
            message: "Oeps, er gaat iets mis. Probeer het a.u.b. nog een keer of neem contact met ons op."
        });
    }
};
