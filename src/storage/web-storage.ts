import { IDBPDatabase, openDB } from 'idb';
import { INITIAL_STATE as INITIAL_SETTINGS } from '../slices/settings.slice';
import { IStorage, Settings, StorageKeys } from './base';

export class WebStorage implements IStorage {
  static instance = new WebStorage();

  private async open(): Promise<IDBPDatabase> {
    return await openDB('devkit', 3, {
      async upgrade(db, oldVersion) {
        if (oldVersion < 1) {
          db.createObjectStore(StorageKeys.LISTS);
        }

        if (oldVersion < 2) {
          db.createObjectStore(StorageKeys.NOTES);
        }

        if (oldVersion < 3) {
          const store = db.createObjectStore(StorageKeys.SETTINGS);
          const settings: Settings = {
            ...INITIAL_SETTINGS,
            id: 'settings',
          };

          await store.put(settings, settings.id);
        }
      },
    });
  }

  async everything(): Promise<IStorage.Data> {
    return {
      [StorageKeys.LISTS]: await this.get(StorageKeys.LISTS),
      [StorageKeys.NOTES]: await this.get(StorageKeys.NOTES),
      [StorageKeys.SETTINGS]: await this.get(StorageKeys.SETTINGS),
    };
  }

  async get<K extends StorageKeys>(key: K): Promise<IStorage.DataReturnType<K>[]>;
  async get<K extends StorageKeys>(key: K, id: string): Promise<IStorage.DataReturnType<K>>;
  async get<K extends StorageKeys>(
    key: K,
    id?: string
  ): Promise<IStorage.DataReturnType<K> | IStorage.DataReturnType<K>[]> {
    const db = await this.open();

    if (id) {
      return await db.get(key, id);
    }

    return await db.getAll(key);
  }

  async set<K extends StorageKeys>(key: K, value: IStorage.DataReturnType<K> | IStorage.Data[K]): Promise<void> {
    const db = await this.open();

    if (Array.isArray(value)) {
      const tx = db.transaction(key, 'readwrite');

      await Promise.all([...value.map((v) => tx.store.put(v, v.id)), tx.done]);
    } else {
      await db.put(key, value, value.id);
    }
  }

  async delete(key: StorageKeys, id: string): Promise<void> {
    const db = await this.open();
    await db.delete(key, id);
  }

  async clear(): Promise<void> {
    const db = await this.open();

    await Promise.all(Object.values(StorageKeys).map((key) => db.clear(key)));
  }
}
