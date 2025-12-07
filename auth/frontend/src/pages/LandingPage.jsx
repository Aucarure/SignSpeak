import { Link } from 'react-router-dom';
import { MessageCircle, BookOpen, Users, Sparkles } from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-cyan-500">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-8 h-8 text-white" />
          <h1 className="text-2xl font-bold text-white">SignSpeak</h1>
        </div>
        <div className="flex gap-4">
          <Link
            to="/login"
            className="px-6 py-2 text-white hover:bg-white/10 rounded-lg transition"
          >
            Iniciar Sesión
          </Link>
          <Link
            to="/register"
            className="px-6 py-2 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-100 transition"
          >
            Registrarse
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Aprende sin barreras,
            <br />
            comunícate sin límites
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
            Una plataforma diseñada para conectar a personas oyentes y personas
            sordas o mudas a través del lenguaje de señas.
          </p>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl">
              <MessageCircle className="w-12 h-12 text-white mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                Comunicación Inclusiva
              </h3>
              <p className="text-white/80">
                Conecta con personas sordas o mudas usando lenguaje de señas
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl">
              <BookOpen className="w-12 h-12 text-white mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                Aprende Jugando
              </h3>
              <p className="text-white/80">
                Ejercicios interactivos y tutoriales para dominar las señas
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl">
              <Users className="w-12 h-12 text-white mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                Comunidad Activa
              </h3>
              <p className="text-white/80">
                Únete a una comunidad comprometida con la inclusión
              </p>
            </div>
          </div>

          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 font-bold text-lg rounded-lg hover:bg-gray-100 transition transform hover:scale-105"
          >
            <Sparkles className="w-5 h-5" />
            Comenzar Ahora
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 p-6 text-center text-white/70">
        <p>© 2025 SignSpeak. Rompiendo barreras de comunicación.</p>
      </footer>
    </div>
  );
};