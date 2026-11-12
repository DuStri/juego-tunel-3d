# Plan por hitos

Regla: un hito a la vez, en pasos pequeños. Al terminar cada uno se prueba y
se espera feedback antes de empezar el siguiente.

## Hito 1 — Prototipo jugable mínimo  ✔ (aprobado: "me gusta la dinámica")
- Túnel 3D con avance automático, barreras con cerradura, disparo con ratón,
  choque → reinicio, meta.

## Hito 2 — Avatar y sensación de shooter  ← (implementado, pendiente de feedback)
- Avatar (nave) visible que se mueve libremente en X e Y con WASD o flechas.
- Cámara en tercera persona, detrás de la nave.
- Más velocidad (18 → 30) y nivel más largo.
- Campos de asteroides en pilar (esquivar de lado) y en viga (por arriba o abajo).
- Monedas para recoger: cuentan como puntuación y cargan la habilidad.
- Habilidad especial con Tabulador: pulso que destruye los asteroides de delante
  (8 monedas la llenan). La cámara lenta se descartó.
- Iluminación y asteroides con volumen generados por código.
- Mira de shooter que sigue al ratón, con marca de acierto.

Feedback recibido: la velocidad (30) y el movimiento de la nave están bien.

**Pregunta que responde:** ¿apuntar y esquivar a la vez, a esta velocidad, es divertido?

## Hito 4 — Más "shooter": armas y objetivos
- Sonidos de disparo, acierto y choque; retroceso y fogonazo.
- Cerraduras que se mueven, barreras con varias cerraduras, cerraduras pequeñas.
- Objetivos opcionales que dan puntos (dianas) y señuelos que no hay que disparar.
- Munición/recarga o cadencia limitada (por decidir con el feedback).

## Hito 5 — Niveles y progresión
- Varios niveles con dificultad y velocidad crecientes.
- Selección de nivel; el siguiente se desbloquea al completar el anterior.
- Progreso guardado en el navegador. Contador de intentos y valoración por precisión.

## Hito 3 — Arte del usuario  ← (implementado, pendiente de feedback)
- El usuario aportó packs de modelos (naves, rocas, objetos, planetas) y fondos.
- Nave, rocas de los asteroides, objeto de energía y fondo espacial cargados
  desde `assets/`. El juego se abre con `jugar.bat`.
- Pendiente: sonidos (el usuario aún no los ha aportado), planetas de decoración.

## Hito 6 — Pulido
- Partículas, sacudida de cámara.
- Un color de túnel por nivel, música, pantalla de inicio.
