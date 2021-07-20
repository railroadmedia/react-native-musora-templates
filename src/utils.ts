interface UtilsInterface {
  rootUrl: string;
  brand: string;
  color: string;
  serverDownError: {
    title: string;
    message: string;
  };
}
class Utils implements UtilsInterface {
  brand = '';
  rootUrl = '';

  private _color: { [brand: string]: '#0b76db' | '#fb1b2f' } = {
    drumeo: '#0b76db',
    pianote: '#fb1b2f'
  };
  get color() {
    return this._color[this.brand];
  }

  private serverDownMsg =
    'is down. We are working on a fix and it should be back shortly. Thank you for your patience.';
  private _serverDown: { [brand: string]: { title: string; message: string } } =
    {
      drumeo: {
        title: 'Oh no, we dropped a stick...',
        message: `Drumeo ${this.serverDownMsg}`
      },
      pianote: {
        title: 'Something went wrong...',
        message: `Pianote ${this.serverDownMsg}`
      }
    };
  get serverDownError() {
    return this._serverDown[this.brand];
  }
}

export let utils = new Utils();
