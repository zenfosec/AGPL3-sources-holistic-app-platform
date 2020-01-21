# [![](ASSETS/blue-burst-encapsule.io-icon-72x72.png "Encapsule Project Homepage")](https://encapsule.io)&nbsp;Encapsule Project

> [Homepage](https://encapsule.io "Encapsule Project Homepage...") &bull; [GitHub](https://github.com/Encapsule "Encapsule Project GitHub...") &bull; [Discussion](https://groups.google.com/a/encapsule.io/forum/#!forum/holistic-app-platform-discussion-group "Holistic app platform discussion group...") &bull; [Twitter](https://twitter.com/Encapsule "Encapsule Project Twitter...")

Encapsule Project is MIT-licensed libs & tools for building full-stack Node.js/HTML5 apps & services w/React based on System in Cloud (SiC) architecture.

# ![](ASSETS/encapsule-holistic-32x32.png)&nbsp;[Holistic App Platform](../../README.md#encapsule-project "Back to the Holistic App Platform README...") v0.0.33 quatsino

## &#x25F0; Runtime library: @encapsule/hash-router

> [RTL index](../../README.md#holistic-platform-runtime "Jump back to the RTL index..."): [d2r2](../d2r2/README.md#encapsule-project "Jump to d2r2 README...") &bull; [d2r2-components](../d2r2-components/README.md#encapsule-project "Jump to d2r2-components README...") &bull; &#x25F0; **hash-router** &#x25F0; &bull; [holarchy](../holarchy/README.md#encapsule-project "Jump to holarchy README...") &bull; [holarchy-sml](../holarchy-sml/README.md#encapsule-project "Jump to holarchy-sml README...") &bull; [holism](../holism/README.md#encapsule-project "Jump to holism README...") &bull; [holism-metadata](../holism-metadata/README.md#encapsule-project "Jump to holism-metadata README...") &bull; [holism-services](../holism-services/README.md#encapsule-project "Jump to holism-services README...") &bull; [holodeck](../holodeck/README.md#encapsule-project "Jump to holodeck README...") &bull; [holodeck-assets](../holodeck-assets/README.md#encapsule-project "Jump to holodeck-assets README...") &bull; [hrequest](../hrequest/README.md#encapsule-project "Jump to hrequest README...")

This package contains a minimal client-side hash router implementation that is designed to be integrated into higher-level abstractions. For example, a re-usable ObservableProcessModel (OPM).

```
Package: @encapsule/hash-router v0.0.33 "quatsino" build ID "dzYMjrRCRDOnCvTe6OXp2Q"
Sources: Encapsule/holistic-master#d07a275c48e694b7fb27768ea813ef203dd5b3c8
Purpose: library (Node.js)
Created: 2020-01-20T23:37:36.000Z
License: MIT
```

## ![](ASSETS/encapsule-holistic-24x24.png)&nbsp;Overview

### Optional package-specific description

This is a line of text terminated with a period but no newline.

This is the next line in the content array also with no newline.

This is the third line in a array. The supposition is that all three lines forms a single paragraph.





The proceeding line has two newlines. This line terminates with a single newline.


This is the next line following a line that terminates in newline. This line ends in two newlines.



Lastly...

## ![](ASSETS/encapsule-holistic-24x24.png)&nbsp;Distribution

The @encapsule/hash-router package is a runtime library (RTL) distributed in the @encapsule/holistic package:

```
@encapsule/holistic/PACKAGES/hash-router
```

The `appgen` utility is used to create a copy of this RTL package inside your derived app/service git repo:

```
@AcmeCo/SampleApp/HOLISTIC/PACKAGES/hash-router
```

... and to modifying `@AcmeCo/SampleApp/package.json` to include:

```
"devDependencies": {
    "@encapsule/hash-router": "./HOLISTIC/PACKAGES/hash-router"
}
```

> See also: [appgen](../../README.md#appgen-utility "Jump to appgen documentation...")

## ![](ASSETS/encapsule-holistic-24x24.png)&nbsp;Usage

In your derived app/service implementation code:

Example script, `hash-router-example.js`:

```JavaScript
const hash-router = require('@encapsule/hash-router');
console.log(JSON.stringify(hash-router.__meta));
/* ... your derived code here ... */
```

Authoring `/* ... your derived code ... */` is discussed in the next section.

## ![](ASSETS/encapsule-holistic-24x24.png)&nbsp;Documentation

# Body Section 1

Content line 1.

Content line 2.

## ![](ASSETS/encapsule-holistic-24x24.png)&nbsp;Issues

Please post bug reports to one of the follow issue queues depending on topic:

- @encapsule/holistic [GitHub Issues](https://github.com/Encapsule/holistic/issues) - Holistic platform RTL + appgen issues.

- @encapsule/arccore [GitHub Issues](https://github.com/Encapsule/ARCcore/issues) - Core data RTL issues.

- @encapsule/arctools [GitHub Issue](https://github.com/Encapsule/ARCtools/issues) - Core data tools and RTL issues.

## ![](ASSETS/encapsule-holistic-24x24.png)&nbsp;Discussion

Join the Holistic App Platform [discussion group](https://groups.google.com/a/encapsule.io/forum/#!forum/holistic-app-platform-discussion-group "Holistic app platform discussion group...") to talk about the architecture, design, development, and test of full-stack interactive HTML5 applications and services implemented in JavaScript, derived from [Holistic Platform Runtime](#holistic-platform-runtime), and Facebook [React](https://reactjs.org). And, hosted on [Node.js](https://nodejs.org).

> [&#9666; Holistic App Platform](../../README.md "Back to the main Holistic App Platform REAMDE...") &bull; [&#9652; Top](#encapsule-project "Scroll to the top of the page...")

<hr>

[![Encapsule Project](ASSETS/blue-burst-encapsule.io-icon-72x72.png "Encapsule Project")](https://encapsule.io)

Published under [MIT](LICENSE) license by [Encapsule Project](https://encapsule.io)

Please follow [@Encapsule](https://twitter.com/encapsule) on Twitter for news and updates.

Copyright &copy; 2020 [Christopher D. Russell](https://github.com/ChrisRus) Seattle, Washington USA

<hr>