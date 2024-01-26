import { IDBPDatabase, openDB } from 'idb';

export namespace Todo {
  export type List = {
    id: string;
    label: string;
    items: Item[];
  };

  export type Item = {
    id: string;
    done: boolean;
    label: string;
  };
}

export interface IStorage {
  everything(): Promise<Storage.Data>;
  get(
    key: Storage.Keys,
    id?: string
  ): Promise<Storage.DataReturnType<typeof key> | Storage.DataReturnType<typeof key>[]>;
  set(
    key: Storage.Keys,
    value: Storage.DataReturnType<typeof key> | Storage.DataReturnType<typeof key>[]
  ): Promise<void>;
  delete(key: Storage.Keys, id: string): Promise<void>;
  clear(): Promise<void>;
}

export class WebStorage implements IStorage {
  static instance = new WebStorage();

  private async open(): Promise<IDBPDatabase> {
    return await openDB('devkit', 1, {
      upgrade(db) {
        for (const key of Object.values(Storage.Keys)) {
          db.createObjectStore(key);
        }
      },
    });
  }

  async everything(): Promise<Storage.Data> {
    return {
      [Storage.Keys.LISTS]: await this.get(Storage.Keys.LISTS),
    };
  }

  async get(key: Storage.Keys): Promise<Storage.DataReturnType<typeof key>[]>;
  async get(key: Storage.Keys, id: string): Promise<Storage.DataReturnType<typeof key>>;
  async get(
    key: Storage.Keys,
    id?: string
  ): Promise<Storage.DataReturnType<typeof key> | Storage.DataReturnType<typeof key>[]> {
    const db = await this.open();

    if (id) {
      return await db.get(key, id);
    }

    return await db.getAll(key);
  }

  async set(
    key: Storage.Keys,
    value: Storage.DataReturnType<typeof key> | Storage.DataReturnType<typeof key>[]
  ): Promise<void> {
    const db = await this.open();

    if (Array.isArray(value)) {
      const tx = db.transaction(key, 'readwrite');

      await Promise.all([...value.map((v) => tx.store.put(v, v.id)), tx.done]);
    } else {
      await db.put(key, value, value.id);
    }
  }

  async delete(key: Storage.Keys, id: string): Promise<void> {
    const db = await this.open();
    await db.delete(key, id);
  }

  async clear(): Promise<void> {
    const db = await this.open();

    await Promise.all(Object.values(Storage.Keys).map((key) => db.clear(key)));
  }
}

export class Storage {
  private static storage: IStorage;

  static init(storage: IStorage) {
    if (this.storage) {
      console.warn('Storage has already been initialized, as such this request will be ignored.');
    } else {
      this.storage = storage;
    }
  }

  static async everything(): Promise<Storage.Data>;
  static async everything(stringify: false): Promise<Storage.Data>;
  static async everything(stringify: true): Promise<Storage.Data.Raw>;
  static async everything(stringify?: boolean): Promise<Storage.Data | Storage.Data.Raw> {
    const data = await this.storage.everything();

    if (stringify) {
      return this.convert(data);
    }

    return data;
  }

  static convert(data: Storage.Data): Storage.Data.Raw;
  static convert(data: Storage.Data.Raw): Storage.Data;
  static convert(data: Storage.Data | Storage.Data.Raw): Storage.Data | Storage.Data.Raw {
    if (typeof data[Storage.Keys.LISTS] === 'string') {
      return Object.keys(data).reduce<Storage.Data>(
        (output, key) => {
          output[key] = JSON.parse(data[key]);
          return output;
        },
        {
          [Storage.Keys.LISTS]: [],
        }
      );
    }

    return Object.keys(data).reduce<Storage.Data.Raw>(
      (output, key) => {
        output[key] = JSON.stringify(data[key], null, 4);
        return output;
      },
      {
        [Storage.Keys.LISTS]: '[]',
      }
    );
  }

  static async get(key: Storage.Keys): Promise<Storage.DataReturnType<typeof key>[]>;
  static async get(key: Storage.Keys, id: string): Promise<Storage.DataReturnType<typeof key>>;
  static async get(
    key: Storage.Keys,
    id?: string
  ): Promise<Storage.DataReturnType<typeof key> | Storage.DataReturnType<typeof key>[]> {
    return this.storage.get(key, id);
  }

  static async set(key: Storage.Keys, value: Storage.DataReturnType<typeof key>): Promise<void> {
    return this.storage.set(key, value);
  }

  static async load(data: Storage.Data): Promise<void> {
    await Promise.all(
      Object.keys(data).map((key: Storage.Keys) => {
        return this.storage.set(key, data[key]);
      })
    );
  }

  static async delete(key: Storage.Keys, id: string): Promise<void> {
    return this.storage.delete(key, id);
  }

  static async clear(): Promise<void> {
    return this.storage.clear();
  }
}

export namespace Storage {
  export enum Keys {
    LISTS = 'lists',
  }

  export type Data = {
    [Storage.Keys.LISTS]: Todo.List[];
  };

  export namespace Data {
    export type Raw = Record<Storage.Keys, string>;
  }

  export type DataReturnType<T extends Storage.Keys> = Storage.Data[T] extends Array<any>
    ? Storage.Data[T][0]
    : Storage.Data[T];
}
