# 树状规划（PTC）预设 · 卸载脚本
# 用法：右键「使用 PowerShell 运行」；或 powershell -ExecutionPolicy Bypass -File .\卸载.ps1
[CmdletBinding()]
param(
  [string]$ProfileDir
)

$ErrorActionPreference = 'Stop'
$pluginName = '@local/dsh-tree-plan-preset'
$pluginFolderName = 'dsh-tree-plan-preset'

function Write-Step([string]$t) { Write-Host "-> $t" -ForegroundColor Cyan }
function Write-Ok([string]$t)   { Write-Host "[OK] $t" -ForegroundColor Green }
function Fail([string]$t) { Write-Host "[X] $t" -ForegroundColor Red; exit 1 }
function Read-Json([string]$path) {
  $text = [System.IO.File]::ReadAllText($path, (New-Object System.Text.UTF8Encoding($false)))
  return ($text | ConvertFrom-Json)
}
function Write-Json($obj, [string]$path) {
  $text = $obj | ConvertTo-Json -Depth 32
  [System.IO.File]::WriteAllText($path, $text, (New-Object System.Text.UTF8Encoding($false)))
}

$dshHome = if ($env:DSH_HOME) { $env:DSH_HOME } else { Join-Path $env:USERPROFILE '.dsh' }
if (-not $ProfileDir) {
  $root = Join-Path $dshHome 'profiles'
  $candidates = @(Get-ChildItem $root -Directory -ErrorAction SilentlyContinue | Where-Object { Test-Path (Join-Path $_.FullName 'package.json') })
  $desktop = @($candidates | Where-Object { $_.Name -eq 'desktop' })
  if ($desktop.Count -gt 0) { $ProfileDir = $desktop[0].FullName }
  elseif ($candidates.Count -eq 1) { $ProfileDir = $candidates[0].FullName }
  else { Fail '找到多个 profile，无法自动判断。请加参数 -ProfileDir。' }
}
$pkgPath = Join-Path $ProfileDir 'package.json'
if (-not (Test-Path $pkgPath)) { Fail "该 profile 里没有 package.json：$pkgPath" }
Write-Step "目标 profile：$ProfileDir"

# 1. 从 package.json 里摘掉预设
Copy-Item $pkgPath ($pkgPath + '.bak-tree-plan') -Force
$json = Read-Json $pkgPath
if ($json.dependencies -and ($json.dependencies.PSObject.Properties.Name -contains $pluginName)) {
  $json.dependencies.PSObject.Properties.Remove($pluginName)
  Write-Ok '已移除依赖项'
}
if ($json.dsh -and $json.dsh.profile -and ($json.dsh.profile.PSObject.Properties.Name -contains 'bundles')) {
  $kept = @(@($json.dsh.profile.bundles) | Where-Object { $_ -ne $pluginName })
  $json.dsh.profile.bundles = $kept
  Write-Ok '已从 bundles 里移除'
}
Write-Json $json $pkgPath

# 2. 删掉 node_modules 里的链接
$linkPath = Join-Path $ProfileDir ('node_modules\@local\' + $pluginFolderName)
if (Test-Path $linkPath) {
  $item = Get-Item $linkPath -Force
  if ($item.Attributes -band [IO.FileAttributes]::ReparsePoint) { cmd /c rmdir "$linkPath" | Out-Null }
  else { Remove-Item $linkPath -Recurse -Force }
  Write-Ok "已删除链接：$linkPath"
}

# 3. 删掉插件本体
$installRoot = Join-Path $dshHome ('local-plugins\' + $pluginFolderName)
if (Test-Path $installRoot) {
  Remove-Item $installRoot -Recurse -Force
  Write-Ok "已删除插件文件：$installRoot"
}

Write-Host ''
Write-Host '卸载完成。完全退出 DSH 再重新打开即可。' -ForegroundColor Green
