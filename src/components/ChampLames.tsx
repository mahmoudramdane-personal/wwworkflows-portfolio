"use client";

import { useEffect, useRef } from "react";

// Fond de l'accueil : une façade de lames verticales (brise-soleil) en vue de face, très pâle.
// Les lames ondulent lentement ; près du curseur elles pivotent davantage et prennent le bleu d'accent.
export default function ChampLames({ className = "" }: { className?: string }) {
  const hote = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = hote.current;
    if (!el) return;
    let arret = false;
    let nettoyer = () => {};

    import("three").then((THREE) => {
      if (arret) return;
      const calme = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const rendu = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      rendu.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      el.appendChild(rendu.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
      camera.position.set(0, 0, 40);
      camera.lookAt(0, 0, 0);

      scene.add(new THREE.HemisphereLight(0xffffff, 0xe4e4e8, 2.4));
      const soleil = new THREE.DirectionalLight(0xffffff, 1.4);
      soleil.position.set(-20, 10, 14);
      scene.add(soleil);

      // Façade : NX lames par bande, NY bandes (étages)
      const NX = 210, NY = 16, PAS_X = 0.62, PAS_Y = 2.5, HAUT_LAME = 2.2;
      const lame = new THREE.BoxGeometry(0.05, HAUT_LAME, 0.9);
      const matiere = new THREE.MeshStandardMaterial({ roughness: 0.9, metalness: 0 });
      const lames = new THREE.InstancedMesh(lame, matiere, NX * NY);
      scene.add(lames);

      const blanc = new THREE.Color(0xf6f6f3), bleu = new THREE.Color(0x2b44ff), c = new THREE.Color();
      const m = new THREE.Matrix4(), q = new THREE.Quaternion(), axeY = new THREE.Vector3(0, 1, 0);
      const pos = new THREE.Vector3(), un = new THREE.Vector3(1, 1, 1);

      // Curseur en coordonnées de la façade
      const cible = new THREE.Vector2(999, 999), lisse = new THREE.Vector2(999, 999);
      const bouge = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        if (e.clientY < r.top || e.clientY > r.bottom) return cible.set(999, 999);
        const u = (e.clientX - r.left) / r.width, v = (e.clientY - r.top) / r.height;
        cible.set(camera.left + u * (camera.right - camera.left), camera.top - v * (camera.top - camera.bottom));
      };
      window.addEventListener("pointermove", bouge, { passive: true });

      const taille = () => {
        const w = el.clientWidth, h = el.clientHeight;
        rendu.setSize(w, h, false);
        const demiH = (NY * PAS_Y) / 2 - 0.4, demiL = (demiH * w) / h;
        camera.left = -demiL; camera.right = demiL; camera.top = demiH; camera.bottom = -demiH;
        camera.updateProjectionMatrix();
      };
      taille();
      const obsTaille = new ResizeObserver(taille);
      obsTaille.observe(el);

      let visible = true;
      const obsVue = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
      obsVue.observe(el);

      const horloge = new THREE.Clock();
      let image = 0;
      const dessiner = () => {
        const t = calme ? 0 : horloge.getElapsedTime();
        lisse.lerp(cible, 0.07);
        let i = 0;
        for (let iy = 0; iy < NY; iy++) {
          for (let ix = 0; ix < NX; ix++) {
            const x = (ix - (NX - 1) / 2) * PAS_X, y = (iy - (NY - 1) / 2) * PAS_Y;
            const d = Math.hypot(x - lisse.x, (y - lisse.y) * 0.8);
            const proche = Math.exp(-(d * d) / 16);
            const vague = 0.35 + Math.sin(x * 0.22 - y * 0.35 - t * 0.6) * 0.3;
            q.setFromAxisAngle(axeY, vague + proche * 1.1);
            pos.set(x, y, 0);
            m.compose(pos, q, un);
            lames.setMatrixAt(i, m);
            lames.setColorAt(i, c.copy(blanc).lerp(bleu, Math.min(1, proche * 1.2)));
            i++;
          }
        }
        lames.instanceMatrix.needsUpdate = true;
        if (lames.instanceColor) lames.instanceColor.needsUpdate = true;
        rendu.render(scene, camera);
      };

      const boucle = () => {
        image = requestAnimationFrame(boucle);
        if (visible) dessiner();
      };
      if (calme) dessiner();
      else boucle();

      nettoyer = () => {
        cancelAnimationFrame(image);
        window.removeEventListener("pointermove", bouge);
        obsTaille.disconnect();
        obsVue.disconnect();
        lame.dispose(); matiere.dispose(); rendu.dispose();
        rendu.domElement.remove();
      };
    });

    return () => {
      arret = true;
      nettoyer();
    };
  }, []);

  return <div ref={hote} className={className} aria-hidden="true" />;
}
