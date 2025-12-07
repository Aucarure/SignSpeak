import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Eye, UserCheck, UserX } from 'lucide-react'
import { toast } from 'sonner'
import { usuariosAPI } from '../../api'
import Table from '../../components/common/Table'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'
import Select from '../../components/common/Select'
import Badge from '../../components/common/Badge'
import SearchBar from '../../components/common/SearchBar'

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTipo, setFilterTipo] = useState('')
  const [filterEstado, setFilterEstado] = useState('')
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('create') // 'create' | 'edit' | 'view'
  const [selectedUsuario, setSelectedUsuario] = useState(null)
  
  // Form states
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    contraseña: '',
    tipo_usuario: '',
    activo: true
  })
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    fetchUsuarios()
  }, [filterTipo, filterEstado])

  const fetchUsuarios = async () => {
  try {
    setLoading(true)
    const params = {}
    if (filterTipo) params.tipo_usuario = filterTipo
    if (filterEstado) params.activo = filterEstado === 'activo'
    
    const response = await usuariosAPI.getAll(params)
    
    // ⬇️ CAMBIO AQUÍ: Manejar diferentes formatos de respuesta
    const data = response.data
    let usuariosData = []
    
    if (Array.isArray(data)) {
      // Si es un array directo
      usuariosData = data
    } else if (data.results && Array.isArray(data.results)) {
      // Si tiene paginación
      usuariosData = data.results
    } else if (data.usuarios && Array.isArray(data.usuarios)) {
      // Si viene en un objeto usuarios
      usuariosData = data.usuarios
    }
    
    setUsuarios(usuariosData)
  } catch (error) {
    console.error('Error al cargar usuarios:', error)
    toast.error('Error al cargar usuarios')
    setUsuarios([]) // ⬅️ Importante: inicializar como array vacío
  } finally {
    setLoading(false)
  }
}

  const handleCreate = () => {
    setModalMode('create')
    setSelectedUsuario(null)
    setFormData({
      nombre: '',
      email: '',
      contraseña: '',
      tipo_usuario: '',
      activo: true
    })
    setFormErrors({})
    setIsModalOpen(true)
  }

  const handleEdit = (usuario) => {
    setModalMode('edit')
    setSelectedUsuario(usuario)
    setFormData({
      nombre: usuario.nombre,
      email: usuario.email,
      contraseña: '',
      tipo_usuario: usuario.tipo_usuario,
      activo: usuario.activo
    })
    setFormErrors({})
    setIsModalOpen(true)
  }

  const handleView = (usuario) => {
    setModalMode('view')
    setSelectedUsuario(usuario)
    setIsModalOpen(true)
  }

  const validateForm = () => {
    const errors = {}
    
    if (!formData.nombre.trim()) {
      errors.nombre = 'El nombre es requerido'
    }
    
    if (!formData.email.trim()) {
      errors.email = 'El email es requerido'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email inválido'
    }
    
    if (modalMode === 'create' && !formData.contraseña) {
      errors.contraseña = 'La contraseña es requerida'
    }
    
    if (!formData.tipo_usuario) {
      errors.tipo_usuario = 'El tipo de usuario es requerido'
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
      
      // Si no hay contraseña en edición, no enviarla
      if (modalMode === 'edit' && !dataToSend.contraseña) {
        delete dataToSend.contraseña
      }
      
      if (modalMode === 'create') {
        const response = await usuariosAPI.create(dataToSend)
        console.log('Usuario creado:', response.data)
        toast.success('Usuario creado exitosamente')
      } else if (modalMode === 'edit') {
        const response = await usuariosAPI.update(selectedUsuario.id_usuario, dataToSend)
        console.log('Usuario actualizado:', response.data)
        toast.success('Usuario actualizado exitosamente')
      }
      
      setIsModalOpen(false)
      // Esperar un poco antes de recargar para dar tiempo a la BD
      setTimeout(() => {
        fetchUsuarios()
      }, 500)
    } catch (error) {
      console.error('Error completo:', error)
      console.error('Response data:', error.response?.data)
      
      const errorMessage = error.response?.data?.contraseña?.[0] || 
                          error.response?.data?.detail || 
                          error.response?.data?.message ||
                          'Error al guardar usuario'
      
      toast.error(errorMessage)
    }
  }

  const handleDelete = async (usuario) => {
    if (!window.confirm(`¿Estás seguro de eliminar a ${usuario.nombre}?`)) {
      return
    }

    try {
      await usuariosAPI.eliminarLogico(usuario.id_usuario)
      toast.success('Usuario eliminado exitosamente')
      setTimeout(() => {
        fetchUsuarios()
      }, 500)
    } catch (error) {
      console.error('Error al eliminar usuario:', error)
      toast.error('Error al eliminar usuario')
    }
  }

  const handleToggleEstado = async (usuario) => {
    try {
      await usuariosAPI.cambiarEstado(usuario.id_usuario, !usuario.activo)
      toast.success(`Usuario ${!usuario.activo ? 'activado' : 'desactivado'} exitosamente`)
      setTimeout(() => {
        fetchUsuarios()
      }, 500)
    } catch (error) {
      console.error('Error al cambiar estado:', error)
      toast.error('Error al cambiar estado del usuario')
    }
  }

  // Filtrar usuarios por búsqueda
  const filteredUsuarios = usuarios.filter(usuario => {
    const matchesSearch = usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         usuario.email.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const columns = [
    {
      header: 'ID',
      accessor: 'id_usuario',
      render: (row) => <span className="text-gray-500">#{row.id_usuario}</span>
    },
    {
      header: 'Nombre',
      accessor: 'nombre',
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900">{row.nombre}</p>
          <p className="text-sm text-gray-500">{row.email}</p>
        </div>
      )
    },
    {
      header: 'Tipo',
      accessor: 'tipo_usuario',
      render: (row) => {
        const variants = {
          oyente: 'info',
          sordo: 'warning',
          mudo: 'purple',
          sordomudo: 'danger'
        }
        return (
          <Badge variant={variants[row.tipo_usuario] || 'default'}>
            {row.tipo_usuario}
          </Badge>
        )
      }
    },
    {
      header: 'Estado',
      accessor: 'activo',
      render: (row) => (
        <Badge variant={row.activo ? 'success' : 'danger'}>
          {row.activo ? 'Activo' : 'Inactivo'}
        </Badge>
      )
    },
    {
      header: 'Fecha Registro',
      accessor: 'fecha_registro',
      render: (row) => new Date(row.fecha_registro).toLocaleDateString('es-ES')
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
            title="Ver detalles"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleEdit(row)
            }}
            className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
            title="Editar"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleToggleEstado(row)
            }}
            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
            title={row.activo ? 'Desactivar' : 'Activar'}
          >
            {row.activo ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleDelete(row)
            }}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Eliminar"
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
          <h1 className="text-3xl font-bold text-gray-900">Usuarios</h1>
          <p className="text-gray-600 mt-1">
            Gestiona los usuarios de la plataforma
          </p>
        </div>
        <Button icon={Plus} onClick={handleCreate}>
          Nuevo Usuario
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar por nombre o email..."
          />
          <Select
            value={filterTipo}
            onChange={setFilterTipo}
            placeholder="Todos los tipos"
            options={[
              { value: 'oyente', label: 'Oyente' },
              { value: 'sordo', label: 'Sordo' },
              { value: 'mudo', label: 'Mudo' },
              { value: 'sordomudo', label: 'Sordomudo' }
            ]}
          />
          <Select
            value={filterEstado}
            onChange={setFilterEstado}
            placeholder="Todos los estados"
            options={[
              { value: 'activo', label: 'Activos' },
              { value: 'inactivo', label: 'Inactivos' }
            ]}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Total Usuarios</p>
          <p className="text-2xl font-bold text-gray-900">{usuarios.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Activos</p>
          <p className="text-2xl font-bold text-green-600">
            {usuarios.filter(u => u.activo).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Inactivos</p>
          <p className="text-2xl font-bold text-red-600">
            {usuarios.filter(u => !u.activo).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Filtrados</p>
          <p className="text-2xl font-bold text-blue-600">{filteredUsuarios.length}</p>
        </div>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={filteredUsuarios}
        loading={loading}
        onRowClick={handleView}
      />

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          modalMode === 'create' ? 'Nuevo Usuario' :
          modalMode === 'edit' ? 'Editar Usuario' :
          'Detalles del Usuario'
        }
        size="md"
        footer={
          modalMode !== 'view' && (
            <>
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit}>
                {modalMode === 'create' ? 'Crear Usuario' : 'Guardar Cambios'}
              </Button>
            </>
          )
        }
      >
        {modalMode === 'view' && selectedUsuario ? (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Nombre</p>
              <p className="text-base text-gray-900">{selectedUsuario.nombre}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-base text-gray-900">{selectedUsuario.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Tipo de Usuario</p>
              <Badge variant="info">{selectedUsuario.tipo_usuario}</Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Estado</p>
              <Badge variant={selectedUsuario.activo ? 'success' : 'danger'}>
                {selectedUsuario.activo ? 'Activo' : 'Inactivo'}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Fecha de Registro</p>
              <p className="text-base text-gray-900">
                {new Date(selectedUsuario.fecha_registro).toLocaleString('es-ES')}
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nombre"
              value={formData.nombre}
              onChange={(val) => setFormData({ ...formData, nombre: val })}
              placeholder="Juan Pérez"
              error={formErrors.nombre}
              required
            />
            
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(val) => setFormData({ ...formData, email: val })}
              placeholder="juan@example.com"
              error={formErrors.email}
              required
            />
            
            <Input
              label={modalMode === 'create' ? 'Contraseña' : 'Contraseña (dejar vacío para no cambiar)'}
              type="password"
              value={formData.contraseña}
              onChange={(val) => setFormData({ ...formData, contraseña: val })}
              placeholder="••••••••"
              error={formErrors.contraseña}
              required={modalMode === 'create'}
            />
            
            <Select
              label="Tipo de Usuario"
              value={formData.tipo_usuario}
              onChange={(val) => setFormData({ ...formData, tipo_usuario: val })}
              options={[
                { value: 'oyente', label: 'Oyente' },
                { value: 'sordo', label: 'Sordo' },
                { value: 'mudo', label: 'Mudo' },
                { value: 'sordomudo', label: 'Sordomudo' }
              ]}
              error={formErrors.tipo_usuario}
              required
            />
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.activo}
                onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label className="text-sm font-medium text-gray-700">
                Usuario activo
              </label>
            </div>
          </form>
        )}
      </Modal>
    </div>
  )
}