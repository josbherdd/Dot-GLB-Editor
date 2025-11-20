import { useControls } from "leva";
import { OutdoorChairCuatro } from "./OutdoorChair4";
export const Experience = () => {

    const { yAaxis } = useControls({ yAaxis: {value: 1, min: 0, max: 3, step: 0.01} })

    return(
        
        <>
            <OutdoorChairCuatro />
        </>
    );
};