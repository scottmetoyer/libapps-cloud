'use strict';
const jwt = require('jsonwebtoken');

const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID;
const AUTH0_SIGNING_SECRET = process.env.AUTH0_SIGNING_SECRET;

// Policy helper
const generatePolicy = (principalId, effect, resource) => {
    const authResponse = {};
    authResponse.principalId = principalId;

    if (effect && resource) {
        const policyDocument = {};
        policyDocument.Version = '2012-10-17';
        policyDocument.Statement = [];
        const statementOne = {};
        statementOne.Action = 'execute-api:Invoke';
        statementOne.Effect = effect;
        statementOne.Resource = resource;
        policyDocument.Statement[0] = statementOne;
        authResponse.policyDocument = policyDocument;
    };

    return authResponse;
};

module.exports.handler = (event, context, callback) => {
    if (!event.authorizationToken) {
        return callback('Unauthorized');
    }

    const tokenParts = event.authorizationToken.split(' ');
    const tokenValue = tokenParts[1];

    if (!(tokenParts[0].toLowerCase() === 'bearer' && tokenValue)) {
        // No auth token provided in the request
        return callback('Unauthorized');
    }
    const options = {
        // audience: AUTH0_CLIENT_ID,
    };

    // Decode base64 secret. ref: http://bit.ly/2hA6CrO
    // const secret = new Buffer.from(AUTH0_CLIENT_SECRET, 'base64');
    // NOTE: Our JWT tokens are not Base64 encoded so we don't need to do this

    try {
        jwt.verify(tokenValue, AUTH0_SIGNING_SECRET, options, (verifyError, decoded) => {
            if (verifyError) {
                console.log('verifyError', verifyError);
                console.log(`Token invalid. ${verifyError}`);
                return callback('Unauthorized');
            }

            // Valid and authorized request
            return callback(null, generatePolicy(decoded.sub, 'Allow', '*'));
        });
    } catch (err) {
        console.log('Invalid token', err);
        return callback('Unauthorized');
    }
};