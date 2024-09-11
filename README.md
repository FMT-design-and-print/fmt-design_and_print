# FMT Design and Print

## Getting Started

Install packages

```bash
npm install
```

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## ESLint

This project is `eslint-config-standard` as another ESLint configuration for consistent code styling, as the default Next configuration doesn’t do much to help improve the quality of the codebase.

There is `eslint-plugin-tailwindcss` which handles the organization of our tailwind classnames logically. This makes the code easier to read and review.

Also, there is the `eslint-config-prettier` which removes all ESLint rules that could conflict with Prettier.

> NB: To test that prettier and eslint are working properly together, make sure to install ESLint and Prettier from the Extensions Marketplace

## Pull Request Guide

This guide outlines the steps and best practices you should follow when creating and submitting a pull request (PR). Following these guidelines ensures that our codebase stays clean, organized, and bug-free.

---

### 1. Create Pull Requests Against `dev` Branch

- **All pull requests must be made against the `dev` branch**. Do not create pull requests directly against the `main` branch.
- The `dev` branch serves as our integration branch where all new features, bug fixes, and other changes are tested before moving to `main`.

### 2. Keep PRs Small and Focused

To streamline the review process:

- **Submit small, focused pull requests** that address a specific issue or feature.
- Large PRs with multiple unrelated changes make it harder for reviewers to thoroughly assess the code.
- If your task involves multiple changes, consider breaking it down into smaller PRs.

### 3. Use the Pull Request Template

When submitting a pull request, make sure to follow the provided PR template. This ensures consistency and clarity for the reviewer.

Here’s what to include:

- **Description**: Summarize the changes in your PR. Mention the issue number if it relates to a bug or feature request.
- **Type of Change**: Specify whether it’s a bug fix, new feature, or other update.
- **Checklist**: Review the checklist to ensure you've added tests, documentation, and reviewed your own code.
- **Screenshots**: If your changes affect the UI, **please include screenshots**. This will help reviewers visualize the impact of your changes.

### 4. Perform a Self-Review Before Submitting

Before submitting your PR:

- **Review your own code** to catch any mistakes or improvements you can make before the reviewer sees it.
- Run the linter to check for style issues (`npm run lint` if applicable).
- Make sure all tests are passing (`npm test` if applicable).
- Ensure your PR doesn’t introduce any console warnings or errors.

### 5. Test Your PR After Merging to `dev`

- Once your pull request has been approved and merged into the `dev`, make sure to test your changes on the dev environment: [https://fmt-dp-dev.netlify.app/](https://fmt-dp-dev.netlify.app/).
- Ensure that everything is working as expected. Check for any UI inconsistencies, performance issues, or errors in the developer console.

### 6. Respect the Codebase and Team

- **Be mindful of others’ work**: Always pull the latest changes from `dev` before working on a new feature or bug fix to avoid merge conflicts.
- **Follow team conventions and standards**: Ensure your changes align with the architecture and standards set by the team.
