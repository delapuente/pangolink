# Pangolink!

> The ephemeral sharing service

Pangolink! is a
[progressive web application](https://developer.mozilla.org/en-US/Apps/Progressive),
i.e. a web application that provide near-native user experience in modern
browsers. It's able to work reliable even under flaky networks, receive push
notifications and to be added to the home screen.

## How to use this repository

Pangolink! is a learning-focused project. The history of the project reflects
the evolution from a regular web application to a progressive web application.
The [tip of `master` branch](https://github.com/delapuente/pangolink/tree/master)
will always reflect the most advanced version of the application while the tags
[`offline`](https://github.com/delapuente/pangolink/tree/offline),
[`manifest`](https://github.com/delapuente/pangolink/tree/manifest) and
[`notifications`](https://github.com/delapuente/pangolink/tree/notifications)
reflect the different stages towards the final version. The
[`web-application`](https://github.com/delapuente/pangolink/tree/web-application)
tag marks the point where the (non progressive) web application is considered
done.

Review these diffs to study the changes making up this evolution:

  1. [The base web application](https://github.com/delapuente/pangolink/tree/web-application).
  2. [Offline progressive web application with service workers](https://github.com/delapuente/pangolink/compare/web-application...offline).
  3. [Mobile integration with manifest](https://github.com/delapuente/pangolink/compare/offline...manifest).
  4. [Receiving notifications with the Push API](https://github.com/delapuente/pangolink/compare/manifest...notifications).

Notice each change set is made upon the previous one.

## Is Pangolink! on-line?

Not&hellip; yet.

Due to its learning nature (and time limitations), Pangolink! comes with
some security issues and poor error handling but my intention is actually
publish it, open issues and progressively to fix the issues. Each issue
must keep the code clean enough to retain its learning original purpose.

The goal of publishing is to deal with real world problems of progressive
web apps and explain them in the source code at the same time it becomes
material for my progressive web application talks.

## Forking the project

The project is not meant to be forked as the history is overwritten often
to reflect the evolution from a regular web application to a progressive
web application. Anyway if you do, you can keep it in synchronized with
these commands (assuming `upstream` as my repo and `origin` as yours):

```bash
$ git fetch --force --tags upstream master
$ git checkout master
$ git reset --hard upstream/master
$ git push --force origin master
```

Star it anyway!

## Running Pangolink!

To run Pangolink you will need `node.js` 6.x or greater, `npm` and `bower`.

Now download the repository and run these commands inside the repository root folder:

```bash
$ npm install
$ cd app
$ bower install
```

Finally, come back to the root folder of you repo and run the following command to launch
Pangolink!

```bash
$ node server/index.js
```

## License

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
If a copy of the MPL was not distributed with this file, You can obtain one at
https://mozilla.org/MPL/2.0/.
