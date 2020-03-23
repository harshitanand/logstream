# Tail Log Streaming Service

`logstream` is a Node.js streaming cli web app demon used to stream logs to the browser. It uses nodejs event model extensively to watch for file changes & then streaming logs to client app via websockets.

## Aproaches

### Using fs.watchfile (Not Recommended)

- The built-in fs-watchFile method seems like a logical choice to watch for changes in our log file. The callback listener will be invoked each time the file is changed.
- You may observe a delay between the time you make the change to the log file and the time you see the listener call the code and print to the console. Why? The fs.watchFile method polls for file changes every 5.007 seconds by default.
- Node: the fs-watchFile documentation indicates that the callback listener will be invoked each time the file is accessed.

### Using fs.watch

- A much better option for watching files is to use fs.watch. Whereas fs.watchFile ties up system resources conducting file polling, fs.watch relies on the underlying operating system to provide a way to be notified of filesystem changes.
- As cited in the documentation, Node uses inotify on Linux systems, FSEvents on macOS, and ReadDirectoryChangesW on Windows to receive asynchronous notifications whenever files change (in lieu of synchronous file polling).
- The performance gains of fs.watch become even more significant when watching for file changes in entire directories since the first argument supplied can be either a specific file or a directory.

### Using fs.watch with Debounce & md5Checksum

- A delay of 100 milliseconds appears to work well to emit only one file change event for a given file change while allowing time for multiple file change events to be captured if a file is saved on a fairly frequent basis.
- We can listen for file changes in Node.js and run code in response to those file changes!

## User Stories Covered

- A web page or CLI client which will be used by the user on their machine to display the logs remotely
- The code should be committed to a GitHub repo
- The repo should a README with at least instructions to set up and run the code
- The code should be readable and organized

**Additional**

- Dockerfile configuration to deploy/run any code
- Logs searching
- auto-scrolling
- pausing logs

## Installation options

- download a codebase from [Git](https://github.com/harshitanand/logstream.git)
- using [Docker image](https://cloud.docker.com/repository/docker/whipharsh/taillogstream): `docker run -d -P -v $DIR/log:/appLog whipharsh/taillogstream:stage /appLog/<file>`

## Dependency Resolution, test & Running

- If you have cloned codebase from git, you need to install project dependency throught `npm install` or `yarn`
- You can run the demon from `./logstream <log-file-path>`
- To test the app you can run this via `./logstream nginx_logs.log`
- By default you can see application at http://localhost:50051

## Usage

    ./logstream [options] file

    Options:

      -V, --version                 output the version number
      -h, --host <host>             hostname for app default listen IP, default 0.0.0.0
      -p, --port <port>             port for app default listen socket, default 50051
      -l, --lines <lines>           number on lines stored in browser, default 2000
      -U, --user <username>         Basic Auth username, option works only along with -P option
      -P, --password <password>     Basic Auth password, option works only along with -U option
      -k, --key <key.pem>           Private Key for HTTPS connections on app, option works only along with -c option
      -c, --certificate <cert.pem>  Certificate for HTTPS connections on app, option works only along with -k option
      --url-path <path>             URL route pattern for client app, default /
      --help                        output usage information
