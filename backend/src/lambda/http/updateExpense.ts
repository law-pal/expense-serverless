import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateExpenseRequest } from '../../requests/updateExpenseRequest'
import { updateExpense } from '../../distribution/expenseDistributions'
import { createLogger } from '../../utils/logger'

const logger = createLogger('updateExpenses')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const expenseUpdated: UpdateExpenseRequest = JSON.parse(event.body);
  const updatedExpense = await updateExpense(event, expenseUpdated);
  logger.info(`The following expense was updated ${JSON.stringify(updatedExpense)}`)
  if (!updatedExpense) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: 'Expense does not exist'
      })
    };
  }

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({})
  }
}
