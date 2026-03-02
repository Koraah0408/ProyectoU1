# Informe Técnico: Aplicación de Gestión de Tareas (Cloud To-Do List)

**Proyecto:** Desarrollo Web Full-Stack  

---

## 1. Resumen del Proyecto
El proyecto consiste en el desarrollo de una **Single Page Application (SPA)** funcional que permite a los usuarios gestionar tareas pendientes en tiempo real. La aplicación integra un frontend moderno con servicios de backend en la nube (Serverless), garantizando persistencia de datos y seguridad.

## 2. Arquitectura de la Solución
La aplicación utiliza una arquitectura de tres capas:
* **Frontend:** Desarrollado con **React.js** y **Vite**, enfocado en una experiencia de usuario fluida y una interfaz responsiva mediante **Tailwind CSS**.
* **Backend como Servicio (BaaS):** Se utilizó **Supabase** para la gestión de autenticación, base de datos PostgreSQL y almacenamiento.
* **Despliegue (Hosting):** La aplicación está alojada en **Vercel**, configurada con despliegue continuo desde el repositorio de GitHub.



## 3. Funcionalidades Implementadas
De acuerdo con los requerimientos del proyecto, se habilitaron las siguientes capacidades:
1. **Autenticación:** Registro e inicio de sesión seguro. Se desactivó la confirmación de email para facilitar la evaluación docente.
2. **Operaciones CRUD:** - **Create:** Adición de nuevas tareas con título y descripción.
   - **Read:** Listado dinámico de tareas según el usuario.
   - **Update:** Edición de contenido y cambio de estado (completado/pendiente).
   - **Delete:** Eliminación definitiva de registros.
3. **Sincronización Realtime:** Implementación de suscripciones de Supabase para actualizar la UI sin recargar la página.

## 4. Diseño Responsivo
La interfaz ha sido diseñada bajo la metodología *Mobile-First*, asegurando la usabilidad en dos puntos de interrupción principales:
* **Móvil (≤768px):** Diseño vertical con elementos táctiles optimizados.
* **Escritorio (≥1024px):** Layout expandido con uso eficiente del espacio horizontal.



## 5. Seguridad y Variables de Entorno
Se implementaron medidas de seguridad críticas:
* **Manejo de Credenciales:** Las llaves de API se gestionan mediante archivos `.env.local`, los cuales fueron excluidos del repositorio de GitHub mediante `.gitignore` para prevenir fugas de seguridad.
* **Políticas RLS:** Se configuró **Row Level Security** en la base de datos para que cada usuario solo pueda acceder a sus propios registros.

## 6. Conclusión
El desarrollo de esta aplicación permitió consolidar conocimientos sobre la integración de React con bases de datos en la nube y el despliegue de aplicaciones profesionales. La solución es escalable y cumple con los estándares técnicos solicitados para la Unidad 1.

---
