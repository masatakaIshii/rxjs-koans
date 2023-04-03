import { bufferCount, filter, fromEvent, map, range, toArray } from "rxjs";
import { expect, test } from "vitest";
import { EventEmitter } from 'events'
import { A } from "vitest/dist/types-94cfe4b4";

const __: any = 'Fill in the blank'

test('Basic querying', () => {
    const strings = []
    const numbers = range(1, 100)

    numbers.pipe(
        filter(x => x % 11 === 0),
        map((x: number) => x.toString()),
        toArray()
    ).subscribe(strings.push.bind(strings))

    expect(strings.toString()).toBe('11,22,33,44,55,66,77,88,99')
})

test('querying over events', () => {
    let results = 0

    const e = new EventEmitter();
    fromEvent(e, 'click')
        .pipe(
            filter((click: any) => click.x === click.y),
            map((click: { x: number, y: number }) => click.x + click.y)
        )
        .subscribe(x => results = x)

    e.emit('click', { x: 100, y: 55 })
    e.emit('click', { x: 75, y: 75 })
    e.emit('click', { x: 40, y: 80 })
    expect(results).toBe(150)
})

test('buffering with count and skip', () => {
    const results: string[][] = []
    range(1, 10)
        .pipe(
            bufferCount(5, 5)
        ).subscribe(results.push.bind(results))

    expect(results[0].join('')).toBe('12345')
    expect(results[1].join('')).toBe('678910')
})