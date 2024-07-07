import type { LocalizationLibrary } from "#wayz/lib/components/Localization";
import type { TypeCollection } from "#wayz/lib/structures/ArgumentParserOption";

/**
 * The error type
 */
export type CustomErrorTypeSchema = {
    ArgsError: {
        Less: { expected: number; found: number; };
        NotMatch: { expected: keyof TypeCollection; };
    };
    CollectionError: {
        NotFound: { from: string; where: string; };
    };
};

type t = {
    [K in keyof CustomErrorTypeSchema as `${K}.${Exclude<keyof CustomErrorTypeSchema[K], symbol>}`]: never
};

type CustomErrorType = {
    [K in keyof t]: K extends `${infer A}.${infer B}`
        ? A extends keyof CustomErrorTypeSchema
            ? B extends keyof CustomErrorTypeSchema[A]
                ? CustomErrorTypeSchema[A][B]
                : never
            : never
        : never;
};

/**
 * the error constructor
 */
export default class CustomError<M extends keyof CustomErrorType, A extends CustomErrorType[M]> extends Error {
    public value;

    /**
     * to create new error instance
     *
     * @param message - the error message
     * @param value - the error value
     */
    public constructor(message: M, value: A) {
        super(message as string);
        this.name = "CustomError";
        this.value = value as Record<string, unknown>;
    }

    /**
     * get localized error message
     *
     * @param localization - The localization libs
     */
    public toLocalizeString(localization: LocalizationLibrary): string {
        switch (this.message as keyof CustomErrorType) {
            case "ArgsError.Less": return localization.error.argument.less(this.value.expected as number, this.value.found as number);
            case "ArgsError.NotMatch": return localization.error.argument.notmatch(this.value.expected as keyof TypeCollection);
            case "CollectionError.NotFound": return localization.error.colllection.notFound(this.value.from as string, this.value.where as string);
            default: return "";
        }
    }
}
