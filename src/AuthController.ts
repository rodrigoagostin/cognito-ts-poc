import { Request, Response } from 'express';
import CognitoService from './CognitoService';
import { OK, BAD_REQUEST } from 'http-status-codes';

class AuthController {
  public signIn(req: Request, res: Response) {
    const {email, password} = req.body;

    CognitoService.getInstance().signIn(email, password)
      .then(result => res.status(OK).json(result))
      .catch(err => res.status(BAD_REQUEST).json(err));
  }
}

export default AuthController;