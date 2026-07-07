<?php

namespace Database\Seeders;

use App\Models\Option;
use App\Models\Question;
use App\Models\Quiz;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ── Users ─────────────────────────────────────────────
        User::create([
            'name'     => 'Admin',
            'email'    => 'admin@questra.com',
            'password' => Hash::make('Questra123'),
            'role'     => 'admin',
            'email_verified_at' => now(),
        ]);

        User::create([
            'name'     => 'User One',
            'email'    => 'user@questra.com',
            'password' => Hash::make('Questra123'),
            'role'     => 'user',
            'email_verified_at' => now(),
        ]);

        // ── OOP Fundamentals Quiz ─────────────────────────────
        $oopQuiz = Quiz::create([
            'title'              => 'OOP Fundamentals Quiz',
            'description'        => '10 Multiple Choice & 4 True/False Questions to test OOP Fundamentals.',
            'time_limit_seconds' => 900,
            'is_published'       => true,
        ]);

        $oopMcqQuestions = [
            [
                'body' => 'Which of the following best describes encapsulation in Object-Oriented Programming?',
                'options' => [
                    ['body' => 'The ability of a class to derive properties from another class.', 'is_correct' => false],
                    ['body' => 'The ability of different objects to respond in their own way to the same method call.', 'is_correct' => false],
                    ['body' => 'Bundling data and methods that operate on that data within a single unit.', 'is_correct' => true],
                    ['body' => 'Hiding the complex implementation details and showing only the essential features.', 'is_correct' => false],
                ],
            ],
            [
                'body' => 'What is the primary purpose of inheritance in OOP?',
                'options' => [
                    ['body' => 'Securing data by restricting access to class variables.', 'is_correct' => false],
                    ['body' => 'Code reusability and establishing a relationship between classes.', 'is_correct' => true],
                    ['body' => 'Allowing methods to have the same name but different signatures.', 'is_correct' => false],
                    ['body' => 'Instantiating multiple objects from a single class.', 'is_correct' => false],
                ],
            ],
            [
                'body' => 'In OOP, the ability of different classes to provide different implementations for the same method name is known as:',
                'options' => [
                    ['body' => 'Polymorphism', 'is_correct' => true],
                    ['body' => 'Encapsulation', 'is_correct' => false],
                    ['body' => 'Abstraction', 'is_correct' => false],
                    ['body' => 'Inheritance', 'is_correct' => false],
                ],
            ],
            [
                'body' => 'What is the relationship between a class and an object?',
                'options' => [
                    ['body' => 'An object is a blueprint, and a class is an instance of an object.', 'is_correct' => false],
                    ['body' => 'A class is a blueprint, and an object is an instance of a class.', 'is_correct' => true],
                    ['body' => 'A class is a specific variable, and an object is a function.', 'is_correct' => false],
                    ['body' => 'They are completely independent and unrelated concepts.', 'is_correct' => false],
                ],
            ],
            [
                'body' => 'Which OOP principle focuses on hiding complex implementation details and showing only the essential features to the user?',
                'options' => [
                    ['body' => 'Encapsulation', 'is_correct' => false],
                    ['body' => 'Polymorphism', 'is_correct' => false],
                    ['body' => 'Inheritance', 'is_correct' => false],
                    ['body' => 'Abstraction', 'is_correct' => true],
                ],
            ],
            [
                'body' => 'What is method overriding?',
                'options' => [
                    ['body' => 'Defining multiple methods with the same name but different parameters in the same class.', 'is_correct' => false],
                    ['body' => 'Hiding the variables of a class from other classes.', 'is_correct' => false],
                    ['body' => 'Providing a specific implementation in a subclass for a method that is already defined in its superclass.', 'is_correct' => true],
                    ['body' => 'Creating a new instance of a class.', 'is_correct' => false],
                ],
            ],
            [
                'body' => 'What is the main function of a constructor in a class?',
                'options' => [
                    ['body' => 'To destroy an object when it is no longer needed.', 'is_correct' => false],
                    ['body' => 'To return a value from a class.', 'is_correct' => false],
                    ['body' => 'To inherit properties from a parent class.', 'is_correct' => false],
                    ['body' => 'To initialize a newly created object.', 'is_correct' => true],
                ],
            ],
            [
                'body' => 'Which access modifier restricts the access of a member (variable or method) to only within its own class?',
                'options' => [
                    ['body' => 'Public', 'is_correct' => false],
                    ['body' => 'Private', 'is_correct' => true],
                    ['body' => 'Protected', 'is_correct' => false],
                    ['body' => 'Default', 'is_correct' => false],
                ],
            ],
            [
                'body' => 'A class that inherits properties and behaviors from another class is called a:',
                'options' => [
                    ['body' => 'Base class (or Superclass)', 'is_correct' => false],
                    ['body' => 'Derived class (or Subclass)', 'is_correct' => true],
                    ['body' => 'Abstract class', 'is_correct' => false],
                    ['body' => 'Static class', 'is_correct' => false],
                ],
            ],
            [
                'body' => 'What term describes a scenario where a subclass inherits from more than one superclass?',
                'options' => [
                    ['body' => 'Multilevel inheritance', 'is_correct' => false],
                    ['body' => 'Hierarchical inheritance', 'is_correct' => false],
                    ['body' => 'Multiple inheritance', 'is_correct' => true],
                    ['body' => 'Single inheritance', 'is_correct' => false],
                ],
            ],
        ];

        $order = 1;
        foreach ($oopMcqQuestions as $question) {
            $q = Question::create([
                'quiz_id' => $oopQuiz->id,
                'body'    => $question['body'],
                'type'    => 'mcq',
                'order'   => $order++,
            ]);

            foreach ($question['options'] as $opt) {
                Option::create(array_merge($opt, ['question_id' => $q->id]));
            }
        }

        $oopTrueFalseQuestions = [
            [
                'body' => 'Encapsulation makes it possible to change the internal implementation of a class without affecting the external code that uses it.',
                'is_true' => true,
            ],
            [
                'body' => 'You can create only one object (instance) from a specific class.',
                'is_true' => false,
            ],
            [
                'body' => 'A constructor must always have the same name as the class in which it is defined.',
                'is_true' => true,
            ],
            [
                'body' => 'Method overloading is an example of compile-time (static) polymorphism.',
                'is_true' => true,
            ],
        ];

        foreach ($oopTrueFalseQuestions as $question) {
            $q = Question::create([
                'quiz_id' => $oopQuiz->id,
                'body'    => $question['body'],
                'type'    => 'true_false',
                'order'   => $order++,
            ]);

            foreach ([
                ['body' => 'True',  'is_correct' => $question['is_true'] === true],
                ['body' => 'False', 'is_correct' => $question['is_true'] === false],
            ] as $opt) {
                Option::create(array_merge($opt, ['question_id' => $q->id]));
            }
        }

        // ── Data Structures & Algorithms Quiz ─────────────────
        $dsaQuiz = Quiz::create([
            'title'              => 'Data Structures & Algorithms Quiz',
            'description'        => '10 Multiple Choice & 4 True/False Questions to test DSA knowledge.',
            'time_limit_seconds' => 900,
            'is_published'       => true,
        ]);

        $dsaMcqQuestions = [
            [
                'body' => 'What is the time complexity of accessing an element at a specific index in an array?',
                'options' => [
                    ['body' => 'O(n)', 'is_correct' => false],
                    ['body' => 'O(log n)', 'is_correct' => false],
                    ['body' => 'O(1)', 'is_correct' => true],
                    ['body' => 'O(n^2)', 'is_correct' => false],
                ],
            ],
            [
                'body' => 'Which data structure operates on a Last-In, First-Out (LIFO) principle?',
                'options' => [
                    ['body' => 'Queue', 'is_correct' => false],
                    ['body' => 'Stack', 'is_correct' => true],
                    ['body' => 'Linked List', 'is_correct' => false],
                    ['body' => 'Binary Tree', 'is_correct' => false],
                ],
            ],
            [
                'body' => 'In a standard Binary Search Tree (BST), what is the relationship between a node and its children?',
                'options' => [
                    ['body' => 'The left child is greater than the parent, and the right child is less.', 'is_correct' => false],
                    ['body' => 'Both children are always equal to the parent.', 'is_correct' => false],
                    ['body' => 'The left child is less than the parent, and the right child is greater.', 'is_correct' => true],
                    ['body' => 'There is no specific relationship; it depends on insertion order.', 'is_correct' => false],
                ],
            ],
            [
                'body' => 'Breadth-First Search (BFS) traversal of a graph typically uses which data structure to keep track of nodes to visit next?',
                'options' => [
                    ['body' => 'Stack', 'is_correct' => false],
                    ['body' => 'Priority Queue', 'is_correct' => false],
                    ['body' => 'Array', 'is_correct' => false],
                    ['body' => 'Queue', 'is_correct' => true],
                ],
            ],
            [
                'body' => 'What is the worst-case time complexity of the QuickSort algorithm?',
                'options' => [
                    ['body' => 'O(n log n)', 'is_correct' => false],
                    ['body' => 'O(n^2)', 'is_correct' => true],
                    ['body' => 'O(n)', 'is_correct' => false],
                    ['body' => 'O(log n)', 'is_correct' => false],
                ],
            ],
            [
                'body' => 'Which technique is commonly used to resolve collisions in a Hash Table?',
                'options' => [
                    ['body' => 'Chaining', 'is_correct' => true],
                    ['body' => 'Memoization', 'is_correct' => false],
                    ['body' => 'Divide and Conquer', 'is_correct' => false],
                    ['body' => 'Backtracking', 'is_correct' => false],
                ],
            ],
            [
                'body' => 'Dynamic Programming is best suited for problems that exhibit which two properties?',
                'options' => [
                    ['body' => 'Overlapping subproblems and optimal substructure', 'is_correct' => true],
                    ['body' => 'Non-overlapping subproblems and optimal substructure', 'is_correct' => false],
                    ['body' => 'Greedy choice property and sorting', 'is_correct' => false],
                    ['body' => 'Linear traversal and recursion', 'is_correct' => false],
                ],
            ],
            [
                'body' => 'What is the time complexity of performing a Binary Search on a sorted array of n elements?',
                'options' => [
                    ['body' => 'O(n)', 'is_correct' => false],
                    ['body' => 'O(1)', 'is_correct' => false],
                    ['body' => 'O(log n)', 'is_correct' => true],
                    ['body' => 'O(n log n)', 'is_correct' => false],
                ],
            ],
            [
                'body' => 'In a Max-Heap, which of the following statements is always true?',
                'options' => [
                    ['body' => 'The parent node is always smaller than its children.', 'is_correct' => false],
                    ['body' => 'The tree is always a perfectly balanced binary search tree.', 'is_correct' => false],
                    ['body' => 'The root node contains the maximum element in the heap.', 'is_correct' => true],
                    ['body' => 'The leaf nodes are always sorted from left to right.', 'is_correct' => false],
                ],
            ],
            [
                'body' => 'Which data structure is best suited for implementing a priority queue?',
                'options' => [
                    ['body' => 'Stack', 'is_correct' => false],
                    ['body' => 'Heap', 'is_correct' => true],
                    ['body' => 'Singly Linked List', 'is_correct' => false],
                    ['body' => 'Hash Table', 'is_correct' => false],
                ],
            ],
        ];

        $order = 1;
        foreach ($dsaMcqQuestions as $question) {
            $q = Question::create([
                'quiz_id' => $dsaQuiz->id,
                'body'    => $question['body'],
                'type'    => 'mcq',
                'order'   => $order++,
            ]);

            foreach ($question['options'] as $opt) {
                Option::create(array_merge($opt, ['question_id' => $q->id]));
            }
        }

        $dsaTrueFalseQuestions = [
            [
                'body' => 'Inserting an element at the beginning of an array is faster than inserting an element at the beginning of a singly linked list.',
                'is_true' => false,
            ],
            [
                'body' => 'A tree is a specialized type of graph that cannot contain any cycles.',
                'is_true' => true,
            ],
            [
                'body' => 'Merge Sort is considered a "stable" sorting algorithm, meaning it preserves the relative order of equal elements.',
                'is_true' => true,
            ],
            [
                'body' => 'A Greedy algorithm is guaranteed to always find the globally optimal solution for any given optimization problem.',
                'is_true' => false,
            ],
        ];

        foreach ($dsaTrueFalseQuestions as $question) {
            $q = Question::create([
                'quiz_id' => $dsaQuiz->id,
                'body'    => $question['body'],
                'type'    => 'true_false',
                'order'   => $order++,
            ]);

            foreach ([
                ['body' => 'True',  'is_correct' => $question['is_true'] === true],
                ['body' => 'False', 'is_correct' => $question['is_true'] === false],
            ] as $opt) {
                Option::create(array_merge($opt, ['question_id' => $q->id]));
            }
        }

        // ── Python Fundamentals Quiz ───────────────────────────
        $pythonQuiz = Quiz::create([
            'title'              => 'Python Fundamentals Quiz',
            'description'        => '10 Multiple Choice & 4 True/False Questions to test Python Fundamentals.',
            'time_limit_seconds' => 900,
            'is_published'       => true,
        ]);

        $pythonMcqQuestions = [
            [
                'body' => 'What is the correct syntax to output "Hello World" in Python?',
                'options' => [
                    ['body' => 'echo "Hello World"', 'is_correct' => false],
                    ['body' => 'p("Hello World")', 'is_correct' => false],
                    ['body' => 'print("Hello World")', 'is_correct' => true],
                    ['body' => 'echo("Hello World")', 'is_correct' => false],
                ],
            ],
            [
                'body' => 'How do you insert a single-line comment in Python code?',
                'options' => [
                    ['body' => '// This is a comment', 'is_correct' => false],
                    ['body' => '# This is a comment', 'is_correct' => true],
                    ['body' => '/* This is a comment */', 'is_correct' => false],
                    ['body' => '<!-- This is a comment -->', 'is_correct' => false],
                ],
            ],
            [
                'body' => 'Which of the following is NOT a valid variable name in Python?',
                'options' => [
                    ['body' => 'my_var', 'is_correct' => false],
                    ['body' => '_myvar', 'is_correct' => false],
                    ['body' => '1myvar', 'is_correct' => true],
                    ['body' => 'myVar', 'is_correct' => false],
                ],
            ],
            [
                'body' => 'What is the correct file extension for Python files?',
                'options' => [
                    ['body' => '.pyth', 'is_correct' => false],
                    ['body' => '.pt', 'is_correct' => false],
                    ['body' => '.pyt', 'is_correct' => false],
                    ['body' => '.py', 'is_correct' => true],
                ],
            ],
            [
                'body' => 'Which keyword is used to create a function in Python?',
                'options' => [
                    ['body' => 'function', 'is_correct' => false],
                    ['body' => 'create', 'is_correct' => false],
                    ['body' => 'def', 'is_correct' => true],
                    ['body' => 'make', 'is_correct' => false],
                ],
            ],
            [
                'body' => 'Which of the following data types is immutable (cannot be changed after creation)?',
                'options' => [
                    ['body' => 'List', 'is_correct' => false],
                    ['body' => 'Dictionary', 'is_correct' => false],
                    ['body' => 'Set', 'is_correct' => false],
                    ['body' => 'Tuple', 'is_correct' => true],
                ],
            ],
            [
                'body' => 'What is the output of the expression 3 ** 2 in Python?',
                'options' => [
                    ['body' => '6', 'is_correct' => false],
                    ['body' => '9', 'is_correct' => true],
                    ['body' => '1', 'is_correct' => false],
                    ['body' => '5', 'is_correct' => false],
                ],
            ],
            [
                'body' => 'How do you create a variable named x with the numeric value 5?',
                'options' => [
                    ['body' => 'int x = 5', 'is_correct' => false],
                    ['body' => 'x = 5', 'is_correct' => true],
                    ['body' => 'x == 5', 'is_correct' => false],
                    ['body' => 'let x = 5', 'is_correct' => false],
                ],
            ],
            [
                'body' => "What is the output of print(type([]))?",
                'options' => [
                    ['body' => "<class 'list'>", 'is_correct' => true],
                    ['body' => "<class 'array'>", 'is_correct' => false],
                    ['body' => "<class 'tuple'>", 'is_correct' => false],
                    ['body' => "<class 'dict'>", 'is_correct' => false],
                ],
            ],
            [
                'body' => 'Which string method can be used to convert all characters in a string to upper case?',
                'options' => [
                    ['body' => 'uppercase()', 'is_correct' => false],
                    ['body' => 'toUpper()', 'is_correct' => false],
                    ['body' => 'upper()', 'is_correct' => true],
                    ['body' => 'capitalize()', 'is_correct' => false],
                ],
            ],
        ];

        $order = 1;
        foreach ($pythonMcqQuestions as $question) {
            $q = Question::create([
                'quiz_id' => $pythonQuiz->id,
                'body'    => $question['body'],
                'type'    => 'mcq',
                'order'   => $order++,
            ]);

            foreach ($question['options'] as $opt) {
                Option::create(array_merge($opt, ['question_id' => $q->id]));
            }
        }

        $pythonTrueFalseQuestions = [
            [
                'body' => 'Indentation (whitespace at the beginning of a line) is crucial in Python to define the scope of loops, functions, and classes.',
                'is_true' => true,
            ],
            [
                'body' => 'A single Python list can contain elements of different data types (e.g., integers, strings, and booleans all in one list).',
                'is_true' => true,
            ],
            [
                'body' => 'The == operator is used to assign a value to a variable.',
                'is_true' => false,
            ],
            [
                'body' => 'Python is considered a compiled programming language, not an interpreted one.',
                'is_true' => false,
            ],
        ];

        foreach ($pythonTrueFalseQuestions as $question) {
            $q = Question::create([
                'quiz_id' => $pythonQuiz->id,
                'body'    => $question['body'],
                'type'    => 'true_false',
                'order'   => $order++,
            ]);

            foreach ([
                ['body' => 'True',  'is_correct' => $question['is_true'] === true],
                ['body' => 'False', 'is_correct' => $question['is_true'] === false],
            ] as $opt) {
                Option::create(array_merge($opt, ['question_id' => $q->id]));
            }
        }
    }
}
