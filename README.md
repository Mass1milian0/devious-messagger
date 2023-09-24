# Devious Messager Server

## Description

this is a server for the devious messager mod
it handles the communication between clients and the server

## Installation
this is a nodejs project so you need to have nodejs installed
you can download it from [here](https://nodejs.org/en/download/)
after you have installed nodejs you need to install the dependencies
you can do that by running the following command in the project directory
```bash
npm install
```
after that you need to create a .env file in the project directory which contains the following variables
```env
DISCORD_TOKEN: # your discord bot token
CLIENTID: # your discord bot client id
GUILDID: # your discord guild id
```

## Usage
to start the server you need to run the following command in the project directory
```bash
npm start
```

## Configurations
you can change the port the server is running on by changing the PORT variable in the .env file
```env
PORT: # the port the server is running on
```
also the server will read a file called "chatMap.json" which contains the mapping between the discord channels
identifiers and their corresponding ids

```json
[
    {
        "name": "my identifier",
        "channelId": "123456789012345678"
    }
]
```
do note that the name is case sensitive and has to be the same as the one configured in the mod

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[GNU GPLv3](https://choosealicense.com/licenses/gpl-3.0/)