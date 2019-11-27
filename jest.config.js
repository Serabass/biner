module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    verbose: false,
    testMatch: [
        "**/__tests__/**/*.[jt]s?(x)",
        "**/?(*.)+(spec|test).[jt]s?(x)"
    ]
};
