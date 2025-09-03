export function createStore(initial = {}) {
    let state = { ...initial };

    const subs = new Set();

    const get = () => state;

    const notify = () => { for (const fn of subs) fn(state) }

    const set = (partial) => {
        const next = typeof partial === 'function' ? partial(state) : partial
        state = { ...state, ...next }
        notify()
    }

    const update = (recipe) => {
        set(recipe)
    }

    const subscribe = (fn) => {
        subs.add(fn)

        fn(state)

        return () => subs.delete(fn)
    }

    return { get, set, update, subscribe }
}