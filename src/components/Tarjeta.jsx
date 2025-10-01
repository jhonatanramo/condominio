import Mos from './../pages/css/componentes/tarjeta.module.css';
import {Barra} from './../components/Navigation';


export function Tarjeta() {
    return (
        <Barra>
            <div className={Mos.contenedor_modulo}>
                <h1 className={Mos.titulo}>Todos los Módulos</h1>
                <div className={Mos.contenedor}>
                    {[1,2,3,4,5].map((num) => (
                        <div key={num} className={Mos.modulo}>
                            <h2>Nro módulo: {num}</h2>
                            <p>Pisos</p>
                            <progress value="75" max="100">75%</progress><br />
                            <p>Habitaciones</p>
                            <progress value="0.75">75%</progress><br />
                            <button className={Mos.boton}>Ver módulo</button>
                        </div>
                    ))}
                </div>
            </div>

            <div className={Mos.contenedor_unidad}>
                <h2 className={Mos.titulo}>Todas las Unidades</h2>
                <div className={Mos.contenedor}>
                    <div className={Mos.unidad}>
                        <h3>MOD-2-12</h3>
                        <h2>$us. 3000</h2>
                        <p>Personas máx.: 6</p>
                        <div className={`${Mos.estado} ${Mos.disponible}`}></div>
                        <button className={Mos.boton}>Detalle</button>
                    </div>
                </div>
            </div> 
        </Barra>
    );
}
