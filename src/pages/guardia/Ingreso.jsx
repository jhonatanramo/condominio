import { Barra } from "../../components/Navigation";
import  CamaraPlacas from "../../components/camara/CamaraPlacas";
const manejarEscaneoExitoso = (datosPlaca) => {
    console.log('Datos de la placa escaneada:', datosPlaca);
}
export function Ingreso(){
    return(
        <Barra>
            <input type="checkbox" name="" id="" />
            <label htmlFor="">ci</label><br /><input type="text" /><br />
            <label htmlFor="">nombre</label><br /><input type="text" /><br />
            <label htmlFor="">Apellido</label><br /><input type="text" /><br />
            <CamaraPlacas onEscaneoExitoso={manejarEscaneoExitoso} />

        </Barra>
    );
}