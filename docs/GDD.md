# GDD — "Llave" (nombre provisional)

## Concepto
Juego 3D de avance automático para navegador. Recorres un túnel sin poder
frenar. El camino está cortado por barreras, y cada barrera tiene una
cerradura: **tu disparo es la llave**. Si aciertas a la cerradura a tiempo, la
barrera se abre y sigues; si no, chocas y el nivel vuelve a empezar.
Niveles cortos y exigentes que se aprenden a base de repetir.

## Loop principal
1. Avanzas solo por el túnel a velocidad constante.
2. Aparece una barrera entre la niebla, con su cerradura en algún punto.
3. Apuntas con el ratón y disparas a la cerradura.
4. Acierto → la barrera se abre y pasas. Sin acierto → choque → reinicio inmediato.
5. Llegar a la meta completa el nivel y desbloquea el siguiente.

## Mecánicas
- **Avance automático**: la nave avanza sola y rápido; no se puede frenar.
- **Avatar con movimiento libre**: el jugador mueve la nave en los ejes X e Y
  para esquivar campos de asteroides en pilar (de lado) y en viga (por arriba
  o por abajo). Disparar no los destruye; solo el pulso. La cámara va detrás, en tercera
  persona, así que moverse también desplaza la puntería.
- **Dos habilidades a la vez**: una mano esquiva (teclado) y la otra apunta
  (ratón), como en un shooter.
- **Monedas**: objetos para recoger pasando por encima. Cuentan como
  puntuación del nivel (recogidas/total) y cargan la habilidad especial.
- **Habilidad especial (Tabulador)**: pulso destructor. Con la barra llena
  (8 monedas), lanza un anillo que destruye los asteroides de un tramo por
  delante. No abre barreras. La carga se pierde al chocar.
- **Sensación de shooter**: mira que sigue al ratón, marca de acierto, trazo
  del disparo; más adelante sonido, retroceso y fogonazo.
- **Disparo instantáneo**: el disparo llega al instante donde apunta la mira,
  con un alcance máximo (no se puede abrir lo que aún está muy lejos).
- **Barreras y cerraduras**: solo se puede abrir la barrera cerrada más
  cercana (las de detrás están tapadas).
- **Choque**: tocar una barrera cerrada reinicia el nivel desde el principio.
- **Variedad** (hitos siguientes): cerraduras que se mueven, barreras con
  varias cerraduras, cerraduras pequeñas, señuelos que no hay que disparar.
- **Niveles**: definidos como datos (lista de barreras), cada uno más rápido y
  con combinaciones nuevas.
- **Balas contadas** (más adelante): munición limitada por nivel, para que
  cada disparo cuente, y valoración por precisión.

## Controles
| Acción            | Control          |
|-------------------|------------------|
| Mover la nave     | W A S D o flechas |
| Habilidad especial| Tabulador        |
| Apuntar           | Mover el ratón   |
| Disparar          | Clic izquierdo   |
| Empezar / repetir | Clic             |

## Victoria / derrota
- **Victoria del nivel**: cruzar la meta al final del túnel.
- **Derrota**: chocar con una barrera cerrada o con un pilar → se reinicia el nivel.
- **Victoria del juego**: completar todos los niveles.

## Estilo visual
- Túnel de líneas brillantes sobre fondo oscuro con niebla (estilo "neón").
- Formas simples como placeholder: barreras = paredes rojas, cerraduras =
  rombos amarillos que giran, meta = plano verde. Asteroides, nave y monedas
  tienen volumen e iluminación; se sustituirán por modelos del usuario.
- Más adelante: partículas, sonido, sacudida de cámara y un color por nivel.

## Fuera de alcance (por ahora)
Enemigos que disparan, editor de niveles,
música sincronizada, soporte táctil.
