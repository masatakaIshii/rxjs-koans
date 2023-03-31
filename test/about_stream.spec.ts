import { Observable, Subject } from "rxjs"
import { expect, test } from "vitest"

const __ = 'File in the blank'

test('simple subscription', () => {
    const observable = new Observable((subscriber) => subscriber.next(42))

    observable.subscribe({
        next(x) {
            expect(x).toBe(__)
        }
    })
})

test('what comes in goes out', () => {
    const observable = new Observable((subscriber) => subscriber.next(__))
    observable.subscribe({
        next(x) {
            expect(x).toBe(101)
        }
    })
})

test('this is the same as an event stream', () => {
    const events = new Subject<number>()
    events.subscribe((x) => expect(x).toBe(__))
    events.next(42)
})