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

References:

[Can't run my Node.js Typescript project TypeError (Stack Overflow)](https://stackoverflow.com/questions/62096269/cant-run-my-node-js-typescript-project-typeerror-err-unknown-file-extension)

## RpcIpcMessagePortClosedError

If the following error appears:

```
/node_modules/react-scripts/scripts/build.js:19
  throw err;
  ^

RpcIpcMessagePortClosedError: Process 21317 exited [SIGKILL].
    at /root/Project%203632/client/node_modules/fork-ts-checker-webpack-plugin/lib/rpc/rpc-ipc/RpcIpcMessagePort.js:19:23
    at Generator.next (<anonymous>)
    at /root/Project%203632/client/node_modules/fork-ts-checker-webpack-plugin/lib/rpc/rpc-ipc/RpcIpcMessagePort.js:8:71
    at new Promise (<anonymous>)
    at __awaiter (/root/Project%203632/client/node_modules/fork-ts-checker-webpack-plugin/lib/rpc/rpc-ipc/RpcIpcMessagePort.js:4:12)
    at ChildProcess.handleExit (/root/Project%203632/client/node_modules/fork-ts-checker-webpack-plugin/lib/rpc/rpc-ipc/RpcIpcMessagePort.js:18:42)
    at ChildProcess.emit (events.js:376:20)
    at Process.ChildProcess._handle.onexit (internal/child_process.js:277:12) {
  code: null,
  signal: 'SIGKILL'
}
error Command failed with exit code 1.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
```

and the current Node version is version 17, then the solution may be to downgrade from Node version 17 to version 16

References:

[react-scripts fails to build project with Node 17 (GitHub)](https://github.com/facebook/create-react-app/issues/11562)
