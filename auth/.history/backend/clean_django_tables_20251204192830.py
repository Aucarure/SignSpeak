"""
Script para eliminar SOLO las tablas de Django, manteniendo las de SignSpeak
"""
import psycopg2
from decouple import config

DB_CONFIG = {
    'dbname': config('DB_NAME', default='signspeak_db'),
    'user': config('DB_USER', default='postgres'),
    'password': config('DB_PASSWORD'),
    'host': config('DB_HOST', default='localhost'),
    'port': config('DB_PORT', default='5432')
}

# Tablas de Django que vamos a eliminar
DJANGO_TABLES = [
    'django_migrations',
    'django_content_type',
    'django_session',
    'auth_permission',
    'auth_group',
    'auth_group_permissions',
    'auth_user',
    'auth_user_groups',
    'auth_user_user_permissions',
    'django_admin_log',
]

def clean_django_tables():
    try:
        print("="*60)
        print("🗑️  LIMPIANDO TABLAS DE DJANGO")
        print("="*60)
        
        conn = psycopg2.connect(**DB_CONFIG)
        conn.autocommit = True
        cursor = conn.cursor()
        
        # Listar todas las tablas actuales
        print("\n📊 Tablas actuales en la base de datos:")
        cursor.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name;
        """)
        all_tables = cursor.fetchall()
        for table in all_tables:
            print(f"   - {table[0]}")
        
        print("\n🗑️  Eliminando tablas de Django...")
        
        # Eliminar tablas de Django con CASCADE
        for table in DJANGO_TABLES:
            try:
                cursor.execute(f"""
                    DROP TABLE IF EXISTS {table} CASCADE;
                """)
                print(f"   ✅ Eliminada: {table}")
            except Exception as e:
                print(f"   ⚠️  No se pudo eliminar {table}: {e}")
        
        # Verificar tablas restantes
        print("\n📊 Tablas restantes (de SignSpeak):")
        cursor.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name;
        """)
        remaining_tables = cursor.fetchall()
        for table in remaining_tables:
            print(f"   - {table[0]}")
        
        cursor.close()
        conn.close()
        
        print("\n" + "="*60)
        print("✅ ¡Limpieza completada!")
        print("="*60)
        print("\nAhora ejecuta:")
        print("1. python manage.py makemigrations")
        print("2. python manage.py migrate")
        print("3. python manage.py createsuperuser")
        print("4. python manage.py runserver")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == '__main__':
    print("⚠️  ADVERTENCIA: Esto eliminará las tablas de Django")
    print("Las tablas de SignSpeak (usuarios, diccionario_señas, etc.) NO se tocarán")
    respuesta = input("\n¿Continuar? (si/no): ").lower()
    
    if respuesta in ['si', 's', 'yes', 'y']:
        clean_django_tables()
    else:
        print("❌ Operación cancelada")