import { asyncScheduler, bufferTime, debounceTime, delay, filter, map, Observable, observeOn, of, race, Subject, throwError, timeInterval, timeout, timer } from "rxjs"
import { expect, test } from "vitest"

const __: any = 'Fill in the blank'

test('launching an asnyc event via a scheduler', () => {
    let received = 'Not yet'

    const observable = new Observable<string>((observer) => {
        observer.next('Finished')
    }).pipe(
        observeOn(asyncScheduler)
    )

    observable.subscribe(value => {
        received = value;
    })
    expect(received).toBe('Not yet')
})

test('launching an asnyc event via a scheduler caught', async () => {
    let received = 'Not yet'

    const observable = new Observable<string>((proxyObserver) => {
        proxyObserver.next('Finished')
    }).pipe(
        observeOn(asyncScheduler)
    )
    await new Promise((res) => {
        observable.subscribe(value => {
            received = value;
            res(value)
        })
    })
    expect(received).toBe('Finished')
})

test('launching an event in the future', () => {
    let received: null | string = null
    const people = new Subject<string>()
    people.pipe(
        delay(1)
    ).subscribe(x => received = x)

    people.next('Gordon')

    expect(received).toBe(null)
})

test('launching an event in the future caught', async () => {
    let received: null | string = null
    let time = 500
    const people = new Subject<string>()
    people.pipe(
        delay(time)
    ).subscribe(x => received = x)

    people.next('Gordon')

    const result = await new Promise<number>((res) => {
        let value = 0;
        const idInterval = setInterval(() => {
            if (received !== null) {
                clearInterval(idInterval)
                res(value)
            }
            value++;
        }, 100)
    })
    expect(received).toBe('Gordon')
    expect(result).toBe(4)
})

test('a watched pot', async () => {
    let received = ''
    const timeToBeBoiled = 500
    let timeoutValue = 400

    const potObservable = of('Boiling')
        .pipe(
            delay(timeToBeBoiled),
            timeout(timeoutValue)
        )

    await new Promise<void>((res) => {
        potObservable.subscribe({
            next: (value) => {
                received = value
                res()
            },
            error: () => {
                received = 'Tepid'
                res()
            },
        })
    })

    expect(received).toBe('Tepid')
})

test('you can place a time limit on how long an event should take', async () => {
    const received: string[] = []
    const timeoutValue = 200
    const temperatures = new Subject<string>()

    class CustomTimeoutError extends Error {
        constructor() {
            super('Tepid')
            this.name = ''
        }
    }

    temperatures.pipe(
        timeout({
            each: timeoutValue,
            with: () => throwError(() => new CustomTimeoutError())
        })
    )
        .subscribe({
            next: (v: string) => received.push(v),
            error: (err: string) => received.push(err)
        })

    const result = await new Promise<string>((res) => {
        setTimeout(() => {
            temperatures.next('Boiling')
        }, 300)
        setTimeout(() => {
            res(received.join(', '))
        }, 400)
    })
    expect(result).toBe("Tepid")
})

test('debouncing', async () => {
    const received = []
    const events = new Subject<string>()

    events.pipe(
        debounceTime(100)
    ).subscribe(received.push.bind(received))

    events.next('f')
    events.next('fr')
    events.next('fro')
    events.next('from')

    await new Promise<void>((res) => {

        setTimeout(() => {
            events.next('r')
            events.next('rx')
            events.next('rxj')
            events.next('rxjs')

            setTimeout(() => {
                res()
            }, 120)
        }, 100)
    })
    expect(received.join(' ')).toBe('from rxjs')
})

test('buffering', async () => {
    const received: string[] = []
    const events = new Subject<string>()
    events.pipe(
        bufferTime(10),
        map((c) => c.join('')),
    )
    events.subscribe(value => {
        received.push(value)
    })

    events.next('R')
    events.next('x')
    events.next('J')
    events.next('S')

    await new Promise<void>((res) => {
        setTimeout(() => {
            res()
        }, 500)
        events.next('R')
        events.next('o')
        events.next('c')
        events.next('k')
        events.next('s')
    })
    expect(received.join('')).toBe('RxJSRocks')
})

test('time between calls', async () => {
    const received: string[] = []
    const events = new Subject<string>()

    events.pipe(
        timeInterval(),
        filter(t => t.interval > 100)
    ).subscribe(t => received.push(t.value))

    await new Promise<void>((res) => {
        setTimeout(() => {
            events.next('slow')

            setTimeout(() => {
                events.next('down')
                res()
            }, 101)
        }, 98)
    })

    expect(received.join(' ')).toBe('down')
})

test('results can be ambiguous timing', async() => {
    let results = 0
    const fst = timer(400).pipe(map(() => -1))
    const snd = timer(500).pipe(map(() => 1))

    race(fst, snd)
    .subscribe(value => results = value)

    await new Promise<void>((res) => {
        setTimeout(() => {
            expect(results).toBe(-1)
            res()
        }, 500)
    })
})