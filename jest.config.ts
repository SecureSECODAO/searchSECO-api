import type { Config } from "@jest/types";

const Config: Config.InitialOptions = {
    verbose: true,
    transform: {
        "^.+\\.tsx?$": "ts-jest",
    },
    modulePathIgnorePatterns: ["<rootDir>/dist/", "<rootDir>/.tmp"],

    setupFiles: ["<rootDir>/src/tests/setup/setup.ts"],
};

export default Config;
