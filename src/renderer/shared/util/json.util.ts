import { compare } from "fast-json-patch/commonjs/duplex";

export function getOperations(originalValue: any, currentValue: any) {
    return compare(removeNullOrUndefinedProperties(originalValue), removeNullOrUndefinedProperties(currentValue));
}

export function removeNullOrUndefinedProperties(obj: any) {

    Object.keys(obj).forEach((key: any) => {
        let value = obj[key];

        if(Array.isArray(value)){
            for (let arrayValue of value){
                removeNullOrUndefinedProperties(arrayValue);
            }
        } else if (typeof value === 'object' && value !== null) {
            removeNullOrUndefinedProperties(value);
        } else {
            if(value === null || value === undefined){
                delete obj[key];
            }
        }
    })

    return obj;
}