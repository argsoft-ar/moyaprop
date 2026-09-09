interface TestResult {
  name: string;
  status: 'PASSED' | 'FAILED';
  statusCode: number;
  expectedStatus: number | number[];
  details?: string;
  durationMs: number;
}

const results: TestResult[] = [];

async function request(
  method: string,
  path: string,
  options: {
    body?: any;
    token?: string;
    headers?: Record<string, string>;
  } = {}
): Promise<{ status: number; body: any; headers: any }> {
  const url = `http://localhost:4000${path}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (options.token) {
    headers['Authorization'] = `Bearer ${options.token}`;
  }

  const res = await fetch(url, {
    method,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  let responseBody: any = null;
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    responseBody = await res.json();
  } else {
    responseBody = await res.text();
  }

  return {
    status: res.status,
    body: responseBody,
    headers: Object.fromEntries(res.headers.entries())
  };
}

async function runTest(
  name: string,
  expectedStatus: number | number[],
  fn: () => Promise<{ status: number; body: any; headers?: any }>,
  customValidator?: (body: any) => boolean | string
) {
  const start = Date.now();
  try {
    const res = await fn();
    const durationMs = Date.now() - start;
    const isStatusOk = Array.isArray(expectedStatus)
      ? expectedStatus.includes(res.status)
      : res.status === expectedStatus;

    let errorDetail = '';
    if (!isStatusOk) {
      errorDetail = `Estado esperado ${expectedStatus}, recibido ${res.status}. Body: ${JSON.stringify(res.body)}`;
    } else if (customValidator) {
      const validation = customValidator(res.body);
      if (validation !== true) {
        errorDetail = typeof validation === 'string' ? validation : 'Validación personalizada fallida';
      }
    }

    if (!errorDetail) {
      results.push({ name, status: 'PASSED', statusCode: res.status, expectedStatus, durationMs });
      console.log(`  ✅ PASSED: ${name} (${res.status}) [${durationMs}ms]`);
    } else {
      results.push({
        name,
        status: 'FAILED',
        statusCode: res.status,
        expectedStatus,
        details: errorDetail,
        durationMs
      });
      console.error(`  ❌ FAILED: ${name} - ${errorDetail}`);
    }
  } catch (err: any) {
    const durationMs = Date.now() - start;
    results.push({
      name,
      status: 'FAILED',
      statusCode: 500,
      expectedStatus,
      details: err.message || String(err),
      durationMs
    });
    console.error(`  ❌ ERROR: ${name} - ${err.message}`);
  }
}

async function runSuite() {
  console.log('\n======================================================');
  console.log('🧪 INICIANDO SUITE DE TESTING AUTOMATIZADO - MOYAPROP');
  console.log('======================================================\n');

  let authToken = '';
  let createdPropertyId = '';

  // 1. Salud y Endpoint Raíz
  console.log('--- 1. SALUD Y ENDPOINTS GENERALES ---');
  await runTest('GET / (Bienvenida)', 200, () => request('GET', '/'), (body) => body.name === 'MoyaProp API REST');
  await runTest('GET /api/health (Health check)', 200, () => request('GET', '/api/health'), (body) => body.status === 'ok');

  // 2. Autenticación
  console.log('\n--- 2. AUTENTICACIÓN Y CONTROL DE ACCESO ---');
  await runTest(
    'POST /api/auth/login (Payload vacío -> 400)',
    400,
    () => request('POST', '/api/auth/login', { body: {} })
  );

  await runTest(
    'POST /api/auth/login (Credenciales inválidas -> 401)',
    401,
    () => request('POST', '/api/auth/login', { body: { email: 'admin@moyaprop.com', password: 'PasswordIncorrecta123!' } })
  );

  await runTest(
    'POST /api/auth/login (Credenciales correctas -> 200)',
    200,
    async () => {
      const res = await request('POST', '/api/auth/login', {
        body: { email: 'admin@moyaprop.com', password: 'MoyaProp2025!' }
      });
      if (res.body?.data?.token) {
        authToken = res.body.data.token;
      }
      return res;
    },
    (body) => !!body?.data?.token && !!body?.data?.user?.id
  );

  await runTest(
    'GET /api/auth/me (Sin token -> 401)',
    401,
    () => request('GET', '/api/auth/me')
  );

  await runTest(
    'GET /api/auth/me (Token inválido -> 401)',
    401,
    () => request('GET', '/api/auth/me', { token: 'token-invalido-o-falsificado' })
  );

  await runTest(
    'GET /api/auth/me (Con token válido -> 200)',
    200,
    () => request('GET', '/api/auth/me', { token: authToken }),
    (body) => body?.data?.email === 'admin@moyaprop.com'
  );

  // 3. Catálogo Público de Propiedades
  console.log('\n--- 3. CATÁLOGO PÚBLICO Y BÚSQUEDAS ---');
  await runTest(
    'GET /api/properties (Catálogo público activo)',
    200,
    () => request('GET', '/api/properties'),
    (body) => Array.isArray(body?.data) && typeof body?.meta?.total === 'number'
  );

  await runTest(
    'GET /api/properties?operationType=VENTA (Filtro Operación)',
    200,
    () => request('GET', '/api/properties?operationType=VENTA'),
    (body) => body.data.every((p: any) => p.operationType === 'VENTA')
  );

  await runTest(
    'GET /api/properties?propertyType=CASA (Filtro Tipo)',
    200,
    () => request('GET', '/api/properties?propertyType=CASA'),
    (body) => body.data.every((p: any) => p.propertyType === 'CASA')
  );

  await runTest(
    'GET /api/properties?page=1&limit=2 (Paginación)',
    200,
    () => request('GET', '/api/properties?page=1&limit=2'),
    (body) => body.data.length <= 2 && body.meta.page === 1
  );

  await runTest(
    'GET /api/properties?page=-1 (Validación Zod falla query inválida -> 400)',
    400,
    () => request('GET', '/api/properties?page=-1')
  );

  await runTest(
    'GET /api/properties/00000000-0000-0000-0000-000000000000 (Inmueble inexistente -> 404)',
    404,
    () => request('GET', '/api/properties/00000000-0000-0000-0000-000000000000')
  );

  // 4. Operaciones CRUD Administrativas (Protegidas)
  console.log('\n--- 4. GESTIÓN ADMINISTRATIVA (CRUD PROTEGIDO) ---');
  await runTest(
    'GET /api/properties/admin/all (Sin token -> 401)',
    401,
    () => request('GET', '/api/properties/admin/all')
  );

  await runTest(
    'GET /api/properties/admin/all (Con token -> 200)',
    200,
    () => request('GET', '/api/properties/admin/all', { token: authToken }),
    (body) => Array.isArray(body?.data)
  );

  // Crear propiedad de prueba
  const testPropertyPayload = {
    title: 'QA Test - Casa Quinta con Parque',
    description: 'Propiedad creada automáticamente por la suite de testing pre-producción de MoyaProp para validar integridad CRUD.',
    operationType: 'VENTA',
    propertyType: 'QUINTA',
    price: 185000,
    currency: 'USD',
    expenses: 0,
    totalArea: 1200,
    coveredArea: 180,
    bedrooms: 3,
    bathrooms: 2,
    garages: 2,
    address: 'Calle de Prueba 1234',
    city: 'Burzaco',
    neighborhood: 'Centro',
    featured: false,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
        publicId: 'qa_test_img_1',
        order: 0,
        isCover: true
      }
    ]
  };

  await runTest(
    'POST /api/properties (Admin crea inmueble -> 201)',
    201,
    async () => {
      const res = await request('POST', '/api/properties', {
        token: authToken,
        body: testPropertyPayload
      });
      if (res.body?.data?.id) {
        createdPropertyId = res.body.data.id;
      }
      return res;
    },
    (body) => !!body?.data?.id && body.data.title === testPropertyPayload.title
  );

  if (createdPropertyId) {
    await runTest(
      'GET /api/properties/:id (Consulta pública del inmueble creado -> 200)',
      200,
      () => request('GET', `/api/properties/${createdPropertyId}`),
      (body) => body.data.id === createdPropertyId
    );

    await runTest(
      'PUT /api/properties/:id (Admin modifica inmueble -> 200)',
      200,
      () =>
        request('PUT', `/api/properties/${createdPropertyId}`, {
          token: authToken,
          body: {
            ...testPropertyPayload,
            price: 195000,
            title: 'QA Test - Casa Quinta con Parque (Actualizada)'
          }
        }),
      (body) => Number(body.data.price) === 195000
    );

    await runTest(
      'PATCH /api/properties/:id/status (Admin pausa inmueble -> 200)',
      200,
      () =>
        request('PATCH', `/api/properties/${createdPropertyId}/status`, {
          token: authToken,
          body: { status: 'PAUSADA' }
        }),
      (body) => body.data.status === 'PAUSADA'
    );

    // Debe desaparecer del catálogo público de activas
    await runTest(
      'GET /api/properties/:id (Inmueble pausado no accesible públicamente -> 404)',
      404,
      () => request('GET', `/api/properties/${createdPropertyId}`)
    );

    // Pero sí accesible en el admin
    await runTest(
      'GET /api/properties/admin/:id (Inmueble pausado accesible en admin -> 200)',
      200,
      () => request('GET', `/api/properties/admin/${createdPropertyId}`, { token: authToken }),
      (body) => body.data.status === 'PAUSADA'
    );

    await runTest(
      'DELETE /api/properties/:id (Admin elimina inmueble de prueba -> 200)',
      200,
      () => request('DELETE', `/api/properties/${createdPropertyId}`, { token: authToken })
    );

    // Verificar eliminación definitiva
    await runTest(
      'GET /api/properties/admin/:id (Inmueble eliminado -> 404)',
      404,
      () => request('GET', `/api/properties/admin/${createdPropertyId}`, { token: authToken })
    );
  }

  // 5. CORS y Headers
  console.log('\n--- 5. SEGURIDAD Y POLÍTICAS DE RED ---');
  await runTest(
    'CORS Headers (Permitido para localhost:5173)',
    [200, 204],
    () =>
      request('OPTIONS', '/api/health', {
        headers: {
          Origin: 'http://localhost:5173',
          'Access-Control-Request-Method': 'GET'
        }
      })
  );

  // Resumen
  const total = results.length;
  const passed = results.filter((r) => r.status === 'PASSED').length;
  const failed = results.filter((r) => r.status === 'FAILED').length;

  console.log('\n======================================================');
  console.log('📊 RESUMEN FINAL DE LA AUDITORÍA DE API');
  console.log('======================================================');
  console.log(`Total de pruebas ejecutadas: ${total}`);
  console.log(`Pruebas exitosas (PASSED)  : ${passed}`);
  console.log(`Pruebas fallidas (FAILED)  : ${failed}`);
  console.log(`Tasa de éxito              : ${((passed / total) * 100).toFixed(1)}%`);
  console.log('======================================================\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runSuite().catch((err) => {
  console.error('Error fatal durante la ejecución de la suite:', err);
  process.exit(1);
});
