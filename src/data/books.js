import data from './data.js';

export default class Books {
  askListBooks() {
    return this._mockServerRequest();
  }

  _mockServerRequest = () => {
    return new Promise(resolve => {
      window.setTimeout(() => {
        resolve(data.books);
      }, this._random());
    });
  }

  _random() {
    return Math.floor(Math.random() * 1200);
  }
}
