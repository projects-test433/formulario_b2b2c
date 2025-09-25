import React, { useState } from 'react';
import { sendConfirmationEmail } from '../../services/emailService';
import { db } from '../../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import logo from '../../assets/logo_UASSIST.png';
import appLogo from '../../assets/appLogo.png';
import playLogo from '../../assets/playLogo.png';

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
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
    if (!formData.apellidoMaterno.trim()) newErrors.apellidoMaterno = 'El apellido materno es obligatorio';
    if (!formData.apellidoPaterno.trim()) newErrors.apellidoPaterno = 'El apellido paterno es obligatorio';
    if (!formData.correo.trim()) {
      newErrors.correo = 'El correo es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.correo)) {
      newErrors.correo = 'El formato del correo no es válido';
    }
    if (!formData.numeroContacto.trim()) {
      newErrors.numeroContacto = 'El número de contacto es obligatorio';
    } else if (!/^\d{10}$/.test(formData.numeroContacto)) {
      newErrors.numeroContacto = 'El número de contacto debe de tener 10 dígitos';
    } else if(!/^\d+$/.test(formData.numeroContacto)) {
      newErrors.numeroContacto = 'solo se permiten números'
    }
    if (!formData.fechaNacimiento) newErrors.fechaNacimiento = 'La Fecha de nacimiento es obligatoria';

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();

    if (Object.keys(formErrors).length === 0) {
      setIsSubmitted(true);



      try {
        //guardado en firestore
        const docRef = await addDoc(collection(db, 'registrosClientes'), {
          nombre: formData.nombre,
          apellidoPaterno: formData.apellidoPaterno,
          apellidoMaterno: formData.apellidoMaterno,
          correo: formData.correo.toLocaleLowerCase(),
          numeroContacto: formData.numeroContacto,
          fechaNacimiento: formData.fechaNacimiento,
          fechaRegistro: serverTimestamp()
        });

        console.log('Registro en Firestore con ID:', docRef.id);

        //envío de correo
        const emailResult = await sendConfirmationEmail(formData);
        if(!emailResult.success){
          console.warn('Registro guardado. No se envío correo:', emailResult.error);
        }

        setIsSubmitted(false);
        setIsSuccess(true);
      } catch (error) {
        console.error('Error al guardar los datos:', error);
        setSubmitError(error.message);
        setIsSubmitted(false);
      }
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
    setSubmitError('');
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Formulario enviado!</h2>
            <p className="text-gray-600 mb-6">Tu información se ha registrado correctamente</p>
            
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-800 mb-2">Descarga PHONECHECK</h3>
              <p className="text-blue-600 text-sm">
                Para continuar con el proceso, descarga la app desde tu tienda de aplicaciones e 
                ingresa el código que enviamos a tu correo.
              </p>
              <div className='flex flex-col gap-2 p-8 sm:flex-col sm:items-center sm:gap-6'>
                <a href="https://apps.apple.com/mx/app/phonecheck/id1446390777?platform=iphone" target='blank'>
                  <img src={appLogo} alt="appLogo" className='w-3xs'/>
                </a>
                <a href="https://play.google.com/store/apps/details?id=com.phonecheck.phonecheckconsumer&pcampaignid=web_share" target='blank'>
                  <img src={playLogo} alt="playLogo" className='w-3xs'/>
                </a>
              </div>
            </div>
            <button 
              onClick={handleReset}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200"
            >
              Volver al formulario
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
        <div className="flex flex-col gap-3 p-10 sm:flex-col sm:items-center">
          <img src={logo} alt='logo' className='w-3xs'></img>
          <h2 className="text-lg text-gray-600">Formulario de Registro</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
              {submitError}
            </div>
          )}

          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
              Ingresa tu nombre
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.nombre ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ej. Juan"
            />
            {errors.nombre && <span className="text-red-500 text-xs mt-1 block">{errors.nombre}</span>}
          </div>

          <div>
            <label htmlFor="apellidoPaterno" className="block text-sm font-medium text-gray-700 mb-1">
              Ingresa tu apellido paterno
            </label>
            <input
              type="text"
              id="apellidoPaterno"
              name="apellidoPaterno"
              value={formData.apellidoPaterno}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.apellidoPaterno ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ej. Pérez"
            />
            {errors.apellidoPaterno && <span className="text-red-500 text-xs mt-1 block">{errors.apellidoPaterno}</span>}
          </div>

          <div>
            <label htmlFor="apellidoMaterno" className="block text-sm font-medium text-gray-700 mb-1">
              Ingresa tu apellido materno
            </label>
            <input
              type="text"
              id="apellidoMaterno"
              name="apellidoMaterno"
              value={formData.apellidoMaterno}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.apellidoMaterno ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ej. López"
            />
            {errors.apellidoMaterno && <span className="text-red-500 text-xs mt-1 block">{errors.apellidoMaterno}</span>}
          </div>

          <div>
            <label htmlFor="correo" className="block text-sm font-medium text-gray-700 mb-1">
              Ingresa tu correo electrónico
            </label>
            <input
              type="email"
              id="correo"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.correo ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ej. juan@ejemplo.com"
            />
            {errors.correo && <span className="text-red-500 text-xs mt-1 block">{errors.correo}</span>}
          </div>

          <div>
            <label htmlFor="numeroContacto" className="block text-sm font-medium text-gray-700 mb-1">
              Ingresa tu número de contacto
            </label>
            <input
              type="tel"
              id="numeroContacto"
              name="numeroContacto"
              value={formData.numeroContacto}
              onChange={handleChange}
              onKeyUp={(e) => {
                if(!/[0-9]/.test(e.key)){
                  e.preventDefault();
                }
              }}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.numeroContacto ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ej. 5512345678"
              maxLength='10'
              pattern="[0-9]*"
              inputMode='numeric'
            />
            {errors.numeroContacto && <span className="text-red-500 text-xs mt-1 block">{errors.numeroContacto}</span>}
          </div>

          <div>
            <label htmlFor="fechaNacimiento" className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de nacimiento
            </label>
            <input
              type="date"
              id="fechaNacimiento"
              name="fechaNacimiento"
              value={formData.fechaNacimiento}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.fechaNacimiento ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.fechaNacimiento && <span className="text-red-500 text-xs mt-1 block">{errors.fechaNacimiento}</span>}
          </div>

          <button
            type="submit"
            disabled={isSubmitted}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 disabled:opacity-50"
          >
            {isSubmitted ? 'Enviando...' : 'Enviar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormularioWidget;