import { Request, Response } from 'express';

class PlanController {
  public getPlan(_req: Request, res: Response): void {
    res.send('Plan');
  }

  // Puedes agregar más métodos aquí
}

export default new PlanController();