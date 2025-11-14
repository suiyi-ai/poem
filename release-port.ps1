# PowerShell 脚本：释放指定端口
param(
    [int]$Port = 3000
)

Write-Host "正在检查端口 $Port 的占用情况..." -ForegroundColor Yellow

# 查找监听指定端口的连接
$connections = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | Where-Object {$_.State -eq "Listen"}

if ($connections) {
    foreach ($conn in $connections) {
        $processId = $conn.OwningProcess
        $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
        
        if ($process) {
            Write-Host "发现进程占用端口 $Port :" -ForegroundColor Red
            Write-Host "  进程ID: $processId" -ForegroundColor Yellow
            Write-Host "  进程名: $($process.ProcessName)" -ForegroundColor Yellow
            Write-Host "  进程路径: $($process.Path)" -ForegroundColor Yellow
            
            $confirm = Read-Host "是否终止此进程? (Y/N)"
            if ($confirm -eq "Y" -or $confirm -eq "y") {
                try {
                    Stop-Process -Id $processId -Force
                    Write-Host "成功终止进程 $processId" -ForegroundColor Green
                } catch {
                    Write-Host "终止进程失败: $_" -ForegroundColor Red
                    Write-Host "可能需要管理员权限，请以管理员身份运行此脚本" -ForegroundColor Yellow
                }
            } else {
                Write-Host "已取消操作" -ForegroundColor Yellow
            }
        }
    }
} else {
    Write-Host "端口 $Port 未被占用，可以正常使用" -ForegroundColor Green
}

Write-Host "`n按任意键退出..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

