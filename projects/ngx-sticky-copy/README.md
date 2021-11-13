[![npm version](https://badge.fury.io/js/ngx-sticky-copy.svg)](https://badge.fury.io/js/ngx-sticky-copy)
[![Build Status](https://app.travis-ci.com/Raiper34/ngx-sticky-copy.svg?branch=main)](https://app.travis-ci.com/Raiper34/ngx-sticky-copy)
![npm bundle size](https://img.shields.io/bundlephobia/min/ngx-sticky-copy)
![NPM](https://img.shields.io/npm/l/ngx-sticky-copy)
[![npm version](https://badgen.net/badge/demo/online/orange)](https://ngx-sticky-copy.netlify.app/)

# Ngx-sticky-copy
Ngx Sticky is another Angular approach how to make elements sticky. This library allows you to make sticky even tHead. It creates sticky copy and show/hide based on scroll position.

# Instalation

`npm install ngx-sticky-copy --save`

then add `NgxStickyCopyModule` into module imports
```typescript
import {NgxStickyCopyModule} from 'ngx-sticky-copy';

@NgModule({
// ...
imports: [
    // ...
  NgxStickyCopyModule,
    // ...
],
// ...
})
```

# Usage
See [DEMO](https://ngx-sticky-copy.netlify.app/) app for usage.

# Directives
- *scSticky - for all elements except table head
- *scStickyThead - for table head element (tHead)
