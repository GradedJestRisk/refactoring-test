# refactoring-test

To install, skip and go [there](#Install)

# Introduction
This code* has been ported from a copyrighted C# version, included in the [Unit Testing Principles, Practices, and Patterns](https://www.manning.com/books/unit-testing) book, published by Manning. The author, Vladimir Khorikov, has explicitly allowed such use here. Otherwise stated, all information and quotes in this file comes from the book. I'm not linked in any way with the author; I would like to experiment its proposals and share them with you.

*: except PostgreSQL PL/SQL version, that I wrote by myself. Refered to as pg-pl-sql in codebase, it'a procedural (imperative) language, executed by the database. Basically, it allows mixing "functional" SQL statements together using basic imperative structures (control flow, variables, array). The aim of using such an unusual programming language is to show cost/benefits of such a compact implementation.

Regarding hexagonal architecture, folders are named according to  [OCTO blog post](https://blog.octo.com/en/hexagonal-architecture-three-principles-and-an-implementation-example/)
# Scope
Only entreprise applications are in the scope.
> An entreprise application is an application that aims at automating or assisting an organization's inner
> processses. It can take many forms, but usually the characteristics of an entreprise software are:
> - high business logic complexity;
> - long project lifespan;
> - moderate amounts of data;
> - low or moderate performance requirements.

Only back-office API are in the scope (GUI are off-scope).

# Book's theses overview

## Hypothesis
List:
* test code involve maintenance cost, low-value test code should be deleted
* mockist school (mock all dependencies) cause test brittleness: such test raise false positive while refactoring 
* output-based test does not suffer from such brittleness
* output-based test require side-effect containement in production code
* side-effect containement can be reached using application architecture (eg. hexagonal, functional)

## Conclusion
Coding is a tradeoff

| Architecture     | Code<br>maintenance<br>cost | <br>Code<br>performance | <br>Test<br>cost |
|------------------|---------------------|-------------------------|-----------------------|
| No indirection   | +                   | +                       | +                     |
| Some indirection | +                   | -                       | -                     |


## Target testing'strategy:
Test types:
* unit test 
   * scope :
      * domain only
      * all paths
   * isolation :
      * use real collaborators
      * no mock
* integration test:
    * scope :
        * happy path, exercice all components in the less possible scenarios
        * all other paths, not tested in unit test
    * isolation:
        * use real collaborators in
            * application, domain, infrastructure 
            * in infrastructure, use a real database
        * mock only 
            * unmanaged depency (here, message bus)
            * using handwritten mock  

# Implementation
Codebase comes in several flavors, to widen understanding:
* procedural (no OOP)
   * pg-pl-sql
   * Javascript
* object-oriented
   * hexagonal architecture
   * functional architecture
   
# Repository building
It will follow these steps:
* port procedural C# codebase from book to a [procedural JS](https://github.com/GradedJestRisk/refactoring-test/tree/master/src/procedural/javascript)
* write [characterization test](https://github.com/GradedJestRisk/refactoring-test/tree/master/test/characterization)
* write [pg-pl-sql port](https://github.com/GradedJestRisk/refactoring-test/tree/master/src/procedural/pg-pl-sql), using characterization test 
* port OOP hexagonal C# codebase from book to JS OOP hexagonal
* write test for OOP hexagonal with best practice from book
* write test for OOP hexagonal with anti-patterns (eg. unit-testing everything, using mocks)
* compare costs and benefits of each solutions


# Install
You'll need:
* node and npm 
* a running posgresql instance, with  (for full experience, add [http extension](https://github.com/pramsey/pgsql-http))

**Steps**:
* get the source:
  * clone the repo : <code>git clone git@github.com:GradedJestRisk/refactoring-test.git && cd refactoring-test</code>
  * or download the source code manually, extract and cd 
* install dependencies <code>npm install</code>
* setup your database connection in [knexfile.js](../master/knexfile.js)
```
    connection: {
      database: '<DATABASE_NAME>',
      port:     <PORT>,
      user:     '<USER',
      password: '<PASSWORD>' 
    },
```
* create DB structure (2 tables): run `npx knex migrate:latest`
* run the test <code>npm test</code>

If you installed the http extension, uncomment [the following lines](../master/src/procedural/pg-pl-sql/change-user-email.sql#L122-L138)
```
    -- Propagate changes
    message_json := '{ type: ''emailChangedEvent'', userId: ''' || p_id || ''', email: ''' || p_new_email || ''' }';

    SELECT status,
           content::json ->> 'data' AS data
    INTO
        response_code,
        response_data
    FROM
        http_put('http://httpbin.org/put', message_json, 'text/plain');

    RAISE NOTICE 'response code: %', response_code;
    RAISE NOTICE 'response data: %', response_data;

    IF response_code != 200 THEN
        RETURN MESSAGE_REJECTED;
    END IF;
```

**For development purpose**

To execute code manually:
* create sample data with seeding, run `npx knex seed:run`
* choose your implementation by modifying `const sutPath = <IMPLEMENTATION> ` in [server.js](../master/server.js#L6)
* run `npm start`

To run characterization tests interactively in you IDE on an implementation:
* alter the following line in [change-user-email.test.js](../master/test/characterization/change-user-email.test.js)
```
} else {
    // used for interactive
    sutPath = sutPathProceduralJS;
}
```
To see all SQL queries issued by JS:
* enable debug mode by uncommenting the following line in [knexfile.js](../master/knexfile.js)
```
  // debug: true
```
