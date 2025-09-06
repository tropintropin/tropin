---
title: ""
start: "2025-01-01T00:00:00+03:00"
end: "2025-01-01T00:00:00+03:00"
tags: project
layout: layouts/project-post

excerpt: ""

status:
  - active
  - archived
  - prototype

type:
  - bot
  - website
  - audio-guide
  - tour

image:
  src: ""
  caption: ""

repository:
  url: ""

demo:
  url: ""

technologies:
  - python
  - fastapi
  - redis
  - leaflet

team:
  - name: "Валерий Тропин"
    role: "developer"

notes: ""

map:
  points:
    - name: ""
      lat: 0
      lon: 0
  route:
    - { lat: 0, lon: 0 }
    - { lat: 0, lon: 0 }
---

{# Абзац с буквицей #}

<p class="drop-cap"></p>

{# Цитата #}

<figure class="quote">
  <blockquote></blockquote>
  <figcaption class="quote-caption"></figcaption>
</figure>

{# Иллюстрация #}

<figure>
  <img src="" alt="">
  <figcaption></figcaption>
</figure>

{# Обёртка для встраеваемых карт #}

<div class="map-frame"></div>

{# Код #}

<div class="code-frame">
  {% highlight "txt" %}{% endhighlight %}
</div>

{# PDF #}

<div class="pdf-frame">
  <iframe
    src="#zoom=page-fit&page=1"
    title="PDF Viewer"
    loading="lazy"
    frameborder="0"
  ></iframe>
</div>

{# Обёртка для встраиваемого видео #}

<div class="video-frame"></div>
