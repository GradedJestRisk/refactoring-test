const lc = require('letter-count');

const files = [
    // Procedural PG
    '/procedural/pg-pl-sql/change-user-email.sql',
    '/procedural/pg-pl-sql/email-change-authorized.sql',
    '/procedural/pg-pl-sql/propagate-change.sql',
    '/procedural/pg-pl-sql/update-company.sql',
    '/procedural/pg-pl-sql/update-user.sql',
    // Procedural JS
    '/procedural/javascript/change-user-email.js',
    '/procedural/javascript/out-of-process-dependencies/managed/database.js',
    '/procedural/javascript/out-of-process-dependencies/unmanaged/propagate-change.js',
    // OO
    '/object-oriented/hexagonal-event/code/change-user-email.js',
    '/object-oriented/hexagonal-event/code/application/user-controller.js',
    '/object-oriented/hexagonal-event/code/domain/Company.js',
    '/object-oriented/hexagonal-event/code/domain/User.js',
    '/object-oriented/hexagonal-event/code/infrastructure/managed-dependencies/company-repository.js',
    '/object-oriented/hexagonal-event/code/infrastructure/managed-dependencies/user-repository.js',
    '/object-oriented/hexagonal-event/code/infrastructure/unmanaged-dependencies/message-bus.js',
    '/object-oriented/hexagonal-event/code/shared/email-changed-event.js',
    // OO - Test
    '/object-oriented/hexagonal-event/test/unit/domain/User.test.js',
    '/object-oriented/hexagonal-event/test/integration/change-user-email.test.js',
    // Test
    '/../test/characterization/change-user-email.test.js',
    '/../test/characterization/database-helper.js'
];

files.map((file) => {
    const lengthChars = lc.countFromFile(__dirname + file).chars;
    console.log(file + " is " + lengthChars.toLocaleString('fr-FR') + " characters long");
});
