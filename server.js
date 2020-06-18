const sutPathProceduralDB = './src/procedural/pg-pl-sql/change-user-email.js';
const sutPathProceduralJS = './src/procedural/javascript/change-user-email.js';
const sutPathOOPHexagonalEventJS = './src/object-oriented/hexagonal-event/code/application/user-handler.js';

// Choose which implementation to execute
const sutPath = sutPathOOPHexagonalEventJS;

const userHandler = require(sutPath);

'use strict';

const Hapi = require('@hapi/hapi');
const Joi = require('@hapi/joi');
const JSONAPIError = require('jsonapi-serializer').Error;

const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    server.route([
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
    ]);



    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();