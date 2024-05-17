# DJS03 Project Brief: Book Connect - Abstractions

Dive into the delightful world of "Book Connect," where literary adventures await at your fingertips! Browse, explore, and uncover your next great read from a vast, vibrant collection. Whether you're a fan of thrilling mysteries, epic fantasies, or heartwarming romances, "Book Connect" brings the magic of books directly to you. Happy reading! 

The "Book Connect" project provides an opportunity for students to refine a fully functional version of an application. The focus of this project is to enhance the code's maintainability, extendibility, and readability by applying concepts of objects and functions for abstraction. This will not only streamline future modifications but also consolidate students' understanding of higher-level programming concepts, including documentation, Styleguides, and abstraction principles.




# Refactoring for Readability and Maintainability

1. Rationale behind Refactoring:
Identified areas of the codebase requiring improved readability and maintainability.
Chose to refactor the code into objects and functions to promote modularity, reusability, and clarity because that was our task.

2. Abstraction for Maintainability and Extendability:
Abstracted basically everything into functions and objects, thus reducing code duplication and improving readability.
This also allows an easy addition of new features or modification of existing ones without affecting other parts of the application.

3. Challenges Faced and Overcoming Them:
getting the 'show more' button to work after refactoring things took me a really long time because upon inspection of the chrome browser, no errors were being shown, had to test things function by function until i found where the issue was(render books)

4. Reflections on Understanding JavaScript Concepts:
This exercise deepened understanding of JavaScript programming concepts in several ways.
I learnt the importance of abstraction in promoting code maintainability and scalability.



# DJS04 - DOCUMENTATION

1. Identifying Components:
In this case, the book preview seemed like a good candidate for a Web Component due to its self-contained nature and potential for reuse.

2. Designing the Component:
For the book preview, this involved designing a template for displaying book information and defining methods to fetch and render book data.

3. Implementing the Component:
Write the JavaScript class for the component, defining its constructor, lifecycle methods, and any custom methods needed.
Create the HTML template and CSS styles within the shadow DOM to encapsulate the component's structure and appearance.

4. Integrating into the App:
Used to update the application logic to incorporate the Web Component, replacing any existing functionality as needed.(dialogue - overlay should be the one to change with <book-preview></book-preview> - but it doesnt work)

Challenges:
Getting it to work properly even though everything is set up correctly according to an example given{nav to Example Explained}[https://learn.codespace.co.za/courses/168/modules/581/lessons/2447] on the codespace LMS.(no solution even though when i double checked if i did everything right, chatgpt says it should work??)
Time Constraints due to personal things going on at home.(solution - stayed up late to work because the days were full)