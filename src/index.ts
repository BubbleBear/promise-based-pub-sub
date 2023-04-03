export const makePubSub = <T>() => {
    const ref: [
        sub: (onMsg?: (message: T) => void, onErr?: (error: any) => void) => void,
        pub: ((message: T) => void),
        clear: () => void
    ] = [ () => {}, () => {}, () => {} ]

    let subscribers: [onMsg?: (message: T) => void, onErr?: (error: any) => void][] = []

    let publisheds: Promise<T>[] = []

    ref[0] = (onMsg?: (message: T) => void, onErr?: (error: any) => void) => {
        publisheds.forEach((published) => published.then(onMsg, onErr))
        subscribers.push([onMsg, onErr])
    }

    ref[1] = (message: T) => {
        const p = Promise.resolve(message)
        subscribers.forEach((subscriber) => p.then(...subscriber))
        publisheds.push(p)
    }

    ref[2] = () => {
        subscribers = []
        publisheds = []
    }

    return ref
}

const [sub, pub, clear] = makePubSub()

pub('asdf')

sub((...args) => {
    console.log(`on sub`, ...args)
})

clear()

sub((...args) => {
    console.log(`on sub 1`, ...args)
})

pub(1234)
