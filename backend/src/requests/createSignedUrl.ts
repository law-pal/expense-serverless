/**
 * Fields in a request to update a single EXPENSE item.
 */
export interface CreateSignedURLRequest {
   Bucket: string,
   Key: string,
   Expires: number
 }