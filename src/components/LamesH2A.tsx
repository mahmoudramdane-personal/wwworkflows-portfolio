"use client";

import { useEffect, useRef, useState } from "react";

// H2A · La Bascule : fragment de façade (angle arrondi, 5 niveaux) dont on règle les lames de la double peau.
// Porté du prototype _AGENT/H2A/WEB/h2a_lames_parametriques.html (session WWW · H2A BASCULE), sans ajout.
// three est chargé seulement dans le navigateur (import dynamique), le rendu est libéré au démontage.
// Embed dans un corps de cas : {{module:h2a-lames}}

type Rythme = "regulier" | "quinconce" | "aleatoire" | "crescendo";
type Params = { prof: number; ep: number; esp: number; rythme: Rythme };

const PRESETS: { p: [number, number, number]; libelle: string }[] = [
  { p: [30, 10, 60], libelle: "30×10 · 60" },
  { p: [30, 10, 80], libelle: "30×10 · 80" },
  { p: [40, 10, 60], libelle: "40×10 · 60 · retenue" },
  { p: [40, 10, 80], libelle: "40×10 · 80" },
];
const RYTHMES: { r: Rythme; libelle: string }[] = [
  { r: "regulier", libelle: "Régulier" },
  { r: "quinconce", libelle: "Quinconce" },
  { r: "aleatoire", libelle: "Aléatoire" },
  { r: "crescendo", libelle: "Crescendo" },
];
const VUES = {
  rue: { pos: [-30, 9, 32], cible: [-4, 7, -3], libelle: "Depuis la rue" },
  coursive: { pos: [-6.5, 8.0, -1.4], cible: [6, 7.6, 3.5], libelle: "Depuis la coursive" },
} as const;
type NomVue = keyof typeof VUES;

// Géométrie du fragment (m) : niveaux lus dans la maquette de travail
const NIVEAUX = [-0.8, 3.2, 6.2, 9.4, 12.6, 16.1]; // bas des étages RDC → R+4, puis toiture
const COURSIVE = 2.2; // profondeur coursives / terrasses, d'après le carnet
const DROIT = 13,
  RAYON = 7; // façade droite puis angle arrondi
const LONGUEUR = DROIT + (Math.PI * RAYON) / 2;
const MAX = 6000;

// Point et normale (vers l'extérieur) le long de la façade, abscisse curviligne s
function surFacade(s: number, retrait = 0) {
  if (s <= DROIT) return { x: s - DROIT, z: retrait, nx: 0, nz: 1 };
  const a = (s - DROIT) / RAYON; // 0 → π/2
  const nx = Math.sin(a),
    nz = Math.cos(a);
  return { x: (RAYON - retrait) * nx, z: -RAYON + (RAYON - retrait) * nz, nx, nz };
}

function hasard(seed: number) {
  return () => (seed = (seed * 16807) % 2147483647) / 2147483647;
}

function positions(P: Params, etage: number) {
  const e = P.esp / 100,
    xs: number[] = [];
  if (P.rythme === "aleatoire") {
    const r = hasard(97 + etage * 31);
    let s = e * r();
    while (s < LONGUEUR) {
      xs.push(s);
      s += e * (0.45 + 1.1 * r());
    }
  } else {
    const pas = P.rythme === "crescendo" ? e * (0.6 + 0.25 * etage) : e;
    const dec = P.rythme === "quinconce" && etage % 2 ? pas / 2 : 0;
    for (let s = pas / 2 + dec; s < LONGUEUR; s += pas) xs.push(s);
  }
  return xs;
}

type Scene3D = { recalculer: (P: Params) => number; vue: (nom: NomVue) => void; liberer: () => void };

export default function LamesH2A() {
  const hote = useRef<HTMLDivElement>(null);
  const scene3d = useRef<Scene3D | null>(null);
  const [P, setP] = useState<Params>({ prof: 40, ep: 10, esp: 60, rythme: "regulier" });
  const [vue, setVue] = useState<NomVue>("rue");
  const [nLames, setNLames] = useState(0);
  const [pret, setPret] = useState(false);

  // Mise en place de la scène, une seule fois
  useEffect(() => {
    let annule = false;
    (async () => {
      const THREE = await import("three");
      const { OrbitControls } = await import("three/examples/jsm/controls/OrbitControls.js");
      const el = hote.current;
      if (annule || !el) return;

      const contour = (retrait: number, n = 64) => {
        const pts = [];
        for (let i = 0; i <= n; i++) {
          const p = surFacade((LONGUEUR * i) / n, 0);
          pts.push(new THREE.Vector2(p.x - p.nx * retrait, p.z - p.nz * retrait));
        }
        return pts;
      };

      const rendu = new THREE.WebGLRenderer({ antialias: true });
      rendu.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      rendu.shadowMap.enabled = true;
      rendu.shadowMap.type = THREE.PCFSoftShadowMap;
      rendu.domElement.className = "absolute inset-0 block w-full h-full";
      rendu.domElement.style.touchAction = "none";
      el.prepend(rendu.domElement);
      const scene = new THREE.Scene();
      scene.background = new THREE.Color("#F3F3F0");
      const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 400);
      const ctrl = new OrbitControls(camera, rendu.domElement);
      ctrl.enableDamping = true;
      ctrl.maxPolarAngle = Math.PI * 0.55;
      ctrl.minDistance = 3;
      ctrl.maxDistance = 80;

      scene.add(new THREE.HemisphereLight("#ffffff", "#c9c6bf", 1.4));
      const soleil = new THREE.DirectionalLight("#ffffff", 2.2);
      soleil.position.set(-18, 28, 22);
      soleil.castShadow = true;
      soleil.shadow.mapSize.set(2048, 2048);
      Object.assign(soleil.shadow.camera, { left: -22, right: 22, top: 22, bottom: -10, near: 1, far: 90 });
      soleil.shadow.bias = -0.0004;
      scene.add(soleil);

      const mat = {
        sol: new THREE.MeshStandardMaterial({ color: "#E6E6E1", roughness: 1 }),
        dalle: new THREE.MeshStandardMaterial({ color: "#D6D6D1", roughness: 0.9 }),
        verre: new THREE.MeshStandardMaterial({ color: "#7E93AD", roughness: 0.15, metalness: 0.1, transparent: true, opacity: 0.55 }),
        mur: new THREE.MeshStandardMaterial({ color: "#EDEDEA", roughness: 0.95 }),
        lame: new THREE.MeshStandardMaterial({ color: "#FAFAF7", roughness: 0.6 }),
      };

      const sol = new THREE.Mesh(new THREE.PlaneGeometry(120, 120), mat.sol);
      sol.rotation.x = -Math.PI / 2;
      sol.position.y = NIVEAUX[0];
      sol.receiveShadow = true;
      scene.add(sol);

      // Dalles : bande extrudée qui suit la façade (de la peau jusqu'au fond de la coursive et au-delà)
      const bande = (ret0: number, ret1: number, y: number, h: number, m: InstanceType<typeof THREE.Material>) => {
        const ext = contour(ret0),
          int = contour(ret1).reverse();
        const g = new THREE.ExtrudeGeometry(new THREE.Shape([...ext, ...int]), { depth: h, bevelEnabled: false, curveSegments: 1 });
        g.rotateX(Math.PI / 2);
        g.translate(0, y + h, 0);
        const mesh = new THREE.Mesh(g, m);
        mesh.castShadow = mesh.receiveShadow = true;
        scene.add(mesh);
      };
      for (let k = 1; k < NIVEAUX.length; k++) bande(0, COURSIVE + 6, NIVEAUX[k] - 0.3, 0.3, mat.dalle);
      bande(0.05, COURSIVE + 6, NIVEAUX[0], 0.05, mat.dalle);

      // Vitrage et trumeaux au fond de la coursive (alternés pour lire les logements derrière)
      const paroi = (ret: number, y0: number, y1: number) => {
        const n = 24;
        for (let i = 0; i < n; i++) {
          const a = surFacade((LONGUEUR * i) / n),
            b = surFacade((LONGUEUR * (i + 1)) / n);
          const p0 = new THREE.Vector3(a.x - a.nx * ret, 0, a.z - a.nz * ret),
            p1 = new THREE.Vector3(b.x - b.nx * ret, 0, b.z - b.nz * ret);
          const mesh = new THREE.Mesh(new THREE.PlaneGeometry(p0.distanceTo(p1), y1 - y0), i % 3 === 2 ? mat.mur : mat.verre);
          mesh.position.set((p0.x + p1.x) / 2, (y0 + y1) / 2, (p0.z + p1.z) / 2);
          mesh.rotation.y = Math.atan2(-(p1.z - p0.z), p1.x - p0.x);
          mesh.receiveShadow = true;
          scene.add(mesh);
        }
      };
      for (let k = 0; k < NIVEAUX.length - 1; k++)
        paroi(k === 0 ? 0.6 : COURSIVE, NIVEAUX[k] + (k === 0 ? 0.05 : 0), NIVEAUX[k + 1] - 0.3);

      // Les lames : une InstancedMesh recalculée à chaque réglage
      const lames = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), mat.lame, MAX);
      lames.castShadow = lames.receiveShadow = true;
      scene.add(lames);
      const m4 = new THREE.Matrix4(),
        q = new THREE.Quaternion(),
        v = new THREE.Vector3(),
        sc = new THREE.Vector3(),
        haut = new THREE.Vector3(0, 1, 0);

      const recalculer = (Pr: Params) => {
        const prof = Pr.prof / 100,
          ep = Pr.ep / 100;
        let n = 0;
        for (let k = 0; k < NIVEAUX.length - 1 && n < MAX; k++) {
          const y0 = NIVEAUX[k] + (k === 0 ? 0.05 : 0),
            y1 = NIVEAUX[k + 1] - 0.3;
          for (const s of positions(Pr, k)) {
            if (n >= MAX) break;
            const p = surFacade(s);
            v.set(p.x + (p.nx * prof) / 2, (y0 + y1) / 2, p.z + (p.nz * prof) / 2); // la lame est en saillie, devant le nez de dalle
            q.setFromAxisAngle(haut, Math.atan2(p.nx, p.nz));
            sc.set(ep, y1 - y0, prof);
            lames.setMatrixAt(n++, m4.compose(v, q, sc));
          }
        }
        lames.count = n;
        lames.instanceMatrix.needsUpdate = true;
        // Sphère englobante recalculée : sinon three garde celle d'avant le placement et cache les lames vues de près
        lames.computeBoundingSphere();
        return n;
      };

      const allerA = (nom: NomVue) => {
        const V = VUES[nom];
        camera.position.set(V.pos[0], V.pos[1], V.pos[2]);
        ctrl.target.set(V.cible[0], V.cible[1], V.cible[2]);
        ctrl.update();
      };

      const taille = () => {
        const w = el.clientWidth,
          h = el.clientHeight;
        rendu.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      const obs = new ResizeObserver(taille);
      obs.observe(el);
      taille();
      rendu.setAnimationLoop(() => {
        ctrl.update();
        rendu.render(scene, camera);
      });

      scene3d.current = {
        recalculer,
        vue: allerA,
        liberer: () => {
          obs.disconnect();
          rendu.setAnimationLoop(null);
          ctrl.dispose();
          scene.traverse((o) => {
            const m = o as { geometry?: { dispose: () => void } };
            m.geometry?.dispose();
          });
          Object.values(mat).forEach((m) => m.dispose());
          rendu.dispose();
          rendu.forceContextLoss();
          rendu.domElement.remove();
        },
      };
      setPret(true);
    })();
    return () => {
      annule = true;
      scene3d.current?.liberer();
      scene3d.current = null;
    };
  }, []);

  // Réglages et vue appliqués à la scène
  useEffect(() => {
    if (pret && scene3d.current) setNLames(scene3d.current.recalculer(P));
  }, [P, pret]);
  useEffect(() => {
    if (pret) scene3d.current?.vue(vue);
  }, [vue, pret]);

  // Plein vu de face = épaisseur cumulée des lames / longueur de façade, sur tous les étages
  const plein = Math.min(100, Math.round(((nLames * P.ep) / 100 / (LONGUEUR * (NIVEAUX.length - 1))) * 100));
  const preset = `${P.prof},${P.ep},${P.esp}`;
  const bouton = (actif: boolean) =>
    `mono text-[11px] px-2.5 py-1.5 border transition-colors duration-300 ${
      actif ? "bg-bleu border-bleu text-white" : "bg-white border-trait hover:border-encre"
    }`;

  const curseur = (cle: "prof" | "ep" | "esp", libelle: string, min: number, max: number, pas: number) => (
    <div>
      <label htmlFor={`lames-${cle}`} className="flex justify-between text-[13px] mb-1.5">
        {libelle} <output className="mono text-bleu">{P[cle]} cm</output>
      </label>
      <input
        id={`lames-${cle}`}
        type="range"
        min={min}
        max={max}
        step={pas}
        value={P[cle]}
        onChange={(e) => setP({ ...P, [cle]: Number(e.target.value) })}
        className="w-full accent-[#2B44FF]"
      />
    </div>
  );

  return (
    <figure className="figure-cas">
      <div className="grid md:grid-cols-[minmax(0,1fr)_280px] bg-white border border-trait">
        <div ref={hote} className="relative h-[380px] md:h-auto md:min-h-[540px] bg-papier overflow-hidden">
          <div className="absolute left-3 top-3 z-10 flex gap-1.5">
            {(Object.keys(VUES) as NomVue[]).map((nom) => (
              <button key={nom} type="button" onClick={() => setVue(nom)} className={bouton(vue === nom)} aria-pressed={vue === nom}>
                {VUES[nom].libelle}
              </button>
            ))}
          </div>
          <div className="absolute left-3 bottom-2.5 z-10 mono text-[10px] text-gris pointer-events-none">
            glisser pour tourner · molette ou pincer pour zoomer
          </div>
        </div>

        <div className="p-5 border-t md:border-t-0 md:border-l border-trait flex flex-col gap-5">
          <div>
            <div className="mono text-[11px] text-gris uppercase tracking-wider mb-2">Combinaisons étudiées</div>
            <div className="flex flex-wrap gap-1.5">
              {PRESETS.map((x) => (
                <button
                  key={x.libelle}
                  type="button"
                  onClick={() => setP({ ...P, prof: x.p[0], ep: x.p[1], esp: x.p[2] })}
                  className={bouton(preset === x.p.join(","))}
                >
                  {x.libelle}
                </button>
              ))}
            </div>
          </div>
          {curseur("prof", "Profondeur de la lame", 10, 60, 5)}
          {curseur("ep", "Épaisseur", 4, 20, 1)}
          {curseur("esp", "Espacement (entraxe)", 25, 120, 5)}
          <div>
            <div className="mono text-[11px] text-gris uppercase tracking-wider mb-2">Rythme</div>
            <div className="flex flex-wrap gap-1.5">
              {RYTHMES.map((x) => (
                <button key={x.r} type="button" onClick={() => setP({ ...P, rythme: x.r })} className={bouton(P.rythme === x.r)}>
                  {x.libelle}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2.5 pt-3.5 border-t border-trait">
            <div>
              <b className="block mono font-medium" style={{ fontSize: 18 }}>{nLames}</b>
              <span className="text-xs text-gris">lames sur ce fragment</span>
            </div>
            <div>
              <b className="block mono font-medium" style={{ fontSize: 18 }}>{plein} %</b>
              <span className="text-xs text-gris">de plein vu de face</span>
            </div>
          </div>
          <p className="text-xs text-gris">
            Fragment d&apos;environ 20 m sur 5 niveaux. Les valeurs « plein » sont indicatives (vue frontale, sans soleil).
          </p>
        </div>
      </div>
    </figure>
  );
}
