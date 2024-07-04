import type { LocalizationLibrary } from "#wayz/lib/components/Localization";
import { stripIndent } from "#wayz/lib/util/string";

const commands: LocalizationLibrary["commands"] = {
    help: {
        description: "melihat cara penggunaan perintah",
        commandHelpAll(commandList: string): string {
            return stripIndent`
                Hei kamu ! Apa yang bisa aku bantu ?
                Coba ketik salah satu perintah dibawah ini.

                ${commandList}
            `;
        },
        commandHelpOne(name: string, description: string, argument: string): string {
            return stripIndent`
                Perintah: ${name}
                Deskripsi: ${description}
                Argumen:
                ${argument}
            `;
        }
    },
    echo: {
        description: "mengatakan kembali apa yang kamu katakan"
    },
    eval: {
        description: "menjalankan javascript code"
    },
    language: {
        description: "mengubah bahasa yang digunakan",
        commandLanguageSet(lang: string): string {
            return `Bahasa di ubah ke *${lang}*`;
        }
    },
    ping: {
        description: "memastikan apakah bot hidup apa tidak"
    },
    hastebin: {
        description: "mengupload text yang dimasukan ke haste server"
    }
};

const cmdExecutor: LocalizationLibrary["cmdExecutor"] = {
    cooldown(remain: string): string {
        return `Tolong bersabar, kamu bisa menggunakan perintah ini dalam ${remain}`;
    }
};

const error: LocalizationLibrary["error"] = {
    argument: {
        less(expected: number, found: number): string {
            return `Argumen kurang dari *${expected}*, seharusnya *${found}*`;
        },

        notmatch(type: string): string {
            return `Argumen yang kamu masukan tidak valid, argumen harus ber-tipe *${type}*`;
        }
    },

    colllection: {
        notFound(from: string, where: string): string {
            return `*${where}* tidak dapat ditemukan dalam *${from}*`;
        }
    }
};

export default {
    commands,
    cmdExecutor,
    error
};
