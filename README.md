# tropin.one

[![wakatime](https://wakatime.com/badge/github/tropintropin/tropin.svg)](https://wakatime.com/badge/github/tropintropin/tropin)

## Eleventy Migration

### Project Structure

```
.
├── src/
│   ├── blog/				# Markdown-посты
│	  ├──	projects/
│	  ├──	publications/
│	  ├──	videos/
│   ├── pages/             # Статические страницы (about, contact)
│   ├── _includes/         # layouts и partials
│   │   ├── layouts/
│   │   │   ├── base.njk
│   │   │   └── post.njk
│   │   └── partials/
│   ├── _data/             # site.json и т.д.
│   └── assets/
│       ├── css/           # scss -> css (main.scss)
│       ├── images/
│       ├── videos/
│       ├── audio/
│       └── pdf/
├── .eleventy.js
├── package.json
└── README.md
```

### Frontmatter

```
{
  "title": "My Blog",
  "description": "Notes and experiments",
  "url": "https://example.com",
  "author": "Валера",
  "defaultImage": "/assets/images/og-default.jpg"
}
```

```
---
title: "Заголовок"
description: "Краткое описание"
date: 2025-08-12
layout: "post.njk"
tag: [blog, eleventy]
cover: "/assets/images/cover.jpg"
---
```

### Drafts

```
{% extends "layouts/base.njk" %}
{% block content %}
<article itemscope itemtype="https://schema.org/BlogPosting">
  <h1 itemprop="headline">{{ title }}</h1>
  <time datetime="{{ date | date('YYYY-MM-DD') }}" itemprop="datePublished">{{ date | readableDate }}</time>
  <meta itemprop="author" content="{{ site.author }}">
  <div itemprop="articleBody">{{ content | safe }}</div>
</article>
{% endblock %}
```

## Project Timeline

```mermaid
gantt
title       Project Timeline
dateFormat  YYYY.MM.DD
axisFormat  %Y.%m
excludes

section     DEVELOPMENT
Start the project						:milestone, crit,	done,	2023.02.28,
Add index.html							:done,				html0,	2023.03.05,	1d
Add CSS for sreen width					:done,				css0,	2023.08.13, 1d
Start Migration to Eleventy				:milestone,	crit,			2025.08.12,

section     PRODUCTION
Upload site to server					:milestone, crit, done,		2023.04.04
```
