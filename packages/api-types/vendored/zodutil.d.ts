import { z } from 'zod';
/** Build a Zod enum from a readonly taxonomy array. */
export declare function enumOf<T extends string>(values: ReadonlyArray<T>): z.ZodEnum<[T, ...T[]]>;
//# sourceMappingURL=zodutil.d.ts.map