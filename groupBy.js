/*
 Groups an array of objects by 1 or more fields on the object. The fields being grouped on must be able to be converted to strings
 the result is an object that has a field for each group.
 the names of these fields is the key value of the group where the key value is formed by taking the values of the fields being grouped on and creating an underscore-separated-value.
 each group object has a field for each field being grouped on and 2 additional fields:
    _key: the key value described above
    _items: the objects from the original array in this group
 @param {Array} array - An array of objects
 @param {Array} keys - An array of field names to group by
 @returns {Object} - An object containing the grouped objects
 @example
 const data = [
    { name: "John", age: 20, city: "New York" },
    { name: "Jane", age: 20, city: "Chicago" },
    { name: "John", age: 20, city: "Boston" },
    { name: "John", age: 25, city: "Seattle" },
    { name: "Jane", age: 25, city: "Pittsburgh" },
    { name: "Jane", age: 20, city: "Los Angeles"},
 ];
 const groupedData = groupBy(data, ["name", "age"]);
 console.log(groupedData);
 {
   "John_20": { name: "John", age: 20, _key: "John_20", _items: [ { name: "John", age: 20, city: "New York" }, { name: "John", age: 20, city: "Boston" } ] },
   "Jane_20": { name: "Jane", age: 20, _key: "Jane_20", _items: [ { name: "Jane", age: 20, city: "Chicago" }, { name: "Jane", age: 20, city: "Los Angeles" } ] },
   "John_25": { name: "John", age: 25, _key: "John_25", _items: [ { name: "John", age: 25, city: "Seattle" } ] },
   "Jane_25": { name: "Jane", age: 25, _key: "Jane_25", _items: [ { name: "Jane", age: 25, city: "Pittsburgh" } ] }
 }
*/

const groupBy = (array, keys) => {
    // if there aren't any keys to group the data, or the data is empty, simply return it
    if (keys.length == 0 || array.length == 0) {
        return array
    }

    let groupedData = {};
    for (const elem of array) {
        const groupId = getGroupId(elem, keys);
        if (groupedData[groupId]) {
            groupedData[groupId]._items.push(elem);
        } else {
            // initialize new object if the groupId isn't found in the groupedData obj
            groupedData[groupId] = { _key: groupId, _items: [ elem ]};
            setGroupData(groupedData[groupId], elem, keys);
        }
    }
    return groupedData;
}

/* 
 getGroupId is a helper function that returns a groupId formatted for the
 groupBy function return object (documented above), in this case an underscore-separated-value
 @param {Object} obj - An object to be grouped
 @param {Array} keys - An array of field names to group by
 @returns {String} - A string that is an unserscore-separated-value to be used as a groupId in the groupBy function
 @example
 const obj = { name: "John", age: 20, city: "New York" };
 const groupId = getGroupId(obj, ["name", "age"]);
 console.log(groupId);
 "John_20"
*/
function getGroupId(obj, keys) {
    let groupId = ""; 
    for (let i = 0; i < keys.length; i++) {
        groupId += obj[keys[i]];
        if (i !== keys.length - 1 ) {
            groupId += "_";
        }
    }
    return groupId
}

/* 
 setGroupData is a helper function that adds the key-specific fields to the
 grouped object to be returned by the groupBy function
 @param {Object} obj - An object to be added to the final grouped product
 @param {Object} elem - An object to be grouped 
 @param {Array} keys - An array of field names to group by
 @example
 const obj = { name: "John", age: 20, city: "New York" };
 const groupId = getGroupId(obj, ["name", "age"]);
 console.log(groupId);
 "John_20"
*/
function setGroupData(obj, elem, keys) {
    for (const key of keys){
        if (elem[key]) {
            obj[key] = elem[key];
        }
    }
}

module.exports = { groupBy };
