export default class Subscriber<Type = any> {
    _subscribers = new Map<Symbol, Function>();
    _object = <Type>{};
    constructor(values = <Type>{}) {
        this._object = values;
    }
    _notify() {
        for (const subscriber of Array.from(this._subscribers.values())) {
            subscriber(<this & Type>this);
        }
    }
    get() {
        return this._object;
    }
    set(value: Type) {
        this._object = value;
        this._notify();
    }
    update(fn: (value: Type) => Type) {
        this.set(fn(this._object));
    }
    subscribe(fn: (value: (this & Type)) => any) {
        const symbol = Symbol();
        this._subscribers.set(symbol, fn);
        fn(<this & Type>this);
        return () => {
            this._subscribers.delete(symbol);
        }
    }
    toJSON() {
        return this._object;
    }
    toString() {
        return JSON.stringify(this.toJSON());
    }
}