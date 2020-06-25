const sutPathProceduralDB = './src/procedural/pg-pl-sql/change-user-email.js';
const sutPathProceduralJS = './src/procedural/javascript/change-user-email.js';
const sutPathOOPHexagonalEventJS = './src/object-oriented/hexagonal-event/code/user-side/user-handler.js';

// Choose which implementation to execute
const sutPath = sutPathOOPHexagonalEventJS;

const userHandler = require(sutPath);

const Joi = require('@hapi/joi');
const JSONAPIError = require('jsonapi-serializer').Error;
const packageJSON = require('./package.json');

const routes = [
    {
        method: 'GET',
        path: '/health_check',
        config: {
            handler: () => {
                return {
                    'name': packageJSON.name,
                    'version': packageJSON.version,
                    'description': packageJSON.description,
                };
            }
        }
    },
    {
        method: 'GET',
        path: '/users/{id}',
        config: {
            validate: {
                //query: Joi.object().required().keys({
                //   id: Joi.number().required()
                //}),
                failAction: (request, h) => {
                    const errorHttpStatusCode = 400;
                    const jsonApiError = new JSONAPIError({
                        code: errorHttpStatusCode.toString(),
                        title: 'Bad request',
                        detail: 'Request data are not in the allowed format',
                    });
                    return h.response(jsonApiError).code(errorHttpStatusCode).takeover();
                }
            },
            handler: userHandler.getUser
        }
    }
];

module.exports = routes;