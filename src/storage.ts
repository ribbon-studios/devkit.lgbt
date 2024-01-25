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
  get<T>(key: Storage.Keys, id?: string): Promise<T | T[]>;
  set<T>(key: Storage.Keys, id: string, value: T): Promise<void>;
  delete(key: Storage.Keys, id: string): Promise<void>;
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

  async get<T>(key: Storage.Keys): Promise<T[]>;
  async get<T>(key: Storage.Keys, id: string): Promise<T>;
  async get<T>(key: Storage.Keys, id?: string): Promise<T | T[]> {
    const db = await this.open();

    if (id) {
      return await db.get(key, id);
    }

    return await db.getAll(key);
  }

  async set<T>(key: Storage.Keys, id: string, value: T): Promise<void> {
    const db = await this.open();
    await db.put(key, value, id);
  }

  async delete(key: Storage.Keys, id: string): Promise<void> {
    const db = await this.open();
    await db.delete(key, id);
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

  static async get<T>(key: Storage.Keys): Promise<T[]>;
  static async get<T>(key: Storage.Keys, id: string): Promise<T>;
  static async get<T>(key: Storage.Keys, id?: string): Promise<T | T[]> {
    return this.storage.get<T>(key, id);
  }

  static async set<T>(key: Storage.Keys, id: string, value: T): Promise<void> {
    return this.storage.set<T>(key, id, value);
  }

  static async delete(key: Storage.Keys, id: string): Promise<void> {
    return this.storage.delete(key, id);
  }
}

export namespace Storage {
  export enum Keys {
    LISTS = 'lists',
  }
}
