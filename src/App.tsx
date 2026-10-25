/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import {
  motion,
  AnimatePresence,
  usePresence,
} from 'motion/react';
import {
  ArrowRight,
  ArrowUpRight,
  Plus,
  Bone,
  Dna,
  Gem,
  Leaf,
  BookOpen,
  X,
  Sparkles,
} from 'lucide-react';

interface Chapter {
  name: string;
  image: string;
}

const chaptersData: Chapter[] = [
  {
    name: 'A Era dos Dinossauros',
    image: '/assets/neo-museum/01.png',
  },
  {
    name: 'Fósseis da Vida Ancestral',
    image: '/assets/neo-museum/02.png',
  },
  {
    name: 'Répteis do Mesozoico',
    image: '/assets/neo-museum/03.png',
  },
  {
    name: 'Galeria de Fósseis Marinhos',
    image: '/assets/neo-museum/04.png',
  },
  {
    name: 'Gigantes Pré-históricos',
    image: '/assets/neo-museum/05.png',
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const letterBlock = {
  initial: { y: 120, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const navItems = [
  { label: 'Visitar', href: '#visitar' },
  { label: 'Exposições', href: '#colecao' },
  { label: 'Descobrir', href: '#explorar' },
  { label: 'Aprender', href: '#aprender' },
  { label: 'Sobre', href: '#sobre' },
];

/**
 * SandTransitionImage creates a dynamic sand / particle dissolve effect
 * using SVG feTurbulence, feDisplacementMap, feOffset, feGaussianBlur and feColorMatrix.
 */
function SandTransitionImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [isPresent, safeToRemove] = usePresence();
  const idRef = useRef(`sand-${Math.random().toString(36).substring(2, 9)}`);
  const filterId = idRef.current;
  const [progress, setProgress] = useState(isPresent ? 0 : 1);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const duration = 900;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const linear = Math.min(elapsed / duration, 1);

      if (isPresent) {
        // Entering: quartic ease-out
        const ease = 1 - Math.pow(1 - linear, 4);
        setProgress(1 - ease);
        if (linear < 1) {
          animFrameRef.current = requestAnimationFrame(step);
        }
      } else {
        // Exiting: cubic ease-in
        const ease = Math.pow(linear, 3);
        setProgress(ease);
        if (linear < 1) {
          animFrameRef.current = requestAnimationFrame(step);
        } else {
          safeToRemove?.();
        }
      }
    };

    animFrameRef.current = requestAnimationFrame(step);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPresent, safeToRemove]);

  const dispScale = progress * 150;
  const dy = isPresent ? -progress * 80 : progress * 120;
  const dx = (isPresent ? -1 : 1) * progress * 30;
  const blur = progress * 6;
  const opacity = Math.max(0, 1 - progress * 1.2);

  return (
    <>
      <svg className="absolute w-0 h-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="1.8" numOctaves="4" result="noise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale={dispScale}
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          />
          <feOffset in="displaced" dx={dx} dy={dy} result="offset" />
          <feGaussianBlur in="offset" stdDeviation={blur} result="blurred" />
          <feColorMatrix
            in="blurred"
            type="matrix"
            values={`
              1 0 0 0 0
              0 1 0 0 0
              0 0 1 0 0
              0 0 0 ${opacity} 0
            `}
          />
        </filter>
      </svg>
      <img
        src={src}
        alt={alt}
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
        style={{
          filter: progress > 0.002 ? `url(#${filterId})` : 'none',
          opacity: opacity,
        }}
        className={className}
      />
    </>
  );
}

const particlePositions = [
  [8, 18, 0.2], [17, 72, 1.8], [25, 34, 2.9], [34, 84, 0.7], [45, 15, 2.1],
  [53, 62, 1.4], [61, 28, 3.2], [70, 78, 0.4], [78, 42, 2.5], [88, 16, 1.1],
  [93, 68, 3.7], [12, 48, 2.7], [39, 55, 1.9], [66, 12, 0.9], [84, 88, 3.1],
];

function CinematicOverlay() {
  const [cursor, setCursor] = useState({ x: -100, y: -100, interactive: false });
  const [cursorVisible, setCursorVisible] = useState(false);
  const filmScenes = ['ORIGEM', 'VIDA', 'MOVIMENTO', 'EXTINÇÃO', 'DESCOBERTA'];
  const [filmScene, setFilmScene] = useState(0);

  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const interactive = target.closest('[data-cursor]') as HTMLElement | null;
      setCursor({
        x: event.clientX,
        y: event.clientY,
        interactive: Boolean(interactive),
      });
      setCursorVisible(true);
    };
    const onLeave = () => setCursorVisible(false);
    window.addEventListener('mousemove', onMove);
    document.documentElement.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setFilmScene((current) => (current + 1) % filmScenes.length);
    }, 5200);
    return () => clearInterval(interval);
  }, [filmScenes.length]);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-[#111] z-[100] origin-left"
        animate={{ scaleX: (filmScene + 1) / filmScenes.length }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
      <div className="cinema-noise" aria-hidden="true" />
      <div className="cinema-particles" aria-hidden="true">
        {particlePositions.map(([left, top, delay], index) => (
          <motion.span
            key={index}
            className="cinema-particle"
            style={{ left: `${left}%`, top: `${top}%` }}
            animate={{ y: [0, -18, 0], opacity: [0.12, 0.48, 0.12], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 5 + (index % 4), delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>
      <motion.div
        className={`cinema-cursor hidden md:flex ${cursor.interactive ? 'is-interactive' : ''}`}
        animate={{ left: cursor.x, top: cursor.y, opacity: cursorVisible ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 35, mass: 0.25 }}
        aria-hidden="true"
      />
      <div className="cinema-scene-card" aria-hidden="true">
        <span className="cinema-scene-kicker">MODO FILME · AUTOMÁTICO</span>
        <AnimatePresence mode="wait">
          <motion.span
            key={filmScene}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className="cinema-scene-name"
          >
            0{filmScene + 1} / {filmScenes.length} · {filmScenes[filmScene]}
          </motion.span>
        </AnimatePresence>
        <span className="cinema-scene-dots">
          {filmScenes.map((scene, index) => (
            <span key={scene} className={index === filmScene ? 'is-active' : ''} />
          ))}
        </span>
      </div>
    </>
  );
}

function PterosaurTransition() {
  return (
    <motion.div
      animate={{
        x: ['-8%', '8%', '-8%'],
        y: ['-56%', '-68%', '-56%'],
        rotate: [-2.5, 2.5, -2.5],
        scale: [0.9, 1.02, 0.9],
        opacity: [0.86, 1, 0.86],
      }}
      transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute top-0 left-1/2 -translate-x-1/2 w-[160vw] md:w-[1100px] pointer-events-none z-0"
    >
      <img
        src="/assets/neo-museum/pterossauro-acervo.png"
        alt="Pterossauro fóssil em voo"
        className="w-full h-auto object-contain"
      />
    </motion.div>
  );
}

const analysisStages = [
  { id: '01', label: 'CRÂNIO', text: 'Mandíbula poderosa, dentes serrilhados e uma arquitetura feita para suportar impacto.', x: '24%', y: '38%' },
  { id: '02', label: 'COLUNA', text: 'Uma sequência de vértebras preserva a mecânica de um predador em movimento.', x: '48%', y: '44%' },
  { id: '03', label: 'MEMBROS', text: 'O desenho dos membros revela equilíbrio, peso e velocidade em escala monumental.', x: '55%', y: '68%' },
  { id: '04', label: 'CAUDA', text: 'A cauda funcionava como contrapeso e estabilizador durante a corrida.', x: '78%', y: '48%' },
];

const geologicalTimeline = [
  { key: 'origem', label: 'ORIGEM', date: '4,5 BI', title: 'Formação da Terra', detail: 'Rocha, calor e poeira se organizam em um planeta.', tone: '#8f6f50' },
  { key: 'vida', label: 'VIDA', date: '3,8 BI', title: 'Primeiras formas de vida', detail: 'A vida surge nos oceanos primitivos.', tone: '#596d68' },
  { key: 'triassico', label: 'TRIÁSSICO', date: '252–201 MA', title: 'Os primeiros répteis', detail: 'Novas formas ocupam a paisagem depois da grande extinção.', tone: '#8e6048' },
  { key: 'jurassico', label: 'JURÁSSICO', date: '201–145 MA', title: 'A expansão dos gigantes', detail: 'A diversidade dos dinossauros se espalha pelo planeta.', tone: '#5c7352' },
  { key: 'cretaceo', label: 'CRETÁCEO', date: '145–66 MA', title: 'O voo dos pterossauros', detail: 'Grandes predadores e répteis alados dominam a Terra.', tone: '#a37b54' },
  { key: 'hoje', label: 'HOJE', date: 'AGORA', title: 'A investigação continua', detail: 'Cada fragmento encontrado abre uma nova pergunta.', tone: '#c4bcae' },
];

const observatoryPoints = [
  { id: '01', title: 'Estrutura óssea', text: 'Uma leitura volumétrica transforma a anatomia em uma arquitetura de luz e sombra.' },
  { id: '02', title: 'Camada fóssil', text: 'O modo material revela o peso, a textura e a permanência do espécime no tempo.' },
  { id: '03', title: 'Campo de leitura', text: 'As linhas de marcação localizam o fóssil na placa e revelam sua escala dentro do acervo.' },
];

type ObservatoryMode = 'fossil' | 'structure' | 'analysis';
const observatoryModes: { id: ObservatoryMode; label: string }[] = [
  { id: 'fossil', label: 'FÓSSIL' },
  { id: 'structure', label: 'ESTRUTURA' },
  { id: 'analysis', label: 'ANÁLISE' },
];

function ThreeSpecimenObservatory() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activePoint, setActivePoint] = useState(0);
  const [observatoryMode, setObservatoryMode] = useState<ObservatoryMode>('fossil');
  const modeRef = useRef<ObservatoryMode>('fossil');
  const point = observatoryPoints[activePoint];

  const changeMode = (mode: ObservatoryMode) => {
    modeRef.current = mode;
    setObservatoryMode(mode);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0.2, 7.5);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const exhibit = new THREE.Group();
    exhibit.rotation.z = -0.12;
    scene.add(exhibit);

    const slabMaterial = new THREE.MeshStandardMaterial({
      color: 0x17251b,
      roughness: 0.88,
      metalness: 0.06,
      transparent: true,
      opacity: 0.96,
    });
    const slab = new THREE.Mesh(new THREE.BoxGeometry(5.9, 3.45, 0.18), slabMaterial);
    exhibit.add(slab);

    const slabWireMaterial = new THREE.LineBasicMaterial({ color: 0x9dffbe, transparent: true, opacity: 0.3 });
    const slabWire = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(6.05, 3.6, 0.24)), slabWireMaterial);
    slabWire.position.z = 0.03;
    exhibit.add(slabWire);

    const fossilTexture = new THREE.TextureLoader().load('/assets/neo-museum/pterossauro-acervo.png');
    const fossilMaterial = new THREE.MeshBasicMaterial({
      map: fossilTexture,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
    });
    const fossilPlane = new THREE.Mesh(new THREE.PlaneGeometry(5.55, 3.15), fossilMaterial);
    fossilPlane.position.z = 0.15;
    exhibit.add(fossilPlane);

    const wireMaterial = new THREE.MeshBasicMaterial({ color: 0xf4eadc, wireframe: true, transparent: true, opacity: 0.2 });
    const wireLayer = new THREE.Mesh(new THREE.PlaneGeometry(5.7, 3.28, 14, 8), wireMaterial);
    wireLayer.position.z = 0.17;
    exhibit.add(wireLayer);

    const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xddc6a2, transparent: true, opacity: 0.8 });
    [-1, 1].forEach((x) => [-1, 1].forEach((y) => {
      const marker = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.04), markerMaterial);
      marker.position.set(x * 2.78, y * 1.56, 0.22);
      exhibit.add(marker);
    }));

    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(240);
    for (let index = 0; index < starPositions.length; index += 3) {
      starPositions[index] = (Math.random() - 0.5) * 10;
      starPositions[index + 1] = (Math.random() - 0.5) * 6;
      starPositions[index + 2] = (Math.random() - 0.5) * 3;
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const stars = new THREE.Points(starGeometry, new THREE.PointsMaterial({ color: 0xddc6a2, size: 0.018, transparent: true, opacity: 0.6 }));
    scene.add(stars);

    scene.add(new THREE.AmbientLight(0xf4eadc, 1.6));
    const keyLight = new THREE.DirectionalLight(0xf4eadc, 3.4);
    keyLight.position.set(3, 4, 5);
    scene.add(keyLight);
    const rimLight = new THREE.PointLight(0xd8b58c, 8, 12);
    rimLight.position.set(-4, -1, 3);
    scene.add(rimLight);

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const width = Math.max(bounds.width, 1);
      const height = Math.max(bounds.height, 1);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();

    const clock = new THREE.Clock();
    let frame = 0;
    const render = () => {
      const elapsed = clock.getElapsedTime();
      exhibit.rotation.y = Math.sin(elapsed * 0.36) * 0.18;
      exhibit.rotation.x = Math.sin(elapsed * 0.22) * 0.04;
      exhibit.position.y = Math.sin(elapsed * 0.8) * 0.08;
      const mode = modeRef.current;
      const pulse = (Math.sin(elapsed * 1.2) + 1) * 0.08;
      fossilMaterial.opacity = mode === 'structure' ? 0.14 + pulse : mode === 'analysis' ? 0.52 + pulse : 0.78 + pulse;
      wireMaterial.opacity = mode === 'structure' ? 0.72 + pulse : mode === 'analysis' ? 0.42 + pulse : 0.12 + pulse;
      slabWireMaterial.opacity = mode === 'analysis' ? 0.48 + pulse : 0.18 + pulse;
      slabMaterial.opacity = mode === 'structure' ? 0.78 : 0.96;
      stars.rotation.y = elapsed * 0.018;
      renderer.render(scene, camera);
      frame = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      renderer.dispose();
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        if (Array.isArray(mesh.material)) mesh.material.forEach((material) => material.dispose());
        else if (mesh.material) mesh.material.dispose();
      });
    };
  }, []);

  return (
    <section id="observatorio" className="observatory-section px-8 md:px-16 py-24 md:py-32 border-t border-gray-800">
      <div className="flex flex-col xl:flex-row justify-between gap-8 mb-14">
        <div>
          <div className="text-[10px] font-mono tracking-[0.2em] text-[#ddc6a2] uppercase mb-4">05 / observatório 3D</div>
          <h3 className="text-[2.6rem] md:text-[4.4rem] leading-[0.95] tracking-tight font-medium text-white uppercase">
            Fóssil<br />em suspensão.
          </h3>
        </div>
        <div className="observatory-catalog-label text-[10px] font-mono tracking-[0.2em] text-gray-500 uppercase xl:text-right">
          <span>NHM / SPECIMEN 001</span>
          <span>PLACA DE ACERVO · CRETÁCEO SUPERIOR</span>
        </div>
      </div>

      <div className="observatory-grid">
        <div className="observatory-canvas-wrap">
          <canvas ref={canvasRef} className="observatory-canvas" aria-label="Espécime 3D generativo em rotação contínua" />
          <div className="observatory-readout observatory-readout-top">PLACA / FÓSSIL / SCAN</div>
          <div className="observatory-readout observatory-readout-bottom">NHM 001 · ACERVO EM CAMADAS</div>
          <div className="observatory-axis"><span>X</span><span>Y</span><span>Z</span></div>
          <div className="observatory-specimen-label">
            <span>NHM 001</span>
            <strong>PTEROSSAURO</strong>
            <small>68–66 MA · ESCALA 1:12</small>
          </div>
          <div className="observatory-scale-ruler" aria-label="Escala de um metro">
            <span>0</span><i /><span>1 M</span>
          </div>
        </div>

        <div className="observatory-panel">
          <div className="flex items-center justify-between text-[10px] font-mono tracking-[0.18em] text-gray-500 uppercase border-b border-gray-800 pb-4">
            <span>Hotspots do espécime</span>
            <span className="observatory-live">3D / ativo</span>
          </div>
          <div className="observatory-mode-block">
            <span className="observatory-mode-kicker">Modo de leitura</span>
            <div className="observatory-mode-buttons">
              {observatoryModes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => changeMode(mode.id)}
                  data-cursor="FOCUS"
                  className={observatoryMode === mode.id ? 'is-active' : ''}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={point.id}
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -18 }}
              transition={{ duration: 0.35 }}
              className="py-10"
            >
              <span className="text-[10px] font-mono tracking-[0.2em] text-gray-500">PONTO {point.id}</span>
              <h4 className="mt-3 text-4xl md:text-5xl font-medium text-white tracking-tight">{point.title}</h4>
              <p className="mt-5 text-sm leading-relaxed text-gray-400">{point.text}</p>
            </motion.div>
          </AnimatePresence>
          <div className="flex gap-2 border-t border-gray-800 pt-6">
            {observatoryPoints.map((item, index) => (
              <button
                key={item.id}
                onClick={() => setActivePoint(index)}
                data-cursor="FOCUS"
                className={`observatory-point-button ${index === activePoint ? 'is-active' : ''}`}
              >
                {item.id}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SpecimenAnalysis() {
  const [analysisStage, setAnalysisStage] = useState(0);
  const active = analysisStages[analysisStage];
  const [timelineIndex, setTimelineIndex] = useState(4);
  const activeEpoch = geologicalTimeline[timelineIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      setAnalysisStage((current) => (current + 1) % analysisStages.length);
    }, 2600);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimelineIndex((current) => (current + 1) % geologicalTimeline.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="analise" className="analysis-section px-8 md:px-16 py-24 md:py-32 border-t border-gray-800">
      <div className="flex flex-col xl:flex-row justify-between gap-8 mb-14">
        <div>
          <div className="text-[10px] font-mono tracking-[0.2em] text-gray-500 uppercase mb-4">04 / laboratório de análise</div>
          <h3 className="text-[2.6rem] md:text-[4.4rem] leading-[0.95] tracking-tight font-medium text-white uppercase">
            Analise o<br />espécime.
          </h3>
        </div>
        <p className="max-w-sm text-[11px] font-mono leading-relaxed tracking-wide text-gray-500 uppercase xl:text-right">
          Um inventário vivo de ossos, escala e movimento. A ficha muda sozinha para a gravação, como um scanner atravessando o acervo.
        </p>
      </div>

      <div className="analysis-grid">
        <div className="analysis-viewport">
          <div className="analysis-grid-lines" aria-hidden="true" />
          <motion.div
            className="analysis-scanline"
            animate={{ y: ['-120%', '120%'] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: 'linear' }}
            aria-hidden="true"
          />
          <motion.img
            src="/assets/neo-museum/01.png"
            alt="Esqueleto de tiranossauro em análise"
            className="analysis-specimen"
            animate={{ rotate: [-1, 1, -1], scale: [0.96, 1, 0.96] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              className="analysis-callout"
              style={{ left: active.x, top: active.y }}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.45 }}
            >
              <span />
              <strong>{active.id}</strong>
            </motion.div>
          </AnimatePresence>
          <div className="analysis-corner-label">NHM / SPECIMEN 001 / ANALYSIS MODE</div>
        </div>

        <div className="analysis-data-panel">
          <div className="flex items-center justify-between border-b border-gray-800 pb-4 text-[10px] font-mono tracking-[0.18em] text-gray-500 uppercase">
            <span>Leitura automática</span>
            <span className="analysis-live-dot">ao vivo</span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.4 }}
              className="py-8"
            >
              <span className="text-[11px] font-mono tracking-[0.2em] text-gray-500">PONTO {active.id}</span>
              <h4 className="mt-3 text-4xl md:text-6xl font-medium tracking-tight text-white">{active.label}</h4>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-gray-400">{active.text}</p>
            </motion.div>
          </AnimatePresence>
          <div className="grid grid-cols-2 gap-4 border-y border-gray-800 py-5 text-[10px] font-mono uppercase tracking-widest text-gray-500">
            <div><span className="block text-gray-700 mb-2">Comprimento</span><strong className="text-gray-200">12,3 M</strong></div>
            <div><span className="block text-gray-700 mb-2">Período</span><strong className="text-gray-200">68–66 MA</strong></div>
            <div><span className="block text-gray-700 mb-2">Massa</span><strong className="text-gray-200">14 T</strong></div>
            <div><span className="block text-gray-700 mb-2">Status</span><strong className="text-gray-200">Preservado</strong></div>
          </div>
          <div className="mt-6 flex gap-2">
            {analysisStages.map((stage, index) => (
              <button
                key={stage.id}
                onClick={() => setAnalysisStage(index)}
                data-cursor="ANALYZE"
                aria-label={`Analisar ${stage.label}`}
                className={`analysis-stage-button ${index === analysisStage ? 'is-active' : ''}`}
              >
                {stage.id}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="geological-timeline mt-20">
        <div className="flex items-center justify-between text-[10px] font-mono tracking-[0.2em] text-gray-500 uppercase mb-5">
          <span>Tempo profundo / camadas da Terra</span>
          <span>01 — 06 / {activeEpoch.date}</span>
        </div>
        <div className="geological-viewport" style={{ background: `linear-gradient(135deg, ${activeEpoch.tone}22, transparent 58%)` }}>
          <div className="geological-sediment-stack" aria-hidden="true">
            {geologicalTimeline.map((epoch, index) => (
              <motion.div
                key={epoch.key}
                className={`geological-sediment-layer ${index === timelineIndex ? 'is-active' : ''}`}
                animate={{ opacity: index === timelineIndex ? 0.96 : 0.24, scaleX: index === timelineIndex ? 1 : 0.96 }}
                transition={{ duration: 0.7 }}
                style={{ backgroundColor: epoch.tone }}
              />
            ))}
          </div>
          <motion.div
            className="geological-reading-line"
            animate={{ x: ['-8%', '108%'] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: 'linear' }}
          />
          <AnimatePresence mode="wait">
            <motion.div
              key={activeEpoch.key}
              className="geological-epoch-card"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.45 }}
            >
              <span className="geological-epoch-date">{activeEpoch.date}</span>
              <strong>{activeEpoch.title}</strong>
              <p>{activeEpoch.detail}</p>
            </motion.div>
          </AnimatePresence>
          <AnimatePresence>
            {activeEpoch.key === 'cretaceo' && (
              <motion.img
                src="/assets/neo-museum/pterossauro-acervo.png"
                alt="Pterossauro associado ao Cretáceo"
                className="geological-pterosaur"
                initial={{ opacity: 0, x: 80, scale: 0.7 }}
                animate={{ opacity: 0.78, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -80, scale: 0.7 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
              />
            )}
          </AnimatePresence>
          <div className="geological-plate-code">NHM / DEEP TIME / 001</div>
        </div>
        <div className="geological-track">
          {geologicalTimeline.map((epoch, index) => (
            <button
              key={epoch.key}
              onClick={() => setTimelineIndex(index)}
              data-cursor="FOCUS"
              className={`geological-time-button ${index === timelineIndex ? 'is-active' : ''}`}
            >
              <span>{epoch.label}</span>
              <small>{epoch.date}</small>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const [showVideo, setShowVideo] = useState(false);
  const [activeChapter, setActiveChapter] = useState(2); // starts at "Répteis do Mesozoico"
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedSpecimenModal, setSelectedSpecimenModal] = useState(false);
  const [infoModal, setInfoModal] = useState<string | null>(null);

  // Video delay of 2800ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowVideo(true);
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  // Chapter auto-cycling every 3500ms
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveChapter((prev) => (prev + 1) % 5);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#fcfcfc] text-[#111] font-sans overflow-x-hidden selection:bg-black selection:text-white md:cursor-none cinema-stage">
      <CinematicOverlay />
      {/* =========================================================================
          SECTION 1: HERO (full viewport height)
      ========================================================================= */}
      <section className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden">
        {/* 1D. BACKGROUND VIDEO */}
        {showVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
              src="/assets/neo-museum/museum-loop.mp4"
            />
            {/* Subtle overlay to ensure typography readability */}
            <div className="absolute inset-0 bg-[#fcfcfc]/30 pointer-events-none" />
          </motion.div>
        )}

        {/* 1A. HEADER (NHM Logo) & 1B. SUB-NAV BAR */}
        <motion.header
          initial="initial"
          animate="animate"
          variants={{
            initial: {},
            animate: {
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1,
              },
            },
          }}
          className="pt-6 px-6 md:px-16 z-20 w-full"
        >
          {/* Logo SVG wrapped in motion.h1 */}
          <motion.h1
            variants={{
              initial: { scale: 1.03 },
              animate: {
                scale: 1,
                transition: {
                  duration: 1.2,
                  ease: [0.16, 1, 0.3, 1],
                  staggerChildren: 0.06,
                  delayChildren: 0.1,
                },
              },
            }}
            className="w-full block"
          >
            <svg
              viewBox="0 0 840 100"
              fill="#111"
              className="w-full h-auto max-h-[85px] md:max-h-[110px]"
              aria-label="Museu de História Natural - NHM"
            >
              {/* Letter N (translate 0,0) */}
              <g transform="translate(0,0)">
                <motion.polygon variants={letterBlock} points="0,0 14,0 14,100 0,100" />
                <motion.polygon variants={letterBlock} points="200,0 214,0 214,100 200,100" />
                <motion.polygon variants={letterBlock} points="0,0 33,0 214,100 181,100" />
              </g>

              {/* Letter H (translate 280,0) */}
              <g transform="translate(280,0)">
                <motion.polygon variants={letterBlock} points="0,0 14,0 14,100 0,100" />
                <motion.polygon variants={letterBlock} points="200,0 214,0 214,100 200,100" />
                <motion.polygon variants={letterBlock} points="14,43 200,43 200,57 14,57" />
              </g>

              {/* Letter M (translate 560,0) */}
              <g transform="translate(560,0)">
                <motion.polygon variants={letterBlock} points="0,0 14,0 14,100 0,100" />
                <motion.polygon variants={letterBlock} points="266,0 280,0 280,100 266,100" />
                <motion.polygon variants={letterBlock} points="0,0 26,0 153,100 127,100" />
                <motion.polygon variants={letterBlock} points="254,0 280,0 153,100 127,100" />
              </g>
            </svg>
          </motion.h1>

          {/* 1B. SUB-NAV BAR */}
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="flex justify-between items-start mt-8 text-[10px] md:text-[11px] font-mono tracking-[0.2em] uppercase"
          >
            {/* Left column (15% width) */}
            <div className="w-[30%] sm:w-[20%] md:w-[15%] leading-relaxed text-gray-900 font-medium">
              <div>MUSEU DE</div>
              <div>HISTÓRIA</div>
              <div>NATURAL</div>
            </div>

            {/* Arrow separator (5% width, hidden on mobile) */}
            <div className="hidden md:flex w-[5%] justify-center pt-1">
              <ArrowRight size={14} strokeWidth={1} className="text-gray-400" />
            </div>

            {/* Center column (flex-1 on mobile, 30% on desktop) */}
            <div className="flex-1 md:w-[30%] md:flex-initial text-gray-800 leading-relaxed font-mono px-2 md:px-0">
              {/* Desktop version (3 lines) */}
              <div className="hidden md:block">
                Explorando a história da vida na Terra
                <br />
                através da ciência, descoberta
                <br />e do fascínio pelo mundo natural.
              </div>
              {/* Mobile version (4 lines) */}
              <div className="block md:hidden text-[9px]">
                Explorando a história
                <br />
                da vida na Terra através
                <br />
                da ciência, descoberta
                <br />e do fascínio natural.
              </div>
            </div>

            {/* Arrow separator (5% width, hidden on mobile) */}
            <div className="hidden md:flex w-[5%] justify-center pt-1">
              <ArrowRight size={14} strokeWidth={1} className="text-gray-400" />
            </div>

            {/* Right column (15% width, hidden on mobile): Nav links */}
            <div className="hidden md:flex flex-col w-[15%] space-y-1 text-gray-800 font-mono">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => scrollToSection(item.href.replace('#', ''))}
                  className="text-left hover:text-black hover:underline cursor-pointer transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Hamburger button (far right, z-60) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="group flex flex-col justify-center items-end gap-[6px] p-2 z-60 cursor-pointer md:hidden"
              aria-label={isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            >
              <span
                className={`h-[1.5px] bg-black transition-all duration-300 ${
                  isMobileMenuOpen
                    ? 'w-7 rotate-45 translate-y-[4px]'
                    : 'w-8 group-hover:w-6'
                }`}
              />
              <span
                className={`h-[1.5px] bg-black transition-all duration-300 ${
                  isMobileMenuOpen
                    ? 'w-7 -rotate-45 -translate-y-[3.5px]'
                    : 'w-8 group-hover:w-10'
                }`}
              />
            </button>
          </motion.div>
        </motion.header>

        {/* 1C. MOBILE MENU OVERLAY */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden fixed top-[140px] left-0 w-full bg-[#fcfcfc] border-b border-gray-200 shadow-xl z-50 px-8 py-8"
            >
              <div className="space-y-6 text-sm font-mono tracking-[0.2em] uppercase">
                {navItems.map((item) => (
                  <div key={item.label}>
                    <button
                      onClick={() => scrollToSection(item.href.replace('#', ''))}
                      className="block w-full text-left py-2 hover:text-gray-500 transition-colors"
                    >
                      {item.label}
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* HERO BODY: 1E. LEFT SIDEBAR & 1F. RIGHT SIDEBAR */}
        <div className="relative flex-1 flex flex-col md:flex-row justify-between items-start w-full">
          {/* 1E. LEFT SIDEBAR CONTENT */}
          <motion.div
            initial="initial"
            animate="animate"
            variants={{
              initial: {},
              animate: {
                transition: {
                  staggerChildren: 0.15,
                  delayChildren: 0.6,
                },
              },
            }}
            className="px-6 md:px-16 mt-14 sm:mt-24 md:mt-28 w-full md:w-[420px] z-10"
          >
            {/* Section indicator: 01 + horizontal line */}
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
              <span className="text-xs font-mono font-medium text-black">01</span>
              <span className="w-16 h-[1.5px] bg-black/20" />
            </motion.div>

            {/* Headline: MARAVILHAS ATEMPORAIS */}
            <motion.h2
              variants={fadeUp}
              className="text-[3.2rem] sm:text-[3.8rem] md:text-[5rem] font-normal tracking-tight leading-[1] text-[#111] mb-6"
            >
              MARAVILHAS
              <br />
              ATEMPORAIS
            </motion.h2>

            {/* Description */}
            <motion.p
              variants={fadeUp}
              className="text-[13px] md:text-[14px] text-gray-700 w-full sm:w-[280px] leading-[1.6] mb-8"
            >
              Adentre o mundo natural e descubra as histórias gravadas há milhões de anos.
            </motion.p>

            {/* CTA Button ("Explorar Agora") */}
            <motion.div variants={fadeUp}>
              <button
                onClick={() => scrollToSection('explorar')}
                data-cursor="EXPLORE"
                className="group relative inline-flex items-center gap-3 bg-[#1a1a1a] px-6 py-3.5 border border-[#1a1a1a] rounded-md shadow-sm overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-[0.5px] hover:shadow-[3px_3px_0px_rgba(17,17,17,0.5)] active:translate-y-0 active:shadow-none"
              >
                {/* Sliding background panel */}
                <span className="absolute inset-0 bg-[#fcfcfc] -translate-x-[101%] group-hover:translate-x-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" />

                {/* Custom SVG leaf/plant shape (4 paths) */}
                <svg
                  className="w-4 h-4 fill-[#fcfcfc] group-hover:fill-[#111] transition-all duration-500 group-hover:scale-110 group-hover:-rotate-12 group-hover:-translate-y-1 relative z-10 shrink-0"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 3C8.5 3 4 6.5 4 13c0 3.2 1.6 5.8 3.8 7.3C7.2 19.3 7 18.2 7 17c0-4.5 2.5-8 5-11.5z" />
                  <path d="M12 3c3.5 0 8 3.5 8 10 0 3.2-1.6 5.8-3.8 7.3.6-1 0.8-2.1.8-3.3 0-4.5-2.5-8-5-11.5z" />
                  <path d="M11 7h2v14h-2z" />
                  <path d="M12 11l4.5-3.5 1.2 1.5L12 13.5z" />
                </svg>

                {/* Button Text */}
                <span className="text-[15px] font-medium text-white group-hover:text-[#111] relative z-10 transition-colors duration-300">
                  Explorar Agora
                </span>
              </button>
            </motion.div>
          </motion.div>

          {/* 1F. RIGHT SIDEBAR (hidden on mobile) */}
          <motion.div
            initial="initial"
            animate="animate"
            variants={{
              initial: {},
              animate: {
                transition: {
                  staggerChildren: 0.15,
                  delayChildren: 0.9,
                },
              },
            }}
            className="w-[220px] mt-12 md:mt-24 mr-6 md:mr-16 hidden md:flex flex-col gap-6 z-10"
          >
            {/* Specimen info */}
            <motion.div variants={fadeUp}>
              <h3 className="text-[10px] font-bold font-mono tracking-widest uppercase text-black mb-1">
                Tyrannosaurus Rex
              </h3>
              <p className="text-[12px] text-gray-600 leading-[1.6]">
                Período Cretáceo Superior
                <br />
                68–66 milhões de anos atrás
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div variants={fadeUp} className="flex gap-8">
              <div>
                <span className="block text-[10px] font-mono tracking-widest uppercase text-gray-500 mb-0.5">
                  Comprimento
                </span>
                <span className="text-[13px] font-medium text-[#111]">12.3 m</span>
              </div>
              <div>
                <span className="block text-[10px] font-mono tracking-widest uppercase text-gray-500 mb-0.5">
                  Altura
                </span>
                <span className="text-[13px] font-medium text-[#111]">4.0 m</span>
              </div>
            </motion.div>

            {/* View Details button */}
            <motion.div variants={fadeUp}>
              <button
                onClick={() => setSelectedSpecimenModal(true)}
                data-cursor="VIEW"
                className="group flex items-center gap-3 text-left cursor-pointer transition-all"
              >
                <div className="w-10 h-10 rounded-full border border-gray-400 flex items-center justify-center transition-all duration-300 group-hover:border-black group-hover:bg-[#111]">
                  <Plus
                    size={16}
                    strokeWidth={1.5}
                    className="text-gray-700 transition-colors duration-300 group-hover:text-white"
                  />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-gray-800 group-hover:text-black">
                  Ver Detalhes
                </span>
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* 1G. BOTTOM-LEFT "ROLE PARA EXPLORAR" */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="absolute bottom-10 left-[2.5rem] md:left-[4rem] hidden md:flex items-center gap-4 z-20"
        >
          {/* Pause symbol circle */}
          <div className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center gap-[4px]">
            <span className="w-[1px] h-[12px] bg-gray-600 block" />
            <span className="w-[1px] h-[12px] bg-gray-600 block" />
          </div>
          <span className="text-[10px] font-mono tracking-widest uppercase text-gray-500 font-semibold">
            Role para explorar
          </span>
        </motion.div>
      </section>

      {/* =========================================================================
          SECTION 2: "EXPLORE NOSSO MUNDO"
      ========================================================================= */}
      <section
        id="explorar"
        className="relative w-full min-h-[75vh] md:min-h-screen bg-[#fcfcfc] flex flex-col items-center pt-24 md:pt-32 pb-0 z-20"
      >
        {/* 2A. SECTION LABEL */}
        <div className="text-[10px] md:text-[11px] font-mono tracking-[0.2em] mb-12">
          <span className="text-gray-500 mr-2">[ 02 ]</span>
          <span className="text-gray-900 font-bold uppercase">Explore Nosso Mundo</span>
        </div>

        {/* 2B. MAIN HEADING */}
        <motion.h2
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-[2.2rem] md:text-[3.5rem] lg:text-[4.2rem] leading-[1.1] font-medium tracking-tight text-[#111] max-w-[1000px] text-center px-6"
        >
          Revele as histórias do passado do nosso planeta
          <br className="hidden md:inline" /> através de fósseis, minerais e maravilhas ancestrais.
        </motion.h2>

        {/* 2C. ACTION PILLS */}
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-50px' }}
          variants={{
            initial: {},
            animate: {
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3,
              },
            },
          }}
          className="flex flex-wrap justify-center gap-3 md:gap-4 mt-12 mb-10 md:mb-20 px-6 max-w-4xl"
        >
          {[
            {
              icon: Bone,
              label: 'Dinossauros',
              onClick: () => {
                setActiveChapter(0);
                scrollToSection('colecao');
              },
            },
            {
              icon: Dna,
              label: 'Vida Ancestral',
              onClick: () => {
                setActiveChapter(1);
                scrollToSection('colecao');
              },
            },
            {
              icon: Gem,
              label: 'Minerais',
              onClick: () =>
                setInfoModal(
                  'A Coleção de Mineralogia do museu abriga mais de 50.000 amostras cristalinas raras, meteoritos e gemas formadas sob pressões extremas nas profundezas da crosta terrestre.',
                ),
            },
            {
              icon: Leaf,
              label: 'Fósseis',
              onClick: () => {
                setActiveChapter(3);
                scrollToSection('colecao');
              },
            },
            {
              icon: BookOpen,
              label: 'Saiba Mais',
              onClick: () =>
                setInfoModal(
                  'O Museu de História Natural dedica-se à preservação e pesquisa de espécimes científicos. Nosso acervo contém mais de 80 milhões de itens, cobrindo bilhões de anos da evolução da biosfera terrestre.',
                ),
            },
          ].map((pill) => {
            const Icon = pill.icon;
            return (
              <motion.button
                key={pill.label}
                variants={fadeUp}
                onClick={pill.onClick}
                className="rounded-full border border-gray-300 px-5 py-2.5 text-[11px] font-medium uppercase tracking-wider bg-white/50 backdrop-blur-sm text-gray-800 transition-all duration-300 hover:border-black hover:bg-black hover:text-white flex items-center gap-2 cursor-pointer shadow-xs active:scale-95"
              >
                <Icon size={14} strokeWidth={2} />
                <span>{pill.label}</span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* 2D. SPACER (room for pterodactyl from Section 3 to overlap upward) */}
        <div className="w-full min-h-[220px] md:min-h-[450px]" />

        {/* 2E. BOTTOM TEXT */}
        <div className="absolute bottom-0 left-0 w-full px-8 md:px-16 pb-8 md:pb-12 pointer-events-none flex justify-between items-center">
          <span className="text-[10px] font-mono tracking-widest uppercase text-gray-500 font-medium hidden md:block">
            NÃO APENAS CONTAMOS HISTÓRIAS.
          </span>
          <span className="text-[10px] font-mono tracking-widest uppercase text-gray-500 font-medium hidden md:block">
            PALEONTOLOGIA (C) 2026
          </span>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: "COLEÇÃO ANCESTRAL" (Dark Section)
      ========================================================================= */}
      <section
        id="colecao"
        className="relative w-full bg-[#0a0a0a] text-white flex flex-col z-30 pt-16 md:pt-24"
      >
        {/* 3A. PTERODACTYL IMAGE (scroll-driven overlap into Section 2) */}
        <PterosaurTransition />

        {/* 3B. HEADING AREA */}
        <div className="px-8 md:px-16 pt-32 md:pt-48 mb-16 z-10 flex flex-col xl:flex-row justify-between items-start gap-10">
          {/* Left -- Main heading with 3 inline circle icons */}
          <div className="max-w-4xl">
            <h2 className="text-[1.8rem] md:text-[3rem] lg:text-[3.8rem] xl:text-[4rem] leading-[1.15] font-medium tracking-tight text-white">
              Reunido a partir de milhões de anos de fascínio
              <span className="inline-flex gap-2 md:gap-3 align-middle mx-2 md:mx-4 -translate-y-1">
                <span className="w-10 h-10 md:w-14 md:h-14 rounded-full border border-gray-600 bg-black text-gray-400 flex items-center justify-center transition-colors hover:bg-white hover:text-black hover:border-white">
                  <Bone className="w-4 h-4 md:w-6 md:h-6" />
                </span>
                <span className="w-10 h-10 md:w-14 md:h-14 rounded-full border border-gray-600 bg-black text-gray-400 flex items-center justify-center transition-colors hover:bg-white hover:text-black hover:border-white">
                  <Dna className="w-4 h-4 md:w-6 md:h-6" />
                </span>
                <span className="w-10 h-10 md:w-14 md:h-14 rounded-full border border-gray-600 bg-black text-gray-400 flex items-center justify-center transition-colors hover:bg-white hover:text-black hover:border-white">
                  <Leaf className="w-4 h-4 md:w-6 md:h-6" />
                </span>
              </span>
              & descobertas.
            </h2>
          </div>

          {/* Right -- Tagline + pills */}
          <div className="flex flex-col items-start xl:items-end text-left xl:text-right shrink-0">
            <div className="text-[9px] md:text-[10px] font-mono tracking-widest text-gray-400 uppercase mb-6 leading-relaxed">
              NÃO APENAS EXIBIMOS FÓSSEIS
              <br />
              COMPARTILHAMOS A HISTÓRIA DA TERRA
            </div>

            <div className="flex flex-wrap gap-2.5">
              {['Educativo', 'Autêntico', 'Inspirador'].map((tag) => (
                <span
                  key={tag}
                  className="px-5 py-2 rounded-full border border-gray-600 text-[9px] font-mono tracking-widest uppercase text-gray-300 transition-colors hover:bg-white hover:text-black hover:border-white cursor-default"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 3C. TWO-COLUMN PANEL */}
        <div className="w-full border-t border-gray-800 flex flex-col xl:flex-row z-10">
          {/* Left panel (35% width): SandTransitionImage + Chapter Counter */}
          <div className="w-full xl:w-[35%] border-b xl:border-b-0 xl:border-r border-gray-800 min-h-[420px] md:min-h-[520px] relative p-8 flex flex-col justify-between overflow-hidden bg-radial from-gray-950 to-[#0a0a0a]">
            {/* Top stars indicator */}
            <div className="text-gray-500 text-xl tracking-[0.3em] font-mono select-none">***</div>

            {/* Center: SandTransitionImage */}
            <div className="relative w-full h-[280px] md:h-[340px] flex items-center justify-center my-auto">
              <AnimatePresence mode="wait">
                <SandTransitionImage
                  key={chaptersData[activeChapter].image}
                  src={chaptersData[activeChapter].image}
                  alt={chaptersData[activeChapter].name}
                  className="absolute inset-0 w-[80%] h-[80%] m-auto object-contain mix-blend-lighten pointer-events-none select-none"
                />
              </AnimatePresence>
            </div>

            {/* Bottom: Chapter counter 01 / 05 style */}
            <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase">
              <div className="relative h-4 overflow-hidden w-6">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={activeChapter}
                    initial={{ y: 12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -12, opacity: 0 }}
                    transition={{ duration: 0.35, ease: 'easeInOut' }}
                    className="absolute inset-0 text-[#888]"
                  >
                    0{activeChapter + 1}
                  </motion.span>
                </AnimatePresence>
              </div>
              <span className="text-[#333]">/</span>
              <span className="text-[#888]">05</span>
            </div>
          </div>

          {/* Right panel (65% width): Top Bar + Chapter List */}
          <div className="w-full xl:w-[65%] flex flex-col">
            {/* Top bar */}
            <div className="border-b border-gray-800 p-8 text-[10px] font-mono text-gray-400 tracking-widest flex justify-between items-center">
              <span>Explore o passado. Compreenda o presente.</span>
              <div className="relative h-4 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={activeChapter}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="block uppercase text-white"
                  >
                    Capítulo 0{activeChapter + 1}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>

            {/* Chapter list (5 items) */}
            <div className="flex flex-col">
              {chaptersData.map((chapter, index) => {
                const isActive = activeChapter === index;
                return (
                  <button
                    key={chapter.name}
                    onClick={() => setActiveChapter(index)}
                    data-cursor="OPEN"
                    className={`w-full text-left border-b border-gray-800/80 py-8 px-8 flex justify-between items-center cursor-pointer transition-all duration-300 group ${
                      isActive ? 'text-white bg-white/[0.02]' : 'text-[#555] hover:text-[#aaa]'
                    }`}
                  >
                    <div className="flex items-baseline gap-6">
                      <span className="text-[10px] font-mono tracking-widest text-[#555]">
                        0{index + 1}
                      </span>
                      <span className="text-2xl md:text-[2rem] font-medium tracking-tight transition-transform duration-300 group-hover:translate-x-1">
                        {chapter.name}
                      </span>
                    </div>

                    <div className="w-8 h-8 flex items-center justify-center">
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ArrowUpRight size={22} strokeWidth={1} className="text-gray-300" />
                        </motion.div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 3D. BOTTOM FOOTER */}
        <div className="h-[1px] bg-gray-800 w-full" />
        <SpecimenAnalysis />
        <ThreeSpecimenObservatory />
        <section className="closing-section px-8 md:px-16 py-32 md:py-48">
          <div className="closing-index">06 / continuidade</div>
          <motion.h3
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8 }}
            className="closing-title"
          >
            A história da Terra<br />ainda está sendo descoberta.
          </motion.h3>
          <div className="closing-rule" />
          <div className="closing-signature">
            <span>NATURAL HISTORY MUSEUM</span>
            <strong>NHM</strong>
          </div>
        </section>
        <footer
          id="sobre"
          className="px-8 py-8 text-[10px] font-mono tracking-widest text-gray-500 uppercase bg-[#0a0a0a] flex flex-col sm:flex-row justify-between items-center gap-4"
        >
          <span>ESCAVANDO O PASSADO DO NOSSO PLANETA</span>
          <div className="flex items-center gap-6">
            <span className="text-gray-600">MUSEU DE HISTÓRIA NATURAL &copy; 2026</span>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              VOLTAR AO TOPO ↑
            </button>
          </div>
        </footer>
      </section>

      {/* =========================================================================
          SPECIMEN MODAL: TYRANNOSAURUS REX (Ver Detalhes)
      ========================================================================= */}
      <AnimatePresence>
        {selectedSpecimenModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#111] border border-gray-800 text-white rounded-lg max-w-xl w-full p-8 relative shadow-2xl overflow-hidden"
            >
              <button
                onClick={() => setSelectedSpecimenModal(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Fechar"
              >
                <X size={20} />
              </button>

              <div className="text-[10px] font-mono tracking-[0.2em] text-gray-400 uppercase mb-2">
                FICHA TÉCNICA PALEONTOLÓGICA
              </div>
              <h3 className="text-3xl font-medium tracking-tight mb-2">Tyrannosaurus Rex</h3>
              <p className="text-xs font-mono text-gray-400 mb-6 uppercase tracking-wider">
                Holótipo &amp; Espécimes de Referência • Formação Hell Creek
              </p>

              <div className="grid grid-cols-2 gap-4 border-y border-gray-800 py-4 mb-6 text-sm">
                <div>
                  <span className="text-[10px] font-mono tracking-widest uppercase text-gray-500 block mb-1">
                    Época Geológica
                  </span>
                  <span className="font-medium text-gray-200">Cretáceo Superior (68–66 Ma)</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono tracking-widest uppercase text-gray-500 block mb-1">
                    Comprimento Total
                  </span>
                  <span className="font-medium text-gray-200">12,3 metros</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono tracking-widest uppercase text-gray-500 block mb-1">
                    Altura no Quadril
                  </span>
                  <span className="font-medium text-gray-200">4,0 metros</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono tracking-widest uppercase text-gray-500 block mb-1">
                    Massa Estimada
                  </span>
                  <span className="font-medium text-gray-200">8,4 a 14 toneladas</span>
                </div>
              </div>

              <p className="text-xs text-gray-400 leading-relaxed mb-6 font-mono">
                O crânio do T. Rex possuía ossos fundidos e dentes serrilhados em formato de banana de
                até 30 centímetros, projetados para triturar ossos maciços com uma força estimada de
                35.000 Newtons. Seus grandes bulbos olfativos indicam um dos sentidos do olfato mais
                apurados de toda a era dos dinossauros.
              </p>

              <div className="flex justify-end">
                <button
                  onClick={() => setSelectedSpecimenModal(false)}
                  className="px-6 py-2 bg-white text-black text-xs font-mono uppercase tracking-wider font-semibold rounded-md hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  Entendido
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          INFO MODAL (Pills / Descobrir)
      ========================================================================= */}
      <AnimatePresence>
        {infoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-[#fcfcfc] border border-gray-300 text-[#111] rounded-lg max-w-md w-full p-6 relative shadow-2xl"
            >
              <button
                onClick={() => setInfoModal(null)}
                className="absolute top-5 right-5 text-gray-400 hover:text-black transition-colors cursor-pointer"
                aria-label="Fechar"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase text-gray-500 mb-3">
                <Sparkles size={14} className="text-gray-700" />
                <span>Acervo Científico</span>
              </div>

              <p className="text-sm leading-relaxed text-gray-800 mb-6">{infoModal}</p>

              <div className="flex justify-end">
                <button
                  onClick={() => setInfoModal(null)}
                  className="px-5 py-2 bg-[#111] text-white text-xs font-mono uppercase tracking-wider rounded-md hover:bg-black transition-colors cursor-pointer"
                >
                  Fechar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
