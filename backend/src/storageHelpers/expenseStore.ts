import { CreateSignedURLRequest } from '../requests/createSignedUrl';
import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';

const XrayAWS = AWSXRay.captureAWS(AWS);

export default class ExpenseStore {
  constructor(
    private readonly s3 = new XrayAWS.S3({ signatureVersion: 'v4' }),
    private readonly expenseStore = process.env.S3_BUCKET
  ) { }

  getBucketName() {
    return this.expenseStore;
  }

  getPresignedUploadURL(createSignedUrlRequest: CreateSignedURLRequest) {
    return this.s3.getSignedUrl('putObject', createSignedUrlRequest);
  }
}