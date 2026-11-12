@echo off
rem ============================================================
rem  JUGAR
rem  Doble clic en este archivo para abrir el juego.
rem  Arranca un pequeno servidor local (necesario para que el
rem  navegador pueda cargar los modelos 3D) y abre el juego.
rem  Para cerrar: cierra esta ventana negra.
rem ============================================================
cd /d "%~dp0"
echo.
echo  Abriendo el juego en http://localhost:8000
echo  Deja esta ventana abierta mientras juegas. Cierrala para terminar.
echo.

rem Abre el navegador dentro de 2 segundos, cuando el servidor ya esta listo.
start /b cmd /c "ping -n 3 127.0.0.1 >nul & start http://localhost:8000/index.html"

rem Arranca el servidor con Python (prueba "py" y, si no existe, "python").
where py >nul 2>nul
if %errorlevel%==0 (
  py -3 -m http.server 8000 --bind 127.0.0.1
) else (
  python -m http.server 8000 --bind 127.0.0.1
)

echo.
echo  No se pudo arrancar el servidor. Comprueba que Python esta instalado.
pause
