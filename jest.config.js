module.exports = {
  testTimeout: 60000,
  projects: [
    {
      displayName: 'Admin Angular',
      preset: 'jest-preset-angular',
      setupFilesAfterEnv: ['<rootDir>/jest.renderer.setup.ts'],
      testMatch: ['<rootDir>/src/renderer/admin/**/*.spec.ts', '<rootDir>/src/renderer/shared/**/*.spec.ts'],
      testEnvironment: 'jsdom',
      transform: {
        '^.+\\.(ts|js|html)$': [
          'jest-preset-angular',
          {
            tsconfig: '<rootDir>/tsconfig.spec.json',
            stringifyContentPathRegex: '\\.html$',
          },
        ],
      },
      moduleNameMapper: {
        '@app/(.*)': '<rootDir>/src/renderer/$1',
        '@src/(.*)': '<rootDir>/src/$1',
      }
    },
    {
      displayName: 'Client Angular',
      preset: 'jest-preset-angular',
      setupFilesAfterEnv: ['<rootDir>/jest.renderer.setup.ts'],
      testMatch: ['<rootDir>/src/renderer/client/**/*.spec.ts'],
      testEnvironment: 'jsdom',
      transform: {
        '^.+\\.(ts|js|html)$': [
          'jest-preset-angular',
          {
            tsconfig: '<rootDir>/tsconfig.spec.json',
            stringifyContentPathRegex: '\\.html$',
          },
        ],
      },
      moduleNameMapper: {
        '@app/(.*)': '<rootDir>/src/renderer/$1',
        '@src/(.*)': '<rootDir>/src/$1',
      }
    },
    {
      displayName: 'Electron',
      setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
      testMatch: ['<rootDir>/src/main/**/*.spec.ts'],
      transform: {
        '^.+\\.ts$': ['ts-jest', {
          tsconfig: '<rootDir>/tsconfig.spec.json'
        }]
      },
      testEnvironment: 'node'
    }
  ],
  moduleFileExtensions: ['ts', 'js', 'json'],
  transformIgnorePatterns: [
    'node_modules/(?!@angular|rxjs)'
  ],
  verbose: true
}
