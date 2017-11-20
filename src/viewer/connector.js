const mockUrl = 'http://localhost:4000/mock.json';

export default {
  getCase() {
    return new Promise(function (resolve, reject) {
      const successHandler = (response) => {
        resolve(response);
      };
      const errorHandler = (error) => {
        if (error) {
          console.error(error);
        }

        reject(error);
      };

      $.ajax(mockUrl).then(successHandler, errorHandler);
    });
  }
};
