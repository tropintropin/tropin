# tropin.one

Код моего сайта-визитки [tropin.one](https://tropin.one). Пока что на чистом HTML + CSS. Пишу его по мере изучения этих самых HTML и CSS.

<!-- vim-markdown-toc GFM -->

* [To-Do](#to-do)
* [График работы над сайтом](#График-работы-над-сайтом)
* [Sitemap](#sitemap)

<!-- vim-markdown-toc -->

## To-Do

- [ ] Сделать скроллинг для `<article>`
- [ ] Переместить оглавление страницы в правый сайдбар и сделать его видимым во время прокрутки `<article>`
- [x] Сделать адаптивную вёрстку

## График работы над сайтом

```mermaid
gantt
title       Project Timeline
dateFormat  YYYY.MM.DD
axisFormat  %Y.%m
excludes    

section     Development
Start the project					:milestone, crit,			2023.02.28,
Add index.html						:done,				html0,	2023.03.05,	1d
Add CSS for sreen width				:done,				css0,	2023.08.13, 1d

section     Production
Upload site to server				:milestone, crit, done,		2023.04.04
```

## Sitemap

```mermaid
graph LR
	id00{/}
	id0((index.html))
		id00 ==> id0
	id1(manifest.json)
		id00 -.-> id1 -.-> id0
	id2(robots.txt)
		id00 -.-> id2 -.-> id3
	id3(sitemap.xml)
		id00 -.-> id3 -.-> id0
```
