import axiosClient from './axiosClient.js'

// Ruta exacta del backend real: /api/accounts/register
const LOGIN_URL = '/api/accounts/login'
const REGISTER_URL = '/api/accounts/register'
const TOKEN_STORAGE_KEY = 'authToken'
const SESSION_STORAGE_KEY = 'freebuff.auth.session'

function getToken(data) {
  return (
    data?.token ||
    data?.accessToken ||
    data?.access_token ||
    data?.data?.token ||
    data?.data?.accessToken ||
    data?.data?.access_token
  )
}

function normalizeError(err) {
  if (err?.response) {
    return {
      status: err.response.status,
      data: err.response.data,
      message:
        err.response.data?.msg ||
        err.response.data?.message ||
        err.response.data?.error ||
        err.response.statusText ||
        err.message,
    }
  }

  return { message: err?.message || String(err) }
}

/**
 * credentials: { email, password }
 * Hace POST a /api/accounts/login y devuelve response.data.
 * La API responde { result: "success" | "error", msg, data? }.
 */
export async function login(credentials) {
  try {
    const response = await axiosClient.post(LOGIN_URL, credentials)
    const data = response.data

    if (!data || data.result === 'error' || data.error === true) {
      const message = data?.msg || data?.message || 'No se pudo iniciar sesión'
      throw { status: response.status, data, message }
    }

    const token = getToken(data)
    if (token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token)
      localStorage.setItem(
        SESSION_STORAGE_KEY,
        JSON.stringify({ ...data, token }),
      )
      axiosClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }

    return data
  } catch (err) {
    throw normalizeError(err)
  }
}

/**
 * payload: { firstName, lastName, email, password }
 * Backend real: POST /api/accounts/register
 */
export async function register(payload) {
  try {
    const response = await axiosClient.post(REGISTER_URL, payload)
    const data = response.data

    if (!data || data.result === 'error' || data.error === true) {
      const message = data?.msg || data?.message || 'No se pudo registrar el usuario'
      throw { status: response.status, data, message }
    }

    return data
  } catch (err) {
    throw normalizeError(err)
  }
}

/**
 * Obtiene el listado de usuarios desde la API.
 * Endpoint esperado: GET /api/admin/users
 * Devuelve response.data (o response.data.data) normalizado, o lanza error.
 */
export async function getUsers() {
  try {
    const response = await axiosClient.get('/api/admin/users')
    const data = response.data
    if (!data) {
      throw { message: 'Respuesta vacía al solicitar usuarios' }
    }
    return data
  } catch (err) {
    throw normalizeError(err)
  }
}

/**
 * Actualiza un usuario por id.
 * Endpoint esperado: PUT /api/admin/users/:id
 * payload: { name?, email?, role? }
 */
export async function updateUser(id, payload) {
  try {
    const response = await axiosClient.put(`/api/admin/users/${id}`, payload)
    const data = response.data
    if (!data || data.result === 'error' || data.error === true) {
      const message = data?.msg || data?.message || 'No se pudo actualizar el usuario'
      throw { status: response.status, data, message }
    }
    return data
  } catch (err) {
    throw normalizeError(err)
  }
}

/**
 * Envía una solicitud para restaurar/recuperar contraseña del usuario.
 * La API esperada: POST /api/accounts/reset-password { email }
 * Devuelve response.data o lanza error normalizado.
 */
export async function resetPassword(email) {
  try {
    const response = await axiosClient.post('/api/accounts/reset-password', { email })
    const data = response.data

    if (!data || data.result === 'error' || data.error === true) {
      const message = data?.msg || data?.message || 'No se pudo solicitar restauración de contraseña'
      throw { status: response.status, data, message }
    }

    return data
  } catch (err) {
    throw normalizeError(err)
  }
}

/**
 * Obtiene el perfil del usuario autenticado.
 * Endpoint: GET /api/accounts/profile
 */
export async function getProfile() {
  try {
    const response = await axiosClient.get('/api/accounts/profile')
    const data = response.data
    if (!data) {
      throw { message: 'Respuesta vacía al solicitar perfil' }
    }
    return data
  } catch (err) {
    throw normalizeError(err)
  }
}

/**
 * Actualiza el perfil del usuario autenticado.
 * Endpoint: PUT /api/accounts/profile
 * payload: { firstName?, lastName?, email? }
 */
/**
 * Actualiza el perfil del usuario autenticado enviando la petición directamente al backend real.
 */
export async function updateProfile(payload) {
  try {
    const response = await axiosClient.put('/api/accounts/profile', payload)
    const data = response.data
    
    if (!data || data.result === 'error' || data.error === true) {
      const message = data?.msg || data?.message || 'No se pudo actualizar el perfil'
      throw { status: response.status, data, message }
    }
    return data
  } catch (err) {
    throw normalizeError(err)
  }
}


/**
 * Cambia la contraseña del usuario autenticado.
 * Endpoint: PUT /api/accounts/change-password
 * payload: { currentPassword, newPassword }
 */
export async function changePassword(payload) {
  try {
    const response = await axiosClient.put('/api/accounts/change-password', payload)
    const data = response.data
    if (!data || data.result === 'error' || data.error === true) {
      const message = data?.msg || data?.message || 'No se pudo cambiar la contraseña'
      throw { status: response.status, data, message }
    }
    return data
  } catch (err) {
    throw normalizeError(err)
  }
}

/**
 * Elimina un usuario por id.
 * Endpoint: DELETE /api/admin/users/:id
 * @param {number} id
 * @param {boolean} force - true para borrado físico, false para desactivar
 */
export async function deleteUser(id, force = false) {
  try {
    const url = `/api/admin/users/${id}${force ? '?force=true' : ''}`
    const response = await axiosClient.delete(url)
    const data = response.data
    if (!data || data.result === 'error' || data.error === true) {
      const message = data?.msg || data?.message || 'No se pudo eliminar el usuario'
      throw { status: response.status, data, message }
    }
    return data
  } catch (err) {
    throw normalizeError(err)
  }
}

// ─── ROLES ───

/** Obtener todos los roles */
export async function getRoles() {
  try {
    const response = await axiosClient.get('/api/roles')
    return response.data
  } catch (err) {
    throw normalizeError(err)
  }
}

/** Crear un rol */
export async function createRole(payload) {
  try {
    const response = await axiosClient.post('/api/roles', payload)
    const data = response.data
    if (!data || data.result === 'error') {
      throw { status: response.status, data, message: data?.msg || 'No se pudo crear el rol' }
    }
    return data
  } catch (err) {
    throw normalizeError(err)
  }
}

/** Actualizar un rol */
export async function updateRole(id, payload) {
  try {
    const response = await axiosClient.put(`/api/roles/${id}`, payload)
    const data = response.data
    if (!data || data.result === 'error') {
      throw { status: response.status, data, message: data?.msg || 'No se pudo actualizar el rol' }
    }
    return data
  } catch (err) {
    throw normalizeError(err)
  }
}

/** Eliminar un rol */
export async function deleteRole(id) {
  try {
    const response = await axiosClient.delete(`/api/roles/${id}`)
    const data = response.data
    if (!data || data.result === 'error') {
      throw { status: response.status, data, message: data?.msg || 'No se pudo eliminar el rol' }
    }
    return data
  } catch (err) {
    throw normalizeError(err)
  }
}

// ─── PRODUCTS ───

/** Obtener todos los productos */
export async function getProducts() {
  try {
    const response = await axiosClient.get('/api/products')
    return response.data
  } catch (err) {
    throw normalizeError(err)
  }
}

/** Crear un producto */
export async function createProduct(payload) {
  try {
    const response = await axiosClient.post('/api/products', payload)
    const data = response.data
    if (!data || data.result === 'error') {
      throw { status: response.status, data, message: data?.msg || 'No se pudo crear el producto' }
    }
    return data
  } catch (err) {
    throw normalizeError(err)
  }
}

/** Actualizar un producto */
export async function updateProduct(id, payload) {
  try {
    const response = await axiosClient.put(`/api/products/${id}`, payload)
    const data = response.data
    if (!data || data.result === 'error') {
      throw { status: response.status, data, message: data?.msg || 'No se pudo actualizar el producto' }
    }
    return data
  } catch (err) {
    throw normalizeError(err)
  }
}

/** Eliminar un producto */
export async function deleteProduct(id) {
  try {
    const response = await axiosClient.delete(`/api/products/${id}`)
    const data = response.data
    if (!data || data.result === 'error') {
      throw { status: response.status, data, message: data?.msg || 'No se pudo eliminar el producto' }
    }
    return data
  } catch (err) {
    throw normalizeError(err)
  }
}

// ─── PRODUCT TYPES (Categorías) ───

/** Obtener todas las categorías */
export async function getProductTypes() {
  try {
    const response = await axiosClient.get('/api/product-types')
    return response.data
  } catch (err) {
    throw normalizeError(err)
  }
}

/** Crear una categoría */
export async function createProductType(payload) {
  try {
    const response = await axiosClient.post('/api/product-types', payload)
    const data = response.data
    if (!data || data.result === 'error') {
      throw { status: response.status, data, message: data?.msg || 'No se pudo crear la categoría' }
    }
    return data
  } catch (err) {
    throw normalizeError(err)
  }
}

/** Actualizar una categoría */
export async function updateProductType(id, payload) {
  try {
    const response = await axiosClient.put(`/api/product-types/${id}`, payload)
    const data = response.data
    if (!data || data.result === 'error') {
      throw { status: response.status, data, message: data?.msg || 'No se pudo actualizar la categoría' }
    }
    return data
  } catch (err) {
    throw normalizeError(err)
  }
}

/** Eliminar una categoría */
export async function deleteProductType(id) {
  try {
    const response = await axiosClient.delete(`/api/product-types/${id}`)
    const data = response.data
    if (!data || data.result === 'error') {
      throw { status: response.status, data, message: data?.msg || 'No se pudo eliminar la categoría' }
    }
    return data
  } catch (err) {
    throw normalizeError(err)
  }
}

export function logout() {
  localStorage.removeItem(TOKEN_STORAGE_KEY)
  localStorage.removeItem(SESSION_STORAGE_KEY)
  localStorage.removeItem('menu')
  delete axiosClient.defaults.headers.common['Authorization']
}

const existingToken = localStorage.getItem(TOKEN_STORAGE_KEY)
if (existingToken) {
  axiosClient.defaults.headers.common['Authorization'] = `Bearer ${existingToken}`
}
