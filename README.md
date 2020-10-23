# Asciitron

Asciitron is a simple Desktop [AsciiDoc](https://asciidoctor.org/docs/what-is-asciidoc/) Editor built with [Electron](https://electronjs.org) and [Asciidoctor.js](https://asciidoctor.org/docs/asciidoctor.js/).

![Asciitron](asciitron.png)

## Prerequisites

- Git (https://git-scm.com)
- NPM (https://www.npmjs.com)

## Development

Clone this repository

~~~bash
git clone https://github.com/tbreuss/asciitron.git
~~~

Go into the repository

~~~bash
cd asciitron
~~~ 

Install dependencies

~~~bash
npm install
~~~

Run the app

~~~bash
npm start
~~~

## Build & Release

Build the application for Mac, Windows and Linux using Electron Builder.

~~~bash
npm run release
~~~

Build and release the application on Github Releases.

```bash
GH_TOKEN=MY_GITHUB_TOKEN npm run release
```

## License 

[CC0 1.0 (Public Domain)](LICENSE.md)

## Suggestions

Any suggestions? Open an issue.
