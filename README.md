# Credit Microservice

API REST para simulación de créditos con Node.js, Express, MySQL y Sequelize.

## Inicio Rápido

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
Crear archivo `.env`:
```env
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password
DB_NAME=credit_simulator
```

### 3. Iniciar MySQL
```bash
docker-compose up -d
```

### 4. Ejecutar
```bash
npm start
```

El servidor estará en: `http://localhost:3001`

Documentación Swagger: `http://localhost:3001/api-docs`

---

## API Endpoints

### 1. Health Check
```http
GET /api/v1/credit/health
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Servicio de crédito funcionando correctamente",
  "version": "1.0.0"
}
```

---

### 2. Simular Crédito
```http
POST /api/v1/credit/simulate
```

**Body:**
```json
{
  "monto": 50000,
  "plazo": 24,
  "tasa": 12.5,
  "clienteId": "2996845930101"
}
```

**Parámetros:**
- `monto` (number, requerido): Monto del crédito (> 0)
- `plazo` (number, requerido): Plazo en meses (1-120)
- `tasa` (number, requerido): Tasa nominal anual (0-100)
- `clienteId` (string, opcional): ID del cliente para guardar en BD

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "monto": 50000,
    "plazo": 24,
    "tasaNominalAnual": 12.5,
    "cuotaMensual": 2369.62,
    "totalPagar": 56870.88,
    "totalIntereses": 6870.88,
    "primeras3Cuotas": [
      {
        "mes": 1,
        "cuota": 2369.62,
        "capital": 1848.95,
        "interes": 520.67,
        "saldoInsoluto": 48151.05
      }
    ],
    "ultimas3Cuotas": [...],
    "totalCuotas": 24,
    "creditoId": 1
  }
}
```

---

### 3. Comparar Escenarios
```http
POST /api/v1/credit/compare
```

**Body:**
```json
{
  "monto": 50000,
  "escenarios": [
    { "plazo": 12, "tasa": 10 },
    { "plazo": 24, "tasa": 12 },
    { "plazo": 36, "tasa": 15 }
  ],
  "clienteId": "2996845930101"
}
```

**Parámetros:**
- `monto` (number, requerido): Monto del crédito
- `escenarios` (array, requerido): 1-3 escenarios con `plazo` y `tasa`
- `clienteId` (string, opcional): ID del cliente

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "monto": 50000,
    "escenarios": [
      {
        "escenario": { "plazo": 12, "tasa": 10 },
        "resultado": {
          "cuotaMensual": 4403.08,
          "totalPagar": 52836.96,
          "totalIntereses": 2836.96,
          "primeras3Cuotas": [...],
          "ultimas3Cuotas": [...]
        }
      }
    ],
    "recomendacion": {
      "indice": 1,
      "plazo": 12,
      "tasa": 10,
      "totalPagar": 52836.96,
      "cuotaMensual": 4403.08,
      "razon": "Menor costo total para el cliente",
      "ahorro": 8611.08
    }
  }
}
```

---

### 4. Historial de Créditos
```http
GET /api/v1/credit/history/:clienteId
```

**Ejemplo:**
```http
GET /api/v1/credit/history/CLI-001
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "clienteId": "2996845930101",
    "total": 2,
    "creditos": [
      {
        "id": 1,
        "monto": 50000,
        "plazo": 24,
        "tasaNominalAnual": 12.5,
        "cuotaMensual": 2369.62,
        "totalPagar": 56870.88,
        "totalIntereses": 6870.88,
        "estado": "simulado",
        "tablaAmortizacion": [...],
        "fechaCreacion": "2026-05-14T10:30:00.000Z"
      }
    ]
  }
}
```

---

## Tecnologías

- Node.js + Express
- MySQL + Sequelize ORM
- Yup (validaciones)
- Swagger/OpenAPI
- Helmet + CORS
