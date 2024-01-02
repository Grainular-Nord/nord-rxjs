/** @format */

import { Observable, Subscriber } from '@grainular/nord';
import { BehaviorSubject } from 'rxjs';

/**
 * Converts an RxJS BehaviorSubject into a Grain Observable, allowing integration of RxJS Observables
 * with Grain's reactive components.
 *
 * @template V - The type of values emitted by the BehaviorSubject.
 *
 * @param {BehaviorSubject<V>} observer - The RxJS BehaviorSubject to convert into a Grain Observable.
 *
 * @returns {Observable} A Grain Observable that can be used in Grain components.
 *
 * @example
 * // Import necessary modules
 * import { createComponent, render, $, on } from '@grainular/nord';
 * import { grainy } from '@grainular/nord-rxjs';
 * import { BehaviorSubject } from 'rxjs';
 *
 * // Create a Grain component
 * const App = createComponent((html) => {
 *     // Create an RxJS BehaviorSubject with an initial value of 0
 *     const _count = new BehaviorSubject<number>(0);
 *
 *     // Convert the RxJS BehaviorSubject to a Grain Observable
 *     const count = grainy(_count);
 *
 *     // Create a button that increments the value in response to clicks
 *     return html`<button ${on('click', () => _count.next(_count.value + 1))}>
 *         ${$(count)}
 *     </button>`;
 * });
 */

export const grainy = <V>(observer: BehaviorSubject<V>): Observable => {
    return {
        subscribe: (subscriber: Subscriber<V>) => {
            const subscription = observer.subscribe({ next: (value) => subscriber(value) });
            return () => subscription.unsubscribe();
        },
    };
};
