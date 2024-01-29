import { IStorage, StorageKeys } from './base';

export class Storage {
  private static storage: IStorage;

  static init(storage: IStorage) {
    if (this.storage) {
      console.warn('Storage has already been initialized, as such this request will be ignored.');
    } else {
      this.storage = storage;
    }
  }

  static async everything(): Promise<IStorage.Data>;
  static async everything(stringify: false): Promise<IStorage.Data>;
  static async everything(stringify: true): Promise<IStorage.Data.Raw>;
  static async everything(stringify?: boolean): Promise<IStorage.Data | IStorage.Data.Raw> {
    const data = await this.storage.everything();

    if (stringify) {
      return this.convert(data);
    }

    return data;
  }

  static convert(data: IStorage.Data): IStorage.Data.Raw;
  static convert(data: IStorage.Data.Raw): IStorage.Data;
  static convert(data: IStorage.Data | IStorage.Data.Raw): IStorage.Data | IStorage.Data.Raw {
    if (this.isRawData(data)) {
      return Object.keys(data).reduce<IStorage.Data>(
        (output, key) => {
          output[key as keyof IStorage.Data] = JSON.parse(data[key as keyof IStorage.Data]);
          return output;
        },
        {
          [StorageKeys.LISTS]: [],
          [StorageKeys.NOTES]: [],
        }
      );
    }

    return Object.keys(data).reduce<IStorage.Data.Raw>(
      (output, key) => {
        output[key as keyof IStorage.Data.Raw] = JSON.stringify(data[key as keyof IStorage.Data.Raw], null, 4);
        return output;
      },
      {
        [StorageKeys.LISTS]: '[]',
        [StorageKeys.NOTES]: '[]',
      }
    );
  }

  static async get<K extends StorageKeys>(key: K): Promise<IStorage.DataReturnType<K>[]>;
  static async get<K extends StorageKeys>(key: K, id: string): Promise<IStorage.DataReturnType<K>>;
  static async get<K extends StorageKeys>(
    key: K,
    id?: string
  ): Promise<IStorage.DataReturnType<K> | IStorage.DataReturnType<K>[]>;
  static async get<K extends StorageKeys>(
    key: K,
    id?: string
  ): Promise<IStorage.DataReturnType<K> | IStorage.DataReturnType<K>[]> {
    return this.storage.get(key, id);
  }

  static async set<K extends StorageKeys>(
    key: K,
    value: IStorage.DataReturnType<K>[] | IStorage.DataReturnType<K>
  ): Promise<void> {
    return this.storage.set(key, value);
  }

  static async load(data: IStorage.Data): Promise<void> {
    await Promise.all(
      Object.keys(data).map((key) => {
        return this.storage.set(key as keyof IStorage.Data, data[key as keyof IStorage.Data]);
      })
    );
  }

  static async delete(key: StorageKeys, id: string): Promise<void> {
    await this.storage.delete(key, id);
  }

  static async clear(): Promise<void> {
    await this.storage.clear();
  }

  private static isRawData(data: IStorage.Data.Raw | IStorage.Data): data is IStorage.Data.Raw {
    return typeof data[StorageKeys.LISTS] === 'string';
  }
}

export * from './base';
export * from './web-storage';
