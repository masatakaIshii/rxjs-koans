import { expect, test } from "vitest"
import { EventEmitter } from "events"
import { fromEvent, takeWhile } from "rxjs"

const __: any = 'Fill in the blank'

test('the main event', () => {
    let received = []
    const e = new EventEmitter()
    const subscription = fromEvent(e, 'change')
        .subscribe(received.push.bind(received))

    e.emit('change', 'R')
    e.emit('change', 'x')
    e.emit('change', 'J')
    e.emit('change', 'S')

    subscription.unsubscribe()

    e.emit('change', '!')

    expect("RxJS").toBe(received.join(''))
})


test('the main event take while until the function param return false', () => {
    let received = []
    const e = new EventEmitter()
    fromEvent(e, 'change')
        .pipe(takeWhile(_ => received.length < 4))
        .subscribe(received.push.bind(received))

    e.emit('change', 'R')
    e.emit('change', 'x')
    e.emit('change', 'J')
    e.emit('change', 'S')
    e.emit('change', '!')

    expect("RxJS").toBe(received.join(''))
})