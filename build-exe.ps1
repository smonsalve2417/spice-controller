$ErrorActionPreference = 'Stop'

npm run build

if (-not (Get-Command pyinstaller -ErrorAction SilentlyContinue)) {
    throw "PyInstaller no esta instalado. Ejecuta: python -m pip install -r requirements-build.txt"
}

Remove-Item -Recurse -Force build, release -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Path release | Out-Null

pyinstaller --noconfirm --clean --onefile --name SpiceControllerServer `
    --add-data "dist;dist" `
    --distpath release `
    server.py

Write-Host "Ejecutable creado en release\SpiceControllerServer.exe"