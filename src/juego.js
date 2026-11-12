// ============================================================
// JUEGO
// Une todas las piezas: prepara la escena 3D, controla los estados
// de la partida, lee los controles, gestiona el disparo, las monedas
// y la habilidad, y ejecuta el bucle principal.
// ============================================================

// ----------------------------------------------------------
// PREPARACIÓN DE THREE.JS
// Hacen falta tres cosas: una escena (el mundo), una cámara (los
// ojos del jugador) y un renderizador (quien dibuja en pantalla).
// ----------------------------------------------------------
const escena = new THREE.Scene();
escena.background = new THREE.Color(CONFIG.COLOR_FONDO);
// Niebla del mismo color que el fondo: lo lejano se funde con la oscuridad.
escena.fog = new THREE.Fog(CONFIG.COLOR_FONDO, CONFIG.NIEBLA_CERCA, CONFIG.NIEBLA_LEJOS);

// Luces: sin ellas, los objetos con volumen (asteroides, nave, monedas)
// se verían como siluetas planas.
//  - Luz ambiente de cielo/suelo: ilumina todo un poco, sin sombras duras.
//  - Luz direccional: como un sol, crea caras claras y oscuras (da volumen).
escena.add(new THREE.HemisphereLight(0xbfd4ff, 0x1a1030, 0.9));
const sol = new THREE.DirectionalLight(0xffffff, 1.1);
sol.position.set(3, 5, 4); // la luz viene de arriba, a la derecha y por detrás
escena.add(sol);

const camara = new THREE.PerspectiveCamera(
  CONFIG.CAMPO_VISION,
  window.innerWidth / window.innerHeight, // proporción de la ventana
  0.1,                                    // lo más cercano que se dibuja
  CONFIG.NIEBLA_LEJOS + 10                // lo más lejano que se dibuja
);

const renderizador = new THREE.WebGLRenderer({ antialias: true });
renderizador.outputEncoding = THREE.sRGBEncoding; // colores correctos para modelos con textura
renderizador.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderizador.domElement);

// Si cambia el tamaño de la ventana, ajustamos cámara y lienzo.
window.addEventListener('resize', () => {
  camara.aspect = window.innerWidth / window.innerHeight;
  camara.updateProjectionMatrix();
  renderizador.setSize(window.innerWidth, window.innerHeight);
});

// Elementos de index.html
const elInfo = document.getElementById('info');
const elMensaje = document.getElementById('mensaje');
const elDestello = document.getElementById('destello');
const elMira = document.getElementById('mira');
const elHabilidad = document.getElementById('habilidad');
const elHabilidadBarra = document.getElementById('habilidad-barra');

// ----------------------------------------------------------
// ESTADO DE LA PARTIDA
// El juego siempre está en uno de estos estados:
//   'cargando'   → esperando a que lleguen los modelos e imágenes
//   'listo'      → esperando el clic para empezar
//   'jugando'    → avanzando por el túnel
//   'choque'     → pausa breve tras chocar
//   'completado' → se cruzó la meta
// ----------------------------------------------------------
let estado = 'cargando';
let indiceNivel = 0;
let nivel = null;        // datos del nivel actual (de niveles.js)
let tunel = null;        // objeto 3D del túnel
let barreras = [];       // lista de objetos Barrera
let obstaculos = [];     // lista de objetos Obstaculo
let monedas = [];        // lista de objetos Moneda
let trazos = [];         // líneas de disparo que se están mostrando
let monedasRecogidas = 0;
let carga = 0;           // carga de la habilidad: de 0 (vacía) a 1 (llena)
let pulso = null;        // el pulso que está viajando ahora mismo (o null)

const avatar = new Avatar(escena);

// Construye (o reconstruye) el nivel desde cero y coloca al avatar al inicio.
function cargarNivel() {
  // Limpiar lo que hubiera del intento anterior.
  barreras.forEach((barrera) => barrera.destruir());
  obstaculos.forEach((obstaculo) => obstaculo.destruir());
  monedas.forEach((moneda) => moneda.destruir());
  if (tunel) escena.remove(tunel);
  quitarPulso();

  nivel = NIVELES[indiceNivel];
  tunel = crearTunel(nivel.largo);
  escena.add(tunel);
  barreras = nivel.barreras.map((datos) => new Barrera(escena, datos));
  obstaculos = nivel.obstaculos.map((datos) => new Obstaculo(escena, datos));
  monedas = nivel.monedas.map((datos) => new Moneda(escena, datos));

  avatar.reiniciar();
  camara.position.x = 0; // la cámara vuelve al centro sin deslizarse
  camara.position.y = CONFIG.CAMARA_ALTURA;

  // Monedas y habilidad empiezan de cero en cada intento.
  monedasRecogidas = 0;
  carga = 0;
  actualizarHabilidad();
  actualizarInfo();
}

function actualizarInfo() {
  const abiertas = barreras.filter((barrera) => barrera.abierta).length;
  elInfo.textContent = nivel.nombre +
    ' · Barreras: ' + abiertas + '/' + barreras.length +
    ' · Energía: ' + monedasRecogidas + '/' + monedas.length;
}

function empezar() {
  estado = 'jugando';
  elMensaje.textContent = '';
}

function chocar() {
  estado = 'choque';
  elMensaje.textContent = '¡CHOQUE!';
  elDestello.style.opacity = 0.6;

  // Tras una pausa corta, el nivel vuelve a empezar directamente
  // (sin pedir clic: reintentar tiene que ser inmediato).
  setTimeout(() => {
    elDestello.style.opacity = 0;
    cargarNivel();
    empezar();
  }, CONFIG.PAUSA_CHOQUE_MS);
}

function completar() {
  estado = 'completado';
  elMensaje.textContent = '¡NIVEL COMPLETADO!\n\nEnergía recogida: ' + monedasRecogidas + '/' + monedas.length +
    '\n\nHaz clic para repetir';
}

// ----------------------------------------------------------
// CONTROLES DE MOVIMIENTO
// Guardamos qué teclas están pulsadas en este momento. El bucle
// principal las consulta en cada fotograma.
// ----------------------------------------------------------
const teclasPulsadas = {};
window.addEventListener('keydown', (evento) => { teclasPulsadas[evento.code] = true; });
window.addEventListener('keyup', (evento) => { teclasPulsadas[evento.code] = false; });

window.addEventListener('keydown', (evento) => {
  if (evento.code === 'Tab') {
    evento.preventDefault(); // evita que el navegador use Tab para cambiar de elemento
    activarHabilidad();
  }
});

// Devuelve -1 (izquierda), 0 (quieto) o 1 (derecha).
function leerDireccionX() {
  let direccion = 0;
  if (teclasPulsadas.KeyA || teclasPulsadas.ArrowLeft) direccion -= 1;
  if (teclasPulsadas.KeyD || teclasPulsadas.ArrowRight) direccion += 1;
  return direccion;
}

// Devuelve -1 (abajo), 0 (quieto) o 1 (arriba).
function leerDireccionY() {
  let direccion = 0;
  if (teclasPulsadas.KeyS || teclasPulsadas.ArrowDown) direccion -= 1;
  if (teclasPulsadas.KeyW || teclasPulsadas.ArrowUp) direccion += 1;
  return direccion;
}

// ----------------------------------------------------------
// MONEDAS
// Al pasar por encima se recogen: suman al contador y cargan la
// habilidad especial.
// ----------------------------------------------------------
function recogerMonedas() {
  monedas.forEach((moneda) => {
    if (!moneda.tocaA(avatar)) return;
    moneda.recoger();
    monedasRecogidas += 1;
    carga = Math.min(1, carga + CONFIG.CARGA_POR_MONEDA);
    actualizarHabilidad();
    actualizarInfo();
  });
}

// ----------------------------------------------------------
// HABILIDAD ESPECIAL: PULSO DESTRUCTOR
// Con la barra llena, el Tabulador lanza un anillo de energía que
// viaja por delante de la nave y destruye los asteroides que alcanza.
// No abre barreras: esas siguen necesitando puntería.
// ----------------------------------------------------------
function activarHabilidad() {
  if (estado !== 'jugando' || carga < 1 || pulso) return;
  carga = 0;
  actualizarHabilidad();

  // El anillo: un "donut" fino que sale desde la nave.
  const malla = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.07, 8, 48),
    new THREE.MeshBasicMaterial({ color: CONFIG.COLOR_PULSO, fog: false })
  );
  malla.position.copy(avatar.grupo.position);
  escena.add(malla);
  pulso = { malla: malla, zInicio: avatar.z, recorrido: 0 };
}

function actualizarPulso(dt) {
  if (!pulso) return;

  // El anillo avanza mucho más rápido que la nave y crece hasta llenar el túnel.
  pulso.recorrido += CONFIG.PULSO_VELOCIDAD * dt;
  pulso.malla.position.z = pulso.zInicio - pulso.recorrido;
  pulso.malla.scale.setScalar(Math.min(6, 1 + pulso.recorrido * 0.2));

  // Destruye cada asteroide que el anillo ya ha alcanzado.
  obstaculos.forEach((obstaculo) => {
    const alcanzado = obstaculo.z <= pulso.zInicio && obstaculo.z >= pulso.malla.position.z;
    if (alcanzado && !obstaculo.destruido) obstaculo.explotar();
  });

  if (pulso.recorrido >= CONFIG.PULSO_ALCANCE) quitarPulso();
}

function quitarPulso() {
  if (!pulso) return;
  escena.remove(pulso.malla);
  pulso.malla.geometry.dispose();
  pulso.malla.material.dispose();
  pulso = null;
}

// Actualiza la barra de la habilidad.
function actualizarHabilidad() {
  elHabilidadBarra.style.width = Math.round(carga * 100) + '%';
  elHabilidad.classList.toggle('lista', carga >= 1);
}

// ----------------------------------------------------------
// MIRA
// Un elemento HTML que sigue al ratón, como en los shooters.
// ----------------------------------------------------------
window.addEventListener('pointermove', (evento) => {
  elMira.style.left = evento.clientX + 'px';
  elMira.style.top = evento.clientY + 'px';
});

// Marca de acierto: la mira cambia de forma y color un instante.
function marcarAcierto() {
  elMira.classList.add('acierto');
  setTimeout(() => elMira.classList.remove('acierto'), CONFIG.DURACION_MARCA_MS);
}

// ----------------------------------------------------------
// DISPARO
// Un "rayo" es una línea invisible que sale de la cámara y pasa por
// el punto de la pantalla donde está la mira. Si ese rayo toca la
// cerradura, es un acierto.
// ----------------------------------------------------------
const rayo = new THREE.Raycaster();
const puntero = new THREE.Vector2();

function disparar(evento) {
  // Convertir la posición del ratón (píxeles) al sistema de Three.js,
  // donde la pantalla va de -1 a 1 en cada eje.
  puntero.x = (evento.clientX / window.innerWidth) * 2 - 1;
  puntero.y = -(evento.clientY / window.innerHeight) * 2 + 1;
  rayo.setFromCamera(puntero, camara);

  // Por defecto el trazo llega hasta el alcance máximo (disparo fallado).
  let destino = rayo.ray.at(CONFIG.ALCANCE, new THREE.Vector3());

  // Solo se puede abrir la primera barrera cerrada (tapa a las de detrás)
  // y solo si ya está dentro del alcance.
  const objetivo = barreras.find((barrera) => !barrera.abierta);
  if (objetivo && avatar.z - objetivo.z <= CONFIG.ALCANCE) {
    const impactos = rayo.intersectObject(objetivo.cerradura);
    if (impactos.length > 0) {
      destino = impactos[0].point;
      objetivo.abrir();
      actualizarInfo();
      marcarAcierto();
    }
  }

  dibujarTrazo(destino);
}

// Dibuja una línea breve desde el avatar hasta donde llegó el disparo.
function dibujarTrazo(destino) {
  const origen = avatar.grupo.position.clone();
  const geometria = new THREE.BufferGeometry().setFromPoints([origen, destino]);
  const material = new THREE.LineBasicMaterial({ color: CONFIG.COLOR_TRAZO, fog: false });
  const linea = new THREE.Line(geometria, material);
  escena.add(linea);
  trazos.push({ linea: linea, caduca: performance.now() + CONFIG.DURACION_TRAZO_MS });
}

function limpiarTrazos() {
  const ahora = performance.now();
  trazos = trazos.filter((trazo) => {
    if (ahora < trazo.caduca) return true;
    escena.remove(trazo.linea);
    trazo.linea.geometry.dispose();
    trazo.linea.material.dispose();
    return false;
  });
}

// Un mismo clic hace cosas distintas según el estado de la partida.
window.addEventListener('pointerdown', (evento) => {
  if (estado === 'listo') {
    empezar();
  } else if (estado === 'jugando') {
    disparar(evento);
  } else if (estado === 'completado') {
    cargarNivel();
    empezar();
  }
});

// ----------------------------------------------------------
// CÁMARA
// Va detrás y por encima del avatar. Lo sigue con un pequeño
// retraso, para que el movimiento se note sin marear. En vertical lo
// acompaña solo en parte, para no salirse por el techo del túnel.
// ----------------------------------------------------------
function actualizarCamara(dt) {
  const suavizado = Math.min(1, dt * CONFIG.CAMARA_SUAVIDAD);
  const alturaDeseada = avatar.y * CONFIG.CAMARA_SEGUIR_Y + CONFIG.CAMARA_ALTURA;
  camara.position.z = avatar.z + CONFIG.CAMARA_ATRAS;
  camara.position.x += (avatar.x - camara.position.x) * suavizado;
  camara.position.y += (alturaDeseada - camara.position.y) * suavizado;
}

// ----------------------------------------------------------
// BUCLE PRINCIPAL
// requestAnimationFrame llama a esta función antes de cada
// fotograma (~60 veces por segundo).
// ----------------------------------------------------------
const reloj = new THREE.Clock();

function bucle() {
  requestAnimationFrame(bucle);

  // dt = segundos desde el fotograma anterior. Multiplicar por dt hace que
  // el juego vaya igual de rápido en ordenadores lentos y rápidos.
  // El límite de 0.05 evita saltos enormes si la pestaña estuvo en pausa.
  const dt = Math.min(reloj.getDelta(), 0.05);

  if (estado === 'jugando') {
    avatar.actualizar(leerDireccionX(), leerDireccionY(), dt);
    actualizarPulso(dt);
    recogerMonedas();

    // Comprobaciones, por orden: barrera cerrada, asteroides, meta.
    const cerrada = barreras.find((barrera) => !barrera.abierta);
    if (cerrada && avatar.z <= cerrada.z + CONFIG.DISTANCIA_CHOQUE) {
      chocar();
    } else if (obstaculos.some((obstaculo) => obstaculo.chocaCon(avatar))) {
      chocar();
    } else if (avatar.z <= -nivel.largo) {
      completar();
    }
  }

  actualizarCamara(dt);
  barreras.forEach((barrera) => barrera.actualizar(dt));
  obstaculos.forEach((obstaculo) => obstaculo.actualizar(dt));
  monedas.forEach((moneda) => moneda.actualizar(dt));
  limpiarTrazos();
  renderizador.render(escena, camara);
}

// ----------------------------------------------------------
// ARRANQUE
// Primero se cargan los modelos e imágenes; cuando terminan, se
// construye el nivel y se espera el clic del jugador.
// ----------------------------------------------------------
elMensaje.textContent = 'Cargando...';
bucle(); // el bucle ya dibuja mientras tanto (túnel vacío)

cargarRecursos((fallos) => {
  if (RECURSOS.nave) avatar.usarModelo(RECURSOS.nave);
  if (RECURSOS.fondo) escena.background = RECURSOS.fondo;

  cargarNivel();
  estado = 'listo';
  elMensaje.textContent = 'LLAVE\n\nDispara a las cerraduras amarillas para abrir el camino\n' +
    'Esquiva los asteroides con W A S D\nRecoge energía para cargar el pulso (TAB)\n\nHaz clic para empezar';

  // Si faltan archivos, casi siempre es por abrir index.html con doble clic.
  if (fallos > 0) {
    elMensaje.textContent += '\n\n(No se cargaron ' + fallos + ' archivos de assets/.\n' +
      'Abre el juego con jugar.bat para ver los modelos)';
  }
});
