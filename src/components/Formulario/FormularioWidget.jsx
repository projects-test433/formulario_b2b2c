import React from 'react';
import './FormularioWidget.css';

const FormularioWidget = () => {
  return (
    <form className="formulario-widget">
      <div className="form-group">
        <label htmlFor="nombre">Nombre</label>
        <input type="text" id="nombre" name="nombre" placeholder="Ingresa tu nombre" required />
      </div>

      <div className="form-group">
        <label htmlFor="apellido-paterno">Apellido Paterno</label>
        <input type="text" id="apellido-paterno" name="apellido-paterno" placeholder="Ingresa tu apellido paterno" required />
      </div>

      <div className="form-group">
        <label htmlFor="apellido-materno">Apellido Materno</label>
        <input type="text" id="apellido-materno" name="apellido-materno" placeholder="Ingresa tu apellido materno" required />
      </div>

      <div className="form-group">
        <label htmlFor="correo">Correo Electrónico</label>
        <input type="email" id="correo" name="correo" placeholder="Ingresa tu correo electrónico" required />
      </div>

      <div className="form-group">
        <label htmlFor="numero-contacto">Número de Contacto</label>
        <input type="tel" id="numero-contacto" name="numero-contacto" placeholder="Ingresa tu número de contacto" required />
      </div>

      <div className="form-group">
        <label htmlFor="fecha-nacimiento">Fecha de Nacimiento</label>
        <input type="date" id="fecha-nacimiento" name="fecha-nacimiento" required />
      </div>

      <button type="submit" className="btn-submit">Enviar</button>
    </form>
  );
};

export default FormularioWidget;