import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';
import { deleteExpense } from '../../distribution/expenseDistributions';
import { createLogger } from '../../utils/logger'

const logger = createLogger('deleteExpense')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  logger.info(`Processing event ${JSON.stringify(event)}`)
  if (!(await deleteExpense(event))) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: 'Expense does not exist'
      })
    };
  }
  
  return {
    statusCode: 202,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({})
  };
}

