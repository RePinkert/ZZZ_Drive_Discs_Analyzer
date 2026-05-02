@echo off
chcp 65001 >nul
echo ========================================
echo   绝区零驱动盘分析器 — 构建脚本
echo ========================================
echo.

:: 安装依赖
pip show pyinstaller >nul 2>&1
if errorlevel 1 (
    echo [1/4] 安装 PyInstaller...
    pip install pyinstaller
) else (
    echo [1/4] PyInstaller 已安装
)

pip show pywebview >nul 2>&1
if errorlevel 1 (
    echo [2/4] 安装 pywebview...
    pip install pywebview
) else (
    echo [2/4] pywebview 已安装
)

:: 编译 TypeScript
echo [3/4] 编译 Web UI...
call npm --prefix web-ui run build
if errorlevel 1 (
    echo 错误: TypeScript 编译失败
    pause
    exit /b 1
)

:: 打包 exe（--windowed 隐藏控制台窗口）
echo [4/4] 打包 exe...
python -m PyInstaller --onefile --windowed --distpath . --name "ZZZ驱动盘分析器" --add-data "web-ui\index.html;web-ui" --add-data "web-ui\dist;web-ui\dist" --add-data "web-ui\set_registry.csv;web-ui" --add-data "web-ui\slot_attributes.csv;web-ui" --add-data "set_registry.csv;." --add-data "slot_attributes.csv;." --clean launcher.py

if errorlevel 1 (
    echo 错误: PyInstaller 打包失败
    pause
    exit /b 1
)

:: 清理中间产物
set /p CLEAN="是否清理中间产物 (build/ + .spec)? [Y/n] "
if /i "%CLEAN%"=="n" goto done
rd /s /q build 2>nul
del /q "ZZZ驱动盘分析器.spec" 2>nul
echo 已清理。

echo.
echo ========================================
echo   构建完成！
echo   输出: ZZZ驱动盘分析器.exe
echo ========================================
pause
