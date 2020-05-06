# refactoring-test

Ways:
* database-side procedural
* JS procedural
* clean architecture
* functional architecture

Hypothesis:
* mock all dependencies make test brittle: false positive while refactoring 
* test code involve maintenance cost, low-value test code should be deleted
* code design profoundly influence test code

Steps:
* codebase from book
* write characterization test 
* write database-side procedural
* refactor code to clean architecture
* write test for clean architecture with best practice from book
* write test for clean architecture with anti-patterns (unit-testing everything, using mocks => tons of tests)

[Book](https://www.manning.com/books/unit-testing) 'strategy:
* unit test on domain
* integration test
    * scope :
        * happy path
        * integration test, path not tested in unit test
    * tool:
        * mock message bus only
        * use real database 
