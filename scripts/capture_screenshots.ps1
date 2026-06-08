Param(
  [string]$name = $(Get-Date -Format "yyyyMMdd-HHmmss")
)

# Comprueba que adb esté disponible
if (-not (Get-Command adb -ErrorAction SilentlyContinue)) {
  Write-Error "adb no está en PATH. Instala Android SDK Platform-Tools y añade adb al PATH."
  exit 1
}

$screenshotsDir = Join-Path -Path (Split-Path -Parent $MyInvocation.MyCommand.Definition) -ChildPath "..\assets\docs\screenshots"
$screenshotsDir = (Resolve-Path $screenshotsDir).ProviderPath
if (-not (Test-Path $screenshotsDir)) { New-Item -ItemType Directory -Path $screenshotsDir -Force | Out-Null }

$remoteTemp = "/sdcard/screenshot.png"
$destFile = Join-Path $screenshotsDir ("screenshot-$name.png")

Write-Host "Capturando pantalla en dispositivo/emulador..." -ForegroundColor Cyan
adb shell screencap -p $remoteTemp
adb pull $remoteTemp `"$destFile`"
adb shell rm $remoteTemp

if (Test-Path $destFile) {
  Write-Host "Captura guardada en: $destFile" -ForegroundColor Green
} else {
  Write-Error "Error al obtener la captura. Comprueba que el dispositivo/emulador está conectado y adb funciona."
}
