import { warn } from "cc";
/**
 * Local Storage manager so that each time to get a specific key does not need to access local storage
 * @author Harpinder Singh
 * @version 0.0.1
 */

export enum STORAGE {
  LOCAL,
  SESSION,
}
export class LocAndSessStoreManager {
  //Singleton instance
  private static _instance: LocAndSessStoreManager | null = null;

  //Data cache so that no need to access localstorage again and again
  private _dataCache: Map<string, string> = new Map<string, string>();

  public static get Instance() {
    if (!LocAndSessStoreManager._instance) {
      LocAndSessStoreManager._instance = new LocAndSessStoreManager();
    }
    return LocAndSessStoreManager._instance;
  }

  public get dataCache() {
    return this._dataCache;
  }

  /**
   *Function to get data from cahche or localstorage
   * @param key Key to get It will check in the available of cache for key if found fine or it will check in localstorage
   * @returns
   */

  public getData(key: string, storageType: STORAGE = STORAGE.LOCAL): string {
    //check if is available in data cache
    const dataCache = this.dataCache;
    console.log("dataCache.get(key)", dataCache.get(key), dataCache.has(key));
    if (dataCache.has(key)) return dataCache.get(key) || "";

    let data;
    //Check if it is available in local or session
    if (storageType == STORAGE.LOCAL) {
      data = localStorage.getItem(key);
    } else {
      data = sessionStorage.getItem(key);
    }

    if (data) {
      dataCache.set(key, data);
      return data;
    }
    warn("No key avaialable ::  ", key);
    return "";
  }
  /**
   *  Setter for data to map key with data
   * @param key key to access data
   * @param data data for the same
   */
  public setData(
    key: string,
    data: string,
    storageType: STORAGE = STORAGE.LOCAL
  ) {
    console.log(key, data);
    this.dataCache.set(key, data);
    //checking for local and seession storage to store
    switch (storageType) {
      case STORAGE.LOCAL:
        localStorage.setItem(key, data);
        break;
      case STORAGE.SESSION:
        sessionStorage.setItem(key, data);
        break;
    }
  }
}
