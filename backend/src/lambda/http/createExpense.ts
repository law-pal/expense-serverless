import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateExpenseRequest } from '../../requests/createExpenseRequest'
import { createExpense } from '../../distribution/expenseDistributions'
import { createLogger } from '../../utils/logger'

const logger = createLogger('createTodo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newExpenses: CreateExpenseRequest = JSON.parse(event.body);
  logger.info(`Processing event ${JSON.stringify(event)}`)
  
  if (!newExpenses.name) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'name not found'
      })
    };
  }

  const items = await createExpense(event, newExpenses);
  logger.info('Create new Expense', {'newExpense': newExpenses})
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item: items
    })
  };
}





