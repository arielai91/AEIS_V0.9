import { Request, Response } from 'express';

class CasilleroController {
  public getCasillero(_req: Request, res: Response): void {
    res.send('Casillero');
  }

  // Puedes agregar más métodos aquí
}

export default new CasilleroController();