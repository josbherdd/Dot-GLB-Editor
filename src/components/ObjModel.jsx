import React, { useEffect, useState } from "react";
import { useLoader } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/Addons.js";

export function Model({ urlPath }) {

  // const [modelo, setModelo] = useState(null);

  // useEffect(() => {
  //   if (!urlPath || !mtlPath) {
  //     console.error("❌ Rutas de modelo inválidas:", urlPath, mtlPath); return;}

  //   const mtlLoader = new MTLLoader();
  //   mtlLoader.load(mtlPath, (materiales) => {
  //     console.log("✅ MTL cargado:", materiales);
  //     materiales.preload(); // Carga los materiales antes de aplicarlos al OBJ

  //     const objLoader = new OBJLoader();
  //     objLoader.setMaterials(materiales);
  //     objLoader.load( urlPath, (objeto) => {
  //         setModelo(objeto);
  //       },
  //       undefined,
  //       (error) => console.error("Error cargando el OBJ:", error)
  //     );
  //   }, undefined, (error) => console.error("Error cargando el MTL:", error));
  // }, [urlPath, mtlPath]);

  // if (!modelo) return;

  const obj = useLoader(OBJLoader, urlPath );

  return <primitive object={obj} scale={1.2} />;
}