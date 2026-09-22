# Next.js Starter Template

Scaffolds a Next.js app with the company template, tooling, and git already set up.

## Usage

```bash
npx @dreamx-ai/nextjs-starter my-app
```

Omit the project name to be prompted for one.

### One-time setup per machine

The package is private, so npm needs the registry and a GitHub PAT with `read:packages`. Add to `~/.npmrc`:

```
@dreamx-ai:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_PAT
```

## Publishing

Bump the version, then:

```bash
npm publish
```
