declare const __DEV__: boolean | undefined;

const warned = new Set<string>();

/**
 * True in React Native / Expo development builds. Guarded with typeof so it
 * also works where the bundler doesn't define __DEV__ (tests, plain web).
 */
export function isDev(): boolean {
  return typeof __DEV__ !== "undefined" && !!__DEV__;
}

/** One console warning per key per session, in development only. */
export function warnOnce(key: string, message: string): void {
  if (!isDev() || warned.has(key)) return;

  warned.add(key);
  console.warn(`[responsive-rn] ${message}`);
}

/**
 * Flags use of a 1.x API. They keep working throughout 2.x and are removed
 * in 3.0.
 */
export function warnDeprecated(key: string, message: string): void {
  warnOnce(`deprecated:${key}`, `${message} (deprecated in 2.0, removed in 3.0)`);
}

/**
 * Adds deprecated fields as non-enumerable getters: reading one still works
 * (and warns once), but they don't show up when the object is spread,
 * logged or serialized.
 */
export function defineDeprecated<T extends object, D extends object>(
  target: T,
  fields: { [K in keyof D]: { get: () => D[K]; message: string } },
): T & D {
  for (const key of Object.keys(fields) as Array<keyof D & string>) {
    const { get, message } = fields[key];

    Object.defineProperty(target, key, {
      enumerable: false,
      configurable: true,
      get() {
        warnDeprecated(`field:${key}`, message);
        return get();
      },
    });
  }

  return target as T & D;
}
