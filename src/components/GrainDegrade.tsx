"use client";

import { useEffect, useRef } from "react";

// Dégradé granuleux maison (WebGL brut, sans bibliothèque) : papier en haut, bleu WWW plein en bas.
// Entre les deux, de grandes taches de couleur très douces, tirées au hasard à chaque visite,
// qui dérivent lentement ; une tache suit le curseur. Grain de pellicule par-dessus.

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

const N = 7;
const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uT;
uniform vec4 uTaches[${N}];   // x, y (0..1), rayon horizontal, poids (+ bleu / - papier)
uniform float uHaut[${N}];   // rayon vertical
uniform float uMode;          // 0 : fondu vers le footer ; 1 : en-tête de page (papier, bleu, encre)

// Hachage sans motif visible (Dave Hoskins) : le grain ne doit pas faire de diagonales
float h(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float bruit(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(h(i), h(i + vec2(1, 0)), u.x), mix(h(i + vec2(0, 1)), h(i + vec2(1, 1)), u.x), u.y);
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;            // y vers le haut : 1 = haut du bloc
  float ar = uRes.x / uRes.y;
  // Légère irrégularité des bords, à très grande échelle
  vec2 w = vec2(bruit(uv * 2.0 + uT * 0.03), bruit(uv * 2.0 + 9.0 - uT * 0.03)) - 0.5;
  vec2 q = uv + w * 0.12;

  float f = uMode < 0.5 ? pow(1.0 - q.y, 1.4) * 1.3 - 0.25 : 0.0;
  for (int k = 0; k < ${N}; k++) {
    vec4 t = uTaches[k];
    vec2 d = (q - t.xy) * vec2(ar, 1.0) / vec2(t.z, uHaut[k]);
    f += t.w * exp(-dot(d, d));
  }
  vec3 papier = vec3(0.953, 0.953, 0.941);
  vec3 lavande = vec3(0.72, 0.76, 1.0);
  vec3 bleu = vec3(0.169, 0.267, 1.0);
  vec3 encre = vec3(0.067, 0.067, 0.078);
  vec3 c;
  if (uMode < 0.5) {
    f = mix(f, 0.0, smoothstep(0.8, 1.0, uv.y));    // papier franc tout en haut
    f = mix(f, 1.0, smoothstep(0.14, 0.0, uv.y));   // bleu plein tout en bas
    f = clamp(f, 0.0, 1.0);
    c = mix(papier, lavande, smoothstep(0.1, 0.55, f));
    c = mix(c, bleu, smoothstep(0.5, 0.92, f));
  } else {
    // Le texte reste sur le papier : taches à droite (ordinateur) ou en bas (téléphone)
    float m = ar > 1.0 ? smoothstep(0.34, 0.8, q.x) : smoothstep(0.62, 0.86, 1.0 - q.y);
    m *= smoothstep(0.0, ar > 1.0 ? 0.3 : 0.08, uv.y);   // retour au papier en bas : pas de bord coupé
    f = clamp(f * m * (ar > 1.0 ? 1.0 : 0.72), 0.0, 1.2);
    c = mix(papier, bleu, smoothstep(0.12, 0.55, f));
    c = mix(c, encre, smoothstep(0.62, 1.1, f));
  }

  // Grain de pellicule
  // Pas de grain ici : le même voile .grain-aplat que tout le site est posé par-dessus (teintes identiques)
  gl_FragColor = vec4(c, 1.0);
}`;

// Taches tirées au hasard : position, rayon, poids, et une dérive lente propre à chacune
function tirer(entete: boolean, portrait: boolean) {
  const r = Math.random;
  return Array.from({ length: N - 1 }, (_, k) => ({
    x: entete && !portrait ? 0.5 + r() * 0.55 : r(),
    y: entete && portrait ? 0.04 + r() * 0.28 : 0.05 + r() * 0.8,
    rayon: 0.2 + r() * 0.55,
    haut: 0.12 + r() * 0.3,
    poids: k % 3 === 2 ? -(0.35 + r() * 0.3) : (entete ? 0.6 + r() * 0.5 : 0.45 + r() * 0.45),
    ax: 0.08 + r() * 0.18, ay: 0.05 + r() * 0.1,
    vx: 0.04 + r() * 0.08, vy: 0.03 + r() * 0.07,
    px: r() * 6.28, py: r() * 6.28,
  }));
}

export default function GrainDegrade({
  className = "",
  mode = "fondu",
}: {
  className?: string;
  mode?: "fondu" | "entete";
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, premultipliedAlpha: false });
    if (!gl) return;

    const shader = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, shader(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uT = gl.getUniformLocation(prog, "uT");
    const uTaches = gl.getUniformLocation(prog, "uTaches");
    const uHaut = gl.getUniformLocation(prog, "uHaut");
    const cadre = canvas.getBoundingClientRect();
    const taches = tirer(mode === "entete", cadre.width < cadre.height);
    gl.uniform1f(gl.getUniformLocation(prog, "uMode"), mode === "entete" ? 1 : 0);
    const valeurs = new Float32Array(N * 4);
    const hauts = new Float32Array([...taches.map((a) => a.haut), 0.22]);

    const calme = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cible = { x: 0.5, y: 0.5, f: 0 };
    const souris = { x: 0.5, y: 0.5, f: 0 };

    const taille = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const r = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(r.width * dpr));
      canvas.height = Math.max(1, Math.round(r.height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    taille();
    const ro = new ResizeObserver(taille);
    ro.observe(canvas);

    const bouge = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const dedans = e.clientY >= r.top && e.clientY <= r.bottom;
      cible.x = (e.clientX - r.left) / r.width;
      cible.y = 1 - (e.clientY - r.top) / r.height;
      cible.f = dedans ? 1 : 0;
    };
    window.addEventListener("pointermove", bouge, { passive: true });

    let visible = false;
    let raf = 0;
    const t0 = performance.now();
    const dessine = () => {
      souris.x += (cible.x - souris.x) * 0.06;
      souris.y += (cible.y - souris.y) * 0.06;
      souris.f += (cible.f - souris.f) * 0.04;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      const t = calme ? 12 : (performance.now() - t0) / 1000;
      gl.uniform1f(uT, t);
      taches.forEach((a, k) => {
        valeurs[k * 4] = a.x + Math.sin(t * a.vx + a.px) * a.ax;
        valeurs[k * 4 + 1] = a.y + Math.sin(t * a.vy + a.py) * a.ay;
        valeurs[k * 4 + 2] = a.rayon;
        valeurs[k * 4 + 3] = a.poids;
      });
      // Dernière tache : suit le curseur, n'existe que quand il est dans le bloc
      valeurs[(N - 1) * 4] = souris.x;
      valeurs[(N - 1) * 4 + 1] = souris.y;
      valeurs[(N - 1) * 4 + 2] = 0.22;
      valeurs[(N - 1) * 4 + 3] = 0.5 * souris.f;
      gl.uniform4fv(uTaches, valeurs);
      gl.uniform1fv(uHaut, hauts);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (visible && !calme) raf = requestAnimationFrame(dessine);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(dessine);
    });
    io.observe(canvas);
    dessine();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", bouge);
    };
  }, [mode]);

  return <canvas ref={ref} className={`block w-full h-full ${className}`} aria-hidden="true" />;
}
