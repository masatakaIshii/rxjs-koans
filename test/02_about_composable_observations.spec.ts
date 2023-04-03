import { every, filter, from, map, range, reduce, scan, tap } from "rxjs"
import { expect, test } from "vitest"

const __: any = 'Fill in the blank'

test('composable add with reduce', () => {
    let numbers: number[] = [10, 100, 1000] as number[]

    let sum$ = from(numbers).pipe(reduce((acc: number, curr) => acc + curr, 0))

    sum$.subscribe(result => {
        expect(result).toBe(__)
    })
})

test('composable add with scan', () => {
    let result = 0;
    let numbers: number[] = [10, 100, 1000] as number[]

    let sum$ = from(numbers).pipe(scan((acc: number, curr) => acc + curr, 0))

    sum$.subscribe(number =>
        result += number
    )
    expect(result).toBe(__)
})

test('composable before and after', () => {
    const names = range(1, 6)
    let a = '', b = ''

    from(names)
        .pipe(
            tap(n => a += n),
            filter((n) => n % 2 === 0),
            tap(n => b += n)
        )
        .subscribe();

    expect(a).toBe(__)
    expect(b).toBe(__)
})

test('we wrote this', () => {
    const received: string[] = []
    const names = ['Bart', 'Marge', 'Wes', 'Linus', 'Erik', 'Matt']

    from(names)
        .pipe(filter((n: string) => n.length <= __))
        .subscribe(received.push.bind(received))

    expect(received.join(',')).toBe('Bart,Wes,Erik,Matt')
})

test('converting events', () => {
    let received = ''
    const names = ['wE', 'hOPe', 'yOU', 'aRe', 'eNJoyIng', 'tHiS']

    from(names)
        .pipe(
            map(x => {
                return x
                //return x.__()
            })
        ).subscribe(x => received += x + ' ')

    expect(received).toBe('we hope you are enjoying this ')
})

test('create a more relevant stream', () => {
    let received = ''
    const mouseXMovements = [100, 200, 150]
    const relativeMouse = from(mouseXMovements).pipe(map(x => x - __))

    relativeMouse.subscribe(x => received += x + ', ')
    expect(received).toBe('50, 150, 100, ')
})

test('checking everything', () => {
    let received: null | boolean = null
    const names = [2, 4, 6, 8]

    from(names)
        .pipe(every(x => x % 2 === 0))
        .subscribe(x => received = x)

    expect(received).toBe(__)
})

test('composition means the sum is greater than the parts', () => {
    let received = 0
    const numbers = range(1, 10)

    numbers.pipe(
        filter(x => x > __),
        reduce((a, b) => a + b, 0)
    ).subscribe(x => received = x)

    expect(received).toBe(19)
})