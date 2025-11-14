@echo off
setlocal enabledelayedexpansion
echo 正在检查3000端口占用情况...
echo.

netstat -ano | findstr :3000 | findstr LISTENING
if %errorlevel% equ 0 (
    echo.
    echo 发现3000端口被占用，正在查找进程...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do (
        set PID=%%a
        echo 找到进程ID: !PID!
        echo 正在终止进程...
        taskkill /PID !PID! /F
        if !errorlevel! equ 0 (
            echo 成功终止进程 !PID!
        ) else (
            echo 终止进程失败，可能需要管理员权限
        )
    )
) else (
    echo 3000端口未被占用，可以正常使用
)

echo.
echo 按任意键退出...
pause >nul

