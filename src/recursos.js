// ============================================================
// RECURSOS
// Carga los modelos 3D y las imágenes de la carpeta assets/ antes
// de que empiece la partida, y los deja listos en RECURSOS.
//
// Importante: el navegador solo permite cargar estos archivos si el
// juego se abre con jugar.bat (servidor local), no con doble clic
// sobre index.html. Si algo no carga, el juego usa las formas
// simples hechas por código.
// ============================================================

// Hace que los colores escritos como 0xRRGGBB se vean igual que en
// cualquier editor de imágenes al usar iluminación realista.
THREE.ColorManagement.legacyMode = false;

// Aquí quedan los recursos ya cargados. null o lista vacía = no disponible.
const RECURSOS = {
  nave: null,     // modelo de la nave
  rocas: [],      // modelos de roca para los campos de asteroides
  moneda: null,   // modelo del objeto que se recoge
  fondo: null,    // imagen panorámica del espacio
};

// Los modelos descargados vienen con tamaños y centros muy distintos.
// Esta función mete cada uno en una "caja" estándar: centrado en el
// origen y con tamaño 1 en su lado más largo. Después basta con
// escalarlo al tamaño que queramos.
function normalizarModelo(objeto) {
  const caja = new THREE.Box3().setFromObject(objeto);
  const centro = caja.getCenter(new THREE.Vector3());
  const medidas = caja.getSize(new THREE.Vector3());
  const ladoMayor = Math.max(medidas.x, medidas.y, medidas.z);

  objeto.position.sub(centro);              // centrar
  const contenedor = new THREE.Group();
  contenedor.add(objeto);
  contenedor.scale.setScalar(1 / ladoMayor); // tamaño 1

  const plantilla = new THREE.Group();
  plantilla.add(contenedor);
  return plantilla;
}

// Carga todo y, al acabar, llama a alTerminar(fallos), donde fallos es
// el número de archivos que no se pudieron cargar.
function cargarRecursos(alTerminar) {
  const cargadorModelos = new THREE.GLTFLoader();
  const cargadorImagenes = new THREE.TextureLoader();
  let pendientes = 0;
  let fallos = 0;

  // Cada archivo tarda un tiempo distinto en llegar. Llevamos la cuenta
  // de cuántos faltan y avisamos cuando ya no queda ninguno.
  const terminarUno = () => {
    pendientes -= 1;
    if (pendientes === 0) alTerminar(fallos);
  };
  const fallar = () => { fallos += 1; terminarUno(); };

  const cargarModelo = (ruta, alCargar) => {
    pendientes += 1;
    cargadorModelos.load(ruta, (gltf) => {
      alCargar(normalizarModelo(gltf.scene));
      terminarUno();
    }, undefined, fallar);
  };

  cargarModelo(CONFIG.MODELO_NAVE, (modelo) => { RECURSOS.nave = modelo; });
  cargarModelo(CONFIG.MODELO_MONEDA, (modelo) => { RECURSOS.moneda = modelo; });
  CONFIG.MODELOS_ROCA.forEach((ruta) => {
    cargarModelo(ruta, (modelo) => { RECURSOS.rocas.push(modelo); });
  });

  // Fondo: una imagen panorámica que envuelve toda la escena.
  pendientes += 1;
  cargadorImagenes.load(CONFIG.IMAGEN_FONDO, (textura) => {
    textura.mapping = THREE.EquirectangularReflectionMapping; // "enrollar" la imagen como una esfera
    textura.encoding = THREE.sRGBEncoding;
    RECURSOS.fondo = textura;
    terminarUno();
  }, undefined, fallar);
}
