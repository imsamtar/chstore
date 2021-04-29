class MapStore<Value = any> extends Map<string, Value> {
    private _subscribers = new Map<Symbol, Function>();
    constructor(value: Object | [string, Value][] = {}) {
        super();
        if (value instanceof Array) {
            for (const [key, val] of value) {
                this.set(key, val);
            }
        } else {
            for (const key in value) {
                this.set(key, value[key]);
            }
        }
        this.defineGetters();
    }
    private defineGetters() {
        for (const key of this.getKeys()) {
            const getter = this['__lookupGetter__'](key);
            if (!getter) {
                this['__defineGetter__'](key, () => this.get(key));
            }
            const setter = this['__lookupSetter__'](key);
            if (!setter) {
                this['__defineSetter__'](key, (value) => this.set(key, value));
            }
        }
    }
    private notify() {
        this.defineGetters();
        for (const subscriber of Array.from(this._subscribers.values())) {
            subscriber(this);
        }
    }
    set(key: string, value: Value) {
        super.set(key, value);
        this.notify();
        return this;
    }
    delete(key: string) {
        const result = super.delete(key);
        if (result) this.notify();
        return result;
    }
    clear() {
        super.clear();
        this.notify();
    }
    subscribe(fn: (value: MapStore<Value>) => any) {
        const symbol = Symbol();
        this._subscribers.set(symbol, fn);
        fn(this);
        return () => {
            this._subscribers.delete(symbol);
        }
    }
    map<Type>(fn: (key: string, value: Value, map: MapStore) => Type): MapStore<Type> {
        const entries = Array.from(this.entries());
        return new MapStore<Type>(entries.map(([key, value]) => [key, fn(key, value, this)]));
    }
    getKeys(): string[] {
        const skip = ['_subscribers'];
        return Array.from(super.keys()).filter(key => !skip.find(k => k === key));;
    }
    getValues(): Value[] {
        const keys = this.getKeys();
        return keys.map(key => this.get(key));
    }
    toJSON() {
        const object = {};
        const keys = this.getKeys();
        for (const key of keys) {
            object[key] = this.get(key);
        }
        return object;
    }
    toString() {
        return JSON.stringify(this.toJSON());
    }
}

export default MapStore;
