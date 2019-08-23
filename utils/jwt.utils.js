// Imports
var jwt = require('jsonwebtoken');

const JWT_SIGN_SECRET = 'ds4gs458sf4z4za4fssvqsfzrfa84f4g94g9e65e1z2e4g4d574z';

// Exported functions
module.exports = {
  generateTokenForUser: function(userData) {
    //console.log(userData)
    return jwt.sign({
      userId: userData.row.id,
      username: userData.row.username,
      password: userData.row.password
    },
    JWT_SIGN_SECRET,
    {
      expiresIn: '1h'
    })
  },
  verifytoken: function(token){
    console.log(jwt.verify(token, JWT_SIGN_SECRET))
  },
  verifydate: function(token){
    var datetoken = jwt.verify(token, JWT_SIGN_SECRET)
    datetoken = datetoken.exp
    var datenow = Math.round((new Date().getTime() )/1000)
    if (datenow > datetoken){
      
    }
  }
  
  ,
  parseAuthorization: function(authorization) {
    return (authorization != null) ? authorization.replace('Bearer ', '') : null;
  },
  getUserId: function(authorization) {
    var userId = -1;
    var token = module.exports.parseAuthorization(authorization);
    if(token != null) {
      try {
        var jwtToken = jwt.verify(token, JWT_SIGN_SECRET);
        if(jwtToken != null)
          userId = jwtToken.userId;
      } catch(err) { }
    }
    return userId;
  }
}