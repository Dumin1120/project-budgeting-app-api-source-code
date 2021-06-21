# project-budgeting-app-api-source-code

A backend API using express that performs full CRUD on one model: `transactions`.

Live: [https://dumin1120-proj-budgeting-app.herokuapp.com/](https://dumin1120-proj-budgeting-app.herokuapp.com/)

### Welcome to my Budgeting App API!

### Endpoints

### `GET`
`https://dumin1120-proj-budgeting-app.herokuapp.com/transactions/`

For all transactions

This will return all transactions, an array of objects.
```javascript
[
    {
        "date": "06/13/21",
        "name": "Deposit",
        "amount": 100,
        "from": "Paycheck",
        "id": "aabb"
    },
    {
        "date": "06/14/21",
        "name": "Bought coffee",
        "amount": -2.99,
        "from": "Spend",
        "id": "bbaa"
    },
    ...
]
```

### `GET`
`https://dumin1120-proj-budgeting-app.herokuapp.com/transactions/{ids}`

For one or more transactions

Example one transaction: `https://dumin1120-proj-budgeting-app.herokuapp.com/transactions/aabb`

Example two transactions: `https://dumin1120-proj-budgeting-app.herokuapp.com/transactions/aabb,bbaa`

This will return transactions found with corresponding ids, an array of object(s). When sending a request for more than one, separate the ids by comma ",". If requesting one transaction and id is not found, a 404 error will return. If requesting more than one transaction, and no id found, no error will return, an empty array will return instead.

### `POST`
`https://dumin1120-proj-budgeting-app.herokuapp.com/transactions/`

When sending a request to post one transaction, sending a json object {} or an array of an object [{}] is allowed. When posting more than one transaction, it is required to be an array of objects. Each object is required to be in this format, restrict to 4 key/value pairs:
```javascript
{
    "date": "string type, in mm/dd/yy format only and it is a valid date after 2020",
    "name": "string type, can not be empty or only spaces",
    "amount": number type, positive or negative, can not exceed safe range, can not exceed 2 decimal digits,
    "from": "string type, key has to be exist inside object, optional value, can be left as empty string"
}
```
### `PUT`
`https://dumin1120-proj-budgeting-app.herokuapp.com/transactions/{ids}`

See `GET` endpoint for actual link examples

When sending a request to update one transaction, sending a json object {} or an array of an object [{}] is allowed. When updating more than one tranction, separate ids by comma ",". And data is required to be an array of objects, each object has to be in a specific format, please refer to `POST` endpoint for format restrictions.

### `DELETE`
`https://dumin1120-proj-budgeting-app.herokuapp.com/transactions/{ids}`

See `GET endpoint` for actual link examples

When sending a request to delete more than one tranction, separate ids by comma ",".