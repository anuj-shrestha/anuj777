"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useSongPlayer } from "@/components/SongPlayerProvider";
import { songs } from "@/data/songs";

// Animation States
type AnimState =
  | "IDLE_EMPTY"          // Platter is empty, arm is at rest
  | "UNLOAD_NEEDLE"       // Lift needle off the platter
  | "UNLOAD_ROBOT_SWING"  // Swing robot arm to platter, lower grabber
  | "UNLOAD_LIFT"         // Lift record off platter
  | "UNLOAD_MOVE_STACK"   // Move record to vinyl stack position
  | "UNLOAD_LOWER"        // Lower record onto stack, release
  | "LOAD_ROBOT_SWING"    // Swing robot arm to stack, lower grabber
  | "LOAD_LIFT"           // Lift chosen record off stack
  | "LOAD_MOVE_PLATTER"   // Move record to platter position
  | "LOAD_LOWER"          // Lower record onto platter, release
  | "LOAD_NEEDLE"         // Move playback needle onto record
  | "PLAYING";            // Record is spinning on platter, playing

const stackColorPalettes = [
  { hex: 0xe05a47, twBg: "bg-terra-500", text: "text-terra-50" }, // Terra
  { hex: 0xf59e0b, twBg: "bg-amber-500", text: "text-amber-50" }, // Amber
  { hex: 0x3b82f6, twBg: "bg-blue-500", text: "text-blue-50" },   // Blue
  { hex: 0x10b981, twBg: "bg-emerald-500", text: "text-emerald-50" }, // Emerald
  { hex: 0x8b5cf6, twBg: "bg-violet-500", text: "text-violet-50" },   // Violet
  { hex: 0xec4899, twBg: "bg-pink-500", text: "text-pink-50" },     // Pink
];

export default function ThreeVinyl() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { playing, play, stop } = useSongPlayer();
  const [hoveredSong, setHoveredSong] = useState<string | null>(null);

  // Position Definitions
  const platterPos = new THREE.Vector3(-0.8, 0.12, -0.2);
  const stackPos = new THREE.Vector3(1.1, 0.06, 0.0); // Side Stack
  const robotBasePos = new THREE.Vector3(0.0, 0.08, -1.0);
  const needleBasePos = new THREE.Vector3(-1.4, 0.08, 0.8);

  const shippedSongs = songs.filter((s) => s.status === "shipped");

  // State reference to share data with Three.js rendering loop
  const stateRef = useRef({
    playing: !!playing,
    activeSongTitle: playing || "",
    targetSongTitle: playing || "",
    animState: (playing ? "PLAYING" : "IDLE_EMPTY") as AnimState,
    stateTimer: 0.0,
    platterRecordVisible: !!playing,
    transitRecordVisible: false,
    hoveredButton: null as "playPause" | "stop" | null,
  });

  // Track state changes from React context
  useEffect(() => {
    const current = stateRef.current;
    if (playing) {
      current.targetSongTitle = playing;
      if (current.animState === "IDLE_EMPTY") {
        current.animState = "LOAD_ROBOT_SWING";
        current.stateTimer = 0;
      } else if (current.animState === "PLAYING" && current.activeSongTitle !== playing) {
        // Change song: eject current first
        current.animState = "UNLOAD_NEEDLE";
        current.stateTimer = 0;
      }
    } else {
      current.targetSongTitle = "";
      if (current.animState === "PLAYING" || current.animState === "LOAD_NEEDLE") {
        current.animState = "UNLOAD_NEEDLE";
        current.stateTimer = 0;
      }
    }
  }, [playing]);

  // Audio feedback chimes
  const playChime = (freq: number, type: OscillatorType = "sine", duration = 0.12) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1200, ctx.currentTime);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  };

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = 420; // 420px height for optimal framing

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xfdfcf7, 0.05);

    // --- Camera ---
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 5.5, 3.6);
    camera.lookAt(0, -0.2, 0.0);

    // --- Renderer ---
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfffaf4, 1.4);
    dirLight.position.set(3, 6, 2.5);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0xe05a47, 0.35, 5);
    pointLight.position.set(-0.8, 0.6, 0.8);
    scene.add(pointLight);

    // --- Record Player Base ---
    const playerGroup = new THREE.Group();
    playerGroup.rotation.x = -0.12;
    playerGroup.rotation.y = 0.16;
    scene.add(playerGroup);

    const baseGeo = new THREE.BoxGeometry(4.2, 0.18, 3.2);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x1c1c1f,
      roughness: 0.55,
      metalness: 0.2,
    });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.castShadow = true;
    base.receiveShadow = true;
    playerGroup.add(base);

    // Wooden border underneath
    const rimGeo = new THREE.BoxGeometry(4.26, 0.05, 3.26);
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0xe05a47,
      roughness: 0.4,
    });
    const rim = new THREE.Mesh(rimGeo, rimMat);
    rim.position.y = -0.11;
    playerGroup.add(rim);

    // --- Turntable Platter ---
    const platterGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.06, 32);
    const platterMat = new THREE.MeshStandardMaterial({
      color: 0x52525b,
      metalness: 0.85,
      roughness: 0.25,
    });
    const platter = new THREE.Mesh(platterGeo, platterMat);
    platter.position.copy(platterPos);
    platter.position.y -= 0.03;
    platter.castShadow = true;
    playerGroup.add(platter);

    const spindleGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.18, 8);
    const spindleMat = new THREE.MeshStandardMaterial({ color: 0xd4d4d8, metalness: 0.9 });
    const spindle = new THREE.Mesh(spindleGeo, spindleMat);
    spindle.position.copy(platterPos);
    spindle.position.y += 0.06;
    playerGroup.add(spindle);

    // --- Vinyl Label Dynamic Texture ---
    const labelCanvas = document.createElement("canvas");
    labelCanvas.width = 256;
    labelCanvas.height = 256;
    const labelCtx = labelCanvas.getContext("2d")!;

    const drawLabel = (titleText: string) => {
      labelCtx.fillStyle = "#e05a47";
      labelCtx.fillRect(0, 0, 256, 256);
      labelCtx.strokeStyle = "#faf6ee";
      labelCtx.lineWidth = 4;
      labelCtx.beginPath();
      labelCtx.arc(128, 128, 110, 0, Math.PI * 2);
      labelCtx.stroke();

      labelCtx.fillStyle = "#faf6ee";
      labelCtx.font = "bold 14px monospace";
      labelCtx.textAlign = "center";
      labelCtx.fillText("SIDE A", 128, 70);

      labelCtx.font = "italic 15px Georgia, serif";
      const displayTitle = titleText.length > 18 ? titleText.slice(0, 15) + "..." : titleText || "SELECT SONG";
      labelCtx.fillText(displayTitle, 128, 135);

      labelCtx.font = "8px monospace";
      labelCtx.fillText("SHIA SUPERTRAMP", 128, 185);

      labelCtx.fillStyle = "#18181b";
      labelCtx.beginPath();
      labelCtx.arc(128, 128, 12, 0, Math.PI * 2);
      labelCtx.fill();
    };

    drawLabel(stateRef.current.activeSongTitle);
    const labelTexture = new THREE.CanvasTexture(labelCanvas);

    // --- Vinyl Record Helper Mesh ---
    const createRecordMesh = (labelMap: THREE.Texture | null) => {
      const record = new THREE.Group();

      const diskGeo = new THREE.CylinderGeometry(1.15, 1.15, 0.02, 32);
      const diskMat = new THREE.MeshStandardMaterial({
        color: 0x111111,
        roughness: 0.18,
        metalness: 0.05,
      });
      const disk = new THREE.Mesh(diskGeo, diskMat);
      disk.castShadow = true;
      record.add(disk);

      const grooveMat = new THREE.MeshStandardMaterial({
        color: 0x090909,
        roughness: 0.3,
      });
      for (let r = 0.5; r < 1.1; r += 0.12) {
        const ringGeo = new THREE.RingGeometry(r, r + 0.005, 32);
        ringGeo.rotateX(-Math.PI / 2);
        const ring = new THREE.Mesh(ringGeo, grooveMat);
        ring.position.y = 0.011;
        record.add(ring);
      }

      const centerLabelGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.005, 32);
      const centerLabelMat = new THREE.MeshStandardMaterial({
        map: labelMap,
        roughness: 0.5,
      });
      const centerLabel = new THREE.Mesh(centerLabelGeo, centerLabelMat);
      centerLabel.position.y = 0.012;
      record.add(centerLabel);

      return record;
    };

    // Platter Record (visible on turntable)
    const platterRecord = createRecordMesh(labelTexture);
    platterRecord.position.copy(platterPos);
    platterRecord.position.y += 0.01;
    playerGroup.add(platterRecord);

    // Transit Record (held by robot arm during motion)
    const transitRecord = createRecordMesh(labelTexture);
    playerGroup.add(transitRecord); // local base space

    // --- Vinyl Records Stack (to the right) ---
    const stackGroup = new THREE.Group();
    stackGroup.position.copy(stackPos);
    playerGroup.add(stackGroup);

    const stackVinyls: THREE.Group[] = [];
    for (let i = 0; i < 4; i++) {
      const labelCanvasStatic = document.createElement("canvas");
      labelCanvasStatic.width = 128;
      labelCanvasStatic.height = 128;
      const ctxS = labelCanvasStatic.getContext("2d")!;
      const selectedColorObj = stackColorPalettes[i % stackColorPalettes.length];
      ctxS.fillStyle = `#${selectedColorObj.hex.toString(16)}`;
      ctxS.fillRect(0, 0, 128, 128);
      ctxS.fillStyle = "#faf6ee";
      ctxS.beginPath();
      ctxS.arc(64, 64, 45, 0, Math.PI * 2);
      ctxS.stroke();

      const textureS = new THREE.CanvasTexture(labelCanvasStatic);
      const stackVinyl = createRecordMesh(textureS);
      stackVinyl.position.y = i * 0.026;
      stackVinyl.rotation.y = i * 0.45;
      stackGroup.add(stackVinyl);
      stackVinyls.push(stackVinyl);
    }

    // --- Tonearm (Playback needle) ---
    const tonearmGroup = new THREE.Group();
    tonearmGroup.position.copy(needleBasePos);
    playerGroup.add(tonearmGroup);

    const armBaseGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.16, 12);
    const armBaseMat = new THREE.MeshStandardMaterial({ color: 0x27272a, metalness: 0.6 });
    const armBase = new THREE.Mesh(armBaseGeo, armBaseMat);
    armBase.position.y = 0.08;
    tonearmGroup.add(armBase);

    const armRodGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.4, 8);
    armRodGeo.rotateX(Math.PI / 2);
    armRodGeo.translate(0, 0, 0.7); // Pivot from back
    const rodMat = new THREE.MeshStandardMaterial({ color: 0xd4d4d8, metalness: 0.9, roughness: 0.1 });
    const armRod = new THREE.Mesh(armRodGeo, rodMat);
    armRod.position.y = 0.18;
    tonearmGroup.add(armRod);

    const cartridgeGeo = new THREE.BoxGeometry(0.1, 0.06, 0.16);
    const cartridgeMat = new THREE.MeshStandardMaterial({ color: 0xe05a47 });
    const cartridge = new THREE.Mesh(cartridgeGeo, cartridgeMat);
    cartridge.position.set(0, 0.18, 1.4);
    tonearmGroup.add(cartridge);

    tonearmGroup.rotation.y = -0.5;

    // --- Robot Loader Arm ---
    const robotGroup = new THREE.Group();
    robotGroup.position.copy(robotBasePos);
    playerGroup.add(robotGroup);

    const robotBaseGeo = new THREE.CylinderGeometry(0.15, 0.18, 0.3, 16);
    const robotBase = new THREE.Mesh(robotBaseGeo, armBaseMat);
    robotBase.position.y = 0.15;
    robotGroup.add(robotBase);

    const loaderBoomGeo = new THREE.BoxGeometry(0.08, 0.08, 1.2);
    loaderBoomGeo.translate(0, 0, 0.5);
    const loaderBoomMat = new THREE.MeshStandardMaterial({ color: 0x3f3f46, metalness: 0.7 });
    const loaderBoom = new THREE.Mesh(loaderBoomGeo, loaderBoomMat);
    loaderBoom.position.y = 0.32;
    robotGroup.add(loaderBoom);

    const grabberGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.06, 12);
    const grabberMat = new THREE.MeshStandardMaterial({ color: 0xe05a47, roughness: 0.5 });
    const grabber = new THREE.Mesh(grabberGeo, grabberMat);
    grabber.position.set(0, 0.28, 1.0);
    robotGroup.add(grabber);

    robotGroup.rotation.y = 0.0;
    loaderBoom.position.y = 0.32;

    // --- 3D Tactile Buttons ---
    const buttonBaseGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.04, 16);
    const buttonBaseMat = new THREE.MeshStandardMaterial({ color: 0x27272a, metalness: 0.8 });

    const playButtonPlungerGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.08, 16);
    const playButtonPlungerMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.3 }); // Green
    
    // Play button assembly
    const playButtonBase = new THREE.Mesh(buttonBaseGeo, buttonBaseMat);
    playButtonBase.position.set(-1.6, 0.09, 1.2);
    playerGroup.add(playButtonBase);

    const playPlunger = new THREE.Mesh(playButtonPlungerGeo, playButtonPlungerMat);
    playPlunger.position.set(-1.6, 0.11, 1.2);
    playPlunger.userData = { action: "playPause" };
    playerGroup.add(playPlunger);

    // Play icon (cone rotated sideways)
    const playIconGeo = new THREE.ConeGeometry(0.04, 0.08, 3);
    playIconGeo.rotateX(Math.PI / 2);
    playIconGeo.rotateZ(-Math.PI / 2);
    const iconMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const playIcon = new THREE.Mesh(playIconGeo, iconMat);
    playIcon.position.set(-1.6, 0.155, 1.2);
    playerGroup.add(playIcon);

    // Stop button assembly
    const stopButtonPlungerMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 }); // Red
    
    const stopButtonBase = new THREE.Mesh(buttonBaseGeo, buttonBaseMat);
    stopButtonBase.position.set(-1.1, 0.09, 1.2);
    playerGroup.add(stopButtonBase);

    const stopPlunger = new THREE.Mesh(playButtonPlungerGeo, stopButtonPlungerMat);
    stopPlunger.position.set(-1.1, 0.11, 1.2);
    stopPlunger.userData = { action: "stop" };
    playerGroup.add(stopPlunger);

    // Stop icon (box)
    const stopIconGeo = new THREE.BoxGeometry(0.06, 0.01, 0.06);
    const stopIcon = new THREE.Mesh(stopIconGeo, iconMat);
    stopIcon.position.set(-1.1, 0.155, 1.2);
    playerGroup.add(stopIcon);

    // --- Button Raycasting Hover & Click ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects([playPlunger, stopPlunger]);

      if (intersects.length > 0) {
        const action = intersects[0].object.userData.action;
        stateRef.current.hoveredButton = action;
        canvasRef.current!.style.cursor = "pointer";
      } else {
        stateRef.current.hoveredButton = null;
        canvasRef.current!.style.cursor = "default";
      }
    };

    const onClick = (e: MouseEvent) => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects([playPlunger, stopPlunger]);

      if (intersects.length > 0) {
        const action = intersects[0].object.userData.action;
        if (action === "playPause") {
          if (playing) {
            stop();
            playChime(150, "sine", 0.15);
          } else {
            const firstSong = songs.find((s) => s.status === "shipped");
            if (firstSong) {
              play(firstSong.title);
            }
          }
        } else if (action === "stop") {
          stop();
          playChime(120, "sawtooth", 0.18);
        }
      }
    };

    const canvasElement = canvasRef.current;
    canvasElement.addEventListener("mousemove", onMouseMove);
    canvasElement.addEventListener("click", onClick);

    // --- Animation Loop ---
    let animationFrameId: number;
    let lastTime = performance.now();
    let currentTitle = stateRef.current.activeSongTitle;

    const animate = (time: number) => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = (time - lastTime) * 0.001;
      lastTime = time;

      const state = stateRef.current;
      state.stateTimer += delta;

      // Update texture on change
      if (state.activeSongTitle !== currentTitle) {
        currentTitle = state.activeSongTitle;
        drawLabel(currentTitle);
        labelTexture.needsUpdate = true;
      }

      // --- Loader Animation State Machine ---
      let robotTargetRotY = 0.0;
      let robotTargetHeight = 0.32;
      let needleTargetRotY = -0.5;

      const progress = Math.min(state.stateTimer / 0.8, 1.0); // 0.8s duration

      switch (state.animState) {
        case "IDLE_EMPTY":
          robotTargetRotY = 0.0;
          needleTargetRotY = -0.5;
          state.platterRecordVisible = false;
          state.transitRecordVisible = false;
          break;

        case "UNLOAD_NEEDLE":
          needleTargetRotY = -0.5 + (0.35 - -0.5) * (1 - progress);
          robotTargetRotY = 0.0;
          state.platterRecordVisible = true;
          state.transitRecordVisible = false;
          if (progress >= 1.0) {
            state.animState = "UNLOAD_ROBOT_SWING";
            state.stateTimer = 0;
            playChime(220, "triangle", 0.08);
          }
          break;

        case "UNLOAD_ROBOT_SWING":
          const swingAnglePlatter = Math.atan2(platterPos.x - robotBasePos.x, platterPos.z - robotBasePos.z);
          robotTargetRotY = swingAnglePlatter * progress;
          robotTargetHeight = 0.32 - 0.14 * progress;
          state.platterRecordVisible = true;
          state.transitRecordVisible = false;
          if (progress >= 1.0) {
            state.animState = "UNLOAD_LIFT";
            state.stateTimer = 0;
            playChime(660, "sine", 0.06);
          }
          break;

        case "UNLOAD_LIFT":
          const baseSwingPlatter = Math.atan2(platterPos.x - robotBasePos.x, platterPos.z - robotBasePos.z);
          robotTargetRotY = baseSwingPlatter;
          robotTargetHeight = 0.18 + 0.28 * progress;

          state.platterRecordVisible = false;
          state.transitRecordVisible = true;
          transitRecord.position.copy(platterPos);
          transitRecord.position.y = platterPos.y + 0.28 * progress;

          if (progress >= 1.0) {
            state.animState = "UNLOAD_MOVE_STACK";
            state.stateTimer = 0;
          }
          break;

        case "UNLOAD_MOVE_STACK":
          const angleP = Math.atan2(platterPos.x - robotBasePos.x, platterPos.z - robotBasePos.z);
          const angleS = Math.atan2(stackPos.x - robotBasePos.x, stackPos.z - robotBasePos.z);
          robotTargetRotY = angleP + (angleS - angleP) * progress;
          robotTargetHeight = 0.46;

          state.platterRecordVisible = false;
          state.transitRecordVisible = true;

          const recordPos = platterPos.clone().add(new THREE.Vector3(0, 0.3, 0))
            .lerp(stackPos.clone().add(new THREE.Vector3(0, 0.3 + 3 * 0.026, 0)), progress);
          transitRecord.position.copy(recordPos);

          if (progress >= 1.0) {
            state.animState = "UNLOAD_LOWER";
            state.stateTimer = 0;
          }
          break;

        case "UNLOAD_LOWER":
          const finalAngleS = Math.atan2(stackPos.x - robotBasePos.x, stackPos.z - robotBasePos.z);
          robotTargetRotY = finalAngleS;
          robotTargetHeight = 0.46 - 0.22 * progress;

          state.platterRecordVisible = false;
          state.transitRecordVisible = true;
          transitRecord.position.copy(stackPos);
          transitRecord.position.y = stackPos.y + 3 * 0.026 + 0.14 * (1 - progress);

          if (progress >= 1.0) {
            state.transitRecordVisible = false;
            if (state.targetSongTitle) {
              state.animState = "LOAD_ROBOT_SWING";
              state.stateTimer = 0;
            } else {
              state.animState = "IDLE_EMPTY";
              state.activeSongTitle = "";
              state.stateTimer = 0;
            }
            playChime(180, "sine", 0.1);
          }
          break;

        case "LOAD_ROBOT_SWING":
          const rotStack = Math.atan2(stackPos.x - robotBasePos.x, stackPos.z - robotBasePos.z);
          robotTargetRotY = rotStack * progress;
          robotTargetHeight = 0.32 - 0.12 * progress;

          state.platterRecordVisible = false;
          state.transitRecordVisible = false;
          state.activeSongTitle = state.targetSongTitle;

          if (progress >= 1.0) {
            state.animState = "LOAD_LIFT";
            state.stateTimer = 0;
            playChime(660, "sine", 0.06);
          }
          break;

        case "LOAD_LIFT":
          const rotStackLift = Math.atan2(stackPos.x - robotBasePos.x, stackPos.z - robotBasePos.z);
          robotTargetRotY = rotStackLift;
          robotTargetHeight = 0.2 + 0.26 * progress;

          state.platterRecordVisible = false;
          state.transitRecordVisible = true;
          transitRecord.position.copy(stackPos);
          transitRecord.position.y = stackPos.y + 3 * 0.026 + 0.26 * progress;

          if (progress >= 1.0) {
            state.animState = "LOAD_MOVE_PLATTER";
            state.stateTimer = 0;
          }
          break;

        case "LOAD_MOVE_PLATTER":
          const loadRotS = Math.atan2(stackPos.x - robotBasePos.x, stackPos.z - robotBasePos.z);
          const loadRotP = Math.atan2(platterPos.x - robotBasePos.x, platterPos.z - robotBasePos.z);
          robotTargetRotY = loadRotS + (loadRotP - loadRotS) * progress;
          robotTargetHeight = 0.46;

          state.platterRecordVisible = false;
          state.transitRecordVisible = true;

          const transitPos = stackPos.clone().add(new THREE.Vector3(0, 0.35, 0))
            .lerp(platterPos.clone().add(new THREE.Vector3(0, 0.35, 0)), progress);
          transitRecord.position.copy(transitPos);

          if (progress >= 1.0) {
            state.animState = "LOAD_LOWER";
            state.stateTimer = 0;
          }
          break;

        case "LOAD_LOWER":
          const targetRotP = Math.atan2(platterPos.x - robotBasePos.x, platterPos.z - robotBasePos.z);
          robotTargetRotY = targetRotP;
          robotTargetHeight = 0.46 - 0.25 * progress;

          state.platterRecordVisible = false;
          state.transitRecordVisible = true;
          transitRecord.position.copy(platterPos);
          transitRecord.position.y = platterPos.y + 0.35 * (1 - progress);

          if (progress >= 1.0) {
            state.platterRecordVisible = true;
            state.transitRecordVisible = false;
            state.animState = "LOAD_NEEDLE";
            state.stateTimer = 0;
            playChime(392, "triangle", 0.12);
          }
          break;

        case "LOAD_NEEDLE":
          robotTargetRotY = Math.atan2(platterPos.x - robotBasePos.x, platterPos.z - robotBasePos.z) * (1 - progress);
          robotTargetHeight = 0.21 + 0.11 * progress;
          needleTargetRotY = -0.5 + (0.35 - -0.5) * progress;

          state.platterRecordVisible = true;
          state.transitRecordVisible = false;

          if (progress >= 1.0) {
            state.animState = "PLAYING";
            state.stateTimer = 0;
            setTimeout(() => playChime(261.63, "triangle", 0.18), 0);
            setTimeout(() => playChime(329.63, "triangle", 0.18), 100);
            setTimeout(() => playChime(392.00, "triangle", 0.18), 200);
          }
          break;

        case "PLAYING":
          robotTargetRotY = 0.0;
          needleTargetRotY = 0.35;
          state.platterRecordVisible = true;
          state.transitRecordVisible = false;

          const spinSpeed = 2.5 * delta;
          platterRecord.rotation.y += spinSpeed;
          platter.rotation.y += spinSpeed;
          break;
      }

      // Smoothly animate button plungers Y position
      const targetPlayY = state.hoveredButton === "playPause" ? 0.095 : 0.115;
      const targetStopY = state.hoveredButton === "stop" ? 0.095 : 0.115;
      playPlunger.position.y += (targetPlayY - playPlunger.position.y) * 0.2;
      playIcon.position.y = playPlunger.position.y + 0.045;

      stopPlunger.position.y += (targetStopY - stopPlunger.position.y) * 0.2;
      stopIcon.position.y = stopPlunger.position.y + 0.045;

      robotGroup.rotation.y += (robotTargetRotY - robotGroup.rotation.y) * 0.15;
      loaderBoom.position.y += (robotTargetHeight - loaderBoom.position.y) * 0.15;
      tonearmGroup.rotation.y += (needleTargetRotY - tonearmGroup.rotation.y) * 0.15;

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    // --- Resize Handler ---
    const handleResize = () => {
      if (!containerRef.current || !canvasRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = 420;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(animationFrameId);
      canvasElement.removeEventListener("mousemove", onMouseMove);
      canvasElement.removeEventListener("click", onClick);
      window.removeEventListener("resize", handleResize);

      // Dispose
      baseGeo.dispose();
      baseMat.dispose();
      rimGeo.dispose();
      rimMat.dispose();
      platterGeo.dispose();
      platterMat.dispose();
      spindleGeo.dispose();
      spindleMat.dispose();
      labelTexture.dispose();
      buttonBaseGeo.dispose();
      buttonBaseMat.dispose();
      playButtonPlungerGeo.dispose();
      playButtonPlungerMat.dispose();
      playIconGeo.dispose();
      iconMat.dispose();
      stopButtonPlungerMat.dispose();
      stopIconGeo.dispose();
      armBaseGeo.dispose();
      armBaseMat.dispose();
      armRodGeo.dispose();
      rodMat.dispose();
      cartridgeGeo.dispose();
      cartridgeMat.dispose();
      robotBaseGeo.dispose();
      loaderBoomGeo.dispose();
      loaderBoomMat.dispose();
      grabberGeo.dispose();
      grabberMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="w-full flex flex-col gap-6" ref={containerRef}>
      {/* 3D Viewport containing record player */}
      <div className="relative w-full h-[420px] rounded-2xl bg-cream-50 border border-cream-200 shadow-inner flex items-center justify-center overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* Status indicator badge */}
        <div className="absolute top-4 left-4 font-mono text-[9px] uppercase tracking-widest text-ink-400 bg-cream-100/80 px-2 py-0.5 rounded border border-cream-200/50 backdrop-blur-sm">
          {playing ? (
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-terra-500 animate-pulse" />
              Playing LP
            </span>
          ) : (
            "Select Record & Play"
          )}
        </div>
      </div>

      {/* Crate Digger Shelf: Vertically stacked records below */}
      <div className="flex flex-col gap-2">
        <header className="flex items-baseline justify-between px-1">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-400">Record Rack</span>
          <span className="text-xs text-ink-500 italic">Select record to play</span>
        </header>

        {/* Crate bin container */}
        <div className="flex gap-4 p-4 overflow-x-auto scrollbar-thin scrollbar-thumb-cream-300 scrollbar-track-transparent rounded-xl bg-cream-50/50 border border-cream-200/60 shadow-inner">
          {shippedSongs.map((s, idx) => {
            const isCurrent = playing === s.title;
            const isHovered = hoveredSong === s.title;
            const colorObj = stackColorPalettes[idx % stackColorPalettes.length];

            return (
              <div
                key={s.title}
                onClick={() => isCurrent ? stop() : play(s.title)}
                onMouseEnter={() => setHoveredSong(s.title)}
                onMouseLeave={() => setHoveredSong(null)}
                className="group relative flex flex-col items-center cursor-pointer shrink-0 py-2"
                style={{ width: "96px" }}
              >
                {/* Vinyl Slip-out animation */}
                <div
                  className={`absolute w-20 h-20 rounded-full bg-zinc-950 border border-zinc-800 shadow-lg flex items-center justify-center transition-all duration-300 ease-out z-0`}
                  style={{
                    transform: isCurrent 
                      ? "translateY(-48px) rotate(180deg)" 
                      : isHovered 
                      ? "translateY(-24px) rotate(45deg)" 
                      : "translateY(0px) rotate(0deg)",
                  }}
                >
                  <div className={`w-8 h-8 rounded-full ${colorObj.twBg} border border-zinc-800 flex items-center justify-center`}>
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-950" />
                  </div>
                </div>

                {/* Cardboard Sleeve */}
                <div
                  className={`relative w-24 h-24 rounded shadow-md border ${colorObj.twBg} ${colorObj.text} flex flex-col justify-between p-2.5 z-10 transition-transform duration-300 ease-out`}
                  style={{
                    transform: isCurrent || isHovered ? "scale(1.05)" : "scale(1.0)",
                  }}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-[7px] font-bold uppercase opacity-80 leading-none">
                      LP #{idx + 1}
                    </span>
                    <span className="font-mono text-[7px] font-bold opacity-80 leading-none">
                      {s.language.slice(0, 3)}
                    </span>
                  </div>

                  <div className="flex-1 flex items-center justify-center">
                    <p className="font-serif font-bold text-[9px] tracking-tight leading-[1.1] text-center select-none line-clamp-3">
                      {s.title}
                    </p>
                  </div>

                  <div className="border-t border-current/25 pt-1 flex items-center justify-between">
                    <span className="text-[6px] font-mono tracking-wider opacity-60">SHIA SUPERTRAMP</span>
                    {isCurrent && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dynamic Song Window below canvas showing playing/hovered song info */}
      <div className="rounded-xl border border-cream-200 bg-cream-50/50 p-5 shadow-sm min-h-[130px] flex flex-col justify-between transition-all duration-300">
        {hoveredSong ? (
          <div>
            {(() => {
              const hSongObj = shippedSongs.find((s) => s.title === hoveredSong);
              if (!hSongObj) return null;
              return (
                <>
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="font-serif text-lg tracking-tight text-ink-900">
                      🔍 Inspecting: <span className="font-medium text-terra-600">{hSongObj.title}</span>
                    </h3>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-ink-400">
                      {hSongObj.language}
                    </span>
                  </div>
                  <p className="text-sm text-ink-600 leading-relaxed mb-1">
                    <span className="font-mono text-[10px] uppercase text-ink-400 mr-2">Theme:</span>
                    {hSongObj.theme}
                  </p>
                  {hSongObj.about && (
                    <p className="text-xs text-ink-500 italic">{hSongObj.about}</p>
                  )}
                </>
              );
            })()}
          </div>
        ) : playing ? (
          <div>
            <div className="flex justify-between items-baseline mb-2">
              <h3 className="font-serif text-lg tracking-tight text-ink-900">
                💿 Playing: <span className="font-medium text-terra-600">{playing}</span>
              </h3>
              <span className="font-mono text-[9px] uppercase tracking-widest text-ink-400">
                {shippedSongs.find(s => s.title === playing)?.language || "Bilingual"}
              </span>
            </div>
            <p className="text-sm text-ink-600 leading-relaxed mb-1">
              <span className="font-mono text-[10px] uppercase text-ink-400 mr-2">Theme:</span>
              {shippedSongs.find(s => s.title === playing)?.theme}
            </p>
            {shippedSongs.find(s => s.title === playing)?.about && (
              <p className="text-xs text-ink-500 italic">
                {shippedSongs.find(s => s.title === playing)?.about}
              </p>
            )}
            <button
              onClick={() => stop()}
              className="mt-3 font-mono text-[10px] uppercase tracking-wider text-terra-600 hover:text-terra-700 font-bold"
            >
              Stop & Eject Record
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center py-4">
            <span className="text-2xl mb-1.5 opacity-60">📦</span>
            <p className="font-serif italic text-ink-500 text-sm">
              Hover over a record inside the bin below to inspect, click to load it onto the turntable.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
