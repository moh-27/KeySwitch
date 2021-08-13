const { app, BrowserWindow, globalShortcut, ipcMain, Menu, clipboard, Tray } = require('electron')
const { readFileSync, writeFileSync, existsSync } = require('fs');
var robot = require("robotjs");

//require('electron-reload')(__dirname);
//const debug = require('electron-debug');
//debug();

//const { FORMERR } = require('dns');
// { settings } = require('cluster');
const { convert } = require('./converter.js');
const { settings } = require('cluster');

//start
let win;
let curSettings;
let curLayout;
let usedLangs;
let tray = null;


function createWindow() {
    win = new BrowserWindow({
        //width: 1100,
        //height: 500,
        useContentSize: true,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        }
    })
    win.removeMenu()
    win.loadFile('src/style/index.html');

}

app.whenReady().then(() => {
    createWindow();

})



app.on('ready', () => {
    setSettings(getDefaultSettings());
    curSettings = getDefaultSettings();
    //start app with the last used settings 


    tray = new Tray('src/style/icon/icon.png')

    const contextMenu = Menu.buildFromTemplate([
        { label: 'Open', type: 'normal', click: () => win.show() },
        { label: 'Minimize', type: 'normal', click: () => win.minimize() },
        { label: 'Hide', type: 'normal', click: () => win.hide() },
        { label: 'Exist', type: 'normal', role: "quit" }
    ])
    tray.setToolTip('Layout Switcher')
    tray.setContextMenu(contextMenu)

    tray.on('click', () => {
        win.isVisible() ? win.hide() : win.show()
    })

})

ipcMain.on('defSetting', (event) => {
    event.reply('getDefSettings', getDefaultSettings())
})

// return the default settings / from settings.json file
function getDefaultSettings() {
    let defset = [{
            "name": "conv_selected",
            "active": true,
            "shortcut": "CmdOrCtrl+Q "
        },
        {
            "name": "conv_line",
            "active": true,
            "shortcut": "CmdOrCtrl+W "
        },
        {
            "name": "startup",
            "active": false
        },
        {
            "name": "conv_undefined",
            "undefinedCharOption": "Delete"
        },
        {
            "firstLang": "ar",
            "secondLang": "en"
        }
    ];
    let settings;
    let path = app.getPath("userData") + "\\storage\\settings.json";
    if (existsSync(path)) {
        settings = JSON.parse(readFileSync(app.getPath("userData") + "\\storage\\settings.json"));
    } else {
        writeFileSync(app.getPath("userData") + "\\storage\\settings.json", JSON.stringify(defset));
        settings = JSON.parse(readFileSync(app.getPath("userData") + "\\storage\\settings.json"));
    };

    return settings;
}


ipcMain.on('curLayout', (event, newCurLayout, newCurLangs) => {
    curLayout = newCurLayout
    usedLangs = newCurLangs
})


// Set the new settings and remove the previous
function setSettings(settings) {

    globalShortcut.unregisterAll()

    for (let set of settings) {
        if (set.shortcut && set.active) { //For the first 2 objects in settings
            if (set.name == "conv_selected") {
                globalShortcut.register(set.shortcut, () => {
                    robot.keyTap('x', "control")
                    const text = clipboard.readText()
                    let conv = convert(text, curLayout, settings[3].undefinedCharOption) // contain [reverse, and lang's number converted from]
                    clipboard.writeText(conv[0])
                    robot.keyTap('v', "control")
                    win.webContents.send('newText', text, conv[0], conv[1])
                })
            } else if (set.name == "conv_line") {
                globalShortcut.register(set.shortcut, () => {
                    robot.keyTap('home')
                    robot.keyTap('end', "shift")
                    robot.keyTap('x', "control")
                    const text = clipboard.readText()
                    let conv = convert(text, curLayout, settings[3].undefinedCharOption)
                    clipboard.writeText(conv[0])
                    robot.keyTap('v', "control")
                    win.webContents.send('newText', text, conv[0], conv[1])
                })
            }
        }
    }
}

// Activate and deactivate shortcuts
ipcMain.on('activate-setting', (event, setName) => {

    for (let set of curSettings) {
        if (set.name == setName) {
            set.active = true;
        }
    }
    setSettings(curSettings);
})
ipcMain.on('deactivate-setting', (event, setName) => {

    for (let set of curSettings) {
        if (set.name == setName) {
            set.active = false;
        }
    }
    setSettings(curSettings);
})

// Update shortcut keys
ipcMain.on('update-shortcutKeys', (event, setName, newShortcut) => {

    for (let set of curSettings) {
        if (set.name == setName) {
            set.shortcut = newShortcut;
        }
    }
    setSettings(curSettings);
})

//Update for convert undefined character
ipcMain.on('update-undefinedCharOption', (event, setName, selectedOpt) => {
    for (let set of curSettings) {
        if (set.name == setName) {
            set.undefinedCharOption = selectedOpt;
        }
    }
})


//Update default settings JSON
function UpdateDefSettings(setting) {

    setting[setting.length - 1].firstLang = usedLangs[0];
    setting[setting.length - 1].secondLang = usedLangs[1];

    let data = JSON.stringify(setting);

    writeFileSync(app.getPath("userData") + "\\storage\\settings.json", data);

}




app.on('will-quit', () => {
    UpdateDefSettings(curSettings)
    globalShortcut.unregisterAll()
})



app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})