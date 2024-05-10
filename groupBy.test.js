const { groupBy } = require('./groupBy');

const data = [
    { name: "John", age: 20, city: "New York" },
    { name: "Jane", age: 20, city: "Chicago" },
    { name: "John", age: 20, city: "Boston" },
    { name: "John", age: 25, city: "Seattle" },
    { name: "Jane", age: 25, city: "Pittsburgh" },
    { name: "Jane", age: 20, city: "Los Angeles"},
];

const expectedData1 =
{
    "John_20": { name: "John", age: 20, _key: "John_20", _items: [ { name: "John", age: 20, city: "New York" }, { name: "John", age: 20, city: "Boston" } ] },
    "Jane_20": { name: "Jane", age: 20, _key: "Jane_20", _items: [ { name: "Jane", age: 20, city: "Chicago" }, { name: "Jane", age: 20, city: "Los Angeles" } ] },
    "John_25": { name: "John", age: 25, _key: "John_25", _items: [ { name: "John", age: 25, city: "Seattle" } ] },
    "Jane_25": { name: "Jane", age: 25, _key: "Jane_25", _items: [ { name: "Jane", age: 25, city: "Pittsburgh" } ] }
}

const expectedData2 =
{
    "John_20_New York": { name: "John", age: 20, city: "New York", _key: "John_20_New York", _items: [ { name: "John", age: 20, city: "New York" } ] },
    "Jane_20_Chicago": { name: "Jane", age: 20, city: "Chicago", _key: "Jane_20_Chicago", _items: [ { name: "Jane", age: 20, city: "Chicago" } ] },
    "John_20_Boston": { name: "John", age: 20, city: "Boston", _key: "John_20_Boston", _items: [ { name: "John", age: 20, city: "Boston" } ] },
    "John_25_Seattle": { name: "John", age: 25, city: "Seattle", _key: "John_25_Seattle", _items: [ { name: "John", age: 25, city: "Seattle" } ] },
    "Jane_25_Pittsburgh": { name: "Jane", age: 25, city: "Pittsburgh", _key: "Jane_25_Pittsburgh", _items: [ { name: "Jane", age: 25, city: "Pittsburgh" } ] },
    "Jane_20_Los Angeles": { name: "Jane", age: 20, city: "Los Angeles", _key: "Jane_20_Los Angeles", _items: [ { name: "Jane", age: 20, city: "Los Angeles"} ] },
}

// test data above this point; tests below this point


test('given example', () => {
  expect(groupBy(data, ["name", "age"])).toStrictEqual(expectedData1);
});

test('empty keys', () => {
  expect(groupBy(data, [])).toStrictEqual(data);
});

test('empty data', () => {
  expect(groupBy([], ["name", "age"])).toStrictEqual([]);
});

test('group by everything', () => {
  expect(groupBy(data, ["name", "age", "city"])).toStrictEqual(expectedData2);
});