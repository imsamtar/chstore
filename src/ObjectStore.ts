import Subscriber from "./Subscriber";

export class ObjectStore<Type = any> extends Subscriber<Type> {
    constructor(values = <Type>{}) {
        super();
        this._object = values;
    }
    _notify() {
        for (const key of Object.keys(this._object)) {
            if (!this['__lookupGetter__'](key))
                this['__defineGetter__'](key, () => this._object[key]);
            if (!this['__lookupSetter__'](key))
                this['__defineSetter__'](key, (value) => (this._object[key] = value));
        }
        super._notify();
    }
    prop(key: string, value: undefined | Type = undefined) {
        if (typeof value === "undefined") {
            return this._object[key];
        }
        this._object[key] = value;
    }
}

export function objectStore<Type = any>(value = <Type>{}) {
    return <ObjectStore<Type> & Type>new ObjectStore<Type>(value);
}