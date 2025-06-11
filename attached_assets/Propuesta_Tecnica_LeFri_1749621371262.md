# **Propuesta Técnica Detallada: Aplicación Web de Asistencia Legal**

## **1\. Introducción**

La presente propuesta técnica detalla el desarrollo de **LeFriAI ("Legal Friend AI")**, una aplicación web de asistencia legal, diseñada para proveer respuestas rápidas y precisas a consultas legales, facilitar la gestión de procesos y ofrecer un sistema de alerta de emergencia. La aplicación aprovechará las capacidades de inteligencia artificial para el procesamiento de lenguaje natural y la recuperación de información, garantizando una experiencia de usuario eficiente y segura.

---

## **2\. Arquitectura**

La arquitectura de la aplicación se basará en un diseño modular que permitirá la escalabilidad y el mantenimiento independiente de sus componentes principales.

### **Tecnologías Clave**

* **Backend**: Desarrollado con **Flask**, un microframework Python, conocido por su flexibilidad y ligereza, ideal para construir APIs RESTful y manejar la lógica de negocio y la integración con la inteligencia artificial.  
* **Base de Datos**: Se utilizará **MongoDB Atlas** con **Vector Search**, una base de datos NoSQL que ofrece alta disponibilidad y escalabilidad, fundamental para almacenar documentos legales y realizar búsquedas semánticas eficientes mediante embeddings vectoriales.  
* **Inteligencia Artificial**: **Gemini 2.5 Flash** será el motor de IA para el procesamiento de lenguaje natural, especialmente para la implementación de un sistema de Recuperación Aumentada por Generación (**RAG**), lo que permitirá generar respuestas contextualizadas y precisas a partir de la base de conocimientos legales. Se integrará mediante **Google ADK (Agent Development Kit)** y **LangGraph** para la orquestación de agentes inteligentes.  
* **Frontend**: Se construirá utilizando **React 18** (con **TypeScript**), **Vite** como bundler, **Tailwind CSS** para estilos y **Shadcn/ui** para componentes de UI modernos y accesibles, asegurando una experiencia de usuario fluida, responsiva y altamente interactiva.  
* **API de WhatsApp**: Una API independiente desarrollada en **Node.js** con **Express** y **Baileys**, diseñada para gestionar el envío y posiblemente la recepción de mensajes de WhatsApp de manera programática, desacoplando esta funcionalidad del backend principal.  
* **Servicios Externos**: **Google Maps API** para funcionalidades de geolocalización, **Google OAuth** para autenticación segura de usuarios, y la **Constitute API** para la integración de datos constitucionales de diversos países.

### **Diagrama de Flujo Arquitectónico Unificado**

![][image1]

Fragmento de código  
flowchart TD  
    A\[User Interface\<br\>(React 18, Tailwind, Shadcn/ui)\] \--\> B\[Google OAuth Login\]  
    B \--\> C{Dashboard}  
    C \--\> D\[Modo Consulta\]  
    C \--\> E\[Modo Proceso\]  
    C \--\> F\[Modo Emergencia\]  
    C \--\> G\[Perfil Usuario\]

    subgraph Frontend (React 18\)  
        A \--\> H\[Voice/Speech Input\]  
        A \--\> I\[Text Input\]  
        A \--\> J\[Google Maps JS API Integration\]  
        A \--\> K\[Multi-language Support (Flask-Babel/i18next)\]  
    end

    subgraph Backend (Flask \+ Google ADK)  
        D \--\> L\[LangGraph Agent\<br\>(RAGAgent)\]  
        E \--\> M\[LangGraph Agent\<br\>(ProcessAgent)\]  
        F \--\> N\[LangGraph Agent\<br\>(EmergencyAgent)\]  
        G \--\> O\[Profile Service\]

        L \--\> P\[Gemini AI Processor\]  
        M \--\> P  
        N \--\> P

        %% Integración con Tools  
        L \--\> Q\[\[MongoTool\]\]  
        L \--\> R\[\[ConstituteTool\]\]  
        N \--\> S\[\[WhatsAppTool\]\]  
        N \--\> T\[\[MapsTool\]\]  
        M \--\> U\[\[FormTool\]\]  
        M \--\> V\[\[ValidatorTool\]\]

        %% Servicios comunes  
        N \--\> W\[External WhatsApp API\]  
        N \--\> X\[SMTP Service\]  
        B \--\> Y\[Google Identity API\]  
    end

    subgraph Data Layer  
        Q \--\> Z\[MongoDB Atlas Vector Store\]  
        Z \--\> AA\[Legal Documents Collection\]  
        AA \--\> AB\[Country-Specific Laws\]  
        AA \--\> AC\[Constitute Cache\]  
        O \--\> AD\[User Profiles Collection\]  
        O \--\> AE\[Emergency Contacts Collection\]  
    end

    subgraph External WhatsApp API (Node.js/Express/Baileys)  
        W \--\> AF\[WhatsApp Web Interface\]  
        AF \--\> AG\[WhatsApp Messages\]  
    end

    subgraph Deployment & Operations  
        AH\[GitLab CI/CD\]  
        AH \--\> AI\[Google Cloud Run (Backend)\]  
        AH \--\> AJ\[Google Cloud Storage (Frontend Static Assets)\]  
        AH \--\> AK\[Docker Container Registry\]  
        AH \--\> AL\[Cloud VM (External WhatsApp API)\]  
        AH \--\> AM\[Constitute Sync Job\]  
        AM \--\> Z  
        AM \--\> AN\[Constitute API\]  
    end

    Frontend \-- REST/WebSocket \--\> Backend  
    Backend \-- REST \--\> External WhatsApp API  
    Backend \-- API Calls \--\> Y  
    Backend \-- API Calls \--\> AN  
    Backend \-- API Calls \--\> J  
    External WhatsApp API \-- Persistent Session \--\> AG

### **Secuencia de Modo Emergencia**

![][image2]

Fragmento de código  
sequenceDiagram  
    participant User  
    participant Frontend  
    participant GoogleMapsAPI  
    participant Backend  
    participant EmergencyAgent  
    participant GeminiService  
    participant ExternalWhatsAppAPI  
      
    User-\>\>Frontend: Click "Activar Emergencia"  
    Frontend-\>\>GoogleMapsAPI: Request current location  
    GoogleMapsAPI--\>\>Frontend: User's Coordinates (lat, lng)  
    Frontend-\>\>Backend: POST /api/emergency {user\_id, location}  
    Backend-\>\>EmergencyAgent: Process emergency request  
    EmergencyAgent-\>\>Backend: Fetch user's emergency contacts from DB  
    Backend--\>\>EmergencyAgent: List of contacts  
    EmergencyAgent-\>\>GeminiService: Generate alert message (multilingual)  
    GeminiService--\>\>EmergencyAgent: Localized alert text  
    EmergencyAgent-\>\>ExternalWhatsAppAPI: POST /send-message {phone, message, map\_link}  
    ExternalWhatsAppAPI--\>\>EmergencyAgent: Status of message send (success/fail)  
    EmergencyAgent--\>\>Backend: Confirmation of notification  
    Backend--\>\>Frontend: Response {status, contacts\_notified}  
    Frontend--\>\>User: Display emergency status and contacts notified

### **Secuencia de Modo Consulta (Constitute \+ RAG)**

### **![][image3]**

Fragmento de código  
sequenceDiagram  
    participant User  
    participant Frontend  
    participant Backend  
    participant RAGAgent  
    participant MongoTool  
    participant ConstituteTool  
    participant GeminiService  
      
    User-\>\>Frontend: Enter legal query (text/voice)  
    Frontend-\>\>Backend: POST /api/ask {query, country, user\_id}  
    Backend-\>\>RAGAgent: Process legal query  
    RAGAgent-\>\>MongoTool: Search legal\_docs (Vector Search by query, filter by country)  
    MongoTool--\>\>RAGAgent: Relevant legal documents (content, embedding, source)  
      
    alt If initial search is insufficient  
        RAGAgent-\>\>ConstituteTool: Query Constitute API for broader context  
        ConstituteTool--\>\>RAGAgent: Constitutional data  
    end  
      
    RAGAgent-\>\>GeminiService: Generate answer based on retrieved documents and query  
    GeminiService--\>\>RAGAgent: Structured answer with citations  
    RAGAgent--\>\>Backend: Answer {answer, citations}  
    Backend--\>\>Frontend: Display result to user  
    Frontend--\>\>User: Present legal answer with linked citations

### **Secuencia de Sincronización Constitute**

![][image4]

Fragmento de código  
sequenceDiagram  
    participant Scheduler  
    participant SyncJob  
    participant ConstituteAPI  
    participant MongoDBAtlas  
      
    Scheduler-\>\>SyncJob: Trigger daily synchronization  
    SyncJob-\>\>ConstituteAPI: Request list of constitutions  
    ConstituteAPI--\>\>SyncJob: Metadata of constitutions  
      
    loop For each constitution  
        SyncJob-\>\>ConstituteAPI: Request full HTML/text content  
        ConstituteAPI--\>\>SyncJob: Constitution content  
        SyncJob-\>\>MongoDBAtlas: Insert/Update document in legal\_docs collection (content, embedding)  
    end  
      
    SyncJob-\>\>MongoDBAtlas: Update vector indexes for legal\_docs  
    MongoDBAtlas--\>\>SyncJob: Confirmation of index update  
    SyncJob--\>\>Scheduler: Sync job completed

---

## **3\. Esquema de Base de Datos**

La base de datos en MongoDB Atlas se estructurará en las siguientes colecciones:

* **`users`**:

  * `_id`: `ObjectId` (Identificador único del usuario)  
  * `name`: `str` (Nombre completo del usuario)  
  * `email`: `str` (Correo electrónico del usuario, **único**, usado para Google OAuth)  
  * `password_hash`: `str` (Hash de la contraseña del usuario, para registros manuales)  
  * `google_id`: `str` (ID de usuario de Google OAuth, único)  
  * `language`: `enum('es','en','fr')` (Idioma preferido del usuario para la interfaz y respuestas)  
  * `emergency_contacts`: `[ObjectId]` (Array de referencias a documentos en la colección `emergency_contacts`)  
  * `created_at`: `datetime`  
  * `updated_at`: `datetime`  
* **`legal_docs`**:

  * `_id`: `ObjectId` (Identificador único del documento legal)  
  * `country`: `str` (Código ISO del país al que pertenece el documento legal, ej., "EC", "CO", "US", "MX")  
  * `title`: `str` (Título del documento legal, ej., "Constitución de la República del Ecuador")  
  * `content`: `text` (Contenido textual completo del documento legal, preprocesado para RAG)  
  * `embedding`: `vector(768)` (Vector de 768 dimensiones que representa el embedding del `content`, generado por `text-embedding-004` y utilizado para Vector Search)  
  * `source_url`: `str` (URL original del documento, si aplica)  
  * `last_synced`: `datetime` (Fecha de la última sincronización si proviene de una API externa como Constitute)  
  * `type`: `enum('constitution', 'law', 'regulation', 'treaty', 'other')` (Tipo de documento legal)  
* **`emergency_contacts`**:

  * `_id`: `ObjectId` (Identificador único del contacto de emergencia)  
  * `user_id`: `ObjectId` (Referencia al usuario al que pertenece este contacto)  
  * `name`: `str` (Nombre del contacto de emergencia, ej., "María Pérez")  
  * `phone`: `str` (Número de teléfono del contacto, incluyendo código de país, ej., "+593991234567")  
  * `whatsapp_enabled`: `bool` (Indica si el contacto tiene WhatsApp habilitado para recibir alertas)  
  * `relationship`: `str` (Relación con el usuario, ej., "Madre", "Abogado")  
* **`legal_processes`**: (Nueva colección para el seguimiento de procesos)

  * `_id`: `ObjectId` (Identificador único del proceso legal iniciado por el usuario)  
  * `user_id`: `ObjectId` (Referencia al usuario que inició el proceso)  
  * `process_type`: `str` (Tipo de proceso legal, ej., "Divorcio", "Redacción de Contrato", "Demanda Laboral")  
  * `current_step`: `int` (Paso actual en el flujo del proceso)  
  * `status`: `enum('in_progress', 'completed', 'canceled', 'pending_review')`  
  * `data`: `JSON` (Almacena los datos recopilados en cada paso del formulario guiado)  
  * `start_date`: `datetime`  
  * `last_updated`: `datetime`  
  * `final_document_url`: `str` (URL o referencia al documento generado si el proceso culmina en uno)

---

## **4\. Endpoints API**

El backend de Flask expondrá los siguientes endpoints API para la interacción con el frontend y servicios externos. Todos los endpoints que requieren autenticación estarán protegidos por JWT.

### **4.1. Autenticación**

* `POST /api/auth/register`  
  * **Descripción**: Registra un nuevo usuario con email y contraseña.  
  * **Recibe**: `{"email": "str", "password": "str", "name": "str"}`  
  * **Retorna**: `{"message": "User registered successfully", "access_token": "jwt_token"}`  
* `POST /api/auth/login`  
  * **Descripción**: Autentica a un usuario y retorna un JWT.  
  * **Recibe**: `{"email": "str", "password": "str"}`  
  * **Retorna**: `{"access_token": "jwt_token", "user_id": "ObjectId"}`  
* `GET /api/auth/google`  
  * **Descripción**: Inicia el flujo de autenticación con Google OAuth.  
  * **Proceso**: Redirecciona al usuario a la página de autenticación de Google. El callback (`/api/auth/google/callback`) manejará la respuesta de Google y generará un JWT.  
  * **Retorna**: Redirección o JSON con token.  
* `POST /api/auth/refresh`  
  * **Descripción**: Renueva un token JWT expirado.  
  * **Recibe**: `{"refresh_token": "str"}` (si se implementa)  
  * **Retorna**: `{"access_token": "new_jwt_token"}`  
* `POST /api/auth/logout`  
  * **Descripción**: Invalida el token JWT actual del usuario.  
  * **Retorna**: `{"message": "Logged out successfully"}`

### **4.2. Consultas Legales**

* `POST /api/ask` (Protegido por JWT)  
  * **Descripción**: Permite a los usuarios realizar consultas legales y recibir respuestas basadas en el contexto de documentos legales relevantes.

**Recibe**:  
 JSON  
{  
    "query": "str",       // Consulta del usuario  
    "country": "str",     // País de referencia para la consulta (ej., "EC", "CO")  
    "language": "str"     // Idioma de la respuesta deseada (ej., "es", "en")  
}

*   
  * **Proceso**:  
    1. El `RAGAgent` genera un embedding del `query` del usuario utilizando `text-embedding-004`.  
    2. Se realiza una **búsqueda vectorial (Vector Search)** en la colección `legal_docs` de MongoDB Atlas, utilizando el embedding del `query` y filtrando por `country`.  
    3. El `RAGAgent` puede complementar los resultados con datos de la `Constitute API` si es necesario.  
    4. El contenido de los documentos recuperados se envía a **Gemini 2.5 Flash** (mediante `GeminiService`) para generar una respuesta coherente y contextualizada, citando las fuentes.

**Retorna**:  
 JSON  
{  
    "answer": "str",                    // Respuesta generada por la IA  
    "citations": \["doc\_id1", "doc\_id2"\] // IDs de los documentos citados  
}

* 

### **4.3. Emergencias**

* `POST /api/emergency` (Protegido por JWT)  
  * **Descripción**: Envía una alerta de emergencia a los contactos seleccionados del usuario con su ubicación actual.

**Recibe**:  
 JSON  
{  
    "location": {  
        "lat": "float",         // Latitud de la ubicación  
        "lng": "float"          // Longitud de la ubicación  
    },  
    "contact\_ids": \["ObjectId"\] // IDs de los contactos de emergencia a notificar  
}

*   
  * **Proceso**:  
    1. El `EmergencyAgent` recupera los detalles de los contactos de emergencia (`emergency_contacts`) especificados por `contact_ids`.  
    2. Genera un mensaje de alerta personalizado (utilizando `GeminiService` y `MapsTool` para el enlace de mapa).  
    3. Invoca la **API de WhatsApp independiente** (POST `/send-message`) para enviar el mensaje a cada contacto con WhatsApp habilitado.  
    4. Registra el evento de emergencia.

**Retorna**:  
 JSON  
{  
    "status": "success/fail",      // Estado de la operación  
    "contacts\_notified": "int",    // Número de contactos notificados  
    "message": "str"               // Mensaje de confirmación o error  
}

*   
* `GET /api/emergency/contacts` (Protegido por JWT)  
  * **Descripción**: Obtiene la lista de contactos de emergencia del usuario.  
  * **Retorna**: `[{"_id": "ObjectId", "name": "str", "phone": "str", "whatsapp_enabled": bool}]`  
* `POST /api/emergency/contacts` (Protegido por JWT)  
  * **Descripción**: Agrega un nuevo contacto de emergencia.  
  * **Recibe**: `{"name": "str", "phone": "str", "whatsapp_enabled": bool}`  
  * **Retorna**: `{"_id": "ObjectId", "name": "str", "phone": "str"}`  
* `PUT /api/emergency/contacts/<contact_id>` (Protegido por JWT)  
  * **Descripción**: Actualiza un contacto de emergencia existente.  
* `DELETE /api/emergency/contacts/<contact_id>` (Protegido por JWT)  
  * **Descripción**: Elimina un contacto de emergencia.

### **4.4. Procesos Legales**

* `POST /api/process` (Protegido por JWT)  
  * **Descripción**: Inicia o avanza en un flujo de proceso legal predefinido o personalizado.

**Recibe**:  
 JSON  
{  
    "process\_type": "str",      // Tipo de proceso legal (ej. "Divorcio", "Contrato")  
    "current\_step\_data": {}     // JSON con datos del paso actual proporcionados por el usuario  
    "process\_id": "ObjectId"    // Opcional, para continuar un proceso existente  
}

*   
  * **Proceso**:  
    1. El `ProcessAgent` identifica el flujo de trabajo asociado al `process_type` y el `current_step`.  
    2. Utiliza `FormGeneratorTool` para proporcionar la estructura del formulario del paso actual y `InputValidatorTool` para validar los datos recibidos.  
    3. Puede interactuar con `GeminiService` para generar texto o personalizar formularios.  
    4. Actualiza el estado (`status`, `current_step`, `data`) del proceso en la colección `legal_processes`.

**Retorna**:  
 JSON  
{  
    "process\_id": "ObjectId",           // ID del proceso legal  
    "status": "in\_progress/completed",  // Estado de la operación  
    "next\_step": "str",                 // Descripción del siguiente paso (si aplica)  
    "current\_form\_schema": {},          // Esquema del formulario para el siguiente paso  
    "current\_data": {}                  // JSON con el estado actual de los datos del proceso  
}

*   
* `GET /api/process/<process_id>` (Protegido por JWT)  
  * **Descripción**: Obtiene el estado y los datos de un proceso legal específico.  
* `GET /api/process/my` (Protegido por JWT)  
  * **Descripción**: Obtiene la lista de todos los procesos legales del usuario.

### **4.5. WebSockets**

* `ws://{host}/ws/chat` (Para comunicación en tiempo real con asesores, si se implementa un chat humano)  
* `ws://{host}/ws/notifications` (Para notificaciones push en tiempo real a los usuarios)

---

## **5\. Seguridad**

La seguridad es un pilar fundamental en el diseño de la aplicación, implementando las siguientes medidas:

* **Autenticación**:  
  * **JWT (JSON Web Tokens)**: Utilizados para la autenticación de usuarios post-login. Los tokens serán de corta duración, se validarán en cada solicitud y se gestionarán de forma segura (se recomienda almacenar en `HttpOnly cookies` en el cliente para el token de acceso, y un `refresh token` separado).  
  * **Google OAuth 2.0**: Permite a los usuarios registrarse e iniciar sesión de forma rápida y segura utilizando sus cuentas de Google. Se manejarán los scopes y el intercambio de códigos de autorización.  
* **Cifrado de Contraseñas**: Todas las contraseñas de los usuarios (para registros directos) serán cifradas utilizando **bcrypt** antes de ser almacenadas en la base de datos. bcrypt es un algoritmo de hashing de contraseñas robusto y resistente a ataques de fuerza bruta.  
* **Protección contra Inyecciones**: Se implementarán medidas robustas para prevenir ataques de inyección (NoSQL Injection, Inyección de comandos, etc.) mediante la **validación estricta y el saneamiento** de todas las entradas del usuario a nivel de backend y frontend (con `Zod` y validadores en Flask).  
* **Control de Acceso**: Se aplicarán controles de acceso basados en roles o permisos si la aplicación crece para incluir diferentes tipos de usuarios (ej., administradores, asesores legales). Por defecto, los usuarios solo podrán acceder y modificar sus propios recursos.  
* **HTTPS**: Todas las comunicaciones entre el frontend (React) y el backend (Flask), y entre el backend y la API de WhatsApp, se realizarán a través de HTTPS para garantizar el cifrado de datos en tránsito y la integridad de la comunicación.  
* **CORS (Cross-Origin Resource Sharing)**: Se configurará CORS en el backend de Flask para permitir únicamente las solicitudes desde los orígenes de confianza del frontend de React, siguiendo el principio de mínimo privilegio.  
* **OWASP Top 10 Compliance**: Se seguirán las directrices y mejores prácticas de seguridad recomendadas por OWASP para prevenir vulnerabilidades comunes (ej., XSS, CSRF, gestión de sesiones seguras, configuración de seguridad de dependencias).  
* **Manejo de Errores Seguros**: Las respuestas de error del servidor no revelarán información sensible sobre la implementación interna.  
* **Auditoría y Logging**: Se implementará un sistema de logging detallado (con `logger` en JSON) para registrar eventos de seguridad y operación, facilitando la detección de anomalías y la auditoría.

---

## **6\. Plan de Implementación (Cronograma Orientativo para Hackathon)**

El plan de implementación se dividirá en fases iterativas, permitiendo un desarrollo ágil y la entrega gradual de funcionalidades, optimizado para un hackathon.

### **Fase 1: Configuración y Core Backend (2 días)**

* **Configuración de Entorno**:  
  * Configuración del entorno de desarrollo Python con Flask.  
  * Creación y configuración de una instancia de MongoDB Atlas con Vector Search.  
  * Integración inicial con la API de Gemini 2.5 Flash y configuración básica de Google ADK.  
  * Inicialización del proyecto Frontend con React 18, TypeScript, Vite, Tailwind CSS y Shadcn/ui.  
  * Configuración inicial de la API de WhatsApp (Node.js/Express/Baileys).  
* **Desarrollo del Backend Core (Flask)**:  
  * Implementación de la colección `users` y gestión de usuarios (registro con bcrypt, login JWT).  
  * Configuración de Flask-Babel para el soporte multidioma.  
  * Desarrollo inicial del endpoint `/api/ask` con búsqueda RAG básica (integración `text-embedding-004` y `MongoTool`).  
  * Implementación de `RootAgent` y `RAGAgent`.  
* **Desarrollo del Frontend Core (React)**:  
  * Implementación del login/registro de usuarios (con Google OAuth y JWT).  
  * Creación del `Dashboard.tsx` con navegación básica a los diferentes modos.

### **Fase 2: Funcionalidad Principal RAG y Frontend (5 días)**

* **Colección `legal_docs`**:  
  * Desarrollo de scripts (`scripts/ingest_docs.py`) para la ingesta y preprocesamiento de documentos legales públicos (ej., Leyes de Ecuador, usando `ConstituteTool` para sincronización inicial).  
  * Generación y almacenamiento de embeddings para la colección `legal_docs` utilizando `text-embedding-004`.  
  * Optimización del endpoint `/api/ask` para utilizar **Vector Search** en MongoDB Atlas, incluyendo filtrado por país y citaciones (integración `ConstituteTool` en `RAGAgent`).  
* **Frontend de Consultas Legales (`LegalConsultation.tsx`)**:  
  * Diseño e implementación de la interfaz de usuario para consultas legales (chat modal con `ChatWidget.tsx`).  
  * Integración del frontend con el endpoint `/api/ask` (usando `React Query`).  
  * Implementación de la funcionalidad de cambio de idioma en tiempo real (RF-001, RF-002).  
* **API de WhatsApp (Node.js)**:  
  * Desarrollo completo de la API de WhatsApp (endpoints `/qr`, `/send-message`, `/status`).  
  * Implementación de las plantillas de mensajes preaprobadas con variables para uso del backend (RF-007, RF-008).

### **Fase 3: Alertas de Emergencia y Procesos Legales (5 días)**

* **Endpoint `/api/emergency` (Flask)**:  
  * Implementación de la colección `emergency_contacts` y sus CRUD (`/api/emergency/contacts`).  
  * Desarrollo del endpoint `/api/emergency` en Flask, orquestado por `EmergencyAgent`.  
  * Integración del backend Flask con la API de WhatsApp externa (consumiendo `POST /send-message` a través de `WhatsAppTool`).  
* **Frontend de Emergencias (`Emergency.tsx`)**:  
  * Diseño e implementación de la interfaz de usuario para la gestión de emergencias (`Emergency.tsx`).  
  * Integración de Google Maps JavaScript API para el mapa interactivo y la captura automática de coordenadas (RF-009, RF-010).  
  * Funcionalidad para seleccionar y gestionar contactos de emergencia (RF-011).  
* **Endpoint `/api/process` (Flask)**:  
  * Diseño y modelado de flujos legales de ejemplo (`legal_processes` collection).  
  * Desarrollo del endpoint `/api/process` en Flask, orquestado por `ProcessAgent` (integrando `FormGeneratorTool` y `InputValidatorTool`).  
* **Frontend de Procesos Legales (`LegalProcess.tsx`)**:  
  * Interfaz de usuario con formularios guiados paso a paso (RF-013).

### **Fase 4: Seguridad, Despliegue y Pruebas (1 día)**

* **Seguridad Avanzada**:  
  * Revisión y cumplimiento de los requisitos de seguridad **OWASP Top 10** (RNF-003).  
  * Asegurar el uso de HTTPS en todas las comunicaciones (RNF-009).  
  * Implementar validación y saneamiento de entradas en todos los endpoints (RNF-011).  
  * Configuración de CORS para producción.  
* **Pruebas exhaustivas**:  
  * Pruebas unitarias y de integración para backend y frontend.  
  * Pruebas de rendimiento para el endpoint `/api/ask` (RNF-001) y la carga concurrente (RNF-002).  
  * Pruebas de accesibilidad (WCAG 2.1 Nivel AA \- RNF-005).  
* **Despliegue con CI/CD (GitLab)**:  
  * Preparación de los entornos de producción: Backend Flask en Google Cloud Run, Frontend React como assets estáticos, API de WhatsApp en un Docker Container en una VM (ej. GCE).  
  * Configuración de GitLab CI/CD (`.gitlab-ci.yml`) para automatizar el build, test y deploy de todos los componentes.  
  * Configuración de monitoreo y logging para todos los componentes.  
  * Creación de un video demo para el hackathon, mostrando los casos de uso clave (violencia doméstica, deportación, atención médica).

---

## **7\. Requisitos Funcionales**

Los requisitos funcionales describen lo que el sistema debe hacer, especificando las operaciones y servicios que proveerá a los usuarios.

| ID Requisito | Descripción del Requisito | Prioridad | Módulo Afectado |
| ----- | ----- | ----- | ----- |
| RF-001 | El sistema debe permitir el **cambio de idioma en tiempo real** entre español, inglés y francés. | Alta | Frontend, Backend |
| RF-002 | El sistema debe **localizar fechas y formatos numéricos** según el idioma seleccionado por el usuario. | Media | Frontend, Backend |
| RF-003 | El sistema debe generar **embeddings para documentos legales** utilizando el modelo `text-embedding-004`. | Alta | Backend, BD |
| RF-004 | El sistema debe realizar **búsquedas por similitud semántica** en la colección `legal_docs` utilizando MongoDB Atlas Vector Search. | Alta | Backend, BD |
| RF-005 | El sistema debe permitir **filtrar las búsquedas de documentos legales por país** (ej., EC, CO, US, MX). | Alta | Backend, BD |
| RF-006 | El sistema debe **integrarse con la API de WhatsApp (Node.js/Baileys)** para el envío de alertas. | Alta | Backend, WhatsApp API |
| RF-007 | El sistema debe utilizar **plantillas de mensajes preaprobadas** para las alertas de WhatsApp. | Alta | Backend, WhatsApp API |
| RF-008 | Las plantillas de mensajes deben soportar **variables como \[nombre\], \[ubicación\] y \[enlace\_mapa\]**. | Alta | Backend, WhatsApp API |
| RF-009 | El sistema debe mostrar un **mapa interactivo** en el frontend utilizando Google Maps JavaScript API. | Media | Frontend |
| RF-010 | El sistema debe **capturar automáticamente las coordenadas de geolocalización** del usuario en caso de emergencia. | Alta | Frontend, Backend |
| RF-011 | El sistema debe permitir a los usuarios **gestionar sus contactos de emergencia**, añadiendo, editando y eliminando contactos. | Media | Frontend, Backend, BD |
| RF-012 | El sistema debe permitir a los usuarios **iniciar sesión mediante Google OAuth**. | Alta | Frontend, Backend |
| RF-013 | El sistema debe permitir a los usuarios **gestionar sus procesos legales paso a paso**. | Media | Frontend, Backend, BD |
| RF-014 | El sistema debe **autenticar usuarios mediante JWT** después del inicio de sesión. | Alta | Backend |

---

## **8\. Requisitos No Funcionales**

Los requisitos no funcionales describen cómo el sistema debe funcionar, abarcando aspectos de calidad como rendimiento, seguridad, escalabilidad y usabilidad.

| ID Requisito | Descripción del Requisito | Prioridad | Módulo Afectado |
| ----- | ----- | ----- | ----- |
| RNF-001 | El sistema debe responder a las **consultas de Gemini en menos de 3 segundos** en el 95% de los casos. | Alta | Backend, IA |
| RNF-002 | El sistema debe estar diseñado para soportar un mínimo de **1000 usuarios concurrentes** sin degradación significativa del rendimiento. | Alta | General |
| RNF-003 | El sistema debe cumplir con las **recomendaciones de seguridad OWASP Top 10**. | Alta | General |
| RNF-004 | Las contraseñas de los usuarios deben ser **cifradas con bcrypt** antes de su almacenamiento. | Alta | Backend, BD |
| RNF-005 | El sistema debe cumplir con el **nivel AA de las Pautas de Accesibilidad al Contenido Web (WCAG) 2.1**. | Media | Frontend |
| RNF-006 | El sistema debe garantizar la **confidencialidad de los datos del usuario** según las normativas de protección de datos aplicables. | Alta | General |
| RNF-007 | El sistema debe ser **fácil de usar e intuitivo** para usuarios sin experiencia técnica avanzada. | Media | Frontend |
| RNF-008 | El sistema debe ser **compatible con los navegadores web modernos** (Chrome, Firefox, Edge, Safari) en sus últimas dos versiones estables. | Media | Frontend |
| RNF-009 | La comunicación entre el frontend y el backend debe usar **HTTPS**. | Alta | Frontend, Backend |
| RNF-010 | La API de WhatsApp debe ser **escalable horizontalmente** (mediante Docker/PM2). | Media | WhatsApp API |
| RNF-011 | El sistema debe **validar y sanear todas las entradas** del usuario para prevenir ataques de inyección. | Alta | Backend |
| RNF-012 | El frontend debe manejar la **localización de mensajes y UI** a través de archivos de idioma. | Media | Frontend |
