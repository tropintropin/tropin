# tropin.one

[![wakatime](https://wakatime.com/badge/github/tropintropin/tropin.svg)](https://wakatime.com/badge/github/tropintropin/tropin)
![Deploy Status](https://github.com/tropintropin/tropin/actions/workflows/deploy.yml/badge.svg?branch=main)

## About

This is my personal website where I share projects, experience, and blog posts. In 2025, I migrated it to Eleventy to make building and updating faster and simpler.

## Project Timeline

```mermaid
gantt
title       Timeline
dateFormat  YYYY.MM.DD
axisFormat  %Y.%m

section DEVELOPMENT
Start the project                     :milestone,             crit, done, 2023.02.28, 0d
Add index.html                        :done,          html0,              2023.03.05, 1d
Add CSS for screen width              :done,          css0,               2023.08.13, 1d
Start Migration to Eleventy           :milestone,             crit, done, 2025.08.12, 0d

section PRODUCTION
Upload site to server                 :milestone,             crit, done, 2023.04.04, 0d
Upload MVP site during migration      :milestone,                   done, 2025.08.15, 0d
```

## Tech Stack

- **Eleventy** – static site generator
- **Nunjucks** – templating engine
- **SCSS → CSS** – styles preprocessor
- **JavaScript** – client-side interactivity
- **Pagefind** – search indexing for static sites
- **GitHub Actions** – CI/CD automation

## Deployment

- Automatically deployed via GitHub Actions to GitHub Pages
- Eleventy builds output to `_site` folder

## NPM Scripts Overview

- **build:css** – Compile SCSS to CSS (compressed, no source maps):

  ```bash
  npm run build:css
  ```

- **watch:css** – Watch SCSS files for changes and recompile automatically:

  ```bash
  npm run watch:css
  ```

- **start** – Start Eleventy dev server with live reload:

  ```bash
  npm run start
  ```

- **pagefind** – Build Pagefind search index from `_site`:

  ```bash
  npm run pagefind
  ```

- **watch:pagefind** – Watch HTML files in \_site and rebuild search index on changes:

  ```bash
  npm run watch:pagefind
  ```

- **dev** – Development mode: watch SCSS, run Eleventy server, and auto-rebuild search index:

  ```bash
  npm run dev
  ```

  _Note_: On the first run, `_site` is empty. Run `npm run pagefind` once before starting `dev` for search to work or just repeat `npm run dev` again.

- **build** – Full production build: CSS + Eleventy + Pagefind:

  ```bash
  npm run build
  ```

- **clean** – Remove the `_site` folder:

  ```bash
  npm run clean
  ```

## Project Structure

```
.
├── .eleventy.js         # Eleventy configuration
├── .github/workflows    # CI/CD scripts (deployment)
├── package.json         # Project dependencies and scripts
├── README.md            # Documentation
└── src
    ├── _data            # Site data (JSON, JS)
    ├── _includes        # Templates and partial Nunjucks components
    ├── assets           # Styles (CSS), scripts (JS), and images
    ├── root             # Files for site root (CNAME, robots.txt, etc.)
    └── index.njk        # Main page
```
