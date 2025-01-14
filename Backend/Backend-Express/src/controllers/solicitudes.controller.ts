import { Request, Response } from 'express';

class SolicitudesController {
    public getSolicitud(_req: Request, res: Response): void {
        res.send('Solicitud');
    }
}

export default new SolicitudesController();