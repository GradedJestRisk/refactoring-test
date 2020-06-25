## Perspectives ##
You can't have all of them

Perspectives:
* protection against regression: code behaving incorrectly after change
* resistance to refactoring tolerance: refactoring code should not raise false alarms or broken test
* fast feedback: execute quickly
* maintainability: cost of making a change in code (write code and test code)

## Extreme cases ##

General:
* maintainability is not correlated (except end-to-end)
* resistance to refactoring is binary

So, you should maximize doing sacrifice somewhere

Ideal:
* resistance to refactoring
* protection against regression
* fast feedback

End-to-end
Yes:
* resistance to refactoring
* protection against regression

No:
* fast feedback
* maintainability 

Trivial
Yes:
* resistance to refactoring
* protection against regression

No:
* fast feedback

Brittle test
Yes:
* fast feedback
* protection against regression

No:
* resistance to refactoring

## School ##
Mock:

Classical:

Output-based