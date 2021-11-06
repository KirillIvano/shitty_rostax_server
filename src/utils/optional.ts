export type Optional<T> = {err: Error} | {err: null; val: T};

export const optionalPromise = async <T>(prom: Promise<T>): Promise<Optional<T>> => {
    try {
        const res = await prom;
        return {err: null, val: res};
    } catch (e) {
        return {err: e as Error};
    }
};
