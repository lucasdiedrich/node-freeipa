
const fs = require('fs');
const path = require('path');

// AWS Lambda only allows writing to /tmp, nowhere else.
// This is a quick way to check and change path quickly.
const isLambda = !!process.env.LAMBDA_TASK_ROOT;
let CACHE_FOLDER = '';
if (isLambda) {
    CACHE_FOLDER = '/tmp';
} else {
    CACHE_FOLDER = path.join(__dirname, "../../", ".tmp");
}

const CACHE_PATH = `${CACHE_FOLDER}/freeipa.cookie.json`;

module.exports = class Session {
    /**
     * Construct one new Session
     * @constructor
     * @param {integer} expires - The time in minutes of the expired cookie.
     */
    constructor(expires) {
        this.tokens = {};
        this.defaultExpires = expires;

        this.loadFromFile();
    }

    /**
     * Return true if the user login has an valid cookie inside the store.
     * @method
     * @param {string} login - The user plain login.
     */
    isValid(login) {
        const tuple = this.getTuple(login);

        if (!tuple) { return false; }

        const expires = new Date(tuple.expires);
        const current = new Date();

        if (expires <= current) {
            this.remToken(login);
        }

        return (expires > current);
    }

    /**
     * Return the user cookie if it have one or false if doesn't.
     * @method
     * @param {string} login - The user plain login.
     */
    getTuple(login) {
        const id = Buffer.from(login).toString('base64');

        return this.tokens[id] || false;
    }

    /**
     * Add an token to the store.
     * @method
     * @param {string} login - The user plain login.
     * @param {string} token - The plain token returned from freeipa server.
     */
    addToken(login, token) {
        const id = Buffer.from(login).toString('base64');

        if (this.tokens[id]) {
            this.remToken(login);
        }

        const expires = new Date();
        expires.setMinutes(expires.getMinutes() + this.defaultExpires);

        this.tokens[id] = {
            token,
            expires,
        };

        this.exportToFile();
    }

    /**
     * Remove an token from the store.
     * @method
     * @param {string} login - The user plain login.
     */
    remToken(login) {
        const id = Buffer.from(login).toString('base64');
        if (this.tokens[id]) {
            delete this.tokens[id];

            this.exportToFile();
        }
    }

    /**
     * Return all tokens.
     * @method
     */
    getAllTokens() {
        return this.tokens();
    }

    /**
     * Export the current json object to the file store.
     * @method
     */
    exportToFile() {
        if (!fs.existsSync(CACHE_FOLDER)) {
            fs.mkdirSync(CACHE_FOLDER);
        }
        fs.writeFileSync(CACHE_PATH, JSON.stringify(this.tokens));
    }

    /**
     * Import the current json object to the file store.
     * @method
     */
    loadFromFile() {
        if (fs.existsSync(CACHE_PATH)) {
            const cache = JSON.parse(fs.readFileSync(CACHE_PATH));
            this.tokens = cache;
        }
    }
};
