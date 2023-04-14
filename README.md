This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Install husky

Automatic with git

More info:

- [Husky](https://typicode.github.io/husky)
- [GitHooks](https://git-scm.com/docs/githooks)

```bash
yarn husky install
```

## Commit Lint

Lint for git commit message

More info:

- [CommitLint](https://commitlint.js.org/)
- [CommitLint Format online](https://commitlint.io/)
- [Conventional Commits](https://www.conventionalcommits.org/)

#### Commit Format

    <type:require> ([scope:optional]): <subject:require>
    [body:optional]
    [footer(s):optional]

#### Type

- build: build system or external dependencies changes
- ci: CI configurations and scripts changes
- docs: documentation
- feat: feature
- fix: bug fix
- perf: improves performance
- refactor: neither fixes a bug or adds a feature
- revert: reverts a previous commit
- style: formatting, missing semi colons, etc.

### Example

**Full**

    feat(message popup): add confirm
    popup show when click confirm
    #220 #221

**Basic**

    feat: add confirm
