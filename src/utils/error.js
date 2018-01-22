

class Err {
  // get APIError() {
  //   // Couldn't find "data.message" key in response
  //   return new Error('Cannot establish connections with the server.');
  // }

  CustomError(msg) {
    return new Error(msg);
  }
}

export default new Err();
