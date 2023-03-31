import { from, Observable, range, Subject, tap } from "rxjs"
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

test('how event streams relate to observables', () => {
    let observableresult = 1
    new Observable<number>((sub) => sub.next(73)).subscribe((x) => observableresult = x)

    let eventStreamResult = 1
    const events = new Subject<number>()
    events.subscribe((x) => eventStreamResult = x)
    
    //events.__(73)

    expect(observableresult).toBe(eventStreamResult)
})

test('event streams have multiple results', () => {
    let eventStreamResult = 0
    const events = new Subject<number>()
    events.subscribe((x) => {
        eventStreamResult += x
    })

    events.next(10)
    events.next(7)

    expect(eventStreamResult).toBe(__)
})

test('simple return', () => {
    let received = ''
    const observable = new Observable<string>((subscriber) => {
        subscriber.next('foo')
    })
    observable.subscribe((x) => {
        received = x
    })
    expect(received).toBe(__)
})

test('the last event', () => {
    let received = '';
    const names = ['foo', 'bar']

    from(names).subscribe((x) => {
        received = x
    })
    expect(received).toBe(__)
})

test('everything counts', () => {
    let received = 0
    const numbers = [3, 4]
    from(numbers).subscribe(x => received += x)

    expect(received).toBe(__)
})

test('this is still an event stream', () => {
    let received = 0
    const numbers = new Subject<number>()
    numbers.subscribe((x) => received += x)

    numbers.next(10)
    numbers.next(5)

    expect(received).toBe(__)
})

test('all events will be received', () => {
    let received = 'Working'
    const numbers = range(9, 5)

    from(numbers).subscribe(x => received += ` ${x}`)

    expect(received).toBe(__)
})

test('do things in the middle', () => {
    const status: string[] = []
    const daysTilTest = from(range(1, 4))

    daysTilTest.pipe(tap(
        (d) => status.push(`${5 - d}=${5 - d === 1 ? 'Study Like Mad' : __}`)
    )).subscribe()

    expect(status.toString()).toBe('4=Party,3=Party,2=Party,1=Study Like Mad')
})

test('nothing listens until you subscribe', () => {
    let sum = 0
    const numbers = from(range(1, 5))
    const observable = numbers.pipe(tap((x) => sum += x))

    expect(sum).toBe(0)

    //observable.__()

    expect(sum).toBe(1 + 2 + 3 + 4 + 5)
})

test('events before you subscribe do not count', () => {
    let sum = 0
    const numbers = new Subject<number>()
    const observable = numbers.pipe(tap(x => sum += x))

    numbers.next(1)
    numbers.next(2)

    observable.subscribe()

    numbers.next(3)
    numbers.next(4)

    expect(sum).toBe(__)
})

test('events after you unsubcribe dont count', () => {
    let sum = 0
    const numbers = new Subject<number>()
    const observable = numbers.pipe(tap(x => sum += x))
    const subscription = observable.subscribe()

    numbers.next(1)
    numbers.next(2)

    subscription.unsubscribe()

    numbers.next(3)
    numbers.next(4)

    expect(sum).toBe(__)
})

test('events while subscribing', () => {
    const received = []
    const words = new Subject()
    const observable = words.pipe(tap(received.push.bind(received)))

    words.next('Peter')
    words.next('said')

    const subscription = observable.subscribe()

    words.next('you')
    words.next('look')
    words.next('pretty')

    subscription.unsubscribe()
    
    words.next('ugly')

    expect(received.join(' ')).toBe(__)
})