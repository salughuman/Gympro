const pngToIco = require('png-to-ico').default;
const fs = require('fs');
const packager = require('electron-packager');
const electronInstaller = require('electron-winstaller');
const path = require('path');

async function build() {
    try {
        console.log("Converting icon...");
        const buf = await pngToIco('assets/icon.png');
        fs.writeFileSync('assets/icon.ico', buf);
        console.log("Icon converted successfully.");

        console.log("Packaging app...");
        const appPaths = await packager({
            dir: '.',
            name: 'GymPro',
            platform: 'win32',
            arch: 'x64',
            icon: 'assets/icon.ico',
            out: 'release',
            overwrite: true,
            asar: true,
            ignore: [
                /^\/node_modules\/electron-builder/,
                /^\/node_modules\/electron-packager/,
                /^\/node_modules\/electron-winstaller/,
                /^\/src/,
                /^\/\.gitignore/,
                /^\/eslint\.config\.js/,
                /^\/vite\.config\.js/,
                /^\/README\.md/,
                /^\/build-win\.js/,
                /^\/release/
            ]
        });

        console.log(`App packaged successfully at: ${appPaths[0]}`);

        console.log("Creating Windows installer...");
        await electronInstaller.createWindowsInstaller({
            appDirectory: appPaths[0],
            outputDirectory: 'release/installer',
            authors: 'GymPro',
            exe: 'GymPro.exe',
            setupIcon: 'assets/icon.ico',
            noMsi: true,
            setupExe: 'GymPro-Setup.exe'
        });

        console.log("Installer created successfully at release/installer/GymPro-Setup.exe");
    } catch (e) {
        console.error("Build failed:", e);
        process.exit(1);
    }
}

build();
