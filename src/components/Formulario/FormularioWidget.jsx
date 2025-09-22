import React, {useState} from 'react';
import './FormularioWidget.css';

const FormularioWidget = () => {

  const [formData, setFormData] = useState({
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    correo: '',
    numeroContacto: '',
    fechaNacimiento: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if(errors[name]){
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if(!formData.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
    if(!formData.apellidoMaterno.trim()) newErrors.apellidoMaterno = 'El apellido materno es obligatorio';
    if(!formData.apellidoPaterno.trim()) newErrors.apellidoPaterno = 'El apellido paterno es obligatorio';
    if(!formData.correo.trim()){
      newErrors.correo = 'El correo es obligatorio';
    } else if(!/\S+@\S+\.\S+/.test(formData.correo)){
      newErrors.correo = 'El formato del correo no es válido';
    }
    if(!formData.numeroContacto.trim()) {
      newErrors.numeroContacto = 'El número de contacto es obligatorio';
    } else if(!/^\d{10}$/.test(formData.numeroContacto)){
      newErrors.numeroContacto = 'El número de contacto debe de tener 10 dígitos';
    }
    if(!formData.fechaNacimiento) newErrors.fechaNacimiento = 'La Fecha de nacimiento es obligatoria';

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateForm();

    if(Object.keys(formErrors).length === 0){
      setIsSubmitted(true);

      setTimeout(() => {
        setIsSubmitted(false);
        setIsSuccess(true);
        console.log('Datos del formulario enviados:', formData);
      }, 1500);
    } else {
      setErrors(formErrors);
    }
  };

  const handleReset = () => {
    setFormData({
      nombre: '',
      apellidoMaterno: '',
      apellidoPaterno: '',
      correo: '',
      numeroContacto: '',
      fechaNacimiento: ''
    });
    setErrors({});
    setIsSuccess(false);
  };

  if(isSuccess){
    return (
      <div className="success-message">
        <h2>¡Formulario enviado con éxito!</h2>
        <button className="btn-reset" onClick={handleReset}>Enviar otro formulario</button>
      </div>
    );
  };

  return (
    <form className="formulario-widget" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="nombre">Nombre</label>
        <input 
          type="text" 
          id="nombre" 
          name="nombre" 
          placeholder="Ingresa tu nombre" 
          value={formData.nombre} 
          onChange={handleChange}
          required />
      </div>

      <div className="form-group">
        <label htmlFor="apellidoPaterno">Apellido Paterno</label>
        <input 
          type="text" 
          id="apellidoPaterno" 
          name="apellidoPaterno" 
          placeholder="Ingresa tu apellido paterno"
          value={formData.apellidoPaterno}
          onChange={handleChange}
          required />
      </div>

      <div className="form-group">
        <label htmlFor="apellidoMaterno">Apellido Materno</label>
        <input 
          type="text" 
          id="apellidoMaterno" 
          name="apellidoMaterno" 
          placeholder="Ingresa tu apellido materno"
          value={formData.apellidoMaterno}
          onChange={handleChange}
          required />
      </div>

      <div className="form-group">
        <label htmlFor="correo">Correo Electrónico</label>
        <input 
          type="email" 
          id="correo" 
          name="correo" 
          placeholder="Ingresa tu correo electrónico"
          value={formData.correo}
          onChange={handleChange}
          required />
      </div>

      <div className="form-group">
        <label htmlFor="numeroContacto">Número de Contacto</label>
        <input 
          type="tel" 
          id="numeroContacto" 
          name="numeroContacto" 
          placeholder="Ingresa tu número de contacto"
          value={formData.numeroContacto}
          onChange={handleChange}
          required />
      </div>

      <div className="form-group">
        <label htmlFor="fechaNacimiento">Fecha de Nacimiento</label>
        <input 
          type="date" 
          id="fechaNacimiento" 
          name="fechaNacimiento"
          value={formData.fechaNacimiento}
          onChange={handleChange}
          required />
      </div>

      <button type="submit" className="btn-submit" disabled={isSubmitted}>Enviar</button>
    </form>
  );
};

export default FormularioWidget;