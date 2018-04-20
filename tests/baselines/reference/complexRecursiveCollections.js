//// [tests/cases/compiler/complexRecursiveCollections.ts] ////

//// [complex.ts]
interface Ara<T> { t: T }
interface Collection<K, V> {
    map<M>(mapper: (value: V, key: K, iter: this) => M): Collection<K, M>;
    flatMap<M>(mapper: (value: V, key: K, iter: this) => Ara<M>, context?: any): Collection<K, M>;
    // these seem necessary to push it over the top for memory usage
    reduce<R>(reducer: (reduction: R, value: V, key: K, iter: this) => R, initialReduction: R, context?: any): R;
    reduce<R>(reducer: (reduction: V | R, value: V, key: K, iter: this) => R): R;
    toSeq(): Seq<K, V>;
}
interface Seq<K, V> extends Collection<K, V> {
}
interface N1<T> extends Collection<void, T> {
    map<M>(mapper: (value: T, key: void, iter: this) => M): N1<M>;
    flatMap<M>(mapper: (value: T, key: void, iter: this) => Ara<M>, context?: any): N1<M>;
}
interface N2<T> extends N1<T> {
    map<M>(mapper: (value: T, key: void, iter: this) => M): N2<M>;
    flatMap<M>(mapper: (value: T, key: void, iter: this) => Ara<M>, context?: any): N2<M>;
    toSeq(): N2<T>;
}
//// [immutable.ts]
// Test that complex recursive collections can pass the `extends` assignability check without
// running out of memory. This bug was exposed in Typescript 2.4 when more generic signatures
// started being checked.
declare module Immutable {
  export function fromJS(jsValue: any, reviver?: (key: string | number, sequence: Collection.Keyed<string, any> | Collection.Indexed<any>, path?: Array<string | number>) => any): any;
  export function is(first: any, second: any): boolean;
  export function hash(value: any): number;
  export function isImmutable(maybeImmutable: any): maybeImmutable is Collection<any, any>;
  export function isCollection(maybeCollection: any): maybeCollection is Collection<any, any>;
  export function isKeyed(maybeKeyed: any): maybeKeyed is Collection.Keyed<any, any>;
  export function isIndexed(maybeIndexed: any): maybeIndexed is Collection.Indexed<any>;
  export function isAssociative(maybeAssociative: any): maybeAssociative is Collection.Keyed<any, any> | Collection.Indexed<any>;
  export function isOrdered(maybeOrdered: any): boolean;
  export function isValueObject(maybeValue: any): maybeValue is ValueObject;
  export interface ValueObject {
    equals(other: any): boolean;
    hashCode(): number;
  }
  export module List {
    function isList(maybeList: any): maybeList is List<any>;
    function of<T>(...values: Array<T>): List<T>;
  }
  export function List(): List<any>;
  export function List<T>(): List<T>;
  export function List<T>(collection: Iterable<T>): List<T>;
  export interface List<T> extends Collection.Indexed<T> {
    // Persistent changes
    set(index: number, value: T): List<T>;
    delete(index: number): List<T>;
    remove(index: number): List<T>;
    insert(index: number, value: T): List<T>;
    clear(): List<T>;
    push(...values: Array<T>): List<T>;
    pop(): List<T>;
    unshift(...values: Array<T>): List<T>;
    shift(): List<T>;
    update(index: number, notSetValue: T, updater: (value: T) => T): this;
    update(index: number, updater: (value: T) => T): this;
    update<R>(updater: (value: this) => R): R;
    merge(...collections: Array<Collection.Indexed<T> | Array<T>>): this;
    mergeWith(merger: (oldVal: T, newVal: T, key: number) => T, ...collections: Array<Collection.Indexed<T> | Array<T>>): this;
    mergeDeep(...collections: Array<Collection.Indexed<T> | Array<T>>): this;
    mergeDeepWith(merger: (oldVal: T, newVal: T, key: number) => T, ...collections: Array<Collection.Indexed<T> | Array<T>>): this;
    setSize(size: number): List<T>;
    // Deep persistent changes
    setIn(keyPath: Iterable<any>, value: any): this;
    deleteIn(keyPath: Iterable<any>): this;
    removeIn(keyPath: Iterable<any>): this;
    updateIn(keyPath: Iterable<any>, notSetValue: any, updater: (value: any) => any): this;
    updateIn(keyPath: Iterable<any>, updater: (value: any) => any): this;
    mergeIn(keyPath: Iterable<any>, ...collections: Array<any>): this;
    mergeDeepIn(keyPath: Iterable<any>, ...collections: Array<any>): this;
    // Transient changes
    withMutations(mutator: (mutable: this) => any): this;
    asMutable(): this;
    asImmutable(): this;
    // Sequence algorithms
    concat<C>(...valuesOrCollections: Array<Iterable<C> | C>): List<T | C>;
    map<M>(mapper: (value: T, key: number, iter: this) => M, context?: any): List<M>;
    flatMap<M>(mapper: (value: T, key: number, iter: this) => Iterable<M>, context?: any): List<M>;
    filter<F extends T>(predicate: (value: T, index: number, iter: this) => value is F, context?: any): List<F>;
    filter(predicate: (value: T, index: number, iter: this) => any, context?: any): this;
  }
  export module Map {
    function isMap(maybeMap: any): maybeMap is Map<any, any>;
    function of(...keyValues: Array<any>): Map<any, any>;
  }
  export function Map<K, V>(collection: Iterable<[K, V]>): Map<K, V>;
  export function Map<T>(collection: Iterable<Iterable<T>>): Map<T, T>;
  export function Map<V>(obj: {[key: string]: V}): Map<string, V>;
  export function Map<K, V>(): Map<K, V>;
  export function Map(): Map<any, any>;
  export interface Map<K, V> extends Collection.Keyed<K, V> {
    // Persistent changes
    set(key: K, value: V): this;
    delete(key: K): this;
    remove(key: K): this;
    deleteAll(keys: Iterable<K>): this;
    removeAll(keys: Iterable<K>): this;
    clear(): this;
    update(key: K, notSetValue: V, updater: (value: V) => V): this;
    update(key: K, updater: (value: V) => V): this;
    update<R>(updater: (value: this) => R): R;
    merge(...collections: Array<Collection<K, V> | {[key: string]: V}>): this;
    mergeWith(merger: (oldVal: V, newVal: V, key: K) => V, ...collections: Array<Collection<K, V> | {[key: string]: V}>): this;
    mergeDeep(...collections: Array<Collection<K, V> | {[key: string]: V}>): this;
    mergeDeepWith(merger: (oldVal: V, newVal: V, key: K) => V, ...collections: Array<Collection<K, V> | {[key: string]: V}>): this;
    // Deep persistent changes
    setIn(keyPath: Iterable<any>, value: any): this;
    deleteIn(keyPath: Iterable<any>): this;
    removeIn(keyPath: Iterable<any>): this;
    updateIn(keyPath: Iterable<any>, notSetValue: any, updater: (value: any) => any): this;
    updateIn(keyPath: Iterable<any>, updater: (value: any) => any): this;
    mergeIn(keyPath: Iterable<any>, ...collections: Array<any>): this;
    mergeDeepIn(keyPath: Iterable<any>, ...collections: Array<any>): this;
    // Transient changes
    withMutations(mutator: (mutable: this) => any): this;
    asMutable(): this;
    asImmutable(): this;
    // Sequence algorithms
    concat<KC, VC>(...collections: Array<Iterable<[KC, VC]>>): Map<K | KC, V | VC>;
    concat<C>(...collections: Array<{[key: string]: C}>): Map<K | string, V | C>;
    map<M>(mapper: (value: V, key: K, iter: this) => M, context?: any): Map<K, M>;
    mapKeys<M>(mapper: (key: K, value: V, iter: this) => M, context?: any): Map<M, V>;
    mapEntries<KM, VM>(mapper: (entry: [K, V], index: number, iter: this) => [KM, VM], context?: any): Map<KM, VM>;
    flatMap<M>(mapper: (value: V, key: K, iter: this) => Iterable<M>, context?: any): Map<any, any>;
    filter<F extends V>(predicate: (value: V, key: K, iter: this) => value is F, context?: any): Map<K, F>;
    filter(predicate: (value: V, key: K, iter: this) => any, context?: any): this;
  }
  export module OrderedMap {
    function isOrderedMap(maybeOrderedMap: any): maybeOrderedMap is OrderedMap<any, any>;
  }
  export function OrderedMap<K, V>(collection: Iterable<[K, V]>): OrderedMap<K, V>;
  export function OrderedMap<T>(collection: Iterable<Iterable<T>>): OrderedMap<T, T>;
  export function OrderedMap<V>(obj: {[key: string]: V}): OrderedMap<string, V>;
  export function OrderedMap<K, V>(): OrderedMap<K, V>;
  export function OrderedMap(): OrderedMap<any, any>;
  export interface OrderedMap<K, V> extends Map<K, V> {
    // Sequence algorithms
    concat<KC, VC>(...collections: Array<Iterable<[KC, VC]>>): OrderedMap<K | KC, V | VC>;
    concat<C>(...collections: Array<{[key: string]: C}>): OrderedMap<K | string, V | C>;
    map<M>(mapper: (value: V, key: K, iter: this) => M, context?: any): OrderedMap<K, M>;
    mapKeys<M>(mapper: (key: K, value: V, iter: this) => M, context?: any): OrderedMap<M, V>;
    mapEntries<KM, VM>(mapper: (entry: [K, V], index: number, iter: this) => [KM, VM], context?: any): OrderedMap<KM, VM>;
    flatMap<M>(mapper: (value: V, key: K, iter: this) => Iterable<M>, context?: any): OrderedMap<any, any>;
    filter<F extends V>(predicate: (value: V, key: K, iter: this) => value is F, context?: any): OrderedMap<K, F>;
    filter(predicate: (value: V, key: K, iter: this) => any, context?: any): this;
  }
  export module Set {
    function isSet(maybeSet: any): maybeSet is Set<any>;
    function of<T>(...values: Array<T>): Set<T>;
    function fromKeys<T>(iter: Collection<T, any>): Set<T>;
    function fromKeys(obj: {[key: string]: any}): Set<string>;
    function intersect<T>(sets: Iterable<Iterable<T>>): Set<T>;
    function union<T>(sets: Iterable<Iterable<T>>): Set<T>;
  }
  export function Set(): Set<any>;
  export function Set<T>(): Set<T>;
  export function Set<T>(collection: Iterable<T>): Set<T>;
  export interface Set<T> extends Collection.Set<T> {
    // Persistent changes
    add(value: T): this;
    delete(value: T): this;
    remove(value: T): this;
    clear(): this;
    union(...collections: Array<Collection<any, T> | Array<T>>): this;
    merge(...collections: Array<Collection<any, T> | Array<T>>): this;
    intersect(...collections: Array<Collection<any, T> | Array<T>>): this;
    subtract(...collections: Array<Collection<any, T> | Array<T>>): this;
    // Transient changes
    withMutations(mutator: (mutable: this) => any): this;
    asMutable(): this;
    asImmutable(): this;
    // Sequence algorithms
    concat<C>(...valuesOrCollections: Array<Iterable<C> | C>): Set<T | C>;
    map<M>(mapper: (value: T, key: never, iter: this) => M, context?: any): Set<M>;
    flatMap<M>(mapper: (value: T, key: never, iter: this) => Iterable<M>, context?: any): Set<M>;
    filter<F extends T>(predicate: (value: T, key: never, iter: this) => value is F, context?: any): Set<F>;
    filter(predicate: (value: T, key: never, iter: this) => any, context?: any): this;
  }
  export module OrderedSet {
    function isOrderedSet(maybeOrderedSet: any): boolean;
    function of<T>(...values: Array<T>): OrderedSet<T>;
    function fromKeys<T>(iter: Collection<T, any>): OrderedSet<T>;
    function fromKeys(obj: {[key: string]: any}): OrderedSet<string>;
  }
  export function OrderedSet(): OrderedSet<any>;
  export function OrderedSet<T>(): OrderedSet<T>;
  export function OrderedSet<T>(collection: Iterable<T>): OrderedSet<T>;
  export interface OrderedSet<T> extends Set<T> {
    // Sequence algorithms
    concat<C>(...valuesOrCollections: Array<Iterable<C> | C>): OrderedSet<T | C>;
    map<M>(mapper: (value: T, key: never, iter: this) => M, context?: any): OrderedSet<M>;
    flatMap<M>(mapper: (value: T, key: never, iter: this) => Iterable<M>, context?: any): OrderedSet<M>;
    filter<F extends T>(predicate: (value: T, key: never, iter: this) => value is F, context?: any): OrderedSet<F>;
    filter(predicate: (value: T, key: never, iter: this) => any, context?: any): this;
    zip(...collections: Array<Collection<any, any>>): OrderedSet<any>;
    zipWith<U, Z>(zipper: (value: T, otherValue: U) => Z, otherCollection: Collection<any, U>): OrderedSet<Z>;
    zipWith<U, V, Z>(zipper: (value: T, otherValue: U, thirdValue: V) => Z, otherCollection: Collection<any, U>, thirdCollection: Collection<any, V>): OrderedSet<Z>;
    zipWith<Z>(zipper: (...any: Array<any>) => Z, ...collections: Array<Collection<any, any>>): OrderedSet<Z>;
  }
  export module Stack {
    function isStack(maybeStack: any): maybeStack is Stack<any>;
    function of<T>(...values: Array<T>): Stack<T>;
  }
  export function Stack(): Stack<any>;
  export function Stack<T>(): Stack<T>;
  export function Stack<T>(collection: Iterable<T>): Stack<T>;
  export interface Stack<T> extends Collection.Indexed<T> {
    // Reading values
    peek(): T | undefined;
    // Persistent changes
    clear(): Stack<T>;
    unshift(...values: Array<T>): Stack<T>;
    unshiftAll(iter: Iterable<T>): Stack<T>;
    shift(): Stack<T>;
    push(...values: Array<T>): Stack<T>;
    pushAll(iter: Iterable<T>): Stack<T>;
    pop(): Stack<T>;
    // Transient changes
    withMutations(mutator: (mutable: this) => any): this;
    asMutable(): this;
    asImmutable(): this;
    // Sequence algorithms
    concat<C>(...valuesOrCollections: Array<Iterable<C> | C>): Stack<T | C>;
    map<M>(mapper: (value: T, key: number, iter: this) => M, context?: any): Stack<M>;
    flatMap<M>(mapper: (value: T, key: number, iter: this) => Iterable<M>, context?: any): Stack<M>;
    filter<F extends T>(predicate: (value: T, index: number, iter: this) => value is F, context?: any): Set<F>;
    filter(predicate: (value: T, index: number, iter: this) => any, context?: any): this;
  }
  export function Range(start?: number, end?: number, step?: number): Seq.Indexed<number>;
  export function Repeat<T>(value: T, times?: number): Seq.Indexed<T>;
  export module Record {
    export function isRecord(maybeRecord: any): maybeRecord is Record.Instance<any>;
    export function getDescriptiveName(record: Instance<any>): string;
    export interface Class<T extends Object> {
      (values?: Partial<T> | Iterable<[string, any]>): Instance<T> & Readonly<T>;
      new (values?: Partial<T> | Iterable<[string, any]>): Instance<T> & Readonly<T>;
    }
    export interface Instance<T extends Object> {
      readonly size: number;
      // Reading values
      has(key: string): boolean;
      get<K extends keyof T>(key: K): T[K];
      // Reading deep values
      hasIn(keyPath: Iterable<any>): boolean;
      getIn(keyPath: Iterable<any>): any;
      // Value equality
      equals(other: any): boolean;
      hashCode(): number;
      // Persistent changes
      set<K extends keyof T>(key: K, value: T[K]): this;
      update<K extends keyof T>(key: K, updater: (value: T[K]) => T[K]): this;
      merge(...collections: Array<Partial<T> | Iterable<[string, any]>>): this;
      mergeDeep(...collections: Array<Partial<T> | Iterable<[string, any]>>): this;
      mergeWith(merger: (oldVal: any, newVal: any, key: keyof T) => any, ...collections: Array<Partial<T> | Iterable<[string, any]>>): this;
      mergeDeepWith(merger: (oldVal: any, newVal: any, key: any) => any, ...collections: Array<Partial<T> | Iterable<[string, any]>>): this;
      delete<K extends keyof T>(key: K): this;
      remove<K extends keyof T>(key: K): this;
      clear(): this;
      // Deep persistent changes
      setIn(keyPath: Iterable<any>, value: any): this;
      updateIn(keyPath: Iterable<any>, updater: (value: any) => any): this;
      mergeIn(keyPath: Iterable<any>, ...collections: Array<any>): this;
      mergeDeepIn(keyPath: Iterable<any>, ...collections: Array<any>): this;
      deleteIn(keyPath: Iterable<any>): this;
      removeIn(keyPath: Iterable<any>): this;
      // Conversion to JavaScript types
      toJS(): { [K in keyof T]: any };
      toJSON(): T;
      toObject(): T;
      // Transient changes
      withMutations(mutator: (mutable: this) => any): this;
      asMutable(): this;
      asImmutable(): this;
      // Sequence algorithms
      toSeq(): Seq.Keyed<keyof T, T[keyof T]>;
      [Symbol.iterator](): IterableIterator<[keyof T, T[keyof T]]>;
    }
  }
  export function Record<T>(defaultValues: T, name?: string): Record.Class<T>;
  export module Seq {
    function isSeq(maybeSeq: any): maybeSeq is Seq.Indexed<any> | Seq.Keyed<any, any>;
    function of<T>(...values: Array<T>): Seq.Indexed<T>;
    export module Keyed {}
    export function Keyed<K, V>(collection: Iterable<[K, V]>): Seq.Keyed<K, V>;
    export function Keyed<V>(obj: {[key: string]: V}): Seq.Keyed<string, V>;
    export function Keyed<K, V>(): Seq.Keyed<K, V>;
    export function Keyed(): Seq.Keyed<any, any>;
    export interface Keyed<K, V> extends Seq<K, V>, Collection.Keyed<K, V> {
      toJS(): Object;
      toJSON(): { [key: string]: V };
      toSeq(): this;
      concat<KC, VC>(...collections: Array<Iterable<[KC, VC]>>): Seq.Keyed<K | KC, V | VC>;
      concat<C>(...collections: Array<{[key: string]: C}>): Seq.Keyed<K | string, V | C>;
      map<M>(mapper: (value: V, key: K, iter: this) => M, context?: any): Seq.Keyed<K, M>;
      mapKeys<M>(mapper: (key: K, value: V, iter: this) => M, context?: any): Seq.Keyed<M, V>;
      mapEntries<KM, VM>(mapper: (entry: [K, V], index: number, iter: this) => [KM, VM], context?: any): Seq.Keyed<KM, VM>;
      flatMap<M>(mapper: (value: V, key: K, iter: this) => Iterable<M>, context?: any): Seq.Keyed<any, any>;
      filter<F extends V>(predicate: (value: V, key: K, iter: this) => value is F, context?: any): Seq.Keyed<K, F>;
      filter(predicate: (value: V, key: K, iter: this) => any, context?: any): this;
    }
    module Indexed {
      function of<T>(...values: Array<T>): Seq.Indexed<T>;
    }
    export function Indexed(): Seq.Indexed<any>;
    export function Indexed<T>(): Seq.Indexed<T>;
    export function Indexed<T>(collection: Iterable<T>): Seq.Indexed<T>;
    export interface Indexed<T> extends Seq<number, T>, Collection.Indexed<T> {
      toJS(): Array<any>;
      toJSON(): Array<T>;
      toSeq(): this;
      concat<C>(...valuesOrCollections: Array<Iterable<C> | C>): Seq.Indexed<T | C>;
      map<M>(mapper: (value: T, key: number, iter: this) => M, context?: any): Seq.Indexed<M>;
      flatMap<M>(mapper: (value: T, key: number, iter: this) => Iterable<M>, context?: any): Seq.Indexed<M>;
      filter<F extends T>(predicate: (value: T, index: number, iter: this) => value is F, context?: any): Seq.Indexed<F>;
      filter(predicate: (value: T, index: number, iter: this) => any, context?: any): this;
    }
    export module Set {
      function of<T>(...values: Array<T>): Seq.Set<T>;
    }
    export function Set(): Seq.Set<any>;
    export function Set<T>(): Seq.Set<T>;
    export function Set<T>(collection: Iterable<T>): Seq.Set<T>;
    export interface Set<T> extends Seq<never, T>, Collection.Set<T> {
      toJS(): Array<any>;
      toJSON(): Array<T>;
      toSeq(): this;
      concat<C>(...valuesOrCollections: Array<Iterable<C> | C>): Seq.Set<T | C>;
      map<M>(mapper: (value: T, key: never, iter: this) => M, context?: any): Seq.Set<M>;
      flatMap<M>(mapper: (value: T, key: never, iter: this) => Iterable<M>, context?: any): Seq.Set<M>;
      filter<F extends T>(predicate: (value: T, key: never, iter: this) => value is F, context?: any): Seq.Set<F>;
      filter(predicate: (value: T, key: never, iter: this) => any, context?: any): this;
    }
  }
  export function Seq<S extends Seq<any, any>>(seq: S): S;
  export function Seq<K, V>(collection: Collection.Keyed<K, V>): Seq.Keyed<K, V>;
  export function Seq<T>(collection: Collection.Indexed<T>): Seq.Indexed<T>;
  export function Seq<T>(collection: Collection.Set<T>): Seq.Set<T>;
  export function Seq<T>(collection: Iterable<T>): Seq.Indexed<T>;
  export function Seq<V>(obj: {[key: string]: V}): Seq.Keyed<string, V>;
  export function Seq(): Seq<any, any>;
  export interface Seq<K, V> extends Collection<K, V> {
    readonly size: number | undefined;
    // Force evaluation
    cacheResult(): this;
    // Sequence algorithms
    map<M>(mapper: (value: V, key: K, iter: this) => M, context?: any): Seq<K, M>;
    flatMap<M>(mapper: (value: V, key: K, iter: this) => Iterable<M>, context?: any): Seq<K, M>;
    filter<F extends V>(predicate: (value: V, key: K, iter: this) => value is F, context?: any): Seq<K, F>;
    filter(predicate: (value: V, key: K, iter: this) => any, context?: any): this;
  }
  export module Collection {
    function isKeyed(maybeKeyed: any): maybeKeyed is Collection.Keyed<any, any>;
    function isIndexed(maybeIndexed: any): maybeIndexed is Collection.Indexed<any>;
    function isAssociative(maybeAssociative: any): maybeAssociative is Collection.Keyed<any, any> | Collection.Indexed<any>;
    function isOrdered(maybeOrdered: any): boolean;
    export module Keyed {}
    export function Keyed<K, V>(collection: Iterable<[K, V]>): Collection.Keyed<K, V>;
    export function Keyed<V>(obj: {[key: string]: V}): Collection.Keyed<string, V>;
    export interface Keyed<K, V> extends Collection<K, V> {
      toJS(): Object;
      toJSON(): { [key: string]: V };
      toSeq(): Seq.Keyed<K, V>;
      // Sequence functions
      flip(): this;
      concat<KC, VC>(...collections: Array<Iterable<[KC, VC]>>): Collection.Keyed<K | KC, V | VC>;
      concat<C>(...collections: Array<{[key: string]: C}>): Collection.Keyed<K | string, V | C>;
      map<M>(mapper: (value: V, key: K, iter: this) => M, context?: any): Collection.Keyed<K, M>;
      mapKeys<M>(mapper: (key: K, value: V, iter: this) => M, context?: any): Collection.Keyed<M, V>;
      mapEntries<KM, VM>(mapper: (entry: [K, V], index: number, iter: this) => [KM, VM], context?: any): Collection.Keyed<KM, VM>;
      flatMap<M>(mapper: (value: V, key: K, iter: this) => Iterable<M>, context?: any): Collection.Keyed<any, any>;
      filter<F extends V>(predicate: (value: V, key: K, iter: this) => value is F, context?: any): Collection.Keyed<K, F>;
      filter(predicate: (value: V, key: K, iter: this) => any, context?: any): this;
      [Symbol.iterator](): IterableIterator<[K, V]>;
    }
    export module Indexed {}
    export function Indexed<T>(collection: Iterable<T>): Collection.Indexed<T>;
    export interface Indexed<T> extends Collection<number, T> {
      toJS(): Array<any>;
      toJSON(): Array<T>;
      // Reading values
      get<NSV>(index: number, notSetValue: NSV): T | NSV;
      get(index: number): T | undefined;
      // Conversion to Seq
      toSeq(): Seq.Indexed<T>;
      fromEntrySeq(): Seq.Keyed<any, any>;
      // Combination
      interpose(separator: T): this;
      interleave(...collections: Array<Collection<any, T>>): this;
      splice(index: number, removeNum: number, ...values: Array<T>): this;
      zip(...collections: Array<Collection<any, any>>): Collection.Indexed<any>;
      zipWith<U, Z>(zipper: (value: T, otherValue: U) => Z, otherCollection: Collection<any, U>): Collection.Indexed<Z>;
      zipWith<U, V, Z>(zipper: (value: T, otherValue: U, thirdValue: V) => Z, otherCollection: Collection<any, U>, thirdCollection: Collection<any, V>): Collection.Indexed<Z>;
      zipWith<Z>(zipper: (...any: Array<any>) => Z, ...collections: Array<Collection<any, any>>): Collection.Indexed<Z>;
      // Search for value
      indexOf(searchValue: T): number;
      lastIndexOf(searchValue: T): number;
      findIndex(predicate: (value: T, index: number, iter: this) => boolean, context?: any): number;
      findLastIndex(predicate: (value: T, index: number, iter: this) => boolean, context?: any): number;
      // Sequence algorithms
      concat<C>(...valuesOrCollections: Array<Iterable<C> | C>): Collection.Indexed<T | C>;
      map<M>(mapper: (value: T, key: number, iter: this) => M, context?: any): Collection.Indexed<M>;
      flatMap<M>(mapper: (value: T, key: number, iter: this) => Iterable<M>, context?: any): Collection.Indexed<M>;
      filter<F extends T>(predicate: (value: T, index: number, iter: this) => value is F, context?: any): Collection.Indexed<F>;
      filter(predicate: (value: T, index: number, iter: this) => any, context?: any): this;
      [Symbol.iterator](): IterableIterator<T>;
    }
    export module Set {}
    export function Set<T>(collection: Iterable<T>): Collection.Set<T>;
    export interface Set<T> extends Collection<never, T> {
      toJS(): Array<any>;
      toJSON(): Array<T>;
      toSeq(): Seq.Set<T>;
      // Sequence algorithms
      concat<C>(...valuesOrCollections: Array<Iterable<C> | C>): Collection.Set<T | C>;
      map<M>(mapper: (value: T, key: never, iter: this) => M, context?: any): Collection.Set<M>;
      flatMap<M>(mapper: (value: T, key: never, iter: this) => Iterable<M>, context?: any):  Collection.Set<M>;
      filter<F extends T>(predicate: (value: T, key: never, iter: this) => value is F, context?: any): Collection.Set<F>;
      filter(predicate: (value: T, key: never, iter: this) => any, context?: any): this;
      [Symbol.iterator](): IterableIterator<T>;
    }
  }
  export function Collection<I extends Collection<any, any>>(collection: I): I;
  export function Collection<T>(collection: Iterable<T>): Collection.Indexed<T>;
  export function Collection<V>(obj: {[key: string]: V}): Collection.Keyed<string, V>;
  export interface Collection<K, V> extends ValueObject {
    // Value equality
    equals(other: any): boolean;
    hashCode(): number;
    // Reading values
    get<NSV>(key: K, notSetValue: NSV): V | NSV;
    get(key: K): V | undefined;
    has(key: K): boolean;
    includes(value: V): boolean;
    contains(value: V): boolean;
    first(): V | undefined;
    last(): V | undefined;
    // Reading deep values
    getIn(searchKeyPath: Iterable<any>, notSetValue?: any): any;
    hasIn(searchKeyPath: Iterable<any>): boolean;
    // Persistent changes
    update<R>(updater: (value: this) => R): R;
    // Conversion to JavaScript types
    toJS(): Array<any> | { [key: string]: any };
    toJSON(): Array<V> | { [key: string]: V };
    toArray(): Array<V>;
    toObject(): { [key: string]: V };
    // Conversion to Collections
    toMap(): Map<K, V>;
    toOrderedMap(): OrderedMap<K, V>;
    toSet(): Set<V>;
    toOrderedSet(): OrderedSet<V>;
    toList(): List<V>;
    toStack(): Stack<V>;
    // Conversion to Seq
    toSeq(): this;
    toKeyedSeq(): Seq.Keyed<K, V>;
    toIndexedSeq(): Seq.Indexed<V>;
    toSetSeq(): Seq.Set<V>;
    // Iterators
    keys(): IterableIterator<K>;
    values(): IterableIterator<V>;
    entries(): IterableIterator<[K, V]>;
    // Collections (Seq)
    keySeq(): Seq.Indexed<K>;
    valueSeq(): Seq.Indexed<V>;
    entrySeq(): Seq.Indexed<[K, V]>;
    // Sequence algorithms
    map<M>(mapper: (value: V, key: K, iter: this) => M, context?: any): Collection<K, M>;
    filter<F extends V>(predicate: (value: V, key: K, iter: this) => value is F, context?: any): Collection<K, F>;
    filter(predicate: (value: V, key: K, iter: this) => any, context?: any): this;
    filterNot(predicate: (value: V, key: K, iter: this) => boolean, context?: any): this;
    reverse(): this;
    sort(comparator?: (valueA: V, valueB: V) => number): this;
    sortBy<C>(comparatorValueMapper: (value: V, key: K, iter: this) => C, comparator?: (valueA: C, valueB: C) => number): this;
    groupBy<G>(grouper: (value: V, key: K, iter: this) => G, context?: any): /*Map*/Seq.Keyed<G, /*this*/Collection<K, V>>;
    // Side effects
    forEach(sideEffect: (value: V, key: K, iter: this) => any, context?: any): number;
    // Creating subsets
    slice(begin?: number, end?: number): this;
    rest(): this;
    butLast(): this;
    skip(amount: number): this;
    skipLast(amount: number): this;
    skipWhile(predicate: (value: V, key: K, iter: this) => boolean, context?: any): this;
    skipUntil(predicate: (value: V, key: K, iter: this) => boolean, context?: any): this;
    take(amount: number): this;
    takeLast(amount: number): this;
    takeWhile(predicate: (value: V, key: K, iter: this) => boolean, context?: any): this;
    takeUntil(predicate: (value: V, key: K, iter: this) => boolean, context?: any): this;
    // Combination
    concat(...valuesOrCollections: Array<any>): Collection<any, any>;
    flatten(depth?: number): Collection<any, any>;
    flatten(shallow?: boolean): Collection<any, any>;
    flatMap<M>(mapper: (value: V, key: K, iter: this) => Iterable<M>, context?: any): Collection<K, M>;
    // Reducing a value
    reduce<R>(reducer: (reduction: R, value: V, key: K, iter: this) => R, initialReduction: R, context?: any): R;
    reduce<R>(reducer: (reduction: V | R, value: V, key: K, iter: this) => R): R;
    reduceRight<R>(reducer: (reduction: R, value: V, key: K, iter: this) => R, initialReduction: R, context?: any): R;
    reduceRight<R>(reducer: (reduction: V | R, value: V, key: K, iter: this) => R): R;
    every(predicate: (value: V, key: K, iter: this) => boolean, context?: any): boolean;
    some(predicate: (value: V, key: K, iter: this) => boolean, context?: any): boolean;
    join(separator?: string): string;
    isEmpty(): boolean;
    count(): number;
    count(predicate: (value: V, key: K, iter: this) => boolean, context?: any): number;
    countBy<G>(grouper: (value: V, key: K, iter: this) => G, context?: any): Map<G, number>;
    // Search for value
    find(predicate: (value: V, key: K, iter: this) => boolean, context?: any, notSetValue?: V): V | undefined;
    findLast(predicate: (value: V, key: K, iter: this) => boolean, context?: any, notSetValue?: V): V | undefined;
    findEntry(predicate: (value: V, key: K, iter: this) => boolean, context?: any, notSetValue?: V): [K, V] | undefined;
    findLastEntry(predicate: (value: V, key: K, iter: this) => boolean, context?: any, notSetValue?: V): [K, V] | undefined;
    findKey(predicate: (value: V, key: K, iter: this) => boolean, context?: any): K | undefined;
    findLastKey(predicate: (value: V, key: K, iter: this) => boolean, context?: any): K | undefined;
    keyOf(searchValue: V): K | undefined;
    lastKeyOf(searchValue: V): K | undefined;
    max(comparator?: (valueA: V, valueB: V) => number): V | undefined;
    maxBy<C>(comparatorValueMapper: (value: V, key: K, iter: this) => C, comparator?: (valueA: C, valueB: C) => number): V | undefined;
    min(comparator?: (valueA: V, valueB: V) => number): V | undefined;
    minBy<C>(comparatorValueMapper: (value: V, key: K, iter: this) => C, comparator?: (valueA: C, valueB: C) => number): V | undefined;
    // Comparison
    isSubset(iter: Iterable<V>): boolean;
    isSuperset(iter: Iterable<V>): boolean;
    readonly size: number;
  }
}
declare module "immutable" {
  export = Immutable
}


//// [complex.js]
//// [immutable.js]
