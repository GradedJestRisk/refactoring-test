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

# Introduction
This code* has been ported from a copyrighted C# version, included in the [Unit Testing Principles, Practices, and Patterns](https://www.manning.com/books/unit-testing) book, published by Manning. The author, Vladimir Khorikov, has explicitly allowed such use here. Otherwise stated, all information and quotes in this file comes from the book. I'm not linked in any way with the author; I would like to experiment its proposals and share them with you.

*: except PostgreSQL PL/SQL version, that I wrote by myself. Referred to as pg-pl-sql in codebase, it'a procedural (imperative) language, executed by the database. Basically, it allows mixing "functional" SQL statements together using basic imperative structures (control flow, variables, array). The aim of using such an unusual programming language is to show cost/benefits of such a compact implementation.

Regarding hexagonal architecture, folders naming convention come from this [blog post](https://blog.octo.com/en/hexagonal-architecture-three-principles-and-an-implementation-example/)

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
List:
* test code involve maintenance cost, low-value test code should be deleted
* mockist school (mock all dependencies) cause test brittleness: such test raises false positive while refactoring 
* output-based test does not suffer from such brittleness
* output-based test require side effect containment in production code
* side effect containment can be reached using application architecture (eg. hexagonal, functional)

## Conclusion
Coding is a tradeoff

| Architecture     | Code<br>maintenance<br>cost | <br>Code<br>performance | <br>Test<br>cost |
|------------------|---------------------|-------------------------|-----------------------|
| No indirection   | +                   | +                       | +                     |
| Some indirection | +                   | -                       | -                     |


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
        * on happy paths, exercice all components in the less possible scenarios
        * all other paths, not tested in unit test
    * isolation:
        * use real collaborators in
            * application, domain, infrastructure 
            * in infrastructure, use a real database
        * mock only 
            * unmanaged dependency (here, message bus)
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
* port procedural C# codebase from the book to a [procedural JS](../master/src/procedural/javascript)
* write [characterization test](../master/test/characterization)
* write [pg-pl-sql port](../master/src/procedural/pg-pl-sql), using characterization test 
* port OOP hexagonal C# codebase from the book to [JS OOP hexagonal](../master/src/object-oriented/hexagonal-event/code/)
* write test for OOP hexagonal with best practice from book
* write test for OOP hexagonal with anti-patterns (eg. unit-testing everything, using mocks)
* compare costs and benefits of each solution

# Install
You'll need:
* node and npm 
* a running postgresql instance, with  (for full experience, add [http extension](https://github.com/pramsey/pgsql-http))

## Steps 
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

| Implementation     | Code <br> size   | Code <br> execution time | Unit test <br> size  | Unit test <br>  execution time | Integration test <br> size | Char. test <br> execution time   |
|--------------------|---------------|----------|----------|-------|---------|---------|
| Procedural DB      | 650           | 1        | N/A      | N/A   | N/A     | 100     |  
| Procedural JS      | 1 427         | ?        |  N/A     | N/A   | N/A     | 1000    |  
| OOP Hexagonal JS   | 1 756         | ?        | 2 500    | 5     | ?       | 1000    |     

| Helper            | Code     |
|-------------------|----------|
| Char test         | 9 000    |
| Char test helper  | 1 000    |

## Details
To get:
* size (chars), run <code>npm run show:verbosity</code>
* execution time
    * procedural pl/sql, execute function <code>SELECT get_execution_time_micro();</code>
