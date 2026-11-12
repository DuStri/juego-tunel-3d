// ============================================================
// OBSTÁCULO (campo de asteroides)
// Un bloque de asteroides que tapa parte del túnel. No se abre
// disparando: hay que esquivarlo, o destruirlo con el pulso.
//   - Pilar: va del suelo al techo  → se esquiva hacia los lados.
//   - Viga:  va de pared a pared    → se esquiva por arriba o por abajo.
//
// Para los choques se usa una caja invisible (ancho x alto); las
// rocas son solo el dibujo que rellena esa caja.
// ============================================================

// --- Piezas compartidas por todos los asteroides ---
// Crear una forma 3D cuesta memoria, así que hacemos unas pocas
// variantes de roca una sola vez y las reutilizamos girándolas.
const GEOMETRIAS_ROCA = crearGeometriasRoca(5);
const MATERIAL_ROCA = new THREE.MeshStandardMaterial({
  color: CONFIG.COLOR_ASTEROIDE,
  flatShading: true,   // caras planas: aspecto de roca tallada
  roughness: 1,
});

// Parte de una esfera de caras planas y hunde/levanta sus puntos
// para que parezca una roca irregular.
function crearGeometriasRoca(cantidad) {
  const geometrias = [];
  for (let i = 0; i < cantidad; i++) {
    const geometria = new THREE.IcosahedronGeometry(1, 1);
    const posiciones = geometria.attributes.position;
    const semilla = i * 12.9898 + 1;
    for (let v = 0; v < posiciones.count; v++) {
      const x = posiciones.getX(v);
      const y = posiciones.getY(v);
      const z = posiciones.getZ(v);
      // La deformación depende solo de la posición del punto, así los
      // puntos que comparten sitio se mueven juntos y no quedan grietas.
      const relieve = Math.sin(x * 3.1 + semilla) * Math.cos(y * 2.7 + semilla * 1.3)
                    + Math.sin(z * 3.7 + semilla * 0.7);
      const factor = 1 + 0.16 * relieve;
      posiciones.setXYZ(v, x * factor, y * factor, z * factor);
    }
    geometria.computeVertexNormals(); // recalcular cómo rebota la luz
    geometrias.push(geometria);
  }
  return geometrias;
}

// Generador de números "al azar" repetible: con la misma semilla da
// siempre la misma secuencia. Así el nivel se ve igual en cada intento.
function crearAzar(semilla) {
  let estadoAzar = Math.floor(semilla * 1000) + 12345;
  return function () {
    estadoAzar = (estadoAzar * 1664525 + 1013904223) % 4294967296;
    return estadoAzar / 4294967296;
  };
}

class Obstaculo {
  // datos = { distancia, x, y, ancho, alto } tal como viene de niveles.js.
  // Lo que no se indique toma un valor por defecto: centrado y ocupando
  // todo el túnel en esa dirección.
  constructor(escena, datos) {
    this.escena = escena;
    this.z = -datos.distancia;   // avanzar es ir hacia Z negativo
    this.x = datos.x !== undefined ? datos.x : 0;
    this.y = datos.y !== undefined ? datos.y : 0;
    this.ancho = datos.ancho !== undefined ? datos.ancho : CONFIG.TUNEL_ANCHO;
    this.alto = datos.alto !== undefined ? datos.alto : CONFIG.TUNEL_ALTO;
    this.destruido = false;

    this.grupo = new THREE.Group();
    this.grupo.position.set(this.x, this.y, this.z);
    this.crearRocas(datos.distancia);
    escena.add(this.grupo);
  }

  // Rellena la caja del obstáculo con una rejilla de rocas, cada una
  // con tamaño, giro y posición ligeramente distintos.
  crearRocas(semilla) {
    const azar = crearAzar(semilla);
    const columnas = Math.max(1, Math.round(this.ancho / CONFIG.ASTEROIDE_TAMANO));
    const filas = Math.max(1, Math.round(this.alto / CONFIG.ASTEROIDE_TAMANO));
    const celdaAncho = this.ancho / columnas;
    const celdaAlto = this.alto / filas;
    const radio = Math.min(celdaAncho, celdaAlto) * 0.62;

    for (let columna = 0; columna < columnas; columna++) {
      for (let fila = 0; fila < filas; fila++) {
        const roca = this.crearRoca(azar);
        roca.position.set(
          -this.ancho / 2 + celdaAncho * (columna + 0.5) + (azar() - 0.5) * 0.3,
          -this.alto / 2 + celdaAlto * (fila + 0.5) + (azar() - 0.5) * 0.3,
          (azar() - 0.5) * 0.6
        );
        roca.scale.multiplyScalar(radio * (0.85 + azar() * 0.35));
        roca.rotation.set(azar() * 6.28, azar() * 6.28, azar() * 6.28);
        // Cada roca recuerda su velocidad de giro.
        roca.userData.giro = (azar() - 0.5) * 1.2;
        this.grupo.add(roca);
      }
    }
  }

  // Devuelve una roca de radio 1 aproximadamente: una copia de un
  // modelo de assets/ si están cargados, o una roca hecha por código.
  crearRoca(azar) {
    if (RECURSOS.rocas.length > 0) {
      const plantilla = RECURSOS.rocas[Math.floor(azar() * RECURSOS.rocas.length)];
      const roca = plantilla.clone(); // la copia comparte forma y textura: es barata
      roca.scale.setScalar(2);        // los modelos miden 1 de lado; radio 1 = lado 2
      return roca;
    }
    const geometria = GEOMETRIAS_ROCA[Math.floor(azar() * GEOMETRIAS_ROCA.length)];
    return new THREE.Mesh(geometria, MATERIAL_ROCA);
  }

  // ¿La nave está tocando este obstáculo?
  // Se comprueba cada dirección por separado: tiene que coincidir
  // en profundidad (Z), en lateral (X) Y en altura (Y) a la vez.
  chocaCon(avatar) {
    if (this.destruido) return false;
    const coincideZ = Math.abs(avatar.z - this.z) < CONFIG.OBSTACULO_FONDO / 2 + 0.6;
    const coincideX = Math.abs(avatar.x - this.x) < (this.ancho + CONFIG.AVATAR_ANCHO) / 2;
    const coincideY = Math.abs(avatar.y - this.y) < (this.alto + CONFIG.AVATAR_ALTO) / 2;
    return coincideZ && coincideX && coincideY;
  }

  // El pulso lo alcanza: deja de ser peligroso y se desintegra.
  explotar() {
    this.destruido = true;
  }

  // Se llama en cada fotograma. dt = segundos desde el fotograma anterior.
  actualizar(dt) {
    // Las rocas giran despacio.
    this.grupo.children.forEach((roca) => { roca.rotation.y += roca.userData.giro * dt; });

    // Al ser destruido: las rocas se separan y encogen hasta desaparecer.
    if (this.destruido && this.grupo.visible) {
      const escala = this.grupo.scale.x - dt / CONFIG.TIEMPO_EXPLOSION;
      if (escala <= 0) {
        this.grupo.visible = false;
      } else {
        this.grupo.scale.setScalar(escala);
        this.grupo.children.forEach((roca) => { roca.position.multiplyScalar(1 + dt * 6); });
      }
    }
  }

  // Quita el obstáculo de la escena (al reiniciar el nivel).
  // Las formas y el material son compartidos, así que no se eliminan.
  destruir() {
    this.escena.remove(this.grupo);
  }
}
