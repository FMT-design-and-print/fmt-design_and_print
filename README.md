# FMT Design and Print

## Getting Started

First, run the development server:

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

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## ESLint

This project is `eslint-config-standard` as another ESLint configuration for consistent code styling, as the default Next configuration doesn’t do much to help improve the quality of the codebase.

There is `eslint-plugin-tailwindcss` which handles the organization of our tailwind classnames logically. This makes the code easier to read and review.

Also, there is the `eslint-config-prettier` which removes all ESLint rules that could conflict with Prettier.

> NB: To test that prettier and eslint are working properly together, make sure to install ESLint and Prettier from the Extensions Marketplace
