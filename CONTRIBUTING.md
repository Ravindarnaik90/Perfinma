# Contributing to Perfinma

First off, thank you for considering contributing to Perfinma! We're excited to see what you build. This project is a great place to learn and practice your full-stack development skills.

This document provides guidelines for contributing to the project. Whether you're fixing a bug, adding a new feature, or improving documentation, your help is greatly appreciated.

## Code of Conduct
We have a [Code of Conduct](CODE_OF_CONDUCT.md) to ensure our community is welcoming and inclusive for everyone. Please take a moment to read it before you get started.

## How Can I Contribute?
There are many ways to contribute, from writing code and tests to improving the documentation.

### Reporting Bugs
If you find a bug, please open an issue and provide a clear description, including steps to reproduce it.

### Suggesting Enhancements
Have an idea for a new feature or an improvement to an existing one? Feel free to open an issue to discuss it. We recommend starting a discussion before you spend a lot of time on implementation.

### Working on Issues
You can find issues to work on in the [Issues tab](https://github.com/Code-A2Z/perfinma/issues). We've labeled issues that are great for getting started:
* **`good first issue`**: Perfect for newcomers.
* **`help wanted`**: Well-defined tasks that we need help with.
* **`hacktoberfest`**: Issues specifically for Hacktoberfest participants.

Before you start working on an issue, please leave a comment asking to be assigned to it.

## Contribution Workflow
Ready to contribute? Here’s how to set up your development environment and submit your changes.

### 1. Fork the Repository
Start by forking the project to your own GitHub account from the main repository page.

### 2. Clone Your Fork
Clone your forked repository to your local machine.
```bash
git clone [https://github.com/your-username/perfinma.git](https://github.com/your-username/perfinma.git)
cd perfinma
```

### 3. Create a New Branch
Create a new branch for your feature or bug fix. Use a descriptive name.
```bash
# For a new feature
git checkout -b feature/add-transaction-filters

# For a bug fix
git checkout -b fix/dashboard-chart-bug
```

### 4. Set Up the Project
Follow the instructions in the main README.md file to set up the backend and frontend environments, including installing dependencies and creating your .env files.

### 5. Make Your Changes
Now you're ready to write your code! Make your changes in the relevant files.

### 6. Run Tests
Before you submit your contribution, please make sure all tests are passing.
```bash
# In the /backend directory
npm test

# In the /frontend directory
npm test
```
If you're adding a new feature, please add a corresponding test for it.

### 7. Commit Your Changes
Commit your changes with a clear and descriptive message.
```bash
git add .
git commit -m "feat: Add date range filters to transactions page"
```

- feat: A new feature
- fix: A bug fix
- docs: Changes to documentation
- style: Formatting changes (e.g., whitespace)
- refactor: Code changes that neither fix a bug nor add a feature
- test: Adding or correcting tests

Read more [here](https://www.conventionalcommits.org/en/v1.0.0/) for guidelines on how to write commit messages.

### 8. Push to Your Branch
Push your changes up to your forked repository.
```bash
git push origin feature/add-transaction-filters
```

### 9. Open a Pull Request
- Go to the main project repository on GitHub (Code-A2Z/perfinma) and you will see a prompt to open a pull request from your recently pushed branch.
- Give your pull request a clear title. Read more [here](https://namingconvention.org/git/pull-request-naming) for PR naming.
- In the description, explain the changes you made and link to the issue you're solving by writing ```Closes #123``` (replace ```123``` with the issue number).
- Submit the pull request for review.

We'll review your contribution as soon as possible. Thank you again for your interest in making Perfinma better!
