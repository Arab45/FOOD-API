const sendError = (res, message, status=404) =>{
    return res.json({
        success: false,
        message: message,
        status: status  
    })
};

const sendSuccess = (res, message, data) => {
    return res.json({
        success: true,
        message: message,
        data: data
    })
};


const generateOTP = (length) => {
let otp = [];

for(let i = 0; i < length; i++){
    let generatotp = Math.round(Math.random() * 9);
    otp += generatotp;
}

return otp;
};

const sendTryCtachError = (res, error) => {
    console.log(`Unable to perform the action. Reason - ${error}`);
    return res.status(401).json({
      success: false,
      message: `Unable to perform the action. Reason - ${error}`,
    });
  };


module.exports = {
    sendError,
    sendSuccess,
    generateOTP,
    sendTryCtachError
}