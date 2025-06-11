# LeFriAI - Guía de Estilos Completa

## Paleta de Colores

### Colores Principales
- **Primario**: `#2563EB` (azul confianza)
- **Secundario**: `#10B981` (verde acción)
- **Acento**: `#EF4444` (rojo emergencia)
- **Fondo**: `#F9FAFB` (gris claro)
- **Texto**: `#1F2937` (gris oscuro)
- **Bordes**: `#E5E7EB` (gris medio)

### Colores Adicionales
| Uso | Color | Clase Tailwind |
|-----|-------|----------------|
| Éxito | `#10B981` | `bg-emerald-500` |
| Advertencia | `#F59E0B` | `bg-amber-500` |
| Error | `#EF4444` | `bg-red-500` |
| Información | `#3B82F6` | `bg-blue-500` |
| Superficie | `#FFFFFF` | `bg-white` |
| Superficie oscura | `#111827` | `bg-gray-900` |

## Tipografía
- **Fuente Principal**: Inter (sans-serif)
- **Tamaños**:
  - h1: `text-4xl font-bold`
  - h2: `text-3xl font-semibold`
  - h3: `text-2xl font-medium`
  - h4: `text-xl font-medium`
  - p: `text-base`
  - small: `text-sm`

## Componentes Base

### Botones
```jsx
<button className="btn-primary">Acción principal</button>
<button className="btn-secondary">Acción secundaria</button>
<button className="btn-emergency">¡Emergencia!</button>
<button className="btn-disabled" disabled>Deshabilitado</button>
```

Clases:
```css
.btn-primary {
  @apply bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg;
}

.btn-secondary {
  @apply bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-6 rounded-lg transition duration-200 border border-emerald-500;
}

.btn-emergency {
  @apply bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full transition duration-200 shadow-lg hover:shadow-xl animate-pulse;
}

.btn-disabled {
  @apply bg-gray-300 text-gray-500 cursor-not-allowed font-medium py-2 px-6 rounded-lg;
}
```

### Tarjetas
```jsx
<div className="card">
  <h3>Título de tarjeta</h3>
  <p>Contenido de la tarjeta</p>
</div>
```

Clase:
```css
.card {
  @apply bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition duration-300;
}
```

### Entradas de Texto
```jsx
<input type="text" className="input-text" placeholder="Escribe aquí" />
<textarea className="input-text" placeholder="Descripción"></textarea>
```

Clase:
```css
.input-text {
  @apply w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200;
}
```

### Alertas
```jsx
<div className="alert-success">Operación exitosa</div>
<div className="alert-error">Ha ocurrido un error</div>
<div className="alert-warning">Advertencia importante</div>
<div className="alert-info">Información relevante</div>
```

Clases:
```css
.alert-success {
  @apply bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 p-4 rounded;
}

.alert-error {
  @apply bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded;
}

.alert-warning {
  @apply bg-amber-50 border-l-4 border-amber-500 text-amber-700 p-4 rounded;
}

.alert-info {
  @apply bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 rounded;
}
```

## Animaciones y Transiciones
- **Hover**: `transition duration-200`
- **Carga**: `animate-pulse`
- **Entrada**: `animate-fadeIn`
- **Salida**: `animate-fadeOut`

```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeOut {
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(10px); }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-in-out;
}

.animate-fadeOut {
  animation: fadeOut 0.3s ease-in-out;
}
```

## Layout Principal

### Barra de Navegación
```jsx
<nav className="navbar">
  <div className="navbar-logo">LeFriAI</div>
  <div className="navbar-links">
    <a href="/dashboard">Dashboard</a>
    <a href="/profile">Perfil</a>
    <button className="btn-secondary">Cerrar sesión</button>
  </div>
</nav>
```

Clases:
```css
.navbar {
  @apply bg-white shadow-md py-4 px-6 flex justify-between items-center sticky top-0 z-50;
}

.navbar-logo {
  @apply text-2xl font-bold text-blue-600;
}

.navbar-links {
  @apply flex items-center space-x-6;
}
```

## Pantallas Específicas

### Login
```jsx
<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
  <div className="card max-w-md w-full">
    <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Bienvenido a LeFriAI</h1>

    <div className="space-y-4">
      <input type="email" className="input-text" placeholder="Correo electrónico" />
      <input type="password" className="input-text" placeholder="Contraseña" />

      <button className="btn-primary w-full">Iniciar sesión</button>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input type="checkbox" className="rounded text-blue-600" />
          <label className="ml-2 text-sm text-gray-600">Recordarme</label>
        </div>
        <a href="#" className="text-sm text-blue-600 hover:underline">¿Olvidaste tu contraseña?</a>
      </div>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">O continúa con</span>
        </div>
      </div>

      <button className="btn-secondary w-full flex items-center justify-center">
        <GoogleIcon className="w-5 h-5 mr-2" />
        Google
      </button>
    </div>
  </div>
</div>
```

### Dashboard
```jsx
<div className="container mx-auto p-6">
  <h1 className="text-2xl font-bold mb-6 text-gray-800">Dashboard</h1>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <div className="card flex flex-col items-center justify-center p-6 cursor-pointer hover:shadow-lg transition">
      <ChatIcon className="text-blue-600 text-4xl mb-4" />
      <h2 className="text-xl font-semibold text-gray-800">Modo Consulta</h2>
    </div>

    <div className="card flex flex-col items-center justify-center p-6 cursor-pointer hover:shadow-lg transition">
      <EmergencyIcon className="text-red-500 text-4xl mb-4" />
      <h2 className="text-xl font-semibold text-gray-800">Modo Emergencia</h2>
    </div>

    <div className="card flex flex-col items-center justify-center p-6 cursor-pointer hover:shadow-lg transition">
      <ProcessIcon className="text-emerald-500 text-4xl mb-4" />
      <h2 className="text-xl font-semibold text-gray-800">Procesos Legales</h2>
    </div>

    <div className="card flex flex-col items-center justify-center p-6 cursor-pointer hover:shadow-lg transition">
      <ProfileIcon className="text-amber-500 text-4xl mb-4" />
      <h2 className="text-xl font-semibold text-gray-800">Mi Perfil</h2>
    </div>
  </div>

  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div className="card lg:col-span-2">
      <h3 className="text-lg font-semibold mb-4">Actividad Reciente</h3>
      {/* Lista de actividad */}
    </div>

    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Procesos en Curso</h3>
      {/* Lista de procesos */}
    </div>
  </div>
</div>
```

### Modo Consulta (Chat)
```jsx
<div className="flex flex-col h-screen bg-gray-50">
  <div className="flex-1 overflow-y-auto p-4">
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-start mb-4">
        <div className="bg-white rounded-2xl rounded-bl-none p-4 max-w-md shadow-sm">
          <p>Buen día, ¿en qué puedo ayudarte hoy?</p>
        </div>
      </div>

      <div className="flex justify-end mb-4">
        <div className="bg-blue-100 rounded-2xl rounded-br-none p-4 max-w-md shadow-sm">
          <p>Necesito ayuda con un caso de despido injustificado</p>
        </div>
      </div>

      <div className="flex justify-start mb-4">
        <div className="bg-white rounded-2xl rounded-bl-none p-4 max-w-md shadow-sm">
          <p>Para casos de despido en Ecuador, debes considerar...</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">Art. 123 COOTAD</span>
            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">Art. 87 Código Laboral</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div className="border-t border-gray-200 p-4 bg-white">
    <div className="max-w-4xl mx-auto flex items-center">
      <input 
        type="text" 
        placeholder="Escribe tu consulta legal..." 
        className="input-text flex-1 mr-3"
      />
      <button className="btn-primary">
        <SendIcon className="w-5 h-5" />
      </button>
    </div>

    <div className="max-w-4xl mx-auto mt-2 flex flex-wrap gap-2">
      <span className="text-xs text-gray-500">Sugerencias:</span>
      <button className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition">
        Derechos laborales
      </button>
      <button className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition">
        Divorcio express
      </button>
      <button className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition">
        Contratos
      </button>
    </div>
  </div>
</div>
```

### Modo Emergencia
```jsx
<div className="min-h-screen bg-gray-50 p-6">
  <h1 className="text-2xl font-bold mb-6 text-gray-800">Modo Emergencia</h1>

  <div className="card mb-6">
    <div className="w-full h-64 rounded-lg overflow-hidden relative">
      {/* Mapa de Google Maps */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-3">
        <LocationIcon className="text-blue-600 inline mr-2" />
        <span className="text-sm">Quito, Ecuador</span>
      </div>
    </div>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Contactos de Emergencia</h3>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
          <div>
            <p className="font-medium">María Pérez</p>
            <p className="text-sm text-gray-600">+593 99 123 4567</p>
          </div>
          <div className="flex items-center">
            <WhatsAppIcon className="text-green-500 mr-2" />
            <span className="text-sm text-green-600">WhatsApp</span>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
          <div>
            <p className="font-medium">Carlos Rodríguez</p>
            <p className="text-sm text-gray-600">+593 98 765 4321</p>
          </div>
          <div className="flex items-center">
            <PhoneIcon className="text-blue-500 mr-2" />
            <span className="text-sm text-blue-600">Llamada</span>
          </div>
        </div>
      </div>

      <button className="btn-secondary w-full mt-4">
        <PlusIcon className="w-4 h-4 mr-2 inline" />
        Agregar contacto
      </button>
    </div>

    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Protocolos de Emergencia</h3>

      <div className="space-y-3">
        <div className="p-3 border border-gray-200 rounded-lg hover:bg-blue-50 cursor-pointer transition">
          <p className="font-medium flex items-center">
            <ShieldIcon className="text-red-500 mr-2" />
            Violencia doméstica
          </p>
          <p className="text-sm text-gray-600 mt-1">Pasos a seguir y recursos disponibles</p>
        </div>

        <div className="p-3 border border-gray-200 rounded-lg hover:bg-blue-50 cursor-pointer transition">
          <p className="font-medium flex items-center">
            <MedicalIcon className="text-red-500 mr-2" />
            Atención médica urgente
          </p>
          <p className="text-sm text-gray-600 mt-1">Hospitales y clínicas cercanas</p>
        </div>
      </div>
    </div>
  </div>

  <div className="fixed bottom-6 right-6 z-10">
    <button className="btn-emergency flex items-center">
      <EmergencyIcon className="w-6 h-6 mr-2" />
      Activar Emergencia
    </button>
  </div>
</div>
```

### Modo Proceso Legal
```jsx
<div className="min-h-screen bg-gray-50 p-6">
  <h1 className="text-2xl font-bold mb-6 text-gray-800">Proceso: Divorcio Voluntario</h1>

  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center">
      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">1</div>
      <div className="ml-2">
        <p className="text-sm font-medium">Información básica</p>
      </div>
    </div>

    <div className="w-16 h-1 bg-gray-300"></div>

    <div className="flex items-center">
      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-500">2</div>
      <div className="ml-2">
        <p className="text-sm text-gray-500">Acuerdos</p>
      </div>
    </div>

    <div className="w-16 h-1 bg-gray-300"></div>

    <div className="flex items-center">
      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-500">3</div>
      <div className="ml-2">
        <p className="text-sm text-gray-500">Documentos</p>
      </div>
    </div>
  </div>

  <div className="card p-6">
    <h3 className="text-lg font-semibold mb-4">Información de las partes</h3>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
        <input type="text" className="input-text" placeholder="Nombre del cónyuge 1" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Cédula de identidad</label>
        <input type="text" className="input-text" placeholder="Número de cédula" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
        <input type="text" className="input-text" placeholder="Nombre del cónyuge 2" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Cédula de identidad</label>
        <input type="text" className="input-text" placeholder="Número de cédula" />
      </div>
    </div>

    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-1">Dirección del último domicilio conyugal</label>
      <textarea className="input-text" rows="3" placeholder="Dirección completa"></textarea>
    </div>

    <div className="flex justify-end">
      <button className="btn-primary">Continuar</button>
    </div>
  </div>

  <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
    <div className="flex items-start">
      <InfoIcon className="text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
      <p className="text-sm text-blue-700">
        Para el divorcio voluntario en Ecuador, ambos cónyuges deben estar de acuerdo y haber estado casados al menos un año.
      </p>
    </div>
  </div>
</div>
```

### Perfil de Usuario
```jsx
<div className="min-h-screen bg-gray-50 p-6">
  <h1 className="text-2xl font-bold mb-6 text-gray-800">Mi Perfil</h1>

  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div className="lg:col-span-1">
      <div className="card p-6">
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 rounded-full bg-gray-200 border-4 border-white shadow mb-4 flex items-center justify-center">
            <UserIcon className="text-gray-400 w-16 h-16" />
          </div>
          <h2 className="text-xl font-semibold">María Rodríguez</h2>
          <p className="text-gray-600">maria@ejemplo.com</p>

          <div className="mt-6 w-full">
            <h3 className="font-medium mb-2">Idioma preferido</h3>
            <select className="input-text w-full">
              <option>Español</option>
              <option>Inglés</option>
              <option>Francés</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div className="lg:col-span-2">
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Información personal</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input type="text" className="input-text" value="María" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
            <input type="text" className="input-text" value="Rodríguez" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
            <input type="email" className="input-text" value="maria@ejemplo.com" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <input type="tel" className="input-text" placeholder="+593 99 123 4567" />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">País de residencia</label>
          <select className="input-text w-full">
            <option>Ecuador</option>
            <option>Colombia</option>
            <option>Perú</option>
            <option>México</option>
          </select>
        </div>

        <div className="flex justify-end">
          <button className="btn-primary">Guardar cambios</button>
        </div>
      </div>

      <div className="card p-6 mt-6">
        <h3 className="text-lg font-semibold mb-4">Seguridad</h3>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Contraseña</p>
              <p className="text-sm text-gray-600">Última actualización: hace 3 meses</p>
            </div>
            <button className="btn-secondary">Cambiar</button>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Autenticación de dos factores</p>
              <p className="text-sm text-gray-600">No activada</p>
            </div>
            <button className="btn-secondary">Activar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

## Componentes Específicos

### Barra de Progreso
```jsx
<div className="w-full bg-gray-200 rounded-full h-2.5">
  <div 
    className="bg-blue-600 h-2.5 rounded-full" 
    style={{ width: '65%' }}
  ></div>
</div>
```

### Tarjeta de Documento
```jsx
<div className="card hover:shadow-lg transition cursor-pointer">
  <div className="flex items-start">
    <DocumentIcon className="text-blue-500 w-8 h-8 mr-3 mt-1" />
    <div>
      <h4 className="font-medium text-gray-800">Contrato de arrendamiento</h4>
      <p className="text-sm text-gray-600 mt-1">Plantilla actualizada 2025</p>
      <div className="flex flex-wrap gap-1 mt-2">
        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">Ecuador</span>
        <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded text-xs">Civil</span>
      </div>
    </div>
  </div>
  <div className="flex justify-end mt-4">
    <button className="btn-secondary text-sm">Descargar</button>
  </div>
</div>
```

### Notificación
```jsx
<div className="animate-fadeIn fixed top-4 right-4 z-50">
  <div className="alert-success flex items-start">
    <CheckCircleIcon className="text-emerald-500 w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
    <div>
      <p className="font-medium">Documento generado</p>
      <p className="text-sm">Tu contrato está listo para descargar</p>
    </div>
    <button className="ml-4 text-gray-500 hover:text-gray-700">
      <XIcon className="w-4 h-4" />
    </button>
  </div>
</div>
```

## Tema Oscuro
```css
.dark .card {
  @apply bg-gray-800 border-gray-700;
}

.dark .input-text {
  @apply bg-gray-700 border-gray-600 text-white;
}

.dark .btn-primary {
  @apply bg-blue-700 hover:bg-blue-800;
}

.dark body {
  @apply bg-gray-900 text-gray-100;
}

.dark .alert-success {
  @apply bg-emerald-900 border-emerald-700 text-emerald-200;
}

/* Aplicar a todos los componentes necesarios */
```

## Implementación en Tailwind
En `tailwind.config.js`:
```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        secondary: '#10B981',
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-in-out',
        fadeOut: 'fadeOut 0.3s ease-in-out',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeOut: {
          '0%': { opacity: 1, transform: 'translateY(0)' },
          '100%': { opacity: 0, transform: 'translateY(10px)' },
        },
      }
    },
  },
  plugins: [],
}
```

Esta guía de estilos completa cubre todos los componentes y pantallas de LeFriAI, proporcionando una base consistente para implementar la interfaz de usuario con React y Tailwind CSS.