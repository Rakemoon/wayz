import type { LocalizationLibrary } from "#wayz/lib/components/Localization";
import type { TypeCollection } from "#wayz/lib/structures/ArgumentParserOption";

/**
 * The error type
 */
export type CustomErrorType = {
    ArgsError: {
        ArgumentLess: { expected: number; found: number; };
        ArgumentTypeNotMatch: { expected: keyof TypeCollection; };
    };
    CollectionError: {
        NotFound: { from: string; where: string; };
    };
};

/**
 * the error constructor
 */
export default class CustomError<I extends keyof CustomErrorType, M extends keyof CustomErrorType[I], A extends CustomErrorType[I][M]> extends Error {
    public value;

    /**
     * to create new error instance
     *
     * @param type - the error type
     * @param message - the error message
     * @param value - the error value
     */
    public constructor(type: I, message: M, value: A) {
        super(message as string);
        this.name = "CustomError";
        this.name = type;
        this.value = value as Record<string, unknown>;
    }

    /**
     * get localized error message
     *
     * @param localization - The localization libs
     */
    public toLocalizeString(localization: LocalizationLibrary): string {
        switch (this.name as keyof CustomErrorType) {
            case "ArgsError": return this.localizeArgsError(localization);
            case "CollectionError": return this.localizeCollectionError(localization);
            default: return "";
        }
    }

    /**
     * get localized ArgsError message
     *
     * @param localization - The localization libs
     */
    private localizeArgsError(localization: LocalizationLibrary): string {
        switch (this.message as keyof CustomErrorType["ArgsError"]) {
            case "ArgumentLess": return localization.error.argument.less(this.value.expected as number, this.value.found as number);
            case "ArgumentTypeNotMatch": return localization.error.argument.notmatch(this.value.expected as string);
            default: return "";
        }
    }

    /**
     * get localized CollectionError message
     *
     * @param localization - The localization libs
     */
    private localizeCollectionError(localization: LocalizationLibrary): string {
        switch (this.message as keyof CustomErrorType["CollectionError"]) {
            case "NotFound": return localization.error.colllection.notFound(this.value.from as string, this.value.where as string);
            default: return "";
        }
    }
}
