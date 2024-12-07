export default [
  {
    files: ["**/*.js", "**/*.jsx"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true, // JSX 지원
        },
      },
    },
    rules: {
      "no-unused-vars": "warn",
    },
  },
];