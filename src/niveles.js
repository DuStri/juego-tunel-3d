// ============================================================
// NIVELES
// Cada nivel es solo una lista de datos: para diseñar un nivel no
// hace falta tocar el código del juego.
//
//   largo:      distancia hasta la meta.
//   barreras:   paredes que solo se abren disparando a su cerradura.
//     distancia: a qué distancia del inicio está.
//     x, y:      posición de la cerradura en la pared.
//                x va de -4 (izquierda) a 4 (derecha).
//                y va de -2 (abajo) a 2 (arriba). (0, 0) es el centro.
//   obstaculos: campos de asteroides: hay que esquivarlos (o usar el pulso).
//     distancia: a qué distancia del inicio está.
//     Pilar (del suelo al techo, se esquiva hacia los lados):
//       x:     centro del pilar (-5 es la pared izquierda, 5 la derecha).
//       ancho: ancho del pilar (el túnel mide 10 de ancho).
//     Viga (de pared a pared, se esquiva por arriba o por abajo):
//       y:     centro de la viga (-3 es el suelo, 3 el techo).
//       alto:  alto de la viga (el túnel mide 6 de alto).
//     Si se indican x, ancho, y, alto a la vez, es un bloque suelto.
//   monedas:    objetos para recoger; cargan la habilidad especial.
//     distancia: a qué distancia del inicio está.
//     x, y:      posición (x de -4.4 a 4.4, y de -2.6 a 2.6).
// ============================================================
const NIVELES = [
  {
    nombre: 'Nivel 1',
    largo: 640,
    barreras: [
      { distancia: 80,  x: 0,    y: 0 },
      { distancia: 130, x: -2.5, y: 0.5 },
      { distancia: 180, x: 2.5,  y: 1 },
      { distancia: 230, x: 0,    y: -1 },
      { distancia: 280, x: -3,   y: 1.5 },
      { distancia: 330, x: 3,    y: -2 },
      { distancia: 375, x: -1,   y: 1 },
      { distancia: 420, x: 2,    y: 2 },
      { distancia: 465, x: -3.5, y: -0.5 },
      { distancia: 510, x: 3.5,  y: -2 },
      { distancia: 555, x: 0,    y: 1 },
      { distancia: 600, x: -2,   y: -1 },
    ],
    obstaculos: [
      // Entre barrera y barrera hay un obstáculo que esquivar.
      { distancia: 105, x: 0,    ancho: 3 },   // pilar central
      { distancia: 155, y: -1.5, alto: 3 },    // viga abajo: pasar por arriba
      { distancia: 205, y: 1.5,  alto: 3 },    // viga arriba: pasar por abajo
      { distancia: 255, x: -3,   ancho: 4 },   // pilar izquierdo
      { distancia: 305, y: 0,    alto: 2 },    // viga central: por arriba o por abajo
      { distancia: 352, x: 2.5,  ancho: 5 },   // pilar derecho
      { distancia: 398, y: -1,   alto: 4 },    // viga alta desde el suelo: hueco estrecho arriba
      { distancia: 443, x: 0,    ancho: 5 },   // pilar central ancho
      { distancia: 488, y: 1,    alto: 4 },    // viga desde el techo: hueco estrecho abajo
      { distancia: 533, x: 0,    ancho: 6 },   // pilar central muy ancho
      { distancia: 578, x: -2.5, ancho: 5 },   // pilar izquierdo ancho
    ],
    monedas: [
      // Tres monedas en fila señalan el hueco por el que pasar cada obstáculo.
      { distancia: 97, x: 3, y: 0 }, { distancia: 105, x: 3, y: 0 }, { distancia: 113, x: 3, y: 0 },
      { distancia: 147, x: -1, y: 1.8 }, { distancia: 155, x: -1, y: 1.8 }, { distancia: 163, x: -1, y: 1.8 },
      { distancia: 197, x: 1, y: -1.8 }, { distancia: 205, x: 1, y: -1.8 }, { distancia: 213, x: 1, y: -1.8 },
      { distancia: 247, x: 2.5, y: 1 }, { distancia: 255, x: 2.5, y: 1 }, { distancia: 263, x: 2.5, y: 1 },
      { distancia: 297, x: -2, y: 2.2 }, { distancia: 305, x: -2, y: 2.2 }, { distancia: 313, x: -2, y: 2.2 },
      { distancia: 344, x: -3, y: -1 }, { distancia: 352, x: -3, y: -1 }, { distancia: 360, x: -3, y: -1 },
      { distancia: 390, x: 2, y: 2.2 }, { distancia: 398, x: 2, y: 2.2 }, { distancia: 406, x: 2, y: 2.2 },
      { distancia: 435, x: -4, y: 0 }, { distancia: 443, x: -4, y: 0 }, { distancia: 451, x: -4, y: 0 },
      { distancia: 480, x: -2, y: -2.2 }, { distancia: 488, x: -2, y: -2.2 }, { distancia: 496, x: -2, y: -2.2 },
      { distancia: 525, x: 4.1, y: 1 }, { distancia: 533, x: 4.1, y: 1 }, { distancia: 541, x: 4.1, y: 1 },
      { distancia: 570, x: 3, y: -1 }, { distancia: 578, x: 3, y: -1 }, { distancia: 586, x: 3, y: -1 },
    ],
  },
];
