// Web-safe storage adapter for zustand persist.
// MMKV is native-only; on Web we fall back to localStorage.
export type KV = {
  getString: (name: string) => string | null;
  set: (name: string, value: string) => void;
  delete: (name: string) => void;
};

export function createStorageAdapter(): KV {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { MMKV } = require('react-native-mmkv');
    const mmkv = new MMKV();
    return {
      getString: (name) => mmkv.getString(name) ?? null,
      set: (name, value) => mmkv.set(name, value),
      delete: (name) => mmkv.delete(name),
    };
  } catch {
    // Web / SSR fallback
    const hasLS = typeof localStorage !== 'undefined';
    return {
      getString: (name) => (hasLS ? localStorage.getItem(name) : null),
      set: (name, value) => {
        if (hasLS) localStorage.setItem(name, value);
      },
      delete: (name) => {
        if (hasLS) localStorage.removeItem(name);
      },
    };
  }
}