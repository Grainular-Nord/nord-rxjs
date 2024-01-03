/** @format */

import { Grain, Observable, Subscriber, Updater, grain } from '@grainular/nord';
import { SubjectLike, Observable as RxJSObservable, BehaviorSubject, Observer, Subscription } from 'rxjs';

/**
 * Converts an RxJS Observable or Subject-like object into a Grain Observable,
 * allowing integration of RxJS Observables with Grain's reactive components.
 *
 * @template V - The type of values emitted by the RxJS Observable or Subject-like object.
 *
 * @param {RxJSObservable<V> | SubjectLike<V>} observer - The RxJS Observable or Subject-like object
 * to convert into a Grain Observable.
 * @param {V} [initial] - (Optional) The initial value to set for the observer if supported.
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

export const grainy = <V>(observer: RxJSObservable<V> | SubjectLike<V>, initial?: V): Observable => {
    // If a optional initial value is passed, initialize the observer
    if (initial !== undefined && 'next' in observer) {
        window.requestIdleCallback(() => {
            observer.next(initial);
        });
    }

    return {
        subscribe: (subscriber: Subscriber<V>) => {
            const subscription = observer.subscribe({ next: (value) => subscriber(value) });
            return () => subscription.unsubscribe();
        },
    };
};

/**
 * A custom RxJS Subject that provides integration with Grain's reactive components.
 *
 * @template V - The type of values emitted by the subject.
 */
export class GrainularSubject<V> extends BehaviorSubject<V> {
    /**
     * Internal Grain instance associated with this subject.
     * @private
     */
    private _grain: Grain<V> = grain(this.value);

    /**
     * A custom RxJS Subject that provides a way to integrate RxJS Observables into a Nørd Component template.
     *
     * @template V - The type of values emitted by the subject.
     *
     * @param {V} initial - The initial value of the subject.
     *
     * @example
     * import { createComponent, on, render } from '@grainular/nord';
     * import { GrainularSubject } from '@grainular/nord-rxjs';
     *
     * // Create a GrainularSubject with an initial value of 0
     * const _count = new GrainularSubject(0);
     *
     * // Create a Grainular component that increments the value on button click
     * const App = createComponent((html) => {
     *     return html`<button ${on('click', () => _count.next(_count.value + 1))}>
     *         ${_count.asGrain()}
     *     </button>`;
     * });
     */
    constructor(initial: V) {
        super(initial);

        this._grain.subscribe = (subscriber: Subscriber<V>, seed = true) => {
            const subscription = this.subscribe(subscriber);

            return () => subscription.unsubscribe();
        };

        this._grain.set = (value: V) => {
            this.next(value);
        };

        this._grain.update = (updater: Updater<V>) => {
            this.next(updater(this.value));
        };
    }

    /**
     * Retrieves the internal Grain instance associated with this subject.
     *
     * @returns {Grain<V>} The Grain instance.
     */
    asGrain(): Grain<V> {
        return this._grain;
    }
}
