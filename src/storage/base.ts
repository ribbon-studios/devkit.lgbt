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

export namespace Notes {
  export type List = {
    id: string;
    text: string;
  };
}

export interface IStorage {
  everything(): Promise<IStorage.Data>;
  get<K extends StorageKeys>(key: K, id?: string): Promise<IStorage.DataReturnType<K> | IStorage.DataReturnType<K>[]>;
  set(
    key: StorageKeys,
    value: IStorage.DataReturnType<typeof key> | IStorage.DataReturnType<typeof key>[]
  ): Promise<void>;
  delete(key: StorageKeys, id: string): Promise<void>;
  clear(): Promise<void>;
}

export enum StorageKeys {
  LISTS = 'lists',
  NOTES = 'notes',
}

export namespace IStorage {
  export type Data = {
    [StorageKeys.LISTS]: Todo.List[];
    [StorageKeys.NOTES]: Notes.List[];
  };

  export namespace Data {
    export type Raw = Record<StorageKeys, string>;
  }

  export type DataReturnType<K extends StorageKeys> = Data[K][number];
}
