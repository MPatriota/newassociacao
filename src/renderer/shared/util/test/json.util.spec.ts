import { removeNullOrUndefinedProperties } from "../json.util";

describe("JsonUtil", () => {

    it('should remove all null or undefined properties', () => {
        const obj = {
            propertyToRemoveNull: null,
            propertyToRemoveUndefined: undefined,
            propertyNotToRemove: 'teste',
            propertyNotToRemoveNumber: 0,
            propertyNotToRemoveBoolean: false,
            propertyArray: [
                {
                    propertyToRemoveNull: null,
                    propertyToRemoveUndefined: undefined,
                    propertyNotToRemove: 'teste',
                    propertyNotToRemoveNumber: 0,
                    propertyNotToRemoveBoolean: false,
                },
                {
                    propertyToRemoveNull: null,
                    propertyToRemoveUndefined: undefined,
                    propertyNotToRemove: 'teste',
                    propertyNotToRemoveNumber: 0,
                    propertyNotToRemoveBoolean: false,
                },
            ],
            propertyObj: {
                propertyToRemoveNull: null,
                propertyToRemoveUndefined: undefined,
                propertyNotToRemove: 'teste',
                propertyNotToRemoveNumber: 0,
                propertyNotToRemoveBoolean: false,
            }
        }

        let objWithoutNullOrUndefinedProperties = removeNullOrUndefinedProperties(obj);

        expect('propertyToRemoveNull' in objWithoutNullOrUndefinedProperties).toBeFalsy();
        expect('propertyToRemoveUndefined' in objWithoutNullOrUndefinedProperties).toBeFalsy();
        expect('propertyNotToRemove' in objWithoutNullOrUndefinedProperties).toBeTruthy();
        expect('propertyNotToRemoveNumber' in objWithoutNullOrUndefinedProperties).toBeTruthy();
        expect('propertyNotToRemoveBoolean' in objWithoutNullOrUndefinedProperties).toBeTruthy();
        expect('propertyToRemoveNull' in objWithoutNullOrUndefinedProperties.propertyArray[0]).toBeFalsy();
        expect('propertyToRemoveUndefined' in objWithoutNullOrUndefinedProperties.propertyArray[0]).toBeFalsy();
        expect('propertyNotToRemove' in objWithoutNullOrUndefinedProperties.propertyArray[0]).toBeTruthy();
        expect('propertyNotToRemoveNumber' in objWithoutNullOrUndefinedProperties.propertyArray[0]).toBeTruthy();
        expect('propertyNotToRemoveBoolean' in objWithoutNullOrUndefinedProperties.propertyArray[0]).toBeTruthy();
        expect('propertyToRemoveNull' in objWithoutNullOrUndefinedProperties.propertyArray[1]).toBeFalsy();
        expect('propertyToRemoveUndefined' in objWithoutNullOrUndefinedProperties.propertyArray[1]).toBeFalsy();
        expect('propertyNotToRemove' in objWithoutNullOrUndefinedProperties.propertyArray[1]).toBeTruthy();
        expect('propertyNotToRemoveNumber' in objWithoutNullOrUndefinedProperties.propertyArray[1]).toBeTruthy();
        expect('propertyNotToRemoveBoolean' in objWithoutNullOrUndefinedProperties.propertyArray[1]).toBeTruthy();
        expect('propertyToRemoveNull' in objWithoutNullOrUndefinedProperties.propertyObj).toBeFalsy();
        expect('propertyToRemoveUndefined' in objWithoutNullOrUndefinedProperties.propertyObj).toBeFalsy();
        expect('propertyNotToRemove' in objWithoutNullOrUndefinedProperties.propertyObj).toBeTruthy();
        expect('propertyNotToRemoveNumber' in objWithoutNullOrUndefinedProperties.propertyObj).toBeTruthy();
        expect('propertyNotToRemoveBoolean' in objWithoutNullOrUndefinedProperties.propertyObj).toBeTruthy();
    })

})