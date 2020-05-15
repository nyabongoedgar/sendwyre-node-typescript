class Error {
    static handleError(error: any, statusCode: any, response: any) {
      return response.status(statusCode).json({
        success: false,
        error
      });
    }
  }
  
  export default Error;
  