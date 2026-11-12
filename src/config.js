// ============================================================
// CONFIGURACIÓN DEL JUEGO
// Todos los valores ajustables están aquí. Cambia un número,
// recarga la página (F5) y notarás la diferencia.
// Las distancias están en "unidades" del mundo 3D (piensa en metros).
// ============================================================
const CONFIG = {
  // Recursos: qué archivos de assets/ usa el juego.
  // Para cambiar de nave, pon aquí otro archivo de assets/modelos/naves/.
  MODELO_NAVE: 'assets/modelos/naves/Spaceship_RaeTheRedPanda.gltf',
  MODELO_MONEDA: 'assets/modelos/objetos/Pickup_Thunder.gltf',
  MODELOS_ROCA: [
    'assets/modelos/rocas/Rock_1.gltf',
    'assets/modelos/rocas/Rock_2.gltf',
    'assets/modelos/rocas/Rock_3.gltf',
    'assets/modelos/rocas/Rock_4.gltf',
  ],
  IMAGEN_FONDO: 'assets/imagenes/skybox-space-dark.png',
  NAVE_TAMANO: 1.7,         // tamaño de la nave en su lado más largo
  NAVE_GIRO: Math.PI,       // giro para que el morro apunte hacia delante (Math.PI = media vuelta)

  // Avance
  VELOCIDAD: 30,            // unidades por segundo (más = más difícil)

  // Avatar (la nave del jugador)
  AVATAR_VELOCIDAD_X: 13,   // velocidad lateral, unidades por segundo
  AVATAR_VELOCIDAD_Y: 10,   // velocidad vertical, unidades por segundo
  AVATAR_ANCHO: 0.9,        // ancho usado para calcular choques
  AVATAR_ALTO: 0.5,         // alto usado para calcular choques
  AVATAR_INCLINACION: 0.5,  // cuánto se ladea al moverse (radianes)

  // Monedas
  MONEDA_RADIO: 0.45,       // tamaño de la moneda
  MONEDA_ALCANCE: 0.9,      // a qué distancia de la nave se recoge (más = más fácil)
  CARGA_POR_MONEDA: 0.125,  // cuánto carga la habilidad cada moneda (0.125 = 8 monedas la llenan)

  // Habilidad especial: pulso destructor (tecla Tabulador)
  PULSO_ALCANCE: 110,       // hasta qué distancia por delante destruye asteroides
  PULSO_VELOCIDAD: 170,     // velocidad del anillo, unidades por segundo

  // Cámara: va detrás y por encima del avatar
  CAMARA_ATRAS: 7,          // distancia por detrás del avatar
  CAMARA_ALTURA: 1.4,       // cuánto por encima de la nave (alta, para que la nave no tape la mira)
  CAMARA_SEGUIR_Y: 0.6,     // cuánto acompaña la cámara a la nave al subir/bajar (0 a 1)
  CAMARA_SUAVIDAD: 8,       // más alto = la cámara sigue al avatar más pegada
  CAMPO_VISION: 75,         // grados de apertura (más = más sensación de velocidad)

  // Túnel
  TUNEL_ANCHO: 10,
  TUNEL_ALTO: 6,
  SEPARACION_AROS: 8,       // distancia entre los marcos del túnel

  // Visibilidad: la niebla esconde lo que está lejos
  NIEBLA_CERCA: 30,
  NIEBLA_LEJOS: 125,

  // Disparo
  ALCANCE: 90,              // distancia máxima (desde el avatar) a la que se abre una cerradura
  DURACION_TRAZO_MS: 90,    // cuánto se ve la línea del disparo
  DURACION_MARCA_MS: 130,   // cuánto dura la marca de acierto en la mira

  // Barreras
  CERRADURA_RADIO: 0.7,     // tamaño de la cerradura (más pequeño = más difícil)
  BARRERA_GROSOR: 0.4,
  TIEMPO_APERTURA: 0.2,     // segundos que tarda en abrirse
  DISTANCIA_CHOQUE: 0.8,    // a qué distancia de la barrera se considera choque
  PAUSA_CHOQUE_MS: 700,     // pausa tras chocar antes de reiniciar

  // Obstáculos (campos de asteroides que hay que esquivar)
  OBSTACULO_FONDO: 1,       // grosor en la dirección de avance
  ASTEROIDE_TAMANO: 1.6,    // tamaño aproximado de cada roca
  TIEMPO_EXPLOSION: 0.3,    // segundos que tardan en desintegrarse con el pulso

  // Colores (formato hexadecimal 0xRRGGBB)
  COLOR_FONDO: 0x05060c,
  COLOR_TUNEL: 0x3b6cff,
  COLOR_BARRERA: 0xff3355,
  COLOR_CERRADURA: 0xffe066,
  COLOR_ASTEROIDE: 0x9a7b62,
  COLOR_MONEDA: 0xffd23f,
  COLOR_MONEDA_BRILLO: 0x7a5a00,
  COLOR_PULSO: 0x4de3ff,
  COLOR_META: 0x39ff88,
  COLOR_TRAZO: 0xffffff,
  COLOR_AVATAR: 0x4de3ff,
  COLOR_AVATAR_ALAS: 0x2a8cff,
};
