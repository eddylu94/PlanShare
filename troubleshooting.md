# Troubleshooting

## Cannot run .ts files in server

If the following error appears:

```
[ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /app/src/App.ts
```

Remove the following from `package.json`:

```
"type": "module"
```

and ensure that the following exists in `tsconfig.json`:

```
"compilerOptions": {
  "module": "CommonJS"
}
```

Reference: [Stack Overflow](https://stackoverflow.com/questions/62096269/cant-run-my-node-js-typescript-project-typeerror-err-unknown-file-extension)
