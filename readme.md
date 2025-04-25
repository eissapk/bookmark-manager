> CLI Tool to for managing bookmarks (requires node14)

# Linux
##### Get started
```
cd /path/to/project # navigate to project folder
npm i # install modules
cp node_modules -r /path/to/project/node/linux # copy modules
cp ~/.nvm/versions/node/v14.0.0/bin/node /path/to/project/node/linux # copy node binary file
```

##### Final Structure
```
├── add.js
├── app.bat
├── app.sh
├── config.js
├── credentials.json
├── db.json
├── delete.js
├── get.js
├── index.js
├── node
│   ├── linux
│   │   ├── node
│   │   └── node_modules
│   ├── mac
│   │   ├── node
│   │   └── node_modules
│   └── win
│       ├── node.exe
│       └── node_modules
├── olum.js
├── package.json
├── readme.md
└── update.js
```

##### Make project portable
> copy the final structure to a USB flash and add alias in your .bashrc

##### copy project to usb flash
```
cp /path/to/project -r /path/to/usb-flash
```

##### add alias on OS

```
alias book='node /path/to/usb-flash/index.js'
```

##### run it using alias anywhere on your OS

```
book --help
book --version
```

##### run it from usb-flash (portable)

```
/path/to/usb-flash/node/linux/node index.js -h
```

##### Useful commands using `book` alias

```
book get # lists all bookmarks in db.json file
book get --id 2 # show acccount with id 2
book get --name google # show acccount with name google
book add --name google --section general --url www.google.com # saves bookmark for google
```

##### Create master password

```
node config.js
```