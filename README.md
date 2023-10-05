# ESL Website Astro

ESL Website built with [Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com/). This project is a work in progress. The goal is to build a fast, modern, and accessible website for the users that visit the site.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or higher)
- [Git](https://git-scm.com/)

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/chatchatabc/esl-website-astro.git
   ```
2. Open the project folder
   ```sh
    cd esl-website-astro
   ```
3. Install NPM packages
   ```sh
    npm install
   ```
4. Install wrangler globally **(Optional)**
   ```sh
    npm install -g wrangler
   ```
   > Wrangler is used to deploy the site to Cloudflare Pages

### Development

1. Start the development server
   ```sh
    npm run dev
   ```
2. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Deployment

1. Build the site
   ```sh
    npm run build
   ```
   > The site will be built to the `dist` folder
2. Deploy the site
   ```sh
    wrangler pages publish dist
   ```
   > This will deploy the site to your Cloudflare Pages account

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/withastro/astro/tree/latest/examples/minimal)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/sandbox/github/withastro/astro/tree/latest/examples/minimal)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/withastro/astro?devcontainer_path=.devcontainer/minimal/devcontainer.json)

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                | Action                                           |
| :--------------------- | :----------------------------------------------- |
| `npm install`          | Installs dependencies                            |
| `npm run dev`          | Starts local dev server at `localhost:3000`      |
| `npm run build`        | Build your production site to `./dist/`          |
| `npm run preview`      | Preview your build locally, before deploying     |
| `npm run astro ...`    | Run CLI commands like `astro add`, `astro check` |
| `npm run astro --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
"# ESL-Astro"
