class Store<Value = any> {
    private value: Value = null;
    private _subscribers = new Map<Symbol, Function>();
    constructor(value: Value, getters: string[] = [], setters: string[] = []) {
        this.value = value;
        for (const key of getters) {
            if (this['__lookupGetter__'](key)) continue;
            this['__defineGetter__'](key, () => this.value[key]);
        }
        for (const key of setters) {
            if (this['__lookupSetter__'](key)) continue;
            this['__defineSetter__'](key, (value) => this.value[key] = value);
        }
    }
    private notify() {
        const value = this.value;
        for (const subscriber of Array.from(this._subscribers.values())) {
            subscriber(value);
        }
    }
    get() {
        return this.value;
    }
    set(value: Value) {
        this.value = value;
        this.notify();
    }
    update(updater) {
        this.set(updater(this.value));
    }
    subscribe(fn: (value: Value) => any) {
        const symbol = Symbol();
        this._subscribers.set(symbol, fn);
        fn(this.value);
        return () => {
            this._subscribers.delete(symbol);
        }
    }
}

export default Store;