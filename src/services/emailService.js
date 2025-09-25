// services/emailService.js - Versión simple con URL directa
const FUNCTION_URL = 'https://sendconfirmationemail-54eklypvsq-uc.a.run.app';

export const sendConfirmationEmail = async (userData) => {
  try {
    console.log('📤 Enviando a función:', userData);
    
    const response = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const result = await response.json();
    console.log('✅ Respuesta:', result);
    
    return result;
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
};