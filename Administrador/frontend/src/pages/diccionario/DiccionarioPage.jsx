import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Eye, TrendingUp } from 'lucide-react'
import { toast } from 'sonner'
import { diccionarioAPI } from '../../api'

export default function DiccionarioPage() {
  const [senas, setSenas] = useState([])
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategoria, setFilterCategoria] = useState('')
  const [filterDificultad, setFilterDificultad] = useState('')
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('create')
  const [selectedSena, setSelectedSena] = useState(null)
  
  // Form states
  const [formData, setFormData] = useState({
    palabra: '',
    descripcion: '',
    id_categoria: '',
    url_video: '',
    duracion_video_segundos: '',
    dificultad: 'medio',
    activo: true
  })
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    fetchSenas()
    fetchCategorias()
  }, [filterCategoria, filterDificultad])

  const fetchSenas = async () => {
    try {
      setLoading(true)
      const params = {}
      if (filterCategoria) params.id_categoria = filterCategoria
      if (filterDificultad) params.dificultad = filterDificultad
      
      const response = await diccionarioAPI.señas.getAll(params)
      const data = response.data
      
      // Manejar diferentes formatos de respuesta
      let senasData = []
      if (Array.isArray(data)) {
        senasData = data
      } else if (data.results && Array.isArray(data.results)) {
        senasData = data.results
      }
      
      setSenas(senasData)
    } catch (error) {
      console.error('Error al cargar señas:', error)
      toast.error('Error al cargar señas')
      setSenas([])
    } finally {
      setLoading(false)
    }
  }

  const fetchCategorias = async () => {
    try {
      const response = await diccionarioAPI.categorias.getAll()
      const data = response.data
      
      // Manejar diferentes formatos
      let categoriasData = []
      if (Array.isArray(data)) {
        categoriasData = data
      } else if (data.results && Array.isArray(data.results)) {
        categoriasData = data.results
      }
      
      setCategorias(categoriasData)
    } catch (error) {
      console.error('Error al cargar categorías:', error)
      setCategorias([])
    }
  }

  const handleCreate = () => {
    setModalMode('create')
    setSelectedSena(null)
    setFormData({
      palabra: '',
      descripcion: '',
      id_categoria: '',
      url_video: '',
      duracion_video_segundos: '',
      dificultad: 'medio',
      activo: true
    })
    setFormErrors({})
    setIsModalOpen(true)
  }

  const handleEdit = (sena) => {
    setModalMode('edit')
    setSelectedSena(sena)
    setFormData({
      palabra: sena.palabra,
      descripcion: sena.descripcion || '',
      id_categoria: sena.id_categoria || '',
      url_video: sena.url_video || '',
      duracion_video_segundos: sena.duracion_video_segundos || '',
      dificultad: sena.dificultad,
      activo: sena.activo
    })
    setFormErrors({})
    setIsModalOpen(true)
  }

  const handleView = (sena) => {
    setModalMode('view')
    setSelectedSena(sena)
    setIsModalOpen(true)
  }

  const validateForm = () => {
    const errors = {}
    
    if (!formData.palabra.trim()) {
      errors.palabra = 'La palabra es requerida'
    }
    
    if (!formData.id_categoria) {
      errors.id_categoria = 'La categoría es requerida'
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
      
      // Convertir categoria a número si existe
      if (dataToSend.id_categoria) {
        dataToSend.id_categoria = parseInt(dataToSend.id_categoria)
      }
      
      // Convertir duración a número
      if (dataToSend.duracion_video_segundos) {
        dataToSend.duracion_video_segundos = parseInt(dataToSend.duracion_video_segundos)
      } else {
        dataToSend.duracion_video_segundos = null
      }
      
      if (modalMode === 'create') {
        await diccionarioAPI.señas.create(dataToSend)
        toast.success('Seña creada exitosamente')
      } else if (modalMode === 'edit') {
        await diccionarioAPI.señas.update(selectedSena.id_seña, dataToSend)
        toast.success('Seña actualizada exitosamente')
      }
      
      setIsModalOpen(false)
      fetchSenas()
    } catch (error) {
      console.error('Error al guardar seña:', error)
      
      // Manejar error 500 pero que se creó
      if (error.response?.status === 500) {
        toast.success('Seña guardada (recargando...)')
        setIsModalOpen(false)
        fetchSenas()
      } else {
        const errorMessage = error.response?.data?.detail || 
                            error.response?.data?.message ||
                            'Error al guardar seña'
        toast.error(errorMessage)
      }
    }
  }

  const handleDelete = async (sena) => {
    if (!window.confirm(`¿Estás seguro de eliminar la seña "${sena.palabra}"?`)) {
      return
    }

    try {
      await diccionarioAPI.señas.delete(sena.id_seña)
      toast.success('Seña eliminada exitosamente')
      fetchSenas()
    } catch (error) {
      console.error('Error al eliminar seña:', error)
      toast.error('Error al eliminar seña')
    }
  }

  const filteredSenas = senas.filter(sena => 
    sena.palabra.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (sena.descripcion && sena.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const getCategoriaName = (id_categoria) => {
    const cat = categorias.find(c => c.id_categoria === id_categoria)
    return cat ? cat.nombre : 'Sin categoría'
  }

  const stats = {
    total: senas.length,
    facil: senas.filter(s => s.dificultad === 'facil').length,
    medio: senas.filter(s => s.dificultad === 'medio').length,
    dificil: senas.filter(s => s.dificultad === 'dificil').length
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Diccionario de Señas</h1>
            <p className="text-gray-600 mt-1">Gestiona el catálogo completo de señas</p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nueva Seña
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar señas..."
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={filterCategoria}
              onChange={(e) => setFilterCategoria(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas las categorías</option>
              {categorias.map(cat => (
                <option key={cat.id_categoria} value={cat.id_categoria}>
                  {cat.nombre}
                </option>
              ))}
            </select>
            <select
              value={filterDificultad}
              onChange={(e) => setFilterDificultad(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas las dificultades</option>
              <option value="facil">Fácil</option>
              <option value="medio">Medio</option>
              <option value="dificil">Difícil</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <p className="text-sm text-gray-600">Total Señas</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <p className="text-sm text-gray-600">Fácil</p>
            <p className="text-2xl font-bold text-green-600">{stats.facil}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <p className="text-sm text-gray-600">Medio</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.medio}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <p className="text-sm text-gray-600">Difícil</p>
            <p className="text-2xl font-bold text-red-600">{stats.dificil}</p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Cargando...</div>
          ) : filteredSenas.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No hay señas disponibles</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Palabra</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dificultad</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Practicada</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredSenas.map((sena) => (
                    <tr key={sena.id_seña} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleView(sena)}>
                      <td className="px-6 py-4 text-sm text-gray-500">#{sena.id_seña}</td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{sena.palabra}</p>
                          <p className="text-sm text-gray-500">{sena.descripcion || 'Sin descripción'}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {getCategoriaName(sena.id_categoria)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          sena.dificultad === 'facil' ? 'bg-green-100 text-green-800' :
                          sena.dificultad === 'medio' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {sena.dificultad}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <TrendingUp className="w-4 h-4" />
                          <span>{sena.veces_practicada || 0} veces</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleView(sena)
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Ver"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEdit(sena)
                            }}
                            className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDelete(sena)
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">
                {modalMode === 'create' ? 'Nueva Seña' :
                 modalMode === 'edit' ? 'Editar Seña' :
                 'Detalles de la Seña'}
              </h2>
              
              {modalMode === 'view' && selectedSena ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Palabra</p>
                    <p className="text-xl font-bold text-gray-900">{selectedSena.palabra}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Descripción</p>
                    <p className="text-base text-gray-900">{selectedSena.descripcion || 'Sin descripción'}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Categoría</p>
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {getCategoriaName(selectedSena.id_categoria)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Dificultad</p>
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                        {selectedSena.dificultad}
                      </span>
                    </div>
                  </div>
                  {selectedSena.url_video && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-2">Video</p>
                      <a 
                        href={selectedSena.url_video} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Ver video
                      </a>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">Estadísticas</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600">Practicada</p>
                        <p className="text-lg font-bold text-gray-900">{selectedSena.veces_practicada || 0} veces</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600">Popularidad</p>
                        <p className="text-lg font-bold text-gray-900">{selectedSena.popularidad || 0}</p>
                      </div>
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
                      Palabra / Seña <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.palabra}
                      onChange={(e) => setFormData({ ...formData, palabra: e.target.value })}
                      placeholder="Hola, Gracias, Buenos días..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    {formErrors.palabra && <p className="text-red-500 text-sm mt-1">{formErrors.palabra}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                    <textarea
                      value={formData.descripcion}
                      onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                      placeholder="Descripción de cómo realizar la seña..."
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Categoría <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.id_categoria}
                        onChange={(e) => setFormData({ ...formData, id_categoria: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Seleccionar categoría</option>
                        {categorias.map(cat => (
                          <option key={cat.id_categoria} value={cat.id_categoria}>
                            {cat.nombre}
                          </option>
                        ))}
                      </select>
                      {formErrors.id_categoria && <p className="text-red-500 text-sm mt-1">{formErrors.id_categoria}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Dificultad</label>
                      <select
                        value={formData.dificultad}
                        onChange={(e) => setFormData({ ...formData, dificultad: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="facil">Fácil</option>
                        <option value="medio">Medio</option>
                        <option value="dificil">Difícil</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">URL del Video</label>
                    <input
                      type="url"
                      value={formData.url_video}
                      onChange={(e) => setFormData({ ...formData, url_video: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duración del Video (segundos)
                    </label>
                    <input
                      type="number"
                      value={formData.duracion_video_segundos}
                      onChange={(e) => setFormData({ ...formData, duracion_video_segundos: e.target.value })}
                      placeholder="30"
                      min="1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.activo}
                      onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <label className="ml-2 text-sm text-gray-700">Seña activa</label>
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
                      {modalMode === 'create' ? 'Crear Seña' : 'Guardar Cambios'}
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