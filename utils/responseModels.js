class Success {
    constructor(message, payload){
        this.status = "Success",
        this.message = message,
        this.payload = payload ? payload : ""
    }
}

class Error {
    constructor(message, error){
        this.status = "Failure",
        this.message = message,
        this.errorType = error ? error : ""
    }
}

export {Success, Error};