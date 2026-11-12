// ============================================================
// TÚNEL
// Construye el túnel como líneas brillantes: un marco rectangular
// cada pocos metros y cuatro líneas largas en las esquinas.
// Los marcos pasando a los lados son lo que da sensación de velocidad.
// ============================================================

// Devuelve un grupo (conjunto de objetos 3D) con el túnel y la meta.
function crearTunel(largo) {
  const grupo = new THREE.Group();

  const mitadAncho = CONFIG.TUNEL_ANCHO / 2;
  const mitadAlto = CONFIG.TUNEL_ALTO / 2;
  // El túnel sigue un poco más allá de la meta para que no se vea "el final".
  const fin = -(largo + CONFIG.NIEBLA_LEJOS);

  // Guardamos los puntos de dos en dos: cada pareja es un segmento de línea.
  const puntos = [];
  const linea = (x1, y1, z1, x2, y2, z2) => {
    puntos.push(new THREE.Vector3(x1, y1, z1), new THREE.Vector3(x2, y2, z2));
  };

  // Marcos rectangulares. Recuerda: avanzar es ir hacia Z negativo.
  for (let z = 0; z >= fin; z -= CONFIG.SEPARACION_AROS) {
    linea(-mitadAncho, -mitadAlto, z,  mitadAncho, -mitadAlto, z); // suelo
    linea( mitadAncho, -mitadAlto, z,  mitadAncho,  mitadAlto, z); // pared derecha
    linea( mitadAncho,  mitadAlto, z, -mitadAncho,  mitadAlto, z); // techo
    linea(-mitadAncho,  mitadAlto, z, -mitadAncho, -mitadAlto, z); // pared izquierda
  }

  // Cuatro líneas largas en las esquinas.
  linea(-mitadAncho, -mitadAlto, 0, -mitadAncho, -mitadAlto, fin);
  linea( mitadAncho, -mitadAlto, 0,  mitadAncho, -mitadAlto, fin);
  linea( mitadAncho,  mitadAlto, 0,  mitadAncho,  mitadAlto, fin);
  linea(-mitadAncho,  mitadAlto, 0, -mitadAncho,  mitadAlto, fin);

  const geometria = new THREE.BufferGeometry().setFromPoints(puntos);
  const material = new THREE.LineBasicMaterial({ color: CONFIG.COLOR_TUNEL });
  grupo.add(new THREE.LineSegments(geometria, material));

  // Meta: un plano verde semitransparente al final del nivel.
  const meta = new THREE.Mesh(
    new THREE.PlaneGeometry(CONFIG.TUNEL_ANCHO, CONFIG.TUNEL_ALTO),
    new THREE.MeshBasicMaterial({
      color: CONFIG.COLOR_META,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
    })
  );
  meta.position.z = -largo;
  grupo.add(meta);

  return grupo;
}
