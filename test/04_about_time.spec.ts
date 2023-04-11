import { asyncScheduler, bufferTime, debounceTime, delay, filter, interval, map, Observable, observeOn, of, race, Subject, throwError, timeInterval, timeout, timer } from "rxjs"
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
    expect(received).toBe(__)
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
    expect(received).toBe(__)
})

test('launching an event in the future', () => {
    let received: null | string = null
    const people = new Subject<string>()
    people.pipe(
        delay(1)
    ).subscribe(x => received = x)

    people.next('Gordon')

    expect(received).toBe(__)
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
    expect(received).toBe(__)
    expect(result).toBe(__)
})

test('a watched pot', async () => {
    let received = ''
    const timeToBeBoiled = 500
    let timeoutValue = __ as number

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
    const timeoutValue = __ as number
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
    expect(received.join(' ')).toBe(__)
})

test.only('buffering', async () => {
    const received: string[] = []
    const events = new Subject<string>()
    events.pipe(
        bufferTime(1000),
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
            events.next('R')
            events.next('o')
            events.next('c')
            events.next('k')
        },  )

    })
    events.next('s')
    expect(received.join('')).toBe("RxJSRocks")
})

test.only("another buffering case", async () => {
    const source = interval(500)

    const example = source.pipe(bufferTime(2000))

    const result = await new Promise<number[]>((res) => {
        example.subscribe(val => {
            res(val)
        })
    })
    expect(result).toEqual([0,1,2])
})

test('time between calls', async () => {
    const received: string[] = []
    const events = new Subject<string>()

    events.pipe(
        timeInterval(),
        filter(t => t.interval > __)
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

    expect(received.join(' ')).toBe(__)
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