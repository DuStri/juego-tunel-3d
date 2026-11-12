// ============================================================
// MONEDA
// Objeto para recoger. Se recoge pasando con la nave por encima.
// Cada moneda carga un poco la habilidad especial.
// ============================================================

// Forma y material compartidos por todas las monedas.
const GEOMETRIA_MONEDA = new THREE.CylinderGeometry(
  CONFIG.MONEDA_RADIO, CONFIG.MONEDA_RADIO, 0.1, 20
);
const MATERIAL_MONEDA = new THREE.MeshStandardMaterial({
  color: CONFIG.COLOR_MONEDA,
  emissive: CONFIG.COLOR_MONEDA_BRILLO, // luz propia: se ve aunque esté lejos
  metalness: 0.6,
  roughness: 0.3,
});

class Moneda {
  // datos = { distancia, x, y } tal como viene de niveles.js
  constructor(escena, datos) {
    this.escena = escena;
    this.x = datos.x;
    this.y = datos.y;
    this.z = -datos.distancia;
    this.recogida = false;

    this.grupo = new THREE.Group();
    if (RECURSOS.moneda) {
      // Copia del modelo de assets/ (comparte forma y textura: es barata).
      const modelo = RECURSOS.moneda.clone();
      modelo.scale.setScalar(CONFIG.MONEDA_RADIO * 2);
      this.grupo.add(modelo);
    } else {
      // Moneda hecha por código. El cilindro está "tumbado" por defecto;
      // lo ponemos de canto, y es el grupo el que gira sobre sí mismo.
      const disco = new THREE.Mesh(GEOMETRIA_MONEDA, MATERIAL_MONEDA);
      disco.rotation.x = Math.PI / 2;
      this.grupo.add(disco);
    }
    this.grupo.position.set(this.x, this.y, this.z);
    escena.add(this.grupo);
  }

  // ¿La nave está lo bastante cerca como para recogerla?
  tocaA(avatar) {
    if (this.recogida) return false;
    return Math.abs(avatar.z - this.z) < 1.0 &&
           Math.abs(avatar.x - this.x) < CONFIG.MONEDA_ALCANCE &&
           Math.abs(avatar.y - this.y) < CONFIG.MONEDA_ALCANCE;
  }

  recoger() {
    this.recogida = true;
    this.grupo.visible = false;
  }

  // Se llama en cada fotograma: la moneda gira.
  actualizar(dt) {
    this.grupo.rotation.y += dt * 4;
  }

  // Quita la moneda de la escena (al reiniciar el nivel).
  destruir() {
    this.escena.remove(this.grupo);
  }
}
