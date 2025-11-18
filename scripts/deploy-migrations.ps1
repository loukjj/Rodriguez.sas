<#
Script: deploy-migrations.ps1
Propósito: Ayuda segura y reproducible para desplegar migraciones Prisma en una DB PostgreSQL.

Uso (PowerShell):
  .\scripts\deploy-migrations.ps1

El script hará:
  - Detectar `DATABASE_URL` en `.env` o pedirla al usuario.
  - Mostrar la última migración en `prisma/migrations`.
  - Pedir confirmación de que se hizo backup.
  - Opcionalmente ejecutar `pg_dump` para crear un backup si el usuario provee credenciales y `pg_dump` está instalado.
  - Ejecutar `npx prisma migrate deploy` apuntando a `DATABASE_URL` proporcionada.
  - Mostrar el estado de migraciones con `npx prisma migrate status`.

Precauciones:
  - No almacena credenciales en el repo.
  - Asegúrate de ejecutar desde la raíz del repo.
#>

function Read-EnvFile($path) {
  if (-Not (Test-Path $path)) { return $null }
  $lines = Get-Content $path | Where-Object { $_ -and ($_ -notmatch '^\s*#') }
  $dict = @{}
  foreach ($line in $lines) {
    if ($line -match '^\s*([^=]+)=(.*)$') {
      $k = $matches[1].Trim()
      $v = $matches[2].Trim().Trim('"')
      $dict[$k] = $v
    }
  }
  return $dict
}

Write-Host "-- Prisma deploy helper --"

Push-Location (Get-Location)
try {
  $repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path | Split-Path -Parent
  Set-Location $repoRoot

  # Intentar leer .env
  $envFile = Join-Path $repoRoot ".env"
  $envVals = Read-EnvFile $envFile
  $DATABASE_URL = $null
  if ($envVals -and $envVals.ContainsKey('DATABASE_URL')) {
    $DATABASE_URL = $envVals['DATABASE_URL']
    Write-Host "Encontrado DATABASE_URL en .env"
  }

  if (-not $DATABASE_URL) {
    $DATABASE_URL = Read-Host "Introduce DATABASE_URL (postgresql://user:pass@host:port/db)"
  }

  if (-not $DATABASE_URL) {
    Write-Host "DATABASE_URL no proporcionada. Abortando." -ForegroundColor Red
    exit 1
  }

  # Mostrar últimas migraciones
  $migrationsDir = Join-Path $repoRoot "prisma/migrations"
  if (Test-Path $migrationsDir) {
    $dirs = Get-ChildItem $migrationsDir | Where-Object { $_.PSIsContainer } | Sort-Object Name
    if ($dirs.Count -eq 0) {
      Write-Host "No se encontraron migraciones en prisma/migrations" -ForegroundColor Yellow
    } else {
      Write-Host "Migraciones encontradas:" -ForegroundColor Cyan
      $dirs | ForEach-Object { Write-Host " - $($_.Name)" }
      Write-Host "Última migración: $($dirs[-1].Name)" -ForegroundColor Green
    }
  } else {
    Write-Host "No existe la carpeta prisma/migrations. Abortando." -ForegroundColor Red
    exit 1
  }

  # Confirmar backup
  $confirm = Read-Host "Confirmas que has realizado un backup de la DB y que quieres aplicar las migraciones? (yes/no)"
  if ($confirm.ToLower() -ne 'yes') {
    Write-Host "Operación cancelada por el usuario." -ForegroundColor Yellow
    exit 0
  }

  # Opcional: ejecutar pg_dump si el usuario quiere
  $wantBackupNow = Read-Host "Deseas crear ahora un backup con pg_dump desde esta máquina? (y/n)"
  if ($wantBackupNow -eq 'y') {
    # Pedir credenciales (no se guardan)
    $pgHost = Read-Host "PG host (ej: db-host)"
    $pgPort = Read-Host "PG port (ej: 5432)"
    $pgUser = Read-Host "PG user"
    $pgName = Read-Host "PG database name"
    $pgPass = Read-Host "PG password (se usará temporalmente)"
    $backupDir = Join-Path $repoRoot "backups"
    if (-not (Test-Path $backupDir)) { New-Item -ItemType Directory -Path $backupDir | Out-Null }
    $timestamp = Get-Date -Format 'yyyyMMddHHmmss'
    $outFile = Join-Path $backupDir "backup_${timestamp}.dump"

    $env:PGPASSWORD = $pgPass
    $pgdump = Get-Command pg_dump -ErrorAction SilentlyContinue
    if (-not $pgdump) {
      Write-Host "pg_dump no encontrado en PATH. Asegúrate de tener el cliente de Postgres instalado." -ForegroundColor Red
    } else {
      Write-Host "Ejecutando pg_dump... Esto puede tardar según el tamaño de la DB."
      & pg_dump -Fc -h $pgHost -p $pgPort -U $pgUser -d $pgName -f $outFile
      if ($LASTEXITCODE -eq 0) { Write-Host "Backup creado: $outFile" -ForegroundColor Green } else { Write-Host "pg_dump falló." -ForegroundColor Red }
    }
    Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue
  }

  Write-Host "Aplicando migraciones con prisma migrate deploy..." -ForegroundColor Cyan
  $env:DATABASE_URL = $DATABASE_URL
  npx prisma migrate deploy
  if ($LASTEXITCODE -ne 0) {
    Write-Host "prisma migrate deploy falló." -ForegroundColor Red
    exit 1
  }

  Write-Host "Verificando estado de migraciones..." -ForegroundColor Cyan
  npx prisma migrate status

  Write-Host "Migraciones aplicadas correctamente." -ForegroundColor Green

} finally {
  Pop-Location
}
