# chstore
Advance stores for reactive web applications

## API

### Store
- Generic Store
```ts
class Store<Value = any> {
    constructor(value: Value, getters?: string[], setters?: string[]);
    get(): Value;
    set(value: Value): void;
    update(updater: any): void;
    subscribe(fn: (value: Value) => any): () => void;
}
```
### ListStore
- Array like store
```ts
class ListStore<Value = any> extends Array<Value> {
    constructor(values?: Value[]);
    push(...items: Value[]): number;
    pop(): Value;
    unshift(...items: Value[]): number;
    shift(): Value;
    set(values: Value[]): this;
    subscribe(fn: (value: ListStore<Value>) => any): () => void;
    toJSON(): Value[];
    toString(): string;
}
```
### MapStore
- Map like store
```ts
class MapStore<Value = any> extends Map<string, Value> {
    constructor(value?: Object | [string, Value][]);
    set(key: string, value: Value): this;
    delete(key: string): boolean;
    clear(): void;
    subscribe(fn: (value: MapStore<Value>) => any): () => void;
    map<Type>(fn: (key: string, value: Value, map: MapStore) => Type): MapStore<Type>;
    getKeys(): string[];
    getValues(): Value[];
    toJSON(): {};
    toString(): string;
}
```