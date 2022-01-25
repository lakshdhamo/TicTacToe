# TicTacToe

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.1.2.

## Steps to setup Application:
1. Install latest Node.js: https://nodejs.org/en/
2. Install latest typescript : 
```bash
npm install -g typescript
```
3. Navigate to project folder
4. Install Angular CLI Globally
 ```bash
npm install -g @angular/cli
```
5. Restore the dependent packages: `npm install`
6. Command to Build: Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. 
7. Command to Run: Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Running unit tests
Written unit tests using Jasmine & Karma to test the State Management.

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## NGXS?
Used NGXS library for **state management**. NGXS is a state management pattern + library for Angular. It acts as a single source of truth for your application's state, providing simple rules for predictable state mutations.

NGXS is modeled after the CQRS pattern popularly implemented in libraries like Redux and NGRX but reduces boilerplate by using modern TypeScript features such as classes and decorators.

Handled **Undo/Redo** operation using NGXS state management.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
