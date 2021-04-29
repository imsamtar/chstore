class ListStore<Value = any> extends Array<Value> {
    private subscribers = new Map<Symbol, Function>();
    constructor(values: Value[] = []) {
        super();
        if (typeof values.length !== "undefined") {
            for (const value of values) {
                super.push(value);
            }
        }
    }
    private notify() {
        for (const subscriber of Array.from(this.subscribers.values())) {
            subscriber(this);
        }
    }
    push(...items: Value[]) {
        const result = super.push(...items);
        this.notify();
        return result;
    }
    pop() {
        const result = super.pop();
        this.notify();
        return result;
    }
    unshift(...items: Value[]) {
        const result = super.unshift(...items);
        this.notify();
        return result;
    }
    shift() {
        const result = super.shift();
        this.notify();
        return result;
    }
    set(values: Value[]) {
        this.length = 0;
        for (const value of values) {
            super.push(value);
        }
        this.notify();
        return this;
    }
    subscribe(fn: (value: ListStore<Value>) => any) {
        const symbol = Symbol();
        this.subscribers.set(symbol, fn);
        fn(this);
        return () => {
            this.subscribers.delete(symbol);
        }
    }
    toJSON() {
        return Array.from(this);
    }
    toString() {
        return JSON.stringify(this.toJSON());
    }
}

export default ListStore;
