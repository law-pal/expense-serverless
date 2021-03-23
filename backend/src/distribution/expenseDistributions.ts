import 'source-map-support/register';
import * as uuid from 'uuid';
import { APIGatewayProxyEvent } from 'aws-lambda';
import ExpenseAccess from '../accessHelpers/expenseAccess';
import ExpenseStore from '../storageHelpers/expenseStore';
import { getUserId } from '../lambda/utils';
import {  CreateExpenseRequest } from '../requests/createExpenseRequest';
import { UpdateExpenseRequest } from '../requests/updateExpenseRequest';
import { ExpenseItem } from '../models/expenseItem';
import { createLogger } from '../utils/logger'

const logger = createLogger('expenses')
const expenseStorage = new ExpenseStore();
const expenseEntryPoint = new ExpenseAccess();

export async function createExpense(event: APIGatewayProxyEvent, createExpenseRequest: CreateExpenseRequest): Promise<ExpenseItem> {
  const expenseId = uuid.v4();
  const userId = getUserId(event);
  const createdAt = new Date(Date.now()).toISOString();

  const expenseItem = {
    userId,
    expenseId,
    createdAt,
    attachmentUrl: `https://${expenseStorage.getBucketName()}.s3.amazonaws.com/${expenseId}`,
    ...createExpenseRequest
  };
  await expenseEntryPoint.addExpense(expenseItem);
  logger.info(`Processing event ${JSON.stringify(event)} expenseItem was created ${JSON.stringify(expenseItem)}`)
  return expenseItem;
}

export async function getExpenses(event: APIGatewayProxyEvent) {
  const userId = getUserId(event);
  logger.info(`Processing event ${JSON.stringify(event)}`)
  return await expenseEntryPoint.getAllExpenses(userId);
}

export async function getExpense(event: APIGatewayProxyEvent) {
  const expenseId = event.pathParameters.expenseId;
  const userId = getUserId(event);
  logger.info(`Processing event ${JSON.stringify(event)}`)
  return await expenseEntryPoint.getExpense(expenseId, userId);
}


export async function deleteExpense(event: APIGatewayProxyEvent) {
  logger.info(`Processing event ${JSON.stringify(event)}`)
  const expenseId = event.pathParameters.expenseId;
  const userId = getUserId(event);

  if (!(await expenseEntryPoint.getExpense(expenseId, userId))) {
    return false;
  }
  await expenseEntryPoint.deleteExpense(expenseId, userId);
  return true;
}


export async function updateExpense(event: APIGatewayProxyEvent,updateExpenseRequest: UpdateExpenseRequest) {
  const expenseId = event.pathParameters.expenseId;
  const userId = getUserId(event);
  logger.info(`Processing event ${JSON.stringify(event)}`)
  if (!(await expenseEntryPoint.getExpense(expenseId, userId))) {
    return false;
  }
  await expenseEntryPoint.updateExpense(expenseId, userId, updateExpenseRequest);
  return true;
}


export async function generateUploadUrl(event: APIGatewayProxyEvent) {
  const bucket = expenseStorage.getBucketName();
  const urlExpiration = process.env.SIGNED_URL_EXPIRATION;
  const expenseId = event.pathParameters.expenseId;
  logger.info(`Processing event ${JSON.stringify(event)}`)
  
  const createSignedUrlRequest = {
    Bucket: bucket,
    Key: expenseId,
    Expires: parseInt(urlExpiration)
  }
  return expenseStorage.getPresignedUploadURL(createSignedUrlRequest);
}




