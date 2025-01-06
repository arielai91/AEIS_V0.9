import { Request, Response } from 'express';

class S3Controller {
  public getS3(_req: Request, res: Response): void {
    res.send('S3 Bucket');
  }
}

export default new S3Controller();