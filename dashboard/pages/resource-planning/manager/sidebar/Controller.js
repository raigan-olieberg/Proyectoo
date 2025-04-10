export const FUNC__CreateObject = (
    itemObject,
    setItemObject,
    key, 
    value
) => {
    let hasBrackets = key.match(/\[(.*?)\]/);
    if(hasBrackets){
        let parent = key.split("[")[0];
        let child = hasBrackets[1];
        setItemObject({
            ...itemObject,
            [parent]: {
                ...itemObject[parent],
                [child]: value
            }
        });
    } else {
        setItemObject({
            ...itemObject,
            [key]: value
        });
    }
}