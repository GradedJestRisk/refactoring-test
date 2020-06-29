const childProcess = require('child_process');
const MILLISECONDS_IN_SECONDS = 1000;
const ITERATION_COUNT = 10;

// https://stackoverflow.com/questions/32874316/node-js-accessing-the-exit-code-and-stderr-of-a-system-command
function execSync(cmd) {
    try {
        return childProcess.execSync(cmd).toString();
    } catch (error) {
        console.log('exit code: ' + error.status);
        console.log('error message: ' + error.message);
        console.log('stdout: ' + error.stdout);
        console.log('stderr: ' + error.stderr);
    }
}

const testTasks = [
    'procedural-js:char',
    'procedural-db:char',
    'oop-hexagonal-event-js:unit',
    'oop-hexagonal-event-js:integ',
    'oop-hexagonal-event-js:char',
    'oop-hexagonal-event-js:end-to-end',
]

console.log('#########################################"');

testTasks.map((suffix)=> {

    console.log('Executing ' + suffix + ' tests through ' + ITERATION_COUNT + ' iterations');
    const beginDate = Date.now();

    for (let i = 0; i < ITERATION_COUNT; i++){
        const stdout = execSync('npm run test:' + suffix);
        //console.log('stdout' + stdout);
    }

    const elapsedTotal =  Date.now() - beginDate;
    const elapsedAverage = elapsedTotal / ITERATION_COUNT / MILLISECONDS_IN_SECONDS;

    // https://stackoverflow.com/questions/11832914/round-to-at-most-2-decimal-places-only-if-necessary
    const elapsedAverageRounded = Math.round((elapsedAverage + Number.EPSILON) * 100) / 100;

    console.log('average elapsed (s): ' + elapsedAverageRounded);

})


