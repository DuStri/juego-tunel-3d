// ============================================================
// BARRERA
// Una pared que corta el túnel, formada por dos mitades (como una
// puerta corredera) y una cerradura. Al acertar a la cerradura,
// las dos mitades se retiran hacia los lados.
// ============================================================
class Barrera {
  // datos = { distancia, x, y } tal como viene de niveles.js
  constructor(escena, datos) {
    this.escena = escena;
    this.z = -datos.distancia;   // avanzar es ir hacia Z negativo
    this.abierta = false;
    this.progresoApertura = 0;   // 0 = cerrada, 1 = abierta del todo

    this.grupo = new THREE.Group();
    this.grupo.position.z = this.z;

    // --- Las dos mitades de la pared ---
    const mitadAncho = CONFIG.TUNEL_ANCHO / 2;
    const geometriaMitad = new THREE.BoxGeometry(mitadAncho, CONFIG.TUNEL_ALTO, CONFIG.BARRERA_GROSOR);
    const materialPared = new THREE.MeshBasicMaterial({ color: CONFIG.COLOR_BARRERA });

    this.mitadIzquierda = new THREE.Mesh(geometriaMitad, materialPared);
    this.mitadDerecha = new THREE.Mesh(geometriaMitad, materialPared);
    // Cada mitad se centra en su lado: un cuarto del ancho total desde el centro.
    this.mitadIzquierda.position.x = -mitadAncho / 2;
    this.mitadDerecha.position.x = mitadAncho / 2;
    this.grupo.add(this.mitadIzquierda, this.mitadDerecha);

    // --- La cerradura ---
    // Un rombo (octaedro) colocado un poco por delante de la pared, del
    // lado por el que llega el jugador.
    this.cerradura = new THREE.Mesh(
      new THREE.OctahedronGeometry(CONFIG.CERRADURA_RADIO),
      new THREE.MeshBasicMaterial({ color: CONFIG.COLOR_CERRADURA })
    );
    this.cerradura.position.set(datos.x, datos.y, CONFIG.BARRERA_GROSOR / 2 + CONFIG.CERRADURA_RADIO);
    this.grupo.add(this.cerradura);

    escena.add(this.grupo);
  }

  // Se llama cuando un disparo acierta a la cerradura.
  abrir() {
    this.abierta = true;
    this.cerradura.visible = false;
  }

  // Se llama en cada fotograma. dt = segundos desde el fotograma anterior.
  actualizar(dt) {
    // La cerradura gira para llamar la atención.
    this.cerradura.rotation.y += dt * 2;

    // Animación de apertura: cada mitad se encoge hacia su pared.
    if (this.abierta && this.progresoApertura < 1) {
      this.progresoApertura = Math.min(1, this.progresoApertura + dt / CONFIG.TIEMPO_APERTURA);
      const p = this.progresoApertura;
      const cuarto = CONFIG.TUNEL_ANCHO / 4;

      this.mitadIzquierda.scale.x = 1 - p;
      this.mitadDerecha.scale.x = 1 - p;
      this.mitadIzquierda.position.x = -cuarto - p * cuarto;
      this.mitadDerecha.position.x = cuarto + p * cuarto;

      if (p >= 1) {
        this.mitadIzquierda.visible = false;
        this.mitadDerecha.visible = false;
      }
    }
  }

  // Quita la barrera de la escena (al reiniciar el nivel).
  destruir() {
    this.escena.remove(this.grupo);
    this.mitadIzquierda.geometry.dispose();
    this.mitadIzquierda.material.dispose();
    this.cerradura.geometry.dispose();
    this.cerradura.material.dispose();
  }
}
