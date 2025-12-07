// ============================================
// ARCHIVO: src/pages/diccionario/DiccionarioPage.jsx
// Ubicación: frontend/src/pages/diccionario/DiccionarioPage.jsx
// ============================================
import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Eye, TrendingUp, Award } from 'lucide-react'
import { toast } from 'sonner'
import { diccionarioAPI } from '../../api'
import Table from '../../components/common/Table'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'
import Select from '../../components/common/Select'
import Badge from '../../components/common/Badge'
import SearchBar from '../../components/common/SearchBar'

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
    url_imagen: '',
    url_animacion: '',
    duracion_video_segundos: '',
    dificultad: 'medio',
    etiquetas: [],
    activo: true
  })
  const [formErrors, setFormErrors] = useState({})
  const [etiquetaInput, setEtiquetaInput] = useState('')

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
      setSenas(response.data.results || response.data)
    } catch (error) {
      console.error('Error al cargar señas:', error)
      toast.error('Error al cargar señas')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategorias = async () => {
    try {
      const response = await diccionarioAPI.categorias.getAll()
      // Asegurarse de que sea un array
      const data = response.data
      setCategorias(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error al cargar categorías:', error)
      setCategorias([]) // Asegurar que sea array vacío en caso de error
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
      url_imagen: '',
      url_animacion: '',
      duracion_video_segundos: '',
      dificultad: 'medio',
      etiquetas: [],
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
      url_imagen: sena.url_imagen || '',
      url_animacion: sena.url_animacion || '',
      duracion_video_segundos: sena.duracion_video_segundos || '',
      dificultad: sena.dificultad,
      etiquetas: sena.etiquetas || [],
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
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      const dataToSend = { ...formData }
      
      // Convertir categoria a número si existe
      if (dataToSend.id_categoria) {
        dataToSend.id_categoria = parseInt(dataToSend.id_categoria)
      } else {
        dataToSend.id_categoria = null
      }
      
      if (modalMode === 'create') {
        await diccionarioAPI.señas.create(dataToSend)
        toast.success('Seña creada exitosamente')
      } else if (modalMode === 'edit') {
        await diccionarioAPI.señas.update(selectedSena.id_seña, dataToSend)
        toast.success('Seña actualizada exitosamente')
      }
      
      setIsModalOpen(false)
      setTimeout(() => {
        fetchSenas()
      }, 500)
    } catch (error) {
      console.error('Error al guardar seña:', error)
      toast.error('Error al guardar seña')
    }
  }

  const handleDelete = async (sena) => {
    if (!window.confirm(`¿Estás seguro de eliminar la seña "${sena.palabra}"?`)) {
      return
    }

    try {
      await diccionarioAPI.señas.delete(sena.id_seña)
      toast.success('Seña eliminada exitosamente')
      setTimeout(() => {
        fetchSenas()
      }, 500)
    } catch (error) {
      console.error('Error al eliminar seña:', error)
      toast.error('Error al eliminar seña')
    }
  }

  const addEtiqueta = () => {
    if (etiquetaInput.trim() && !formData.etiquetas.includes(etiquetaInput.trim())) {
      setFormData({
        ...formData,
        etiquetas: [...formData.etiquetas, etiquetaInput.trim()]
      })
      setEtiquetaInput('')
    }
  }

  const removeEtiqueta = (etiqueta) => {
    setFormData({
      ...formData,
      etiquetas: formData.etiquetas.filter(e => e !== etiqueta)
    })
  }

  // Filtrar señas por búsqueda
  const filteredSenas = senas.filter(sena => 
    sena.palabra.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (sena.descripcion && sena.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const getCategoriaName = (id_categoria) => {
    const cat = categorias.find(c => c.id_categoria === id_categoria)
    return cat ? cat.nombre : 'Sin categoría'
  }

  const columns = [
    {
      header: 'ID',
      accessor: 'id_seña',
      render: (row) => <span className="text-gray-500">#{row.id_seña}</span>
    },
    {
      header: 'Palabra',
      accessor: 'palabra',
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900">{row.palabra}</p>
          <p className="text-sm text-gray-500">{row.descripcion || 'Sin descripción'}</p>
        </div>
      )
    },
    {
      header: 'Categoría',
      accessor: 'id_categoria',
      render: (row) => (
        <Badge variant="info">
          {getCategoriaName(row.id_categoria)}
        </Badge>
      )
    },
    {
      header: 'Dificultad',
      accessor: 'dificultad',
      render: (row) => {
        const variants = {
          facil: 'success',
          medio: 'warning',
          dificil: 'danger'
        }
        return (
          <Badge variant={variants[row.dificultad]}>
            {row.dificultad}
          </Badge>
        )
      }
    },
    {
      header: 'Practicada',
      accessor: 'veces_practicada',
      render: (row) => (
        <div className="flex items-center space-x-1 text-sm text-gray-600">
          <TrendingUp className="w-4 h-4" />
          <span>{row.veces_practicada} veces</span>
        </div>
      )
    },
    {
      header: 'Acciones',
      render: (row) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleView(row)
            }}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleEdit(row)
            }}
            className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleDelete(row)
            }}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Diccionario de Señas</h1>
          <p className="text-gray-600 mt-1">
            Gestiona el catálogo completo de señas
          </p>
        </div>
        <Button icon={Plus} onClick={handleCreate}>
          Nueva Seña
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar señas..."
          />
          <Select
            value={filterCategoria}
            onChange={setFilterCategoria}
            placeholder="Todas las categorías"
            options={(categorias || []).map(cat => ({
              value: cat.id_categoria,
              label: cat.nombre
            }))}
          />
          <Select
            value={filterDificultad}
            onChange={setFilterDificultad}
            placeholder="Todas las dificultades"
            options={[
              { value: 'facil', label: 'Fácil' },
              { value: 'medio', label: 'Medio' },
              { value: 'dificil', label: 'Difícil' }
            ]}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Total Señas</p>
          <p className="text-2xl font-bold text-gray-900">{senas.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Fácil</p>
          <p className="text-2xl font-bold text-green-600">
            {senas.filter(s => s.dificultad === 'facil').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Medio</p>
          <p className="text-2xl font-bold text-yellow-600">
            {senas.filter(s => s.dificultad === 'medio').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Difícil</p>
          <p className="text-2xl font-bold text-red-600">
            {senas.filter(s => s.dificultad === 'dificil').length}
          </p>
        </div>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={filteredSenas}
        loading={loading}
        onRowClick={handleView}
      />

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          modalMode === 'create' ? 'Nueva Seña' :
          modalMode === 'edit' ? 'Editar Seña' :
          'Detalles de la Seña'
        }
        size="lg"
        footer={
          modalMode !== 'view' && (
            <>
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit}>
                {modalMode === 'create' ? 'Crear Seña' : 'Guardar Cambios'}
              </Button>
            </>
          )
        }
      >
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
                <Badge variant="info">{getCategoriaName(selectedSena.id_categoria)}</Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Dificultad</p>
                <Badge>{selectedSena.dificultad}</Badge>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">Estadísticas</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600">Practicada</p>
                  <p className="text-lg font-bold text-gray-900">{selectedSena.veces_practicada} veces</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600">Popularidad</p>
                  <p className="text-lg font-bold text-gray-900">{selectedSena.popularidad}</p>
                </div>
              </div>
            </div>
            {selectedSena.etiquetas && selectedSena.etiquetas.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Etiquetas</p>
                <div className="flex flex-wrap gap-2">
                  {selectedSena.etiquetas.map((tag, idx) => (
                    <Badge key={idx} variant="default">{tag}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <Input
              label="Palabra / Seña"
              value={formData.palabra}
              onChange={(val) => setFormData({ ...formData, palabra: val })}
              placeholder="Hola, Gracias, Buenos días..."
              error={formErrors.palabra}
              required
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                placeholder="Descripción de cómo realizar la seña..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Categoría"
                value={formData.id_categoria}
                onChange={(val) => setFormData({ ...formData, id_categoria: val })}
                options={(categorias || []).map(cat => ({
                  value: cat.id_categoria,
                  label: cat.nombre
                }))}
                placeholder="Seleccionar categoría"
              />
              
              <Select
                label="Dificultad"
                value={formData.dificultad}
                onChange={(val) => setFormData({ ...formData, dificultad: val })}
                options={[
                  { value: 'facil', label: 'Fácil' },
                  { value: 'medio', label: 'Medio' },
                  { value: 'dificil', label: 'Difícil' }
                ]}
                required
              />
            </div>
            
            <Input
              label="URL Video"
              value={formData.url_video}
              onChange={(val) => setFormData({ ...formData, url_video: val })}
              placeholder="https://..."
            />
            
            <Input
              label="URL Imagen"
              value={formData.url_imagen}
              onChange={(val) => setFormData({ ...formData, url_imagen: val })}
              placeholder="https://..."
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Etiquetas
              </label>
              <div className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={etiquetaInput}
                  onChange={(e) => setEtiquetaInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addEtiqueta()
                    }
                  }}
                  placeholder="Agregar etiqueta..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button type="button" onClick={addEtiqueta} size="sm">
                  Agregar
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.etiquetas.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeEtiqueta(tag)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.activo}
                onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label className="text-sm font-medium text-gray-700">
                Seña activa
              </label>
            </div>
          </form>
        )}
      </Modal>
    </div>
  )
}