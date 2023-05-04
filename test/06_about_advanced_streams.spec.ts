import { Subject, concat, delay, groupBy, map, merge, of, range, reduce, scan, toArray } from "rxjs"
import {expect, test} from "vitest"

const __: any = 'Fill in the blank'

test('merging', () => {
    const easy = []
    const you = of(1, 2, 3)
    const me = of('A', 'B', 'C')

    merge(you, me).subscribe(easy.push.bind(easy))

    expect(easy.join(' ')).toBe(__)
})

test('merging events', () => {
    const first = []
    const both = []

    const s1 = new Subject()
    const s2 = new Subject()

    s1.subscribe(first.push.bind(first))
    merge(s1, s2).subscribe(both.push.bind(both))

    s1.next('I')
    s1.next('am')
    s2.next('nobody.')
    s2.next('Nobody')
    s2.next('is')
    s1.next('perfect.')

    expect(both.join(' ')).toBe(__)
    expect(first.join(' ')).toBe(__)
})

test('merge not take acount order', async () => {
    const result = []
    merge(
        of('A').pipe(delay(20)),
        of('B').pipe(delay(200)),
        of('C').pipe(delay(10)),
        of('D').pipe(delay(1))
    ).subscribe(result.push.bind(result))

    await new Promise<void>((res) => setTimeout(() => res(), 500))

    expect(result.join('')).toBe(__)
})

test('concat observables subscribe in order even with delay', async () => {
    const result = []
    concat(
        of('R').pipe(delay(20)),
        of('x').pipe(delay(50)),
        of('J').pipe(delay(10)),
        of('S').pipe(delay(1))
    ).subscribe(result.push.bind(result))

    await new Promise<void>((res) => setTimeout(() => res(), 500))

    expect(result.join('')).toBe(__)
})

test('concat events work only for the first event if it is still not completed', () => {
    const first = []
    const both = []

    const s1 = new Subject()
    const s2 = new Subject()

    s1.subscribe(first.push.bind(first))
    concat(s1, s2).subscribe(both.push.bind(both))

    s1.next('I')
    s1.next('am')
    s2.next('nobody.')
    s2.next('Nobody')
    s2.next('is')
    s1.next('perfect.')

    expect(first.join(' ')).toBe('I am perfect.')
    expect(both.join(' ')).toBe(__)
})

test('concat events work with two events if first event is completed', () => {
    const first = []
    const both = []

    const s1 = new Subject()
    const s2 = new Subject()

    s1.subscribe(first.push.bind(first))
    concat(s1, s2).subscribe(both.push.bind(both))

    s1.next('I')
    s1.next('am')
    s1.complete()
    s2.next('nobody.')
    s2.next('Nobody')
    s2.next('is')
    s1.next('perfect.')

    expect(both.join(' ')).toBe(__)
    expect(first.join(' ')).toBe(__)
})

test('splutting up', () => {
    const oddsAndEvents: string[] = []
    const numbers = range(1, 9)

    const split = numbers.pipe(groupBy((n) => __))
    split.subscribe((group) => {
        group.subscribe((n) => {
            oddsAndEvents[group.key] || (oddsAndEvents[group.key] = '');
            oddsAndEvents[group.key] += n;
        })
    })

    expect('2468', oddsAndEvents[0])
    expect('13579', oddsAndEvents[1])
})

test('need to subscribe immediately when splitting', function () {
    var averages = [0,0];
    var numbers = of(22,22,99,22,101,22)

    const split = numbers.pipe(groupBy((n) => n % 2))
    split.subscribe((group) => {
        group.pipe(
            toArray(),
            map((value) => __)        
        ).subscribe(value => averages[group.key] = value)
    })
  
    expect(averages[0]).toBe(22)
    expect(averages[1]).toBe(100)
  })

test('use of scan and reduce', () => {
    let numbers = new Subject<number>()

    let sum1 = 0
    let count1 = 0
    let sum2 = 0
    let count2 = 0


    numbers.pipe(scan((acc, number) => acc + number)).subscribe((n) => {
        count1++
        sum1 += n
    })
    numbers.next(1)
    numbers.next(1)
    numbers.next(1)
    numbers.next(1)
    numbers.next(1)
    numbers.next(1)

    numbers.complete()

    const numbers2 = of(1, 2, 3, 4)

    numbers2.pipe(reduce((acc, number) => acc + number)).subscribe((n) => {
        count2++
        sum2 += n
    })

    expect(sum1).toBe(__)
    expect(count1).toBe(__)
    
    expect(sum2).toBe(__)
    expect(count2).toBe(__)
})