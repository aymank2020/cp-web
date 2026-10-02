'use strict';

module.exports = function runtimeConfig(env) {
    env = env || process.env;
    if (!env.SESSION_SECRET || env.SESSION_SECRET.length < 32) {
        throw new Error('SESSION_SECRET must contain at least 32 characters; configure it before starting the demo.');
    }
    if (env.NODE_TLS_REJECT_UNAUTHORIZED === '0') {
        throw new Error('TLS certificate verification must remain enabled for this demo.');
    }
    return {
        trustProxy: env.TRUST_PROXY === '1',
        trackDeployment: env.TRACK_DEPLOYMENT === '1',
        session: {
            secret: env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
            cookie: {httpOnly: true, secure: env.NODE_ENV === 'production'}
        }
    };
};
