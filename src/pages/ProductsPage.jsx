import { useState, useEffect } from 'react'
import Card from '../components/common/Card.jsx'
import Button from '../components/common/Button.jsx'
import * as authService from '../authService.js'
import './UsersPage.css'

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [productTypes, setProductTypes] = useState([])
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(null)
  const [saving, setSaving] = useState(null)
  const [message, setMessage] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ name: '', price: '', brandId: '', typeId: '' })
  const [showCreate, setShowCreate] = useState(false)
  const [createForm, setCreateForm] = useState({ name: '', price: '', brandId: '', typeId: '' })
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    fetchProducts()
    fetchProductTypes()
    fetchBrands()
  }, [])

  async function fetchProducts() {
    setMessage('')
    try {
      const data = await authService.getProducts()
      setProducts(data?.data || data || [])
    } catch (err) {
      setMessage(err?.message || 'No se pudieron cargar los productos')
    }
  }

  async function fetchProductTypes() {
    try {
      const data = await authService.getProductTypes()
      setProductTypes(data?.data || data || [])
    } catch (err) {
      console.error('Error cargando categorías:', err)
    }
  }

  async function fetchBrands() {
    try {
      const res = await fetch('/api/brands/getAll')
      const data = await res.json()
      setBrands(data?.data || [])
    } catch (err) {
      console.error('Error cargando marcas:', err)
    }
  }

  function startEdit(product) {
    setEditingId(product.id)
    setForm({ name: product.name, price: String(product.price), brandId: String(product.brandId), typeId: String(product.typeId) })
    setMessage('')
  }

  function cancelEdit() {
    setEditingId(null)
    setForm({ name: '', price: '', brandId: '', typeId: '' })
  }

  function openCreateForm() {
    setCreateForm({ name: '', price: '', brandId: '', typeId: '' })
    setShowCreate(true)
  }

  function cancelCreate() {
    setShowCreate(false)
  }

  async function handleCreate(e) {
    e.preventDefault()
    setCreating(true)
    setMessage('')
    try {
      await authService.createProduct({
        name: createForm.name,
        price: Number(createForm.price),
        brandId: Number(createForm.brandId),
        typeId: Number(createForm.typeId),
      })
      showMessage('Producto creado correctamente')
      cancelCreate()
      fetchProducts()
    } catch (err) {
      showMessage(err?.message || 'No se pudo crear el producto')
    } finally {
      setCreating(false)
    }
  }

  async function saveEdit(id) {
    setSaving(id)
    setMessage('')
    try {
      await authService.updateProduct(id, {
        name: form.name,
        price: Number(form.price),
        brandId: Number(form.brandId),
        typeId: Number(form.typeId),
      })
      showMessage('Producto actualizado correctamente')
      cancelEdit()
      fetchProducts()
    } catch (err) {
      setMessage(err?.message || 'No se pudo actualizar el producto')
    } finally {
      setSaving(null)
    }
  }

  function showMessage(msg) {
    setMessage(msg)
    setTimeout(() => setMessage(''), 3000)
  }

  async function handleDelete(product) {
    if (!window.confirm(`¿Eliminar producto "${product.name}"?`)) return
    setMessage('')
    setLoading(product.id)
    try {
      await authService.deleteProduct(product.id)
      setProducts(prev => prev.filter(p => p.id !== product.id))
      showMessage('Producto eliminado correctamente')
    } catch (err) {
      showMessage(err?.message || 'No se pudo eliminar el producto')
    } finally {
      setLoading(null)
    }
  }

  return (
    <main>
      <h2 className="page-title">Productos</h2>

      <Card
        title="Listado de productos"
        subtitle="Ver, crear y administrar productos"
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="primary" size="sm" onClick={openCreateForm}>
              + Nuevo producto
            </Button>
            <Button variant="secondary" size="sm" onClick={fetchProducts}>
              Recargar
            </Button>
          </div>
        }
      >
        <div className="users-table-wrap">
          {message && <div className="users-page__message">{message}</div>}

          {showCreate && (
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 16, marginBottom: 16, border: '1px solid var(--color-border)', borderRadius: 8, background: '#f9f9fb', maxWidth: 400 }}>
              <h3 style={{ margin: 0, fontSize: 15 }}>Nuevo producto</h3>

              <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>Nombre</span>
                <input type="text" required value={createForm.name} onChange={e => setCreateForm(f => ({ ...f, name: e.target.value }))} style={{ padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 14 }} />
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>Precio</span>
                <input type="number" step="0.01" required value={createForm.price} onChange={e => setCreateForm(f => ({ ...f, price: e.target.value }))} style={{ padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 14 }} />
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>Marca</span>
                <select required value={createForm.brandId} onChange={e => setCreateForm(f => ({ ...f, brandId: e.target.value }))} style={{ padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 14 }}>
                  <option value="">Seleccionar marca</option>
                  {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </label>

              <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>Categoría</span>
                <select required value={createForm.typeId} onChange={e => setCreateForm(f => ({ ...f, typeId: e.target.value }))} style={{ padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 14 }}>
                  <option value="">Seleccionar categoría</option>
                  {productTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </label>

              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <Button type="submit" variant="primary" size="sm" disabled={creating}>{creating ? 'Creando…' : 'Crear producto'}</Button>
                <Button variant="ghost" size="sm" onClick={cancelCreate}>Cancelar</Button>
              </div>
            </form>
          )}

          <table className="users-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Marca</th>
                <th>Categoría</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td>
                    {editingId === p.id
                      ? <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={{ marginBottom: 4 }} />
                      : p.name}
                  </td>
                  <td>
                    {editingId === p.id
                      ? <input type="number" step="0.01" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} style={{ marginBottom: 4 }} />
                      : `$${p.price}`}
                  </td>
                  <td>
                    {editingId === p.id
                      ? <select value={form.brandId} onChange={e => setForm(f => ({ ...f, brandId: e.target.value }))} style={{ padding: '6px 8px', border: '1px solid var(--color-border)', borderRadius: 6, fontSize: 13 }}>
                          <option value="">Sin marca</option>
                          {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                        </select>
                      : p.brandName || 'Sin marca'}
                  </td>
                  <td>
                    {editingId === p.id
                      ? <select value={form.typeId} onChange={e => setForm(f => ({ ...f, typeId: e.target.value }))} style={{ padding: '6px 8px', border: '1px solid var(--color-border)', borderRadius: 6, fontSize: 13 }}>
                          <option value="">Sin categoría</option>
                          {productTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                      : p.typeName || 'Sin categoría'}
                  </td>
                  <td>
                    {editingId === p.id ? (
                      <>
                        <Button variant="primary" size="sm" onClick={() => saveEdit(p.id)} disabled={saving === p.id}>{saving === p.id ? 'Guardando…' : 'Guardar'}</Button>
                        <Button variant="ghost" size="sm" onClick={cancelEdit}>Cancelar</Button>
                      </>
                    ) : (
                      <>
                        <Button variant="secondary" size="sm" onClick={() => startEdit(p)}>Editar</Button>
                        <Button variant="danger" size="sm" onClick={() => handleDelete(p)} disabled={loading === p.id}>{loading === p.id ? 'Eliminando…' : 'Eliminar'}</Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: 20, color: '#888' }}>No hay productos registrados</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </main>
  )
}
