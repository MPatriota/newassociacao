export class UsuarioContext {
  private static _instance: UsuarioContext;

  private _id?: number;
  private _isAuthenticated = false;

  private constructor() {}

  public static get instance(): UsuarioContext {
    if(!UsuarioContext._instance) {
      UsuarioContext._instance = new UsuarioContext();
    }

    return UsuarioContext._instance;
  }

  public set id(id: number) {
    this._id = id;
  }

  public get id(): number | undefined {
    return this._id
  }

  public get isAuthenticated() {
    return this._isAuthenticated;
  }

  public reset() {
    this._id = undefined;
    this._isAuthenticated = false;
  }

  public authenticate() {
    this._isAuthenticated = true;
  }
}
