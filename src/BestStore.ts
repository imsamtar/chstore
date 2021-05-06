/*class BestStore<T> {
    object: T;
    listeners = new Map<Symbol, (value: T) => void>();
    constructor(object: T) {
        this.object = object;
    }
    get<K extends keyof T>(key: K | undefined = undefined): K extends keyof T ? T[K] : T {
        if (typeof key === "undefined") {
            return this.object as any;
        }
        return this.object[key as any];
    }
    set(value: T) {
        this.object = value;
        this.notify();
    }
    update(updater: (value: T) => T) {
        this.set(updater(this.object));
    }
    setProp<K extends keyof T>(key: K, value: T[K], notify = true) {
        this.object[key] = value;
        if (notify) this.notify();
    }
    subscribe(callback: (value: T) => void) {

    }
    subscribeProp<K extends keyof T>(key: K, callback: (value: T[K]) => void) {

    }
    forEach(callback: (entry: T[keyof T], index: keyof T) => void) {

    }
    notify() {

    }
}

type Hello = {
    hello: "world";
    hy?: "Hy!";
    [x: number]: "hello";
}

const hello: Hello = { hello: "world", 7: 9 };

const store = new BestStore<Hello>(hello);

store.get();

store.set({ hello: "world" });

store.subscribe((value) => {
    value
})

store.subscribeProp("hello", value => {

})

store.forEach((value, index) => {
    index
})
*/
