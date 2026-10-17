# Isolated integration checks; no network, scheduled tasks or real Spotify changes.
$ErrorActionPreference = 'Stop'
$testRoot = Join-Path (Split-Path -Parent $PSScriptRoot) ('.updater-test-' + [Guid]::NewGuid().ToString('N').Substring(0, 8))
$originalLocalAppData = $env:LOCALAPPDATA
$originalTestRoot = $env:JUX_TEST_ROOT
New-Item -ItemType Directory -Path "$testRoot\CustomApps\lyrics-plus" -Force | Out-Null
$env:LOCALAPPDATA = "$testRoot\local"
$env:JUX_TEST_ROOT = $testRoot
Set-Content -LiteralPath "$testRoot\config.ini" -Value '[Setting]'
Set-Content -LiteralPath "$testRoot\CustomApps\lyrics-plus\index.js" -Value 'original'
@'
param([switch]$c, [Parameter(Position=0)][string]$Operation)
if ($c) { Join-Path $env:JUX_TEST_ROOT 'config.ini' }
$global:LASTEXITCODE = if ($Operation -eq 'apply' -and $global:JuxTestFailApply) { 1 } else { 0 }
'@ | Set-Content -LiteralPath "$testRoot\fake-spicetify.ps1"
$global:JuxTestSha = 'a' * 40
$global:JuxTestFailApply = $false
$global:JuxTestDownloads = 0
function Get-Command { [pscustomobject]@{ Source = "$testRoot\fake-spicetify.ps1" } }
function Invoke-RestMethod {
    param($Uri, $Headers, $TimeoutSec)
    if ($Uri -match '/releases/latest$') { return @{ tag_name = 'v1.3.0' } }
    return @{ sha = $global:JuxTestSha }
}
function Invoke-WebRequest {
    param($Uri, $OutFile, [switch]$UseBasicParsing, $TimeoutSec)
    $global:JuxTestDownloads++
    $archiveRoot = "$testRoot\archive-$($global:JuxTestSha.Substring(0, 1))"
    $source = "$archiveRoot\spicetify-lyrics-plus-juxtaposed-$($global:JuxTestSha)\lyrics-plus"
    New-Item -ItemType Directory -Path $source -Force | Out-Null
    foreach ($file in @('index.js', 'style.css', 'PlaybarButton.js')) {
        Set-Content -LiteralPath (Join-Path $source $file) -Value "updated-$($global:JuxTestSha)"
    }
    Set-Content -LiteralPath "$source\manifest.json" -Value '{"subfiles":[],"subfiles_extension":["PlaybarButton.js"]}'
    Compress-Archive -Path "$archiveRoot\*" -DestinationPath $OutFile
}
function Assert-True($Condition, $Message) { if (-not $Condition) { throw $Message } }
try {
    $updater = Join-Path $PSScriptRoot 'update.ps1'
    & $updater -CheckOnly
    Assert-True ($global:JuxTestDownloads -eq 0) 'Check-only downloaded files.'
    Assert-True ((Get-Content "$testRoot\CustomApps\lyrics-plus\index.js").Trim() -eq 'original') 'Check-only changed the installation.'
    & $updater
    Assert-True ((Get-Content "$testRoot\CustomApps\lyrics-plus\index.js").Trim() -eq "updated-$($global:JuxTestSha)") 'Update was not installed.'
    Assert-True (Test-Path "$testRoot\CustomApps\lyrics-plus\.juxtaposed-update-sha") 'Successful update not recorded.'
    & $updater
    Assert-True ($global:JuxTestDownloads -eq 1) 'Unchanged release was downloaded again.'
    $oldSha = $global:JuxTestSha
    $global:JuxTestSha = 'b' * 40
    $global:JuxTestFailApply = $true
    $caught = $false
    try { & $updater } catch { $caught = $true }
    Assert-True $caught 'Apply failure did not fail the update.'
    Assert-True ((Get-Content "$testRoot\CustomApps\lyrics-plus\index.js").Trim() -eq "updated-$oldSha") 'Failed update did not restore source files.'
    Assert-True ((Get-Content "$testRoot\CustomApps\lyrics-plus\.juxtaposed-update-sha").Trim() -eq $oldSha) 'Failed release was marked successful.'
    Write-Output 'PASS: check-only, installation, unchanged release, failed apply and rollback.'
} finally {
    $env:LOCALAPPDATA = $originalLocalAppData
    $env:JUX_TEST_ROOT = $originalTestRoot
    # Retain the isolated fixture and backups in Temp for inspection.
}
