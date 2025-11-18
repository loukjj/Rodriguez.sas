# restart_dev.ps1 - stop process on port 3000 if present, then start next dev bound to 127.0.0.1
$c = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object -First 1
if ($c) {
  Write-Output "KILLING $($c.OwningProcess)"
  Stop-Process -Id $c.OwningProcess -Force
} else {
  Write-Output "NO_PID"
}

# ensure we use localhost binding
$env:HOST = '127.0.0.1'

# start dev server
npm --prefix "C:\Users\Familia\OneDrive\Escritorio\Rodriguez.sas\web-app" run dev
