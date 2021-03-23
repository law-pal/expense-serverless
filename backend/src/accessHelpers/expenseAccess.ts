import * as AWS  from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client'

const AWSXRay = require('aws-xray-sdk');
const XAWS = AWSXRay.captureAWS(AWS)

export default class ExpenseAccess {
  
  constructor(
    private readonly expenseTable = process.env.EXPENSES_TABLE,
    private readonly indexName = process.env.INDEX_NAME,
    private readonly documentClient: DocumentClient = new XAWS.DynamoDB.DocumentClient()
  ) { }
  
  // gets all expenses
  async getAllExpenses(userId) {
    const result = await this.documentClient.query({
      TableName: this.expenseTable,
      IndexName: this.indexName,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }).promise();

    return result.Items;
  }


  // updates a expense
  async updateExpense(expenseId, userId, updatedExpense) {
    await this.documentClient.update({
      TableName: this.expenseTable,
      Key: {
        expenseId,
        userId
      },
      UpdateExpression: 'set #name = :n, #date = :date, #amount = :a',
      ExpressionAttributeValues: {
        ':n': updatedExpense.name,
        ':date': updatedExpense.date,
        ':a': updatedExpense.amount
      },
      ExpressionAttributeNames: {
        '#name': 'name',
        '#date': 'date',
        '#amount': 'amount'
      }
    }).promise();
  }


  // deletes an expense
  async deleteExpense(expenseId, userId) {
    await this.documentClient.delete({
      TableName: this.expenseTable,
      Key: {
        expenseId,
        userId
      }
    }).promise();
  }


  // get an expense
  async getExpense(expenseId, userId) {
    const result = await this.documentClient.get({
      TableName: this.expenseTable,
      Key: {
        expenseId,
        userId
      }
    }).promise();

    return result.Item;
  }


  // creates a new expense
  async addExpense(expenseItem) {
    await this.documentClient.put({
      TableName: this.expenseTable,
      Item: expenseItem
    }).promise();
  }
  
}

