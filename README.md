# LeFri Platform

Plataforma legal integral que combina consultas legales, gestión de procesos y alertas de emergencia.

## 🚀 Tecnologías

- **Frontend**: React, TypeScript, TailwindCSS, Vite
- **Backend**: Node.js, Express, TypeScript
- **Base de Datos**: MongoDB
- **Autenticación**: Google OAuth 2.0
- **APIs Integradas**: 
  - Google Gemini AI
  - WhatsApp Business API
  - Servicios de Email
  - Servicios de Voz

## 📦 Estructura del Proyecto

```
LeFriPlatform/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/    # Componentes reutilizables
│   │   ├── pages/        # Páginas principales
│   │   ├── contexts/     # Contextos de React
│   │   ├── hooks/        # Hooks personalizados
│   │   └── types/        # Tipos TypeScript
├── server/                # Backend Express
│   ├── config/           # Configuraciones
│   ├── services/         # Servicios externos
│   ├── storage/          # Capa de persistencia
│   └── types/            # Tipos TypeScript
└── shared/               # Código compartido
```

## 🛠️ Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/tu-usuario/LeFriPlatform.git
cd LeFriPlatform
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:

En el directorio raíz, crear `.env`:
```env
GOOGLE_OAUTH_CLIENT_ID=tu_client_id_de_google
GOOGLE_OAUTH_CLIENT_SECRET=tu_client_secret_de_google
GOOGLE_OAUTH_REDIRECT_URI=http://localhost:5000/api/auth/google/callback
MONGODB_URI=tu_uri_de_mongodb
SESSION_SECRET=tu_secreto_seguro
```

En el directorio `client`, crear `.env`:
```env
VITE_GOOGLE_CLIENT_ID=tu_client_id_de_google
VITE_API_URL=http://localhost:5000
```

4. Configurar Google OAuth:
   - Ir a [Google Cloud Console](https://console.cloud.google.com)
   - Crear un nuevo proyecto o seleccionar uno existente
   - Habilitar la API de Google OAuth 2.0
   - Crear credenciales OAuth 2.0
   - Agregar los siguientes URIs autorizados:
     - `http://localhost:5000`
     - `http://localhost:5173`
   - Agregar los siguientes orígenes de JavaScript:
     - `http://localhost:5000`
     - `http://localhost:5173`

5. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

## 🔑 Autenticación

La aplicación utiliza Google OAuth 2.0 para la autenticación. Para que funcione correctamente:

1. Asegúrate de que las variables de entorno estén configuradas correctamente
2. Verifica que los URIs de redirección estén configurados en Google Cloud Console
3. El cliente ID debe ser el mismo en ambos archivos `.env`

## 🚨 Solución de Problemas

### Error de Autenticación con Google

Si encuentras el error "Respuesta inválida del servidor":

1. Verifica los logs en la consola del navegador (F12)
2. Asegúrate de que el servidor esté corriendo en el puerto 5000
3. Verifica que las variables de entorno estén configuradas correctamente
4. Limpia el caché del navegador y los datos de localStorage
5. Reinicia el servidor

### Problemas Comunes

1. **Error de CORS**: 
   - Verifica que los orígenes estén configurados correctamente
   - Asegúrate de que el servidor esté configurado para aceptar las credenciales

2. **Error de Conexión a MongoDB**:
   - Verifica la URI de MongoDB
   - Asegúrate de que la base de datos esté accesible

3. **Error de Autenticación**:
   - Verifica las credenciales de Google OAuth
   - Asegúrate de que los URIs de redirección estén configurados correctamente

## 📝 Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Construye la aplicación para producción
- `npm run start`: Inicia la aplicación en modo producción
- `npm run check`: Verifica los tipos TypeScript

## 🔒 Seguridad

- Autenticación mediante Google OAuth 2.0
- Sesiones seguras con express-session
- Protección contra ataques CSRF
- Validación de datos con Zod
- Sanitización de entradas

## 🤝 Contribuir

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles.