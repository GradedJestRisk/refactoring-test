const fs = require('fs')
const lc = require('letter-count');

const fileNames = [
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
    '/object-oriented/hexagonal-event/code/user-side/user-controller.js',
    '/object-oriented/hexagonal-event/code/domain/Company.js',
    '/object-oriented/hexagonal-event/code/domain/User.js',
    '/object-oriented/hexagonal-event/code/server-side/managed-dependencies/company-repository.js',
    '/object-oriented/hexagonal-event/code/server-side/managed-dependencies/user-repository.js',
    '/object-oriented/hexagonal-event/code/server-side/unmanaged-dependencies/message-bus.js',
    '/object-oriented/hexagonal-event/code/shared/email-changed-event.js',
    // OO - Test
    '/object-oriented/hexagonal-event/test/unit/domain/User.test.js',
    '/object-oriented/hexagonal-event/test/integration/change-user-email.test.js',
    '/object-oriented/hexagonal-event/test/integration/httpClientSpy.js',
    '/object-oriented/hexagonal-event/test/end-to-end/user.test.js',
    // Test
    '/../test/characterization/change-user-email.test.js',
    '/../test/database-helper.js'
];

fileNames.map((file) => {
    const filePath = __dirname + '/../' + file;
    if (!fs.existsSync(filePath)) { console.error(filePath + ' does not exists'); return; }
    const lengthChars = lc.countFromFile(filePath).chars;
    console.log(file + " is " + lengthChars.toLocaleString('fr-FR') + " characters long");
});
