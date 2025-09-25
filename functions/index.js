const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

// Configurar el transporter de Nodemailer
const createTransporter = () => {
  const gmailEmail = process.env.GMAIL_EMAIL;
  const gmailPass = process.env.GMAIL_PASS;

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: gmailEmail,
      pass: gmailPass
    }
  });
};

// Función HTTP principal - CORREGIDA
exports.sendConfirmationEmail = functions.https.onRequest(async (req, res) => {
  // Configurar CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Manejar preflight OPTIONS
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  // Solo permitir POST
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Método no permitido. Use POST.' 
    });
  }

  try {
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);

    // Verificar que el body existe y tiene datos
    if (!req.body || Object.keys(req.body).length === 0) {
      console.error('Body vacío o undefined');
      return res.status(400).json({
        success: false,
        error: 'El cuerpo de la solicitud está vacío'
      });
    }

    const {
      nombre,
      apellidoPaterno,
      apellidoMaterno,
      correo,
      numeroContacto,
      fechaNacimiento
    } = req.body;

    // Validaciones básicas
    if (!nombre || !correo) {
      return res.status(400).json({
        success: false,
        error: 'Nombre y correo son requeridos'
      });
    }

    // Crear y verificar transporter
    const transporter = createTransporter();
    await transporter.verify();
    console.log('Transporter de email verificado');

    // Preparar opciones del email
    const mailOptions = {
      from: `"Tu Empresa" <${process.env.GMAIL_EMAIL}>`,
      to: correo,
      subject: `Confirmación de Registro - ${nombre} ${apellidoPaterno || ''}`,
      html: generateEmailTemplate(req.body)
    };

    console.log('Enviando email a:', correo);

    // Enviar email
    const result = await transporter.sendMail(mailOptions);
    console.log('Email enviado exitosamente:', result.messageId);

    // Respuesta exitosa
    res.status(200).json({
      success: true,
      messageId: result.messageId,
      message: 'Correo enviado exitosamente'
    });

  } catch (error) {
    console.error('Error en la función:', error);

    // Respuesta de error
    res.status(500).json({
      success: false,
      error: error.message || 'Error interno del servidor'
    });
  }
});

// Template de email (simplificado para prueba)
function generateEmailTemplate(userData) {
  const fechaRegistro = new Date().toLocaleDateString('es-MX');
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #007BFF; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { padding: 20px; background: #f9f9f9; border: 1px solid #ddd; border-top: none; }
            .data-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .data-table td { padding: 10px; border-bottom: 1px solid #ddd; }
            .data-table td:first-child { font-weight: bold; width: 40%; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>Confirmación de Registro</h1>
        </div>
        
        <div class="content">
            <p>Hola <strong>${userData.nombre} ${userData.apellidoPaterno || ''}</strong>,</p>
            
            <p>Tu registro ha sido exitoso. Aquí están los detalles:</p>
            
            <table class="data-table">
                <tr>
                    <td>Nombre completo:</td>
                    <td>${userData.nombre} ${userData.apellidoPaterno || ''} ${userData.apellidoMaterno || ''}</td>
                </tr>
                <tr>
                    <td>Correo electrónico:</td>
                    <td>${userData.correo}</td>
                </tr>
                ${userData.numeroContacto ? `<tr><td>Número de contacto:</td><td>${userData.numeroContacto}</td></tr>` : ''}
                ${userData.fechaNacimiento ? `<tr><td>Fecha de nacimiento:</td><td>${userData.fechaNacimiento}</td></tr>` : ''}
                <tr>
                    <td>Fecha de registro:</td>
                    <td>${fechaRegistro}</td>
                </tr>
            </table>
            
            <p>¡Gracias por registrarte!</p>
        </div>
    </body>
    </html>
  `;
}