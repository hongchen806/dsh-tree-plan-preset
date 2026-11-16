# 树状规划（PTC）预设 · 安装脚本
# 用法：右键「使用 PowerShell 运行」；或在 PowerShell 里执行 powershell -ExecutionPolicy Bypass -File .\安装.ps1
[CmdletBinding()]
param(
  [string]$ProfileDir,
  [string]$InstallRoot,
  [switch]$SkipJunction
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
function Remove-Link([string]$path) {
  $item = Get-Item $path -Force
  if ($item.Attributes -band [IO.FileAttributes]::ReparsePoint) { cmd /c rmdir "$path" | Out-Null }
  else { Remove-Item $path -Recurse -Force }
}

$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$srcPlugin = Join-Path $here 'plugin'
if (-not (Test-Path (Join-Path $srcPlugin 'package.json'))) {
  Fail '安装包不完整：缺少 plugin\package.json。请先把 zip 完整解压，再在解压后的文件夹里运行本脚本。'
}

# 1. 定位 DSH 数据目录
$dshHome = if ($env:DSH_HOME) { $env:DSH_HOME } else { Join-Path $env:USERPROFILE '.dsh' }
if (-not (Test-Path $dshHome)) { Fail "找不到 DSH 数据目录：$dshHome。请先启动一次 DSH 桌面版再运行。" }
Write-Step "DSH 数据目录：$dshHome"

# 2. 定位 profile
if (-not $ProfileDir) {
  $root = Join-Path $dshHome 'profiles'
  $candidates = @(Get-ChildItem $root -Directory -ErrorAction SilentlyContinue | Where-Object { Test-Path (Join-Path $_.FullName 'package.json') })
  $desktop = @($candidates | Where-Object { $_.Name -eq 'desktop' })
  if ($desktop.Count -gt 0) { $ProfileDir = $desktop[0].FullName }
  elseif ($candidates.Count -eq 1) { $ProfileDir = $candidates[0].FullName }
  else { Fail '找到多个 profile，无法自动判断。请加参数，例如：.\安装.ps1 -ProfileDir "$env:USERPROFILE\.dsh\profiles\desktop"' }
}
$pkgPath = Join-Path $ProfileDir 'package.json'
if (-not (Test-Path $pkgPath)) { Fail "该 profile 里没有 package.json：$pkgPath" }
Write-Step "目标 profile：$ProfileDir"

if (-not $InstallRoot) { $InstallRoot = Join-Path $dshHome ('local-plugins\' + $pluginFolderName) }
Write-Step "插件存放位置：$InstallRoot"

# 3. 复制插件本体
if (Test-Path $InstallRoot) {
  $existing = Get-Item $InstallRoot -Force
  if ($existing.Attributes -band [IO.FileAttributes]::ReparsePoint) { Fail "插件存放位置是一个快捷链接，请先手动删除：$InstallRoot" }
  Remove-Item $InstallRoot -Recurse -Force
}
New-Item -ItemType Directory -Path $InstallRoot -Force | Out-Null
Copy-Item (Join-Path $srcPlugin '*') $InstallRoot -Recurse -Force
Write-Ok "已复制插件文件到 $InstallRoot"

# 4. 合并 profile 的 package.json（先备份）
Copy-Item $pkgPath ($pkgPath + '.bak-tree-plan') -Force
$json = Read-Json $pkgPath

if (-not ($json.PSObject.Properties.Name -contains 'dsh')) {
  Fail 'profile 的 package.json 里没有 dsh 配置段，与本预设要求的版本不匹配。未做任何修改。'
}
if (-not ($json.PSObject.Properties.Name -contains 'dependencies')) {
  $json | Add-Member -NotePropertyName 'dependencies' -NotePropertyValue (New-Object psobject)
}
$linkSpec = 'link:' + ($InstallRoot -replace '\\', '/')
if ($json.dependencies.PSObject.Properties.Name -contains $pluginName) {
  $json.dependencies.$pluginName = $linkSpec
} else {
  $json.dependencies | Add-Member -NotePropertyName $pluginName -NotePropertyValue $linkSpec
}

if (-not ($json.dsh.PSObject.Properties.Name -contains 'profile')) {
  $json.dsh | Add-Member -NotePropertyName 'profile' -NotePropertyValue (New-Object psobject)
}
$bundles = @()
if ($json.dsh.profile.PSObject.Properties.Name -contains 'bundles') {
  $bundles = @(@($json.dsh.profile.bundles) | Where-Object { $_ })
}
if ($bundles -contains $pluginName) {
  Write-Ok 'profile 已登记本预设，无需重复添加'
} else {
  $newBundles = @($bundles) + $pluginName
  if ($json.dsh.profile.PSObject.Properties.Name -contains 'bundles') { $json.dsh.profile.bundles = $newBundles }
  else { $json.dsh.profile | Add-Member -NotePropertyName 'bundles' -NotePropertyValue $newBundles }
  Write-Ok '已把预设登记进 profile 的 bundles'
}

Write-Json $json $pkgPath
Write-Ok '已更新 package.json（原文件备份为 package.json.bak-tree-plan）'

# 5. 在 node_modules 里建立链接，让 DSH 启动即可加载
if (-not $SkipJunction) {
  $nmDir = Join-Path $ProfileDir 'node_modules\@local'
  New-Item -ItemType Directory -Path $nmDir -Force | Out-Null
  $linkPath = Join-Path $nmDir $pluginFolderName
  if (Test-Path $linkPath) { Remove-Link $linkPath }
  try {
    New-Item -ItemType Junction -Path $linkPath -Target $InstallRoot -ErrorAction Stop | Out-Null
    Write-Ok "已建立链接：$linkPath"
  } catch {
    Copy-Item $InstallRoot $linkPath -Recurse -Force
    Write-Ok "无法建立链接，已改为直接复制：$linkPath"
  }
}

Write-Host ''
Write-Host '安装完成。' -ForegroundColor Green
Write-Host '下一步：'
Write-Host '  1) 完全退出 DSH（含托盘图标），再重新打开。'
Write-Host '  2) 新建会话，在预设下拉里选择「树状规划（PTC）」。'
Write-Host '  3) 随便发一个任务，检查第一轮是否只出树、不调用工具。'
Write-Host ''
Write-Host '如果 DSH 打开后提示 profile 安装失败：运行 卸载.ps1 还原，然后把报错截图发给分享者。'
