"""
Script para limpiar migraciones de Django sin usar psql
"""
import psycopg2
import os

# Configuración de la base de datos desde .env
from decouple import config

DB_CONFIG = {
    'dbname': config('DB_NAME', default='signspeak_db'),
    'user': config('DB_USER', default='postgres'),
    'password': config('DB_PASSWORD'),  # Lee del archivo .env
    'host': config('DB_HOST', default='localhost'),
    'port': config('DB_PORT', default='5432')
}

def limpiar_migraciones():
    try:
        print("🔌 Conectando a la base de datos...")
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        # Verificar si existe la tabla
        cursor.execute("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'django_migrations'
            );
        """)
        existe = cursor.fetchone()[0]
        
        if existe:
            print("🗑️  Eliminando migraciones...")
            cursor.execute("DELETE FROM django_migrations;")
            conn.commit()
            print("✅ Migraciones eliminadas correctamente")
        else:
            print("ℹ️  La tabla django_migrations no existe aún")
        
        cursor.close()
        conn.close()
        
        # Eliminar archivos de migración locales
        migrations_dir = 'authentication/migrations'
        print(f"\n🗑️  Limpiando archivos en {migrations_dir}...")
        
        if os.path.exists(migrations_dir):
            for file in os.listdir(migrations_dir):
                if file.endswith('.py') and file != '__init__.py':
                    file_path = os.path.join(migrations_dir, file)
                    os.remove(file_path)
                    print(f"   ❌ Eliminado: {file}")
        
        print("\n✅ ¡Listo! Ahora ejecuta estos comandos:")
        print("=" * 50)
        print("python manage.py makemigrations")
        print("python manage.py migrate")
        print("python manage.py createsuperuser")
        print("=" * 50)
        
    except psycopg2.OperationalError as e:
        print(f"\n❌ Error de conexión: {e}")
        print("\n💡 Verifica:")
        print("   1. PostgreSQL está corriendo")
        print("   2. La contraseña es correcta")
        print("   3. La base de datos 'signspeak_db' existe")
    except Exception as e:
        print(f"\n❌ Error: {e}")

if __name__ == '__main__':
    print("⚠️  ADVERTENCIA: Esto eliminará todas las migraciones")
    print(f"Base de datos: {DB_CONFIG['dbname']}")
    respuesta = input("\n¿Continuar? (si/no): ").lower()
    
    if respuesta in ['si', 's', 'yes', 'y']:
        limpiar_migraciones()
    else:
        print("❌ Operación cancelada")