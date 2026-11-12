# Reglas del proyecto

Juego 3D de avance automático para navegador: disparas a cerraduras para abrir
las barreras del túnel. Hecho con Three.js.
Diseño en `docs/GDD.md`, hitos en `docs/PLAN.md`.

## Cómo correrlo
Doble clic en `jugar.bat`: arranca un servidor local con Python
(`py -3 -m http.server 8000`) y abre http://localhost:8000/index.html.
Hace falta el servidor porque el navegador no deja cargar modelos ni texturas
desde `file://`. Abrir `index.html` con doble clic sigue funcionando, pero con
las formas simples de reserva. No hay paso de compilación. Tras cambiar código:
recargar la página (Ctrl+F5).
Los errores se ven en la consola del navegador (F12).

## Estructura
- `index.html` — página, textos en pantalla (HUD) y carga de scripts **en orden**.
- `lib/three.min.js` y `lib/GLTFLoader.js` — Three.js r147 en local (no usar
  CDN: debe funcionar sin internet). No subir de versión: r147 es la última
  que trae los cargadores (`examples/js`) sin módulos ES.
- `jugar.bat` — arranca el servidor local y abre el juego.
- `src/recursos.js` — carga modelos e imágenes de `assets/` en `RECURSOS`.
- `src/config.js` — todos los valores ajustables (velocidad, tamaños, colores).
- `src/niveles.js` — los niveles como datos (lista de barreras).
- `src/tunel.js` — construye el túnel y la meta.
- `src/barrera.js` — clase `Barrera` (pared + cerradura + animación de abrirse).
- `src/obstaculo.js` — clase `Obstaculo` (campo de asteroides: caja de choque + rocas).
- `src/moneda.js` — clase `Moneda` (objeto para recoger; carga la habilidad).
- `assets/` — modelos (`.gltf` con todo incluido), imágenes y sonidos que
  aporta el usuario (ver `assets/LEEME.txt`). Qué archivo se usa para cada cosa
  se elige en `CONFIG` (`MODELO_NAVE`, `MODELOS_ROCA`, `MODELO_MONEDA`, `IMAGEN_FONDO`).
- `src/avatar.js` — clase `Avatar` (la nave: avance automático y movimiento lateral).
- `src/juego.js` — estados de la partida, controles, mira, disparo, monedas,
  habilidad (pulso), cámara y bucle principal. Siempre el último script.

## Convenciones
- JavaScript sencillo con `<script>` clásicos, **sin módulos ES (`import`/`export`)
  ni bundlers**: los módulos no funcionan al abrir el archivo con doble clic.
  Cada archivo nuevo se añade a `index.html` antes de `juego.js`.
- Nombres de variables, funciones, clases y comentarios en español.
- Nada de "números mágicos": van en `CONFIG` (`src/config.js`).
- Los niveles son datos en `src/niveles.js`, no código.
- Ejes: la cámara avanza hacia **-Z**. En los niveles se usa `distancia`
  (positiva) y el código la convierte a `z = -distancia`. El centro del túnel
  es x=0, y=0.
- Cada pieza visual tiene dos versiones: el modelo de `assets/` y una forma
  simple hecha por código que se usa de reserva si el modelo no carga.
- Los modelos pasan por `normalizarModelo()` (centrados y de tamaño 1); el
  tamaño final se fija con `scale` desde `CONFIG`.
- El usuario es principiante: comentar el porqué de cada bloque y explicar las
  decisiones clave al entregar.

## Forma de trabajo
- Un hito de `docs/PLAN.md` a la vez. Al terminar: explicar cómo probarlo y
  esperar feedback antes de seguir. Marcar el estado del hito en `PLAN.md`.
- Priorizar que sea jugable y divertido antes que bonito.
- El usuario quiere pasos pequeños: escribir un poco, probar, y seguir.
- Referencia de sensaciones: juegos shooter (mira, marca de acierto, respuesta
  inmediata) y runners de avance automático rápidos y exigentes.
- No hay Node. Para probar sin el usuario: abrir `index.html` con Edge sin
  ventana (`msedge --headless=new --dump-dom` / `--screenshot`) desde una
  página de prueba temporal que cargue los scripts y simule clics y teclas.
  En ese modo `requestAnimationFrame` casi no se ejecuta: la prueba debe
  llamar a `bucle()` a mano con un `dt` fijo.
