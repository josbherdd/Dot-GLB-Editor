import { Canvas } from '@react-three/fiber';
import './App.css';
import { useGLTF, useTexture, Environment, Grid, OrbitControls, SoftShadows } from '@react-three/drei'
import { useState, useEffect } from 'react';


function Model({ materialConfigs, setMaterialConfigs, textureOptions, modelPath }) {
    
  const { scene } = useGLTF(modelPath)

  const colorMaps = {}
  Object.entries(textureOptions.color).forEach(([key, url]) => {
  colorMaps[key] = useTexture(url, (t) => (t.flipY = false))
  })

  const normalMaps = {}
  Object.entries(textureOptions.normal).forEach(([key, url]) => {
  normalMaps[key] = useTexture(url, (t) => (t.flipY = false))
  })

  const roughnessMaps = {}
  Object.entries(textureOptions.roughness).forEach(([key, url]) => {
  roughnessMaps[key] = useTexture(url, (t) => (t.flipY = false))
  })

  const metalnessMaps = {}
  Object.entries(textureOptions.metalness).forEach(([key, url]) => {
  metalnessMaps[key] = useTexture(url, (t) => (t.flipY = false))
  })
  
  const aoMaps = {}
  Object.entries(textureOptions.ao).forEach(([key, url]) => {
  aoMaps[key] = useTexture(url, (t) => (t.flipY = false))
  })
  
  
  const [foundMaterials, setFoundMaterials] = useState([])

  useEffect(() => {
    const found = []

  scene.traverse((child) => {
      if (child.isMesh) {

        child.castShadow = true     
        child.receiveShadow = true 

        const mat = child.material
        if (Array.isArray(mat)) {
          mat.forEach((m) => !found.includes(m) && found.push(m))
        } else if (!found.includes(mat)) {
          found.push(mat)
        }
      }
    })
    setFoundMaterials(found)

    const newConfigs = {}
    found.forEach((mat) => {
      newConfigs[mat.uuid] = {
        name: mat.name || 'Unnamed Material',
        colorType: 'default',
        normalType: 'default',
        roughnessType: 'default',
        metalType: 'default',
        aoType: 'default', 
      }
    })

    setMaterialConfigs(newConfigs)
  }, [scene, setMaterialConfigs])


  useEffect(() => {
    foundMaterials.forEach((mat) => {
      const cfg = materialConfigs[mat.uuid]
      if (!cfg) return

      mat.map = colorMaps[cfg.colorType]
      mat.normalMap = normalMaps[cfg.normalType]
      mat.roughnessMap = roughnessMaps[cfg.roughnessType]
      mat.metalnessMap = metalnessMaps[cfg.metalType]
      mat.aoMap = aoMaps[cfg.aoType]
      mat.needsUpdate = true
    })
  }, [foundMaterials, materialConfigs])

  return (
    <>
      <primitive object={scene} scale={1.1} />
    </>
  )
};


export default function App() {

  const [modelPath, setModelPath] = useState('${import.meta.env.BASE_URL}3d-models/OutdoorChair004.glb');
  const [materialConfigs, setMaterialConfigs] = useState({});

  const textureOptions = {
    color: {
      default: '${import.meta.env.BASE_URL}models/textures2/outdoor-chair-004-col-metalness-4k.png',
      wood: '${import.meta.env.BASE_URL}models/textures2/texture-1.jpg',
    },
    normal: {
      default: '${import.meta.env.BASE_URL}models/textures2/outdoor-chair-004-nrm-metalness-4k.png',
      wood: '${import.meta.env.BASE_URL}models/textures2/texture-1-normal.png',
    },
    roughness: {
      default: '${import.meta.env.BASE_URL}models/textures2/outdoor-chair-004-roughness-metalness-4k.png',
      rough: '${import.meta.env.BASE_URL}models/textures2/texture-1-roughness.jpg',
    },
    metalness: {
      default: '${import.meta.env.BASE_URL}models/textures2/outdoor-chair-004-metalness-metalness-4k.png',
      metal: '${import.meta.env.BASE_URL}models/textures2/texture-2-metal.jpg',
    },
    ao: {
      default: '${import.meta.env.BASE_URL}models/textures2/outdoor-chair-004-ao-metalness-4k.png',
      white: '${import.meta.env.BASE_URL}models/textures2/white-ao-texture.png',
    },
  }

  return (
    <main className="h-screen relative">
      
      <div className="w-full h-full ">
       

        <Canvas camera={{ fov: 50, near: 0.1, far: 10, position: [-1, 1.7, 2] }}  shadows >
          <OrbitControls />

          <Environment background={ false } environmentIntensity={0.1} files={ '${import.meta.env.BASE_URL}models/textures2/rogland_sunset_4k.jpg' } />

          <SoftShadows size={30} samples={20} focus={0.8} />

          <directionalLight
          castShadow
          position={[5, 10, 5]}
          intensity={1.5}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={1}
          shadow-camera-far={30}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
          />
            
          {/* En este componente se encuentra el asset */}
          <Model
          key={ modelPath } 
          materialConfigs={materialConfigs}
          setMaterialConfigs={setMaterialConfigs}
          textureOptions={ textureOptions }
          modelPath={ modelPath }
          />

          <mesh receiveShadow rotation-x={-Math.PI / 2} position={[0, -0.001, 0]}>
          <planeGeometry args={[50, 50]} />
          <shadowMaterial transparent opacity={0.35} />
          </mesh>

          <Grid args={[40, 40]} fadeDistance={5} cellSize={0.1} cellThickness={0.6}/>
          
        </Canvas>

        <div className="absolute top-4 right-4 bg-white/70 backdrop-blur pr-2 pl-3 pt-3 pb-2 rounded-lg text-dark">

              <button
                onClick={() => {
                  useGLTF.clear('${import.meta.env.BASE_URL}3d-models/OutdoorChair004.glb')
                  setModelPath('${import.meta.env.BASE_URL}3d-models/OutdoorChair004.glb')}}
                className="px-4 py-2 rounded-lg bg-white text-gray-700 shadow-lg shadow-black/7 mr-3 mb-3 border border-gray-100 hover:border-blue-200 transition-colors duration-200"
              >
                Model 1
              </button>
                      
              <button
                onClick={() => {
                  useGLTF.clear('${import.meta.env.BASE_URL}3d-models/flower-pot.glb')
                  setModelPath('${import.meta.env.BASE_URL}3d-models/flower-pot.glb')}}
                className="px-4 py-2 rounded-lg bg-white text-gray-700 shadow-lg shadow-black/7 mr-2 mb-3 border border-gray-100 hover:border-blue-200 transition-colors duration-200"
              >
                Model 2
              </button>

        <h1 className="font-black text-lg mb-2">Material Settings</h1>

        {Object.entries(materialConfigs).map(([uuid, cfg]) => (
          <div key={uuid} className="mb-3">
            <h3 className="font-semibold text-sm">{cfg.name}</h3>

            <label className="text-xs font-semibold">Color:</label>
                  <div className="flex gap-2 mt-1">
                    {Object.entries(textureOptions.color).map(([key, path]) => (
                      <div
                        key={key}
                        onClick={() =>
                          setMaterialConfigs((prev) => ({
                            ...prev,
                            [uuid]: { ...prev[uuid], colorType: key },
                          }))
                        }
                        className={`w-12 h-12 rounded-lg overflow-hidden cursor-pointer border-2 ${
                          cfg.colorType === key ? 'border-blue-500' : 'border-transparent'
                        }`}
                      >
                        <img src={path} alt={key} className="w-full h-full object-cover" />
                      </div>
                      ))}
                  </div>
              {/* --- */}

            <label className="text-xs">Normal map:</label>   
              <div className="flex gap-2 mt-1">
                    {Object.entries(textureOptions.normal).map(([key, path]) => (
                      <div
                        key={key}
                        onClick={() =>
                          setMaterialConfigs((prev) => ({
                            ...prev,
                            [uuid]: { ...prev[uuid], normalType: key },
                          }))
                        }
                        className={`w-12 h-12 rounded-lg overflow-hidden cursor-pointer border-2 ${
                          cfg.normalType === key ? 'border-blue-500' : 'border-transparent'
                      }`}  >
                        <img src={path} alt={key} className="w-full h-full object-cover" />
                      </div>
                      ))}
                  </div>
              {/* --- */}

            <label className="text-xs">Roughness:</label>   
              <div className="flex gap-2 mt-1">
                    {Object.entries(textureOptions.roughness).map(([key, path]) => (
                      <div
                        key={key}
                        onClick={() =>
                          setMaterialConfigs((prev) => ({
                            ...prev,
                            [uuid]: { ...prev[uuid], roughnessType: key },
                          }))
                        }
                        className={`w-12 h-12 rounded-lg overflow-hidden cursor-pointer border-2 ${
                          cfg.roughnessType === key ? 'border-blue-500' : 'border-transparent'
                        }`} >
                        <img src={path} alt={key} className="w-full h-full object-cover" />
                      </div>
                      ))}
                  </div>
              {/* --- */}

              <label className="text-xs">Metal:</label>   
              <div className="flex gap-2 mt-1">
                    {Object.entries(textureOptions.metalness).map(([key, path]) => (
                      <div
                        key={key}
                        onClick={() =>
                          setMaterialConfigs((prev) => ({
                            ...prev,
                            [uuid]: { ...prev[uuid], metalType: key },
                          }))
                        }
                        className={`w-12 h-12 rounded-lg overflow-hidden cursor-pointer border-2 ${
                          cfg.metalType === key ? 'border-blue-500' : 'border-transparent'
                        }`} >
                        <img src={path} alt={key} className="w-full h-full object-cover" />
                      </div>
                      ))}
                  </div>
              {/* --- */}

              <label className="text-xs">AO:</label>   
              <div className="flex gap-2 mt-1">
                    {Object.entries(textureOptions.ao).map(([key, path]) => (
                      <div
                        key={key}
                        onClick={() =>
                          setMaterialConfigs((prev) => ({
                            ...prev,
                            [uuid]: { ...prev[uuid], aoType: key },
                          }))
                        }
                        className={`w-12 h-12 rounded-lg overflow-hidden cursor-pointer border-2 ${
                          cfg.aoType === key ? 'border-blue-500' : 'border-transparent'
                        }`} >
                        <img src={path} alt={key} className="w-full h-full object-cover" />
                      </div>
                      ))}
                  </div>
              {/* --- */}
          </div>
        ))}
      </div>

      <button
        className=" absolute bg-white/70 font-medium bottom-5 left-1/2 -translate-x-1/2 px-5 py-2 rounded-full bg-blue text-gray-600 backdrop-blur shadow-md hover:bg-white/90 hover:shadow-lg"
      >
        + Add Model
      </button>

      <button
        disabled
        className="
          absolute
          bottom-5 right-63
          w-13 h-13 
          rounded-full
          bg-white/70
          text-gray-600
          backdrop-blur
          shadow-md
          flex items-center justify-center
          font-medium
          hover:bg-white/90
          hover:shadow-lg
        "
      >
        <img
          src={"${import.meta.env.BASE_URL}models/expand.png"}
          alt="icon"
          className="w-5 h-5 opacity-80"
        />
      </button>
        
      </div>
      
    </main>
    
  )
}






























