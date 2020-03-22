import 'cross-fetch/polyfill';
import { CognitoUser, CognitoUserPool, AuthenticationDetails, CognitoUserSession } from 'amazon-cognito-identity-js';

const {COGNITO_POOL_ID, COGNITO_KEY} = process.env;

class CognitoService {
  private readonly clientId: string;
  private readonly userPoolId: string;
  private static instance: CognitoService;

  constructor() {
    this.clientId = COGNITO_KEY!;
    this.userPoolId = COGNITO_POOL_ID!;
  }

  public signIn(email: string, password: string): Promise<CognitoUserSession> {
    return new Promise((resolve, reject) => {
      const authenticationData = {
        Username: email,
        Password: password
      };

      const onSuccess = (result: any) => resolve(result);
      const onFailure = (err: any) => reject(err);

      const authenticationDetails = new AuthenticationDetails(authenticationData);
      const cognitoUser = this._getUserName(email);

      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess,
        onFailure,
        newPasswordRequired: (userAttributes, requiredAttributes) => {
          delete userAttributes.email_verified;
          cognitoUser.completeNewPasswordChallenge(password, requiredAttributes, {onSuccess, onFailure});
        }
      });
    });
  }

  private _getUserName(email: string): CognitoUser {
    return new CognitoUser({
      Username: email,
      Pool: new CognitoUserPool({
        UserPoolId: this.userPoolId,
        ClientId: this.clientId,
      }),
    });
  }

  public static getInstance() {
    if (!CognitoService.instance) {
      CognitoService.instance = new CognitoService();
    }
    return CognitoService.instance;
  }

}

export default CognitoService;