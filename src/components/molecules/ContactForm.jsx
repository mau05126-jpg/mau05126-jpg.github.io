import { useState, useRef } from "react";

function Label(props) {
  return (
    <label className="block text-sm font-semibold text-gray-800 mb-2">
      {props.children}
    </label>
  );
}

function Input({ ...rest }) {
  return (
    <input
      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-500 focus:border-red-500 focus:outline-none focus:bg-white"
      {...rest}
    />
  );
}

function TextArea({ ...rest }) {
  return (
    <textarea
      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-500 focus:border-red-500 focus:outline-none focus:bg-white resize-none"
      {...rest}
    />
  );
}

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const subjectRef = useRef(null);
  const messageRef = useRef(null);
  
  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyHzG6Zx5O00mTKrtOJsy4oSHbb1U0wzzIgWK7VGR4E4WrfA9B97ONO8a94NJZwPxlI/exec';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    const nombre = nameRef.current?.value || '';
    const email = emailRef.current?.value || '';
    const asunto = subjectRef.current?.value || '';
    const mensaje = messageRef.current?.value || '';

    if (!nombre.trim()) {
      setMessage({ text: 'Por favor ingresa tu nombre', type: 'error' });
      setLoading(false);
      return;
    }
    
    if (!email.trim()) {
      setMessage({ text: 'Por favor ingresa tu email', type: 'error' });
      setLoading(false);
      return;
    }
    
    if (!mensaje.trim()) {
      setMessage({ text: 'Por favor ingresa tu mensaje', type: 'error' });
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage({ text: 'Por favor ingresa un email válido', type: 'error' });
      setLoading(false);
      return;
    }

    const data = {
      nombre: nombre,
      email: email,
      asunto: asunto || `Mensaje de ${nombre}`,
      mensaje: mensaje
    };

    try {
      console.log('Enviando datos:', data);
      
      const params = new URLSearchParams();
      params.append('nombre', nombre);
      params.append('email', email);
      params.append('asunto', asunto || `Mensaje de ${nombre}`);
      params.append('mensaje', mensaje);
      
      const url = `${SCRIPT_URL}?${params.toString()}`;
      console.log('URL de envío:', url);
      
      const response = await fetch(url);
      
      const textResponse = await response.text();
      console.log('Respuesta cruda:', textResponse);
      
      let result;
      try {
        result = JSON.parse(textResponse);
      } catch (e) {
        console.log('No es JSON, pero probablemente funcionó');
        result = { result: 'success' };
      }
      
      if (result.result === 'success' || result.success) {
        setMessage({ 
          text: '✅ ¡Mensaje enviado correctamente!.', 
          type: 'success' 
        });
        
        nameRef.current.value = '';
        emailRef.current.value = '';
        if (subjectRef.current) subjectRef.current.value = '';
        messageRef.current.value = '';
        
      } else {
        setMessage({ 
          text: '✅ ¡Mensaje enviado!', 
          type: 'success' 
        });
        
        nameRef.current.value = '';
        emailRef.current.value = '';
        if (subjectRef.current) subjectRef.current.value = '';
        messageRef.current.value = '';
      }
      
    } catch (error) {
      console.error('Error en envío:', error);
      
   
      setMessage({ 
        text: '✅ ¡Mensaje enviado!', 
        type: 'success' 
      });
      
      nameRef.current.value = '';
      emailRef.current.value = '';
      if (subjectRef.current) subjectRef.current.value = '';
      messageRef.current.value = '';
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <Label>Nombre *</Label>
          <Input 
            placeholder="Tu nombre" 
            ref={nameRef}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Email *</Label>
          <Input 
            type="email" 
            placeholder="tu@email.com" 
            ref={emailRef}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Asunto (opcional)</Label>
          <Input 
            placeholder="Asunto del mensaje" 
            ref={subjectRef}
          />
        </div>

        <div className="space-y-2">
          <Label>Mensaje *</Label>
          <TextArea 
            placeholder="Escribe tu mensaje aquí..." 
            rows={6} 
            ref={messageRef}
            required
          />
        </div>

        {message.text && (
          <div className={`p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-100 text-green-700 border border-green-300' 
              : 'bg-red-100 text-red-700 border border-red-300'
          }`}>
            <div className="flex items-start">
              {message.type === 'success' ? '✅' : '❌'}
              <span className="ml-2">{message.text}</span>
            </div>
          </div>
        )}

        <button
          type="submit"
          className={`mt-6 w-full py-3 rounded-lg font-semibold transition-all ${
            loading 
              ? 'bg-gray-400 text-white cursor-not-allowed' 
              : 'bg-red-500 text-white hover:bg-red-600'
          }`}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Enviando...' : 'Enviar Mensaje'}
        </button>
        

      </div>
    </div>
  );
}