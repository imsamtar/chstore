type Values<T> = {
    [p in keyof T]: [p, T[p]]
}[keyof T];

export class MapStore<Type = any> extends Map<keyof Type, Type[keyof Type]> {
    private _subscribers = new Map<Symbol, Function>();
    constructor(value = <Type | Values<Type>[]>{}) {
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
            subscriber(<this & Type>this);
        }
    }
    set<T extends keyof Type>(key: T, value: Type[T]) {
        super.set(key, value);
        this.notify();
        return this;
    }
    delete(key: keyof Type) {
        const result = super.delete(key);
        if (result) this.notify();
        return result;
    }
    clear() {
        super.clear();
        this.notify();
    }
    subscribe(fn: (value: (this & Type)) => any) {
        const symbol = Symbol();
        this._subscribers.set(symbol, fn);
        fn(<this & Type>this);
        return () => {
            this._subscribers.delete(symbol);
        }
    }
    map<Type1 = any>(fn: (key: keyof Type, value: Type[keyof Type], map: MapStore) => Type1[keyof Type1]): MapStore<Type1> {
        const entries = Array.from(this.entries());
        return new MapStore<Type1>(entries.map(([key, value]) => <any>[key, fn(key, value, this)]));
    }
    getKeys(): (keyof Type)[] {
        const skip = ['_subscribers'];
        return Array.from(super.keys()).filter(key => !skip.find(k => k === key));;
    }
    getValues(): (Type[keyof Type])[] {
        const keys = this.getKeys();
        return keys.map(key => this.get(key));
    }
    toJSON() {
        const object = <Type>{};
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

export function mapStore<Type = any>(value = <Type | Values<Type>[]>{}) {
    return <MapStore<Type> & Type>new MapStore<Type>(value);
}

interface Colors {
    red: "#ff0000";
    green: "#00ff00";
    blue: "#0000ff";
}

const colors: Colors = {
    red: "#ff0000",
    green: "#00ff00",
    blue: "#0000ff",
}

const map = mapStore<typeof colors>([["blue", "#0000ff"]]);

map.set("green", "#00ff00");