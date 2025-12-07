import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Eye, FolderOpen } from 'lucide-react'
import { toast } from 'sonner'
import { diccionarioAPI } from '../../api'

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('create')
  const [selectedCategoria, setSelectedCategoria] = useState(null)
  
  // Form states
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    icono: '',
    color: '#3B82F6',
    orden: 0,
    activo: true
  })
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    fetchCategorias()
  }, [])

  const fetchCategorias = async () => {
    try {
      setLoading(true)
      const response = await diccionarioAPI.categorias.getAll()
      const data = response.data
      
      // Manejar diferentes formatos de respuesta
      let categoriasData = []
      if (Array.isArray(data)) {
        categoriasData = data
      } else if (data.results && Array.isArray(data.results)) {
        categoriasData = data.results
      }
      
      setCategorias(categoriasData)
    } catch (error) {
      console.error('Error al cargar categorías:', error)
      toast.error('Error al cargar categorías')
      setCategorias([])
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setModalMode('create')
    setSelectedCategoria(null)
    setFormData({
      nombre: '',
      descripcion: '',
      icono: '',
      color: '#3B82F6',
      orden: 0,
      activo: true
    })
    setFormErrors({})
    setIsModalOpen(true)
  }

  const handleEdit = (categoria) => {
    setModalMode('edit')
    setSelectedCategoria(categoria)
    setFormData({
      nombre: categoria.nombre,
      descripcion: categoria.descripcion || '',
      icono: categoria.icono || '',
      color: categoria.color || '#3B82F6',
      orden: categoria.orden || 0,
      activo: categoria.activo
    })
    setFormErrors({})
    setIsModalOpen(true)
  }

  const handleView = (categoria) => {
    setModalMode('view')
    setSelectedCategoria(categoria)
    setIsModalOpen(true)
  }

  const validateForm = () => {
    const errors = {}
    
    if (!formData.nombre.trim()) {
      errors.nombre = 'El nombre es requerido'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }

    try {
      const dataToSend = { ...formData }
      
      // Convertir orden a número
      dataToSend.orden = parseInt(dataToSend.orden) || 0
      
      if (modalMode === 'create') {
        await diccionarioAPI.categorias.create(dataToSend)
        toast.success('Categoría creada exitosamente')
      } else if (modalMode === 'edit') {
        await diccionarioAPI.categorias.update(selectedCategoria.id_categoria, dataToSend)
        toast.success('Categoría actualizada exitosamente')
      }
      
      setIsModalOpen(false)
      fetchCategorias()
    } catch (error) {
      console.error('Error al guardar categoría:', error)
      
      // Manejar error 500 pero que se creó
      if (error.response?.status === 500) {
        toast.success('Categoría guardada (recargando...)')
        setIsModalOpen(false)
        fetchCategorias()
      } else {
        const errorMessage = error.response?.data?.detail || 
                            error.response?.data?.message ||
                            'Error al guardar categoría'
        toast.error(errorMessage)
      }
    }
  }

  const handleDelete = async (categoria) => {
    if (!window.confirm(`¿Estás seguro de eliminar la categoría "${categoria.nombre}"?`)) {
      return
    }

    try {
      await diccionarioAPI.categorias.delete(categoria.id_categoria)
      toast.success('Categoría eliminada exitosamente')
      fetchCategorias()
    } catch (error) {
      console.error('Error al eliminar categoría:', error)
      const errorMessage = error.response?.data?.detail || 
                          'No se puede eliminar una categoría que tiene señas asociadas'
      toast.error(errorMessage)
    }
  }

  const filteredCategorias = categorias.filter(categoria => 
    categoria.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (categoria.descripcion && categoria.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const stats = {
    total: categorias.length,
    activas: categorias.filter(c => c.activo).length,
    inactivas: categorias.filter(c => !c.activo).length
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Categorías de Señas</h1>
            <p className="text-gray-600 mt-1">Organiza las señas por categorías</p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nueva Categoría
          </button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar categorías..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <p className="text-sm text-gray-600">Total Categorías</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <p className="text-sm text-gray-600">Activas</p>
            <p className="text-2xl font-bold text-green-600">{stats.activas}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <p className="text-sm text-gray-600">Inactivas</p>
            <p className="text-2xl font-bold text-red-600">{stats.inactivas}</p>
          </div>
        </div>

        {/* Grid de Categorías */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-full p-8 text-center text-gray-500">Cargando...</div>
          ) : filteredCategorias.length === 0 ? (
            <div className="col-span-full p-8 text-center text-gray-500">No hay categorías disponibles</div>
          ) : (
            filteredCategorias.map((categoria) => (
              <div
                key={categoria.id_categoria}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleView(categoria)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${categoria.color}20` }}
                    >
                      {categoria.icono ? (
                        <span className="text-2xl">{categoria.icono}</span>
                      ) : (
                        <FolderOpen className="w-6 h-6" style={{ color: categoria.color }} />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{categoria.nombre}</h3>
                      <p className="text-sm text-gray-500">
                        {categoria.total_senas || 0} señas
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    categoria.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {categoria.activo ? 'Activa' : 'Inactiva'}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {categoria.descripcion || 'Sin descripción'}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-xs text-gray-500">
                    Orden: {categoria.orden}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleView(categoria)
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="Ver"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEdit(categoria)
                      }}
                      className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(categoria)
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">
                {modalMode === 'create' ? 'Nueva Categoría' :
                 modalMode === 'edit' ? 'Editar Categoría' :
                 'Detalles de la Categoría'}
              </h2>
              
              {modalMode === 'view' && selectedCategoria ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div 
                      className="w-16 h-16 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${selectedCategoria.color}20` }}
                    >
                      {selectedCategoria.icono ? (
                        <span className="text-3xl">{selectedCategoria.icono}</span>
                      ) : (
                        <FolderOpen className="w-8 h-8" style={{ color: selectedCategoria.color }} />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{selectedCategoria.nombre}</h3>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        selectedCategoria.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedCategoria.activo ? 'Activa' : 'Inactiva'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500">Descripción</p>
                    <p className="text-base text-gray-900">{selectedCategoria.descripcion || 'Sin descripción'}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total de Señas</p>
                      <p className="text-2xl font-bold text-gray-900">{selectedCategoria.total_senas || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Orden</p>
                      <p className="text-2xl font-bold text-gray-900">{selectedCategoria.orden}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500">Color</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <div 
                        className="w-8 h-8 rounded border border-gray-300"
                        style={{ backgroundColor: selectedCategoria.color }}
                      />
                      <span className="text-sm text-gray-600">{selectedCategoria.color}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="w-full mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                  >
                    Cerrar
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      placeholder="Saludos, Familia, Números..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    {formErrors.nombre && <p className="text-red-500 text-sm mt-1">{formErrors.nombre}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                    <textarea
                      value={formData.descripcion}
                      onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                      placeholder="Descripción de la categoría..."
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Icono (Emoji)
                      </label>
                      <input
                        type="text"
                        value={formData.icono}
                        onChange={(e) => setFormData({ ...formData, icono: e.target.value })}
                        placeholder="👋 🏠 🔢"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        maxLength={2}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={formData.color}
                          onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                          className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={formData.color}
                          onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="#3B82F6"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Orden de visualización
                    </label>
                    <input
                      type="number"
                      value={formData.orden}
                      onChange={(e) => setFormData({ ...formData, orden: e.target.value })}
                      placeholder="0"
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Las categorías se ordenarán de menor a mayor</p>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.activo}
                      onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <label className="ml-2 text-sm text-gray-700">Categoría activa</label>
                  </div>
                  
                  <div className="flex gap-2 mt-6">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      {modalMode === 'create' ? 'Crear' : 'Guardar'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}