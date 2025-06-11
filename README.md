# LeFri Platform

## Derechos de Autor y Licencia

© 2024 LeFriPlatform. Todos los derechos reservados.

Este software y su documentación son propiedad intelectual de LeFriPlatform. Se prohíbe estrictamente:

- La reproducción total o parcial del código
- La distribución o comercialización del software
- La modificación o creación de trabajos derivados
- El uso no autorizado de cualquier parte de la propiedad intelectual

Cualquier uso no autorizado de este software constituirá una violación de los derechos de autor y podrá resultar en acciones legales.

## 🚀 Descripción del Proyecto

LeFri Platform es una plataforma web moderna desarrollada con tecnologías de vanguardia para proporcionar una solución robusta y escalable. El proyecto está desarrollado en Ecuador.

## 👨‍💻 Autor

- **Jonnatan Peña**
- Ubicación: Ecuador

## 🛠️ Stack Tecnológico

### Frontend
- React 18
- TypeScript
- TailwindCSS
- Radix UI Components
- React Query
- Zustand (Gestión de Estado)
- Wouter (Enrutamiento)
- Framer Motion (Animaciones)

### Backend
- Node.js
- Express.js
- TypeScript
- MongoDB con Mongoose
- Soporte WebSocket
- Passport.js (Autenticación)

### API de WhatsApp
- Implementación personalizada
- Integración con múltiples proveedores
- Sistema de gestión de leads
- Manejo de mensajes en tiempo real

## 📦 Dependencias Principales

### Componentes UI
- @radix-ui/* (Biblioteca de componentes UI)
- @tanstack/react-query (Manejo de datos y caché)
- framer-motion (Animaciones)
- lucide-react (Iconos)
- react-hook-form (Manejo de formularios)
- zod (Validación de esquemas)

### Servicios Backend
- express
- mongoose
- passport
- nodemailer
- ws (WebSocket)
- googleapis

## 🏗️ Estructura del Proyecto

```
LeFriPlatform/
├── client/                 # Aplicación Frontend
│   ├── src/               # Código fuente
│   └── index.html         # Archivo HTML principal
├── server/                # Aplicación Backend
├── shared/                # Utilidades y tipos compartidos
├── uploads/               # Directorio de archivos subidos
├── whatsapp-api/          # Integración de API de WhatsApp
└── attached_assets/       # Recursos estáticos
```

## 🚀 Comenzando

### Prerrequisitos
- Node.js (Última versión LTS)
- MongoDB
- npm o yarn

### Instalación

1. Clonar el repositorio
```bash
git clone https://github.com/dark-yx/LeFriPlatform.git
```

2. Instalar dependencias
```bash
npm install
```

3. Configurar variables de entorno
```bash
cp .env.example .env
```

4. Iniciar servidor de desarrollo
```bash
npm run dev
```

## 📝 Scripts Disponibles

- `npm run dev` - Iniciar servidor de desarrollo
- `npm run build` - Construir para producción
- `npm run start` - Iniciar servidor de producción
- `npm run check` - Verificación de tipos
- `npm run db:push` - Actualizaciones de esquema de base de datos

## 🔒 Características de Seguridad

- Autenticación con Passport.js
- Gestión de sesiones
- Subida segura de archivos
- Validación de entrada con Zod
- Protección de variables de entorno

## 🌐 Integración de APIs

- API de WhatsApp personalizada
- APIs de Google
- Integración de servicio de correo
- Soporte WebSocket para características en tiempo real

## 🎨 Características UI/UX

- Diseño responsivo
- Soporte para tema claro/oscuro
- Biblioteca moderna de componentes
- Animaciones suaves
- Componentes accesibles

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🙏 Acknowledgments

- Fundación Underlife
- Weblifetech
- All contributors and supporters of the project

---

Desarrollado con ❤️ en Ecuador 