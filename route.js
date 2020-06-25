//const sutPathProceduralDB = './src/procedural/pg-pl-sql/user.js';
//const sutPathProceduralJS = './src/procedural/javascript/user.js';
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
    },
    {
        method: 'POST',
        path: '/users/{id}/email',
        config: {
            validate: {
                payload: Joi.object({
                    id: Joi.number().integer().required(),
                    email: Joi.string().email().required()
                }),
                failAction: (request, h , err) => {
                    const errorHttpStatusCode = 400;
                    const jsonApiError = new JSONAPIError({
                        status: errorHttpStatusCode.toString(),
                        title: 'Bad request',
                        detail: err.details[0].message,
                    });
                    return h.response(jsonApiError).code(errorHttpStatusCode).takeover();
                }
            },
            handler: userHandler.changeUserEmail
        }
    }
];

module.exports = routes;