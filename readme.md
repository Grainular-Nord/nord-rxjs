<!-- @format -->

# @grainular/nord-rxjs

[![Npm package version](https://badgen.net/npm/v/@grainular/nord-rxjs)](https://www.npmjs.com/package/@grainular/nord-rxjs)
[![Npm package total downloads](https://badgen.net/npm/dt/@grainular/nord-rxjs)](https://npmjs.com/package/@grainular/nord-rxjs)
[![Npm package license](https://badgen.net/npm/license/@grainular/nord-rxjs)](https://npmjs.com/package/@grainular/nord-rxjs)

`@grainular/nord-rxjs` is an adapter library that allows seamless integration between [RxJS](https://rxjs.dev) Observables and [Nørd](https://nordjs.dev)'s reactive system. With this library, you can use RxJS Observables as the source of reactive data within your Nørd applications.

## Installation

You can install `@grainular/nord-rxjs` using npm or yarn:

```bash
# Using yarn
yarn add @grainular/nord-rxjs

# Using npm
npm install @grainular/nord-rxjs
```

## Usage

### Converting RxJS Observables

To use `@grainular/nord-rxjs`, you can import the grainy function and use it to convert RxJS Observables into Grain Observables. Here's an example of how to use it in a `Nørd` component:

```ts
import { createComponent, render, $, on } from '@grainular/nord';
import { grainy } from '@grainular/nord-rxjs';
import { BehaviorSubject } from 'rxjs';

const App = createComponent((html) => {
    const _count = new BehaviorSubject<number>(0);
    const count = grainy(_count);

    return html`<button ${on('click', () => _count.next(_count.value + 1))}>${$(count)}</button>`;
});

render(App, { target: document.querySelector('#app') });
```

In this example, we import `@grainular/nord-rxjs`, create a `Nørd` component, and use the grainy function to convert an RxJS BehaviorSubject into a Grain Observable. This allows you to seamlessly use RxJS Observables within your `Nørd` application.

### Using a GrainularSubject

`@grainular/nord-rxjs` also provides a custom RxJS Subject called `GrainularSubject` that offers integration with `Nørd`'s reactive template engine. You can use it as follows:

```ts
import { createComponent, on, render } from '@grainular/nord';
import { GrainularSubject } from '@grainular/nord-rxjs';

const App = createComponent((html) => {
    // Create a GrainularSubject with an initial value of 0
    const count = new GrainularSubject(0);

    return html`<button ${on('click', () => count.next(count.value + 1))}>${count.asGrain()}</button>`;
});

render(App, { target: document.querySelector('#app') });
```

> A `GrainularSubject` is an augmented `BehaviorSubject` and can be used as such.

## Contributing

Contributions to Nørd are always welcome! Whether it's bug reports, feature requests, or code contributions, please read our [contribution guidelines](./contributing.md) for more information on getting involved.

## License

Nørd-rxjs is open-sourced software licensed under the MIT License.

```

```
