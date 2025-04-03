import "./Reference.css";

const Reference = () => {
  return (
    <div className="containerReference">
      <div className="boxReference">
        <div className="dotReference" style={{ backgroundColor: "red" }}></div>
        <span className="spanReference">
          Pago parcial / nulo - Sin confirmacion de asistencia
        </span>
      </div>
      <div className="boxReference">
        <div
          className="dotReference"
          style={{ backgroundColor: "orange" }}></div>
        <span className="spanReference">
          Pago completado - Falta confirmación de asistencia
        </span>
      </div>
      {/* <div className="boxReference">
        <div className="dotReference" style={{ backgroundColor: "blue" }}></div>
        <span className="spanReference">
          Pago completo / nulo / parcial - No asistido
        </span>
      </div> */}
      <div className="boxReference">
        <div
          className="dotReference"
          style={{ backgroundColor: "#03800b" }}></div>
        <span className="spanReference">Pago completado - Turno asistido</span>
      </div>
    </div>
  );
};

export default Reference;
