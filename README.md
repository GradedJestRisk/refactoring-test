# Table of contents
- [Introduction](#introduction)
- [Scope](#scope)
- [Book theses overview](#book-theses-overview)
  * [Hypothesis](#hypothesis)
  * [Conclusion](#conclusion)
  * [Target testing strategy](#target-testing-strategy)
- [Implementation](#implementation)
- [Repository building](#repository-building)
- [Install](#install)
  * [Steps](#steps)
  * [Development purpose](#development-purpose)
- [Compare implementations](#compare-implementations)
  * [An overview](#an-overview)
  * [Details](#details)

# Origin & inspirations
This code* has been ported from a copyrighted C# version, included in the [Unit Testing Principles, Practices, and Patterns](https://www.manning.com/books/unit-testing) book, published by Manning. The author, Vladimir Khorikov, has explicitly allowed such use here. Otherwise stated, all information and quotes in this file comes from the book. I'm not linked in any way with the author; I would like to experiment its proposals and share them with you.

*: except PostgreSQL PL/SQL version, that I wrote by myself. Referred to as pg-pl-sql in codebase, it'a procedural (imperative) language, executed by the database. Basically, it allows mixing "functional" SQL statements together using basic imperative structures (control flow, variables, array). The aim of using such an unusual programming language is to show cost/benefits of such a compact implementation.

Regarding hexagonal architecture, there is a plenty of folders naming convention (see the update note in this [blog post](https://blog.octo.com/en/hexagonal-architecture-three-principles-and-an-implementation-example/)):
 * domain:  port / adapter
 * user-side / application
 * server-side / infrastructure

Characterization testing complies with to [Michael Feathers](https://michaelfeathers.silvrback.com/characterization-testing) definition

# Scope
Only entreprise applications are in the scope.
> An entreprise application is an application that aims at automating or assisting an organization's inner
> processes. It can take many forms, but usually the characteristics of an entreprise software are:
> - high business logic complexity;
> - long project lifespan;
> - moderate amounts of data;
> - low or moderate performance requirements.

Only back-office API is in the scope (GUI are off-scope).

# Book's these overview

## Hypothesis
Automated testing aims at making change cheaper, by making sure:
* the new behaviour is what you expected
* other existing behaviours have not been affected

Automated testing is implemented by code, which should be payed for several times:
* implementation time;
* maintenance time.

Therefore, test can make change costlier.

Several ways to design tests:
* mockist school 
    * mock all dependencies (eg. most collaborators)
    * this cause test code bloat and test brittleness: such test raises false positive while refactoring 
* classical school 
    * mock only shared dependencies (eg. DB)
    * this cause less, but still some test brittleness
* output-based test
    * mock only unmanaged shared dependencies (eg. external API) 
    * brittleness is minimum
* output-based test can be achieved
    * by restricting side effect to dedicated areas in production code
    * such containment is provided by indirection, implemented by application architecture pattern: hexagonal, functional

Output-based test look like the best bet.

Transitioning a codebase to output-based testing is a 2 steps refactoring process:
 * refactor production code (thus breaking existing brittle test) to achieve containment
 * refactor test code

## Conclusion
Coding is a tradeoff between code performance and change cost

| Indirection  | Code change     | Code performance | Test change |
|--------------|-----------------|------------------|-------------|
| None         | costlier        | higher           | costlier    |
| Some         | cheaper         | lower            | cheaper     |
| Too many     | costlier        | lower            | costlier    |

Indirection refers to can be implemented by design patterns, layered architecture. 

Code change (maintenance) cost can be broken down in time:
* to understand existing code
* to make appropriate change
* fix unintended side effects (regression)

Test change (maintenance) cost can be broken down in time:
* to understand existing test
* to make appropriate change to support a code feature change
* to make appropriate change to support a code refactoring change (false positive)

1: Indirection samples are design patterns, layered architecture 

## Target testing strategy
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
        * happy path, exercice all components in the least possible scenarios
        * all other paths untested in unit test
    * isolation:
        * use real collaborators in
            * application, domain 
            * infrastructure : managed dependencies only (eg. DB)
        * mock 
            * infrastructure: unmanaged dependency only (here, external message bus/API)
            * using handwritten mock  

# Implementation
Codebase comes in several flavors, to widen understanding:
* procedural (no OOP)
   * pg-pl-sql
   * Javascript
* object-oriented
   * hexagonal architecture
   
# Repository building
It will follow these steps:
* port procedural C# codebase from the book to a [procedural JS](../master/src/procedural/javascript)
* write [characterization test](../master/test/characterization)
* write [pg-pl-sql port](../master/src/procedural/pg-pl-sql), using characterization test 
* port OOP hexagonal C# codebase from the book to [JS OOP hexagonal](../master/src/object-oriented/hexagonal-event/code/)
* write test for OOP hexagonal 
    * with best practice from book
        * [unit](../master/src/object-oriented/hexagonal-event/test/unit/domain/User.test.js)
        * [integration](../master/src/object-oriented/hexagonal-event/test/integration/change-user-email.test.js)
    * with anti-patterns (eg. unit-testing everything, using mocks)
* [compare](#compare-implementations) costs and benefits of each solution

# Install

## Pre-requisites
You'll need:
* node and npm (I used [nvm](https://github.com/GradedJestRisk/js-training/wiki/node#using-nvm))
* a running postgresql instance:
    * I used [Docker](https://github.com/GradedJestRisk/db-training/wiki/PostgreSQL#container-docker)
    * to make optional http call, you'll need [http extension](https://github.com/pramsey/pgsql-http))

## Steps 
* get the source:
  * with git: clone the repo : <code>git clone git@github.com:GradedJestRisk/refactoring-test.git && cd refactoring-test</code>
  * without git: 
    *  or download the source code manually, extract and cd 
    ```
    curl -LJO https://github.com/GradedJestRisk/refactoring-test/archive/master.zip
    unzip refactoring-test-master.zip
    cd    refactoring-test-master
    ```
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

## Development purpose

To execute code manually:
* create sample data with seeding, run `npx knex seed:run`
* choose your implementation by modifying `const sutPath = <IMPLEMENTATION> ` in [server.js](../master/server.js#L6)
* run `npm start`

To run characterization tests interactively in your IDE on an implementation:
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

# Compare implementations

## An overview

Units:
* time: milliseconds
* size: characters

| Implementation     | Code <br> size   | Code <br> execution time | Unit test <br> size  | Unit test <br>  execution time | Integration test <br> size  | Integration test <br> execution time | Char. test <br> execution time   |
|--------------------|---------------|----------|----------|-------|---------|---------|---------|
| Procedural DB      | 4 250         | 1        | N/A      | N/A   | N/A     | N/A |  100     |  
| Procedural JS      | 2 750         | ?        |  N/A     | N/A   | N/A     | N/A | 1000    |  
| OOP Hexagonal JS   | 5 590         | ?        | 2 500    | 5     | 1 750   | 50  | 1000    |
     

| Helper            | Code     |
|-------------------|----------|
| Char test         | 9 000    |
| Char test helper  | 1 000    |

## Details
To get:
* size (chars), run <code>npm run show:verbosity</code>
* execution time
    * procedural pl/sql, execute function <code>SELECT get_execution_time_micro();</code>
