## BRM API

API REST construida con Node.js, Express y Sequelize para gestionar usuarios, productos y compras sobre PostgreSQL. Incluye autenticación con JWT, control de roles y registro de eventos en archivos de log.

### Tecnologías principales
- Node.js 18 + Express 4
- Sequelize 6 + PostgreSQL 15
- JWT para autenticación y control de acceso
- Docker y Docker Compose para orquestar API y base de datos

## Estructura del proyecto
```
src/
  config/        // conexión, sync y seed de la base de datos
  controllers/   // capa HTTP (express)
  services/      // lógica de negocio (auth, productos, compras)
  models/        // entidades Sequelize (User, Role, Product, Invoice, etc.)
  middlewares/   // autenticación y autorización
  routes/        // definición de endpoints
  utils/         // logger y utilidades JWT
server.js        // bootstrap de la aplicación Express
```

## Requisitos previos
- Node.js >= 18 (solo para ejecutar sin contenedores)
- Docker Desktop + Docker Compose v2
- Cuenta de PostgreSQL local (opcional si se usa Docker)

## Variables de entorno
Crea un archivo `.env` en la raíz con, al menos, las siguientes claves (los valores por defecto entre paréntesis):

```
PORT=3000
NODE_ENV=development
DB_HOST=localhost          # (postgres en Docker)
DB_PORT=5432
DB_NAME=brm_db
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=tu_clave_segura
JWT_EXPIRES_IN=1h
BCRYPT_SALT_ROUNDS=10
DEFAULT_CLIENT_ROLE_ID=2
```

## Ejecución local (sin Docker)
1. Instala dependencias: `npm install`.
2. Asegúrate de tener PostgreSQL corriendo con las credenciales definidas en `.env`.
3. Sincroniza el esquema y roles base:
   - `npm run db:sync` (normal)  
   - `npm run db:sync:force` (recrea tablas)  
   - `npm run seed` (solo roles predeterminados)
4. Inicia la API:
   - `npm run dev` para desarrollo con Nodemon.
   - `npm start` para ejecución estándar.
5. La API quedará disponible en `http://localhost:3000`.

## Ejecución con Docker
1. Asegúrate de que el archivo `.env` existe (Docker reusa el mismo).
2. Levanta los servicios (API + PostgreSQL + volumenes persistentes):
   ```
   docker-compose up --build
   ```
3. Espera a que el servicio `postgres` esté saludable y, si es la primera vez, sincroniza la base:
   ```
   docker-compose exec api npm run db:sync
   ```
4. La API se expone en `http://localhost:3000` y PostgreSQL en `localhost:5432`.
5. Para detener y limpiar contenedores/volúmenes:
   ```
   docker-compose down -v
   ```

Los logs de la aplicación se almacenan en `logs/app.log` y se montan como volumen para que persistan fuera del contenedor.

## Scripts disponibles
- `npm run dev` → arranca Express con Nodemon.
- `npm start` → arranca Express en modo producción.
- `npm run db:sync` → sincroniza modelos con la BD.
- `npm run db:sync:force` / `npm run db:sync:alter` → variantes de sincronización.
- `npm run seed` → crea roles base (Administrador, Cliente).
- `npm run docs` → genera documentación API con apidoc en `docs/`.

## Endpoints principales
Todos los endpoints (excepto `/api/auth/*` y `/`) necesitan encabezado `Authorization: Bearer <token>`.

| Método | Ruta                        | Descripción                               | Rol requerido |
| ------ | --------------------------- | ----------------------------------------- | ------------- |
| GET    | `/`                         | Health check                              | Público       |
| POST   | `/api/auth/register`        | Registrar usuario                         | Público       |
| POST   | `/api/auth/login`           | Iniciar sesión y obtener JWT              | Público       |
| POST   | `/api/products`             | Crear producto                            | Administrador |
| GET    | `/api/products`             | Listar productos activos                   | Cualquier rol |
| GET    | `/api/products/:id`         | Obtener detalle de producto               | Cualquier rol |
| PUT    | `/api/products/:id`         | Actualizar producto                       | Administrador |
| PATCH  | `/api/products/:id/activate`| Activar producto                          | Administrador |
| PATCH  | `/api/products/:id/deactivate`| Desactivar producto                      | Administrador |
| GET    | `/api/purchases`            | Listar compras del cliente autenticado    | Cliente |
| GET    | `/api/purchases/:id`        | Ver detalle completo de una compra        | Cliente |
| POST   | `/api/purchases`            | Registrar compra (actualiza stock y genera factura)| Cliente |

### Flujo de autenticación y compras
1. Registrar usuario (`/api/auth/register`). Por defecto se asigna el rol Cliente (`DEFAULT_CLIENT_ROLE_ID`).
2. Iniciar sesión (`/api/auth/login`) para recibir `token`.
3. Usar `token` en `Authorization` para acceder a endpoints protegidos.
4. Los administradores gestionan productos; los clientes pueden comprar productos activos y consultar su historial. Cada compra genera registros en `Invoice` e `InvoiceDetail`, descuenta stock y expone un detalle con productos, precios unitarios y totales.

## Documentación y pruebas
- Logs detallados en `logs/app.log` para cada solicitud procesada.
- Se puede regenerar documentación HTML/JS con `npm run docs` (requiere apidoc instalado, ya indicado en `devDependencies`).
- Recomendado usar herramientas como Thunder Client, Postman o REST Client para probar los endpoints.

## Troubleshooting rápido
- **Token inválido / 401**: verifica que el encabezado `Authorization` incluya `Bearer`.
- **Stock insuficiente**: `POST /api/purchases` valida que haya inventario disponible.
- **Roles faltantes**: ejecuta `npm run seed` o `npm run db:sync` tras limpiar la BD.

---
Para dudas adicionales o casos específicos, revisa los servicios en `src/services` y los controladores en `src/controllers`, donde se detalla toda la lógica de negocio.


