const lc = require('letter-count');

const files = [
    '/procedural/pg-pl-sql/change-user-email.js',
    '/procedural/javascript/change-user-email.js',
    '/object-oriented/hexagonal-event/code/application/user-controller.js',
    '/object-oriented/hexagonal-event/test/unit/domain/User.test.js',
    '/../test/characterization/change-user-email.test.js',
    '/../test/characterization/database-helper.js'
];

files.map((file) => {
    const lengthChars = lc.countFromFile(__dirname + file).chars;
    console.log(file + " is " + lengthChars.toLocaleString('fr-FR') + " characters long");
});
