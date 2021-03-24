# Expense-serverless

This application implements a simple Expense-Tracker application using AWS Lambda and Serverless framework.

# Functionality of the application

This application will allow creating/removing/updating/fetching Expense items. Each Expense item can optionally have an attachment image. Each user only has access to Expense items that he/she has created.

# Functions implemented

The following functions were implemented and configured in the `serverless.yml` file:

* `Auth` - this function implements a custom authorizer for API Gateway that should be added to all other functions.

* `GetExpenses` - returns all Expenses for a current user. A user id can be extracted from a JWT token that is sent by the frontend

It should return data that looks like this:

```json
{
  "items": [
    {
      "userId": "123",
      "expenseId": "123546",
      "createdAt": "2019-07-27T20:01:45.424Z",
      "name": "Car Payment",
      "date": "2019-07-29T20:01:45.424Z",
      "amount": 275.00,
      "attachmentUrl": "http://example.com/image.png"
    },
    {
     "userId": "456",
      "expenseId": "129856",
      "createdAt": "2020-07-27T20:01:45.424Z",
      "name": "Rent",
      "date": "2020-07-29T20:01:45.424Z",
      "amount": 950.00,
      "attachmentUrl": "http://example.com/image.png"
    },
  ]
}
```

* `CreateExpense` - creates a new Expense for a current user. A shape of data send by a client application to this function can be found in the `CreateExpenseRequest.ts` file

It receives a new Expense item to be created in JSON format that looks like this:

```json
{
      "expenseId": "123546",
      "createdAt": "2019-07-27T20:01:45.424Z",
      "name": "Car Payment",
      "date": "2019-07-29T20:01:45.424Z",
      "amount": 275.00,
      "attachmentUrl": "http://example.com/image.png"
}
```

It should return a new Expense item that looks like this:

```json
{
  "item": {
      "userId": "123",
      "expenseId": "123546",
      "createdAt": "2019-07-27T20:01:45.424Z",
      "name": "Car Payment",
      "date": "2019-07-29T20:01:45.424Z",
      "amount": 275.00,
      "attachmentUrl": "http://example.com/image.png"
  }
}
```

* `UpdateExpense` - updates an Expense item created by a current user. A shape of data send by a client application to this function can be found in the `UpdateExpenseRequest.ts` file

It receives an object that contains three fields that can be updated in a Expense item:

```json
{
  "name": "Phone bill",
  "date": "2019-07-29T20:01:45.424Z",
  "amount": 150.00
}
```

The id of an item that should be updated is passed as a URL parameter.

It should return an empty body.

* `DeleteExpense` - deletes an Expense item created by a current user. Expects an id of an Expense item to remove.

It should return an empty body.

* `GenerateUploadUrl` - returns a pre-signed URL that can be used to upload an attachment file for an Expense item.

It should return a JSON object that looks like this:

```json
{
  "uploadUrl": "https://s3-bucket-name.s3.eu-west-2.amazonaws.com/image.png"
}
```

All functions are already connected to appropriate events from API Gateway.

An id of a user can be extracted from a JWT token passed by a client.

Necessary resources are implemented in the `resources` section of the `serverless.yml` file such as DynamoDB table and S3 bucket.

# How to run the application

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```

## Frontend

To run a client application first edit the `client/src/config.ts` file to set correct parameters. And then run the following commands:

```
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless Expense application.

