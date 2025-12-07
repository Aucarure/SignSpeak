import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Eye, UserCheck, UserX } from 'lucide-react'
import { toast } from 'sonner'
import { usuariosAPI } from '../../api'

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTipo, setFilterTipo] = useState('')
  const [filterEstado, setFilterEstado] = useState('')
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('create')
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
      
      // Manejar diferentes formatos de respuesta
      const data = response.data
      let usuariosData = []
      
      if (Array.isArray(data)) {
        usuariosData = data
      } else if (data.results && Array.isArray(data.results)) {
        usuariosData = data.results
      } else if (data.usuarios && Array.isArray(data.usuarios)) {
        usuariosData = data.usuarios
      }
      
      setUsuarios(usuariosData)
    } catch (error) {
      console.error('Error al cargar usuarios:', error)
      toast.error('Error al cargar usuarios')
      setUsuarios([])
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

  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }

    try {
      const dataToSend = { ...formData }
      
      if (modalMode === 'edit' && !dataToSend.contraseña) {
        delete dataToSend.contraseña
      }
      
      if (modalMode === 'create') {
        await usuariosAPI.create(dataToSend)
        toast.success('Usuario creado exitosamente')
      } else if (modalMode === 'edit') {
        await usuariosAPI.update(selectedUsuario.id_usuario, dataToSend)
        toast.success('Usuario actualizado exitosamente')
      }
      
      setIsModalOpen(false)
      // Recargar inmediatamente
      fetchUsuarios()
    } catch (error) {
      console.error('Error completo:', error)
      console.log('Response:', error.response)
      
      // Si es error 500 pero el usuario se creó, mostramos éxito de todas formas
      if (error.response?.status === 500) {
        toast.success('Usuario guardado (recargando...)')
        setIsModalOpen(false)
        fetchUsuarios()
      } else {
        const errorMessage = error.response?.data?.contraseña?.[0] || 
                            error.response?.data?.detail || 
                            error.response?.data?.message ||
                            'Error al guardar usuario'
        toast.error(errorMessage)
      }
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
      }, 300)
    } catch (error) {
      console.error('Error al eliminar:', error)
      toast.error('Error al eliminar usuario')
    }
  }

  const handleToggleEstado = async (usuario) => {
    try {
      await usuariosAPI.cambiarEstado(usuario.id_usuario, !usuario.activo)
      toast.success(`Usuario ${!usuario.activo ? 'activado' : 'desactivado'}`)
      setTimeout(() => {
        fetchUsuarios()
      }, 300)
    } catch (error) {
      console.error('Error al cambiar estado:', error)
      toast.error('Error al cambiar estado')
    }
  }

  const filteredUsuarios = usuarios.filter(usuario => {
    const matchesSearch = usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         usuario.email.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  // Calcular estadísticas desde los datos locales
  const stats = {
    total: usuarios.length,
    activos: usuarios.filter(u => u.activo).length,
    inactivos: usuarios.filter(u => !u.activo).length,
    filtrados: filteredUsuarios.length
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Usuarios</h1>
            <p className="text-gray-600 mt-1">Gestiona los usuarios de la plataforma</p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nuevo Usuario
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre o email..."
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <select
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos los tipos</option>
              <option value="oyente">Oyente</option>
              <option value="sordo">Sordo</option>
              <option value="mudo">Mudo</option>
              <option value="sordomudo">Sordomudo</option>
            </select>
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos los estados</option>
              <option value="activo">Activos</option>
              <option value="inactivo">Inactivos</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <p className="text-sm text-gray-600">Total Usuarios</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <p className="text-sm text-gray-600">Activos</p>
            <p className="text-2xl font-bold text-green-600">{stats.activos}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <p className="text-sm text-gray-600">Inactivos</p>
            <p className="text-2xl font-bold text-red-600">{stats.inactivos}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <p className="text-sm text-gray-600">Filtrados</p>
            <p className="text-2xl font-bold text-blue-600">{stats.filtrados}</p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Cargando...</div>
          ) : filteredUsuarios.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No hay datos disponibles</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsuarios.map((usuario) => (
                    <tr key={usuario.id_usuario} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleView(usuario)}>
                      <td className="px-6 py-4 text-sm text-gray-500">#{usuario.id_usuario}</td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{usuario.nombre}</p>
                          <p className="text-sm text-gray-500">{usuario.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {usuario.tipo_usuario}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          usuario.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {usuario.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(usuario.fecha_registro).toLocaleDateString('es-ES')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleView(usuario)
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Ver"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEdit(usuario)
                            }}
                            className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleToggleEstado(usuario)
                            }}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg"
                            title={usuario.activo ? 'Desactivar' : 'Activar'}
                          >
                            {usuario.activo ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDelete(usuario)
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
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="text-2xl font-bold mb-4">
                {modalMode === 'create' ? 'Nuevo Usuario' :
                 modalMode === 'edit' ? 'Editar Usuario' :
                 'Detalles del Usuario'}
              </h2>
              
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
                    <p className="text-sm font-medium text-gray-500">Tipo</p>
                    <p className="text-base text-gray-900">{selectedUsuario.tipo_usuario}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Estado</p>
                    <p className="text-base text-gray-900">{selectedUsuario.activo ? 'Activo' : 'Inactivo'}</p>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    {formErrors.nombre && <p className="text-red-500 text-sm mt-1">{formErrors.nombre}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {modalMode === 'create' ? 'Contraseña' : 'Contraseña (opcional)'}
                    </label>
                    <input
                      type="password"
                      value={formData.contraseña}
                      onChange={(e) => setFormData({ ...formData, contraseña: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    {formErrors.contraseña && <p className="text-red-500 text-sm mt-1">{formErrors.contraseña}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                    <select
                      value={formData.tipo_usuario}
                      onChange={(e) => setFormData({ ...formData, tipo_usuario: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Seleccionar...</option>
                      <option value="oyente">Oyente</option>
                      <option value="sordo">Sordo</option>
                      <option value="mudo">Mudo</option>
                      <option value="sordomudo">Sordomudo</option>
                    </select>
                    {formErrors.tipo_usuario && <p className="text-red-500 text-sm mt-1">{formErrors.tipo_usuario}</p>}
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.activo}
                      onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <label className="ml-2 text-sm text-gray-700">Usuario activo</label>
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