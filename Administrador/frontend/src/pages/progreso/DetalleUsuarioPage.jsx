import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  useProgresoUsuario, 
  useDetecciones, 
  useErrores 
} from '../../hooks/useProgreso';
import { usuariosAPI } from '../../api/usuarios';
import {
  ArrowLeft,
  TrendingUp,
  Clock,
  Target,
  Award,
  AlertCircle,
  CheckCircle,
  XCircle,
  Activity
} from 'lucide-react';

const DetalleUsuarioPage = () => {
  const { usuarioId } = useParams();
  const [usuario, setUsuario] = useState(null);
  
  const { 
    progreso, 
    estadisticas, 
    loading: loadingProgreso 
  } = useProgresoUsuario(usuarioId);
  
  const { 
    estadisticas: statsDetecciones, 
    loading: loadingDetecciones 
  } = useDetecciones(usuarioId);
  
  const { 
    erroresFrecuentes, 
    loading: loadingErrores 
  } = useErrores(usuarioId);

  useEffect(() => {
    fetchUsuario();
  }, [usuarioId]);

  const fetchUsuario = async () => {
  try {
    const data = await usuariosAPI.getById(usuarioId);
    setUsuario(data.data);
  } catch (error) {
    console.error('Error al cargar usuario:', error);
  }
};

  const getNivelColor = (nivel) => {
    const colors = {
      novato: 'bg-gray-100 text-gray-800',
      intermedio: 'bg-blue-100 text-blue-800',
      avanzado: 'bg-purple-100 text-purple-800',
      experto: 'bg-yellow-100 text-yellow-800',
    };
    return colors[nivel] || colors.novato;
  };

  if (loadingProgreso) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/progreso"
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Progreso de {usuario?.nombre || `Usuario #${usuarioId}`}
          </h1>
          <p className="text-gray-600 mt-1">
            Análisis detallado del desempeño
          </p>
        </div>
      </div>

      {/* Estadísticas Principales */}
      {estadisticas && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Señas Practicadas</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {estadisticas.total_señas_practicadas}
                </p>
              </div>
              <div className="bg-blue-500 p-3 rounded-lg">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Promedio Aciertos</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {estadisticas.porcentaje_aciertos_promedio.toFixed(1)}%
                </p>
              </div>
              <div className="bg-green-500 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tiempo Total</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {estadisticas.tiempo_total_horas.toFixed(1)}h
                </p>
              </div>
              <div className="bg-purple-500 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Nivel Experto</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {estadisticas.por_nivel_dominio?.experto || 0}
                </p>
              </div>
              <div className="bg-yellow-500 p-3 rounded-lg">
                <Award className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Distribución por Nivel */}
      {estadisticas?.por_nivel_dominio && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Distribución por Nivel de Dominio
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(estadisticas.por_nivel_dominio).map(([nivel, cantidad]) => (
              <div key={nivel} className="text-center p-4 bg-gray-50 rounded-lg">
                <p className={`text-xs font-medium mb-2 px-2 py-1 rounded-full inline-block ${getNivelColor(nivel)}`}>
                  {nivel}
                </p>
                <p className="text-2xl font-bold text-gray-900">{cantidad}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mejores Señas y Señas a Mejorar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mejores Señas */}
        {estadisticas?.mejores_señas && estadisticas.mejores_señas.length > 0 && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Mejores Señas
              </h2>
            </div>
            <div className="p-6 space-y-3">
              {estadisticas.mejores_señas.map((item) => (
                <div key={item.id_progreso} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{item.seña_palabra}</p>
                    <p className="text-sm text-gray-600">
                      {item.veces_practicada} prácticas
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">
                      {parseFloat(item.porcentaje_aciertos).toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-500">
                      Racha: {item.racha_actual}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Señas a Mejorar */}
        {estadisticas?.señas_a_mejorar && estadisticas.señas_a_mejorar.length > 0 && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-500" />
                Señas a Mejorar
              </h2>
            </div>
            <div className="p-6 space-y-3">
              {estadisticas.señas_a_mejorar.map((item) => (
                <div key={item.id_progreso} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{item.seña_palabra}</p>
                    <p className="text-sm text-gray-600">
                      {item.veces_practicada} prácticas
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-orange-600">
                      {parseFloat(item.porcentaje_aciertos).toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.veces_incorrecta} errores
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Estadísticas de Detecciones */}
      {statsDetecciones && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" />
            Estadísticas de Detecciones
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Total Detecciones</p>
              <p className="text-3xl font-bold text-blue-600">
                {statsDetecciones.total_detecciones}
              </p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Confianza Promedio</p>
              <p className="text-3xl font-bold text-green-600">
                {statsDetecciones.confianza_promedio.toFixed(1)}%
              </p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Contextos</p>
              <p className="text-3xl font-bold text-purple-600">
                {Object.keys(statsDetecciones.por_contexto || {}).length}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Errores Frecuentes */}
      {erroresFrecuentes && erroresFrecuentes.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-500" />
              Errores Más Frecuentes
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {erroresFrecuentes.map((error, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">
                      Seña ID: {error.id_seña_esperada}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-red-600">
                      {error.cantidad} errores
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Progreso Detallado */}
      {progreso && progreso.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Progreso Detallado por Seña
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Seña
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Prácticas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Aciertos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Nivel
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Racha
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {progreso.map((item) => (
                  <tr key={item.id_progreso} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{item.seña_palabra}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{item.veces_practicada}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">
                        {parseFloat(item.porcentaje_aciertos).toFixed(1)}%
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getNivelColor(item.nivel_dominio)}`}>
                        {item.nivel_dominio}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">
                        {item.racha_actual} / {item.mejor_racha}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetalleUsuarioPage;