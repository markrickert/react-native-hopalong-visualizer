import React from "react"
import { View, ViewStyle } from "react-native"

import { ExpoWebGLRenderingContext, GLView } from "expo-gl"
import { Renderer, TextureLoader, THREE } from "expo-three"
import { observer } from "mobx-react-lite"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import { runOnJS, useSharedValue, withTiming } from "react-native-reanimated"
import {
  AdditiveBlending,
  BufferGeometry,
  FogExp2,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  Vector3,
} from "three"

import { hsvToHsl } from "src/utils/color"

export const DEFAULT_SPEED = 8
export const DEFAULT_ROTATION_SPEED = 0.005
export const DEFAULT_FOV = 60

export const DEFAULT_POINTS_SUBSET = 4000
export const DEFAULT_SUBSETS = 7
export const DEFAULT_LEVELS = 7
export type OrbitParams<T> = {
  a: T
  b: T
  c: T
  d: T
  e: T
}
export type Orbit<T> = {
  subsets: SubsetPoint[][]
  xMin: T
  xMax: T
  yMin: T
  yMax: T
  scaleX: T
  scaleY: T
}
export type SubsetPoint = {
  x: number
  y: number
  vertex: Vector3
}

export type ParticleSet<TMaterial extends THREE.Material | THREE.Material[]> = {
  /** The material/colour used to draw this ParticleSet */
  myMaterial: TMaterial
  /** Index of the level this ParticleSet belongs to */
  myLevel: number
  /** Index of the subset this ParticleSet belongs to */
  mySubset: number
  /** Whether the colour has been updated since last render */
  needsUpdate: boolean
  /** The underlying location data of the particles */
  particles: THREE.Points
}

type HopalongParticleSet = ParticleSet<THREE.PointsMaterial>

const SCALE_FACTOR = 1500
const CAMERA_BOUND = 200

const LEVEL_DEPTH = 600

const DEF_BRIGHTNESS = 1
const DEF_SATURATION = 0.8

const SPRITE_SIZE = 5

// Orbit parameters constraints
const A_MIN = -30
const A_MAX = 30
const B_MIN = 0.2
const B_MAX = 1.8
const C_MIN = 5
const C_MAX = 17
const D_MIN = 0
const D_MAX = 10
const E_MIN = 0
const E_MAX = 12

export const SPEED_DELTA = 0.25
export const SPEED_DELTA_EXTRA = SPEED_DELTA * 4
export const ROTATION_DELTA = 0.0005
export const ROTATION_DELTA_EXTRA = ROTATION_DELTA * 4
export const POINTS_DELTA = 1000
export const FOV_DELTA = 2

export default observer(function WelcomeScreen() {
  const [settings, setSettings] = React.useState({
    pointsPerSubset: DEFAULT_POINTS_SUBSET,
    levelCount: DEFAULT_LEVELS,
    subsetCount: DEFAULT_SUBSETS,
    speed: DEFAULT_SPEED,
    rotationSpeed: DEFAULT_ROTATION_SPEED,
    cameraFov: DEFAULT_FOV,
    isPlaying: true,
    mouseLocked: true,
  })

  const onLeft = useSharedValue(true)
  const position = useSharedValue(0)

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (onLeft.value) {
        position.value = e.translationX
      } else {
        position.value = CAMERA_BOUND + e.translationX
      }
    })
    .onEnd((e) => {
      if (position.value > CAMERA_BOUND / 2) {
        position.value = withTiming(CAMERA_BOUND, { duration: 100 })
        onLeft.value = false
      } else {
        position.value = withTiming(0, { duration: 100 })
        onLeft.value = true
      }
    })

  let timeout: string | number | NodeJS.Timeout | undefined
  React.useEffect(() => {
    // Clear the animation loop when the component unmounts
    return () => {
      clearTimeout(timeout)
    }
  }, [])

  const texture = React.useMemo<THREE.Texture>(
    () => new TextureLoader().load(require("../assets/galaxy.png")),
    [],
  )

  const [speed, setSpeed] = React.useState<number>(settings.speed)
  const [rotationSpeed, setRotationSpeed] = React.useState<number>(DEFAULT_ROTATION_SPEED)
  const [numPointsSubset, setNumPointsSubset] = React.useState<number>(settings.pointsPerSubset)
  const [numSubsets, setNumSubsets] = React.useState<number>(DEFAULT_SUBSETS)
  const [numLevels, setNumLevels] = React.useState<number>(DEFAULT_LEVELS)

  const orbitParams = React.useRef<OrbitParams<number>>({
    a: 0,
    b: 0,
    c: 0,
    d: 0,
    e: 0,
  })
  const orbit = React.useRef<Orbit<number>>({
    subsets: [],
    xMin: 0,
    xMax: 0,
    yMin: 0,
    yMax: 0,
    scaleX: 0,
    scaleY: 0,
  })

  const shuffleParams = () => {
    orbitParams.current = {
      a: A_MIN + Math.random() * (A_MAX - A_MIN),
      b: B_MIN + Math.random() * (B_MAX - B_MIN),
      c: C_MIN + Math.random() * (C_MAX - C_MIN),
      d: D_MIN + Math.random() * (D_MAX - D_MIN),
      e: E_MIN + Math.random() * (E_MAX - E_MIN),
    }
  }

  const prepareOrbit = () => {
    shuffleParams()
    orbit.current.xMin = 0
    orbit.current.xMax = 0
    orbit.current.yMin = 0
    orbit.current.yMax = 0
  }

  const generateOrbit = (numSubsets: number, numPointsSubset: number) => {
    prepareOrbit()

    const { a, b, c, d, e } = orbitParams.current
    // Using local vars should be faster
    const al = a
    const bl = b
    const cl = c
    const dl = d
    const el = e
    const subsets = orbit.current.subsets
    const scaleFactorL = SCALE_FACTOR

    let xMin = 0
    let xMax = 0
    let yMin = 0
    let yMax = 0
    const choice = Math.random()

    for (let s = 0; s < numSubsets; s++) {
      // Use a different starting point for each orbit subset
      let x = s * 0.005 * (0.5 - Math.random())
      let y = s * 0.005 * (0.5 - Math.random())
      let z: number
      let x1: number

      const curSubset = subsets[s]

      for (let i = 0; i < numPointsSubset; i++) {
        // Iteration formula (generalization of the Barry Martin's original one)

        if (choice < 0.5) {
          z = dl + Math.sqrt(Math.abs(bl * x - cl))
        } else if (choice < 0.75) {
          z = dl + Math.sqrt(Math.sqrt(Math.abs(bl * x - cl)))
        } else {
          z = dl + Math.log(2 + Math.sqrt(Math.abs(bl * x - cl)))
        }

        if (x > 0) {
          x1 = y - z
        } else if (x === 0) {
          x1 = y
        } else {
          x1 = y + z
        }
        y = al - x
        x = x1 + el

        curSubset[i].x = x
        curSubset[i].y = y

        if (x < xMin) {
          xMin = x
        } else if (x > xMax) {
          xMax = x
        }
        if (y < yMin) {
          yMin = y
        } else if (y > yMax) {
          yMax = y
        }
      }
    }

    const scaleX = (2 * scaleFactorL) / (xMax - xMin)
    const scaleY = (2 * scaleFactorL) / (yMax - yMin)

    orbit.current.xMin = xMin
    orbit.current.xMax = xMax
    orbit.current.yMin = yMin
    orbit.current.yMax = yMax
    orbit.current.scaleX = scaleX
    orbit.current.scaleY = scaleY

    // Normalize and update vertex data
    for (let s = 0; s < numSubsets; s++) {
      const curSubset = subsets[s]
      for (let i = 0; i < numPointsSubset; i++) {
        curSubset[i].vertex.setX(scaleX * (curSubset[i].x - xMin) - scaleFactorL)
        curSubset[i].vertex.setY(scaleY * (curSubset[i].y - yMin) - scaleFactorL)
      }
    }
  }

  const initOrbit = (numSubsets: number, numPointsSubset: number) => {
    // Initialize data points
    orbit.current.subsets = []
    for (let i = 0; i < numSubsets; i++) {
      const subsetPoints: SubsetPoint[] = []
      for (let j = 0; j < numPointsSubset; j++) {
        subsetPoints[j] = {
          x: 0,
          y: 0,
          vertex: new Vector3(0, 0, 0),
        }
      }
      orbit.current.subsets.push(subsetPoints)
    }
  }

  const [hueValues, setHueValues] = React.useState<number[]>(
    new Array(numSubsets).fill(0).map(() => Math.random()),
  )
  const generateHues = (numSubsets: number) => {
    setHueValues(new Array(numSubsets).fill(0).map(() => Math.random()))
  }

  const particleSets = React.useRef<HopalongParticleSet[]>([])

  const updateOrbit = () => {
    generateOrbit(numSubsets, numPointsSubset)
    generateHues(numSubsets)
    for (const particleSet of particleSets.current.values()) {
      particleSet.needsUpdate = true
    }
  }

  React.useEffect(() => {
    const timer = setInterval(() => {
      updateOrbit()
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  const onCreateContext = async (gl: ExpoWebGLRenderingContext) => {
    // removes the warning EXGL: gl.pixelStorei() doesn't support this parameter yet!
    const pixelStorei = gl.pixelStorei.bind(gl)
    gl.pixelStorei = function (...args) {
      const [parameter] = args
      switch (parameter) {
        case gl.UNPACK_FLIP_Y_WEBGL:
          return pixelStorei(...args)
      }
    }

    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl
    const sceneColor = 0x000000

    initOrbit(numSubsets, numPointsSubset)

    // Create a WebGLRenderer without a DOM element
    const renderer = new Renderer({
      gl,
      antialias: true,
      powerPreference: "high-performance",
    })
    renderer.setSize(width, height)
    renderer.setClearColor(sceneColor)

    const camera = new PerspectiveCamera(DEFAULT_FOV, width / height, 1, 3 * SCALE_FACTOR)
    camera.position.set(0, 0, SCALE_FACTOR / 2)

    const scene = new Scene()
    scene.fog = new FogExp2(0x000000, 0.001)

    generateOrbit(numSubsets, numPointsSubset)
    generateHues(numSubsets)

    const generateParticleSet = (level: number, subset: number) => {
      // Updating from Geometry to BufferGeometry
      // https://github.com/mrdoob/three.js/pull/21031
      // https://discourse.threejs.org/t/three-geometry-will-be-removed-from-core-with-r125/22401
      const vertices = orbit.current.subsets[subset].map(({ vertex }) => vertex)
      const geometry = new BufferGeometry()
      geometry.setFromPoints(vertices)

      // Updating from ParticleSystem to points
      // https://github.com/mrdoob/three.js/issues/4065
      const materials = new PointsMaterial({
        size: SPRITE_SIZE,
        map: texture,
        blending: AdditiveBlending,
        depthTest: false,
        transparent: false,
      })

      materials.color.setHSL(...hsvToHsl(hueValues[subset], DEF_SATURATION, DEF_BRIGHTNESS))

      const particles = new Points(geometry, materials)
      particles.position.x = 0
      particles.position.y = 0
      particles.position.z =
        -LEVEL_DEPTH * level - (subset * LEVEL_DEPTH) / numSubsets + SCALE_FACTOR / 2

      const particleSet: HopalongParticleSet = {
        myMaterial: materials,
        myLevel: level,
        mySubset: subset,
        needsUpdate: false,
        particles,
      }

      scene.add(particles)
      particleSets.current.push(particleSet)
    }

    // Create particle systems
    for (let k = 0; k < numLevels; k++) {
      for (let s = 0; s < numSubsets; s++) {
        generateParticleSet(k, s)
      }
    }

    function update() {
      if (camera.position.x >= -CAMERA_BOUND && camera.position.x <= CAMERA_BOUND) {
        camera.position.x += (-position.value - camera.position.x) * 0.05
        if (camera.position.x < -CAMERA_BOUND) {
          camera.position.x = -CAMERA_BOUND
        }
        if (camera.position.x > CAMERA_BOUND) {
          camera.position.x = CAMERA_BOUND
        }
      }
      if (camera.position.y >= -CAMERA_BOUND && camera.position.y <= CAMERA_BOUND) {
        camera.position.y += (position.value - camera.position.y) * 0.05
        if (camera.position.y < -CAMERA_BOUND) {
          camera.position.y = -CAMERA_BOUND
        }
        if (camera.position.y > CAMERA_BOUND) {
          camera.position.y = CAMERA_BOUND
        }
      }

      camera.lookAt(scene.position)

      // update particle positions
      // for (let i = 0; i < scene.children.length; i++) {
      for (const particleSet of particleSets.current) {
        const { particles, myMaterial, mySubset } = particleSet
        particles.position.z += speed
        particles.rotation.z += rotationSpeed

        // if the particle level has passed the fade distance
        if (particles.position.z > camera.position.z) {
          // move the particle level back in front of the camera
          particles.position.z = -(numLevels - 1) * LEVEL_DEPTH

          if (particleSet.needsUpdate) {
            // update the geometry and color
            const vertices = orbit.current.subsets[mySubset].map(({ vertex }) => vertex)
            const geometry = particleSet.particles.geometry

            geometry.setFromPoints(vertices)
            particles.geometry.attributes.position.needsUpdate = true

            myMaterial.color.setHSL(
              ...hsvToHsl(hueValues[mySubset], DEF_SATURATION, DEF_BRIGHTNESS),
            )
            particleSet.needsUpdate = false
          }
        }
      }
    }

    // Setup an animation loop
    const render = () => {
      timeout = requestAnimationFrame(render)
      update()
      renderer.render(scene, camera)
      gl.endFrameEXP()
    }
    render()
  }

  const reset = () => {
    "worklet"
    // setSpeed(DEFAULT_SPEED)
    // setRotationSpeed(DEFAULT_ROTATION_SPEED)
    // setNumPointsSubset(DEFAULT_POINTS_SUBSET)
    // setNumSubsets(DEFAULT_SUBSETS)
    // setNumLevels(DEFAULT_LEVELS)
  }

  const tap = Gesture.Tap()
    .maxDuration(250)
    .numberOfTaps(2)
    .onStart(() => {
      console.log("Double tap!")
      runOnJS(reset)()
    })

  return (
    <GestureDetector gesture={tap}>
      <GestureDetector gesture={panGesture}>
        <View style={$flex}>
          <GLView
            style={$flex}
            onContextCreate={onCreateContext}
            enableExperimentalWorkletSupport
          />
        </View>
      </GestureDetector>
    </GestureDetector>
  )
})

const $flex: ViewStyle = { flex: 1 }
