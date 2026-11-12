// ============================================================
// AVATAR
// La nave del jugador. Avanza sola por el túnel y el jugador la
// mueve hacia los lados (eje X) y arriba/abajo (eje Y).
// ============================================================
class Avatar {
  constructor(escena) {
    // "grupo" es lo que se mueve; dentro va el dibujo de la nave.
    this.grupo = new THREE.Group();
    this.grupo.add(this.crearNaveSimple());
    escena.add(this.grupo);
    this.reiniciar();
  }

  // Nave de reserva hecha por código (un cono y unas alas). Se usa
  // mientras carga el modelo, o si el modelo no está disponible.
  crearNaveSimple() {
    const nave = new THREE.Group();

    // Cuerpo: un cono. Por defecto apunta hacia arriba, así que lo
    // tumbamos para que apunte hacia delante (Z negativo).
    const cuerpo = new THREE.Mesh(
      new THREE.ConeGeometry(0.35, 1.4, 8),
      new THREE.MeshStandardMaterial({ color: CONFIG.COLOR_AVATAR, flatShading: true })
    );
    cuerpo.rotation.x = -Math.PI / 2;

    // Alas: una caja ancha y plana, un poco hacia atrás.
    const alas = new THREE.Mesh(
      new THREE.BoxGeometry(CONFIG.AVATAR_ANCHO * 1.4, 0.08, 0.5),
      new THREE.MeshStandardMaterial({ color: CONFIG.COLOR_AVATAR_ALAS, flatShading: true })
    );
    alas.position.z = 0.35;

    nave.add(cuerpo, alas);
    return nave;
  }

  // Sustituye el dibujo de la nave por un modelo 3D ya cargado.
  usarModelo(modelo) {
    this.grupo.clear(); // quita la nave simple
    modelo.scale.setScalar(CONFIG.NAVE_TAMANO);
    modelo.rotation.y = CONFIG.NAVE_GIRO; // orientarla hacia delante
    this.grupo.add(modelo);
  }

  // Atajos para leer la posición: avatar.x, avatar.y y avatar.z
  get x() { return this.grupo.position.x; }
  get y() { return this.grupo.position.y; }
  get z() { return this.grupo.position.z; }

  // Vuelve al punto de salida (al empezar o reiniciar el nivel).
  reiniciar() {
    this.grupo.position.set(0, 0, 0);
    this.grupo.rotation.set(0, 0, 0);
  }

  // Se llama en cada fotograma mientras se juega.
  //   dirX: -1 (izquierda), 0 (quieto) o 1 (derecha)
  //   dirY: -1 (abajo), 0 (quieto) o 1 (arriba)
  //   dt:   segundos desde el fotograma anterior
  actualizar(dirX, dirY, dt) {
    // Avance automático
    this.grupo.position.z -= CONFIG.VELOCIDAD * dt;

    // Movimiento en X y en Y, sin salirse del túnel
    const limiteX = CONFIG.TUNEL_ANCHO / 2 - CONFIG.AVATAR_ANCHO / 2 - 0.1;
    const limiteY = CONFIG.TUNEL_ALTO / 2 - CONFIG.AVATAR_ALTO / 2 - 0.1;
    const nuevaX = this.grupo.position.x + dirX * CONFIG.AVATAR_VELOCIDAD_X * dt;
    const nuevaY = this.grupo.position.y + dirY * CONFIG.AVATAR_VELOCIDAD_Y * dt;
    this.grupo.position.x = Math.max(-limiteX, Math.min(limiteX, nuevaX));
    this.grupo.position.y = Math.max(-limiteY, Math.min(limiteY, nuevaY));

    // Se ladea al girar y levanta/baja el morro al subir/bajar,
    // de forma gradual (solo es estético).
    const suavizado = Math.min(1, dt * 10);
    const ladeoDeseado = -dirX * CONFIG.AVATAR_INCLINACION;
    const cabeceoDeseado = dirY * CONFIG.AVATAR_INCLINACION * 0.6;
    this.grupo.rotation.z += (ladeoDeseado - this.grupo.rotation.z) * suavizado;
    this.grupo.rotation.x += (cabeceoDeseado - this.grupo.rotation.x) * suavizado;
  }
}
