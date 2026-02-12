import {app, BrowserWindow, nativeImage, Tray, Menu} from 'electron'
import { create } from 'node:domain';
import fs from 'node:path';
import path from 'node:path';

let mainWindow: BrowserWindow | null = null
let splashWindow: BrowserWindow | null = null
let aboutWindow: BrowserWindow | null = null
let tray: Tray | null = null

const createMainWindow = () => {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 600,
        minWidth: 800,
        minHeight: 600,
        resizable: true,
        transparent: false,
        frame: true,
        backgroundColor: '#1a1b26',
        title: 'TaskBox - Acceuil',
        icon: path.join(__dirname, '../assets/icon.ico'),
        webPreferences: {
            nodeIntegration: true,
        }
    })

    if (mainWindow) {
        mainWindow.loadFile(path.join(__dirname, '../../src/renderer/index.html'))
    }

    mainWindow.on('ready-to-show', () => setTimeout(() => createAboutWindow(), 500))
}

const createSplashWindow = () => {
    splashWindow = new BrowserWindow({
        width: 400,
        height: 400,
        resizable: false,
        title: 'splash',
        frame: false,
        transparent: true,
        webPreferences: {
            nodeIntegration: true,
        }
    })

    if (splashWindow) {
        splashWindow.loadFile(path.join(__dirname, '../../src/renderer/splash.html'))
    }
}

const createAboutWindow = () => {
    if (!mainWindow) return;
    
    aboutWindow = new BrowserWindow({
        width: 600,
        height: 600,
        resizable: false,
        backgroundColor: '#1a1b26',
        parent: mainWindow,
        modal: true,
        icon: path.join(__dirname, '../assets/icon.ico'),
        webPreferences: {
            nodeIntegration: true
        }
    })

    if (aboutWindow) {
        aboutWindow.loadFile(path.join(__dirname, '../../src/renderer/about.html'))
    }
}

const createTray = () => {
    tray = new Tray(path.join(__dirname, '../assets/icon.ico'))
    const menu = Menu.buildFromTemplate([
        { label: 'Afficher TaskBox', click: () => mainWindow?.show() },
        { label: 'Quitter', click: () => app.quit() }
    ])

    tray.setToolTip('TaskBox')
    tray.setContextMenu(menu)
}

app.whenReady().then(() => {
    createSplashWindow();

    setTimeout(() => {
        splashWindow?.close()
        createMainWindow()
        createTray()
    }, 3000)
})