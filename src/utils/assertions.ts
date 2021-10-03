import {AssertionError} from '../errors/AssertionError';

export function assertExists<T extends unknown>(val: T, err?: string): asserts val is Exclude<T, undefined> {
    if (val === undefined) throw new AssertionError(err);
}

export function assertNumber(val: unknown, err?: string): asserts val is number {
    if (typeof val !== 'number' || val !== val) throw new AssertionError(err);
}

/** parses num or throws error */
export const parseNumber = (val: string, err?: string): number => {
    const parsed = +val;

    assertNumber(parsed, err);

    return parsed;
};

export const getExisting = <T extends unknown>(val: T, err?: string): Exclude<T, undefined> => {
    assertExists<T>(val, err);

    return val as Exclude<T, undefined>;
};
