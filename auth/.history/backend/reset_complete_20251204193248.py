"""
Script para resetear COMPLETAMENTE las tablas de Django
Mantiene SOLO las tablas de SignSpeak
"""
import psycopg2
from decouple import config
import os

DB_CONFIG = {
    'dbname': config('DB_NAME', default='signspeak_db'),
    'user': config('DB_USER', default='postgres'),
    'password': config('DB_PASSWORD'),
    'host': config('DB_HOST', default='localhost'),
    'port': config('DB_PORT', default='5432')
}

# Lista completa de tablas de Django a eliminar
DJANGO_TABLES = [
    'django_migrations',
    'django_content_type',
    'django_session',
    'auth_permission',
    'auth_group',
    'auth_group_permissions',
    'django_admin_log',
]

def reset_complete():
    try:
        print("="*70)
        print("🔧 RESETEO COMPLETO DE DJANGO")
        print("="*70)
        
        conn = psycopg2.connect(**DB_CONFIG)
        conn.autocommit = True
        cursor = conn.cursor()
        
        # Paso 1: Listar todas las tablas actuales
        print("\n📊 Tablas actuales en la base de datos:")
        cursor.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name;
        """)
        all_tables = cursor.fetchall()
        signspeak_tables = []
        django_tables_found = []
        
        for table in all_tables:
            table_name = table[0]
            if any(django_table in table_name for django_table in ['django', 'auth_']):
                django_tables_found.append(table_name)
                print(f"   🔴 Django: {table_name}")
            else:
                signspeak_tables.append(table_name)
                print(f"   🟢 SignSpeak: {table_name}")
        
        # Paso 2: Eliminar TODAS las tablas de Django
        print("\n🗑️  Eliminando tablas de Django...")
        for table in django_tables_found:
            try:
                cursor.execute(f"DROP TABLE IF EXISTS {table} CASCADE;")
                print(f"   ✅ Eliminada: {table}")
            except Exception as e:
                print(f"   ⚠️  Error al eliminar {table}: {e}")
        
        # Paso 3: Verificar tablas restantes
        print("\n✅ Tablas de SignSpeak que permanecen:")
        cursor.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name;
        """)
        remaining = cursor.fetchall()
        for table in remaining:
            print(f"   - {table[0]}")
        
        cursor.close()
        conn.close()
        
        # Paso 4: Limpiar migraciones locales
        print("\n🗑️  Limpiando archivos de migración locales...")
        migrations_dir = 'authentication/migrations'
        if os.path.exists(migrations_dir):
            for file in os.listdir(migrations_dir):
                if file.endswith('.py') and file != '__init__.py':
                    file_path = os.path.join(migrations_dir, file)
                    os.remove(file_path)
                    print(f"   ✅ Eliminado: {file}")
        
        print("\n" + "="*70)
        print("✅ RESETEO COMPLETADO")
        print("="*70)
        print("\n📋 SIGUIENTE PASO: Ejecuta estos comandos EN ORDEN:")
        print("-" * 70)
        print("1. python manage.py makemigrations")
        print("2. python manage.py migrate")
        print("3. python manage.py createsuperuser")
        print("4. python manage.py runserver")
        print("-" * 70)
        
        return True
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == '__main__':
    print("⚠️  ADVERTENCIA: Este script va a:")
    print("   ✅ MANTENER todas las tablas de SignSpeak (usuarios, señas, etc.)")
    print("   ❌ ELIMINAR todas las tablas de Django (django_*, auth_*)")
    print("\n   Las tablas de SignSpeak NO se tocarán.")
    
    respuesta = input("\n¿Continuar? (si/no): ").lower()
    
    if respuesta in ['si', 's', 'yes', 'y']:
        if reset_complete():
            print("\n🎉 Ahora ejecuta los comandos indicados arriba")
        else:
            print("\n❌ Hubo un error. Revisa los mensajes arriba.")
    else:
        print("❌ Operación cancelada")