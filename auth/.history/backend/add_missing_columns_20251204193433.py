"""
Script para agregar las columnas faltantes de Django a la tabla usuarios
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

def add_missing_columns():
    try:
        print("="*70)
        print("🔧 AGREGANDO COLUMNAS FALTANTES A LA TABLA USUARIOS")
        print("="*70)
        
        conn = psycopg2.connect(**DB_CONFIG)
        conn.autocommit = True
        cursor = conn.cursor()
        
        # Verificar columnas existentes
        print("\n📊 Verificando columnas actuales...")
        cursor.execute("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'usuarios'
            ORDER BY ordinal_position;
        """)
        existing_columns = [row[0] for row in cursor.fetchall()]
        print("Columnas existentes:")
        for col in existing_columns:
            print(f"   - {col}")
        
        # Columnas que necesitamos agregar
        columns_to_add = {
            'is_superuser': 'BOOLEAN DEFAULT FALSE',
            'is_staff': 'BOOLEAN DEFAULT FALSE',
            'is_active': 'BOOLEAN DEFAULT TRUE',
            'last_login': 'TIMESTAMP NULL'
        }
        
        print("\n🔧 Agregando columnas faltantes...")
        
        for column_name, column_definition in columns_to_add.items():
            if column_name not in existing_columns:
                try:
                    sql = f"ALTER TABLE usuarios ADD COLUMN {column_name} {column_definition};"
                    cursor.execute(sql)
                    print(f"   ✅ Agregada: {column_name}")
                except Exception as e:
                    print(f"   ⚠️  Error al agregar {column_name}: {e}")
            else:
                print(f"   ℹ️  Ya existe: {column_name}")
        
        # Verificar columnas finales
        print("\n📊 Columnas finales:")
        cursor.execute("""
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'usuarios'
            ORDER BY ordinal_position;
        """)
        final_columns = cursor.fetchall()
        for col_name, col_type in final_columns:
            print(f"   - {col_name}: {col_type}")
        
        cursor.close()
        conn.close()
        
        print("\n" + "="*70)
        print("✅ COLUMNAS AGREGADAS EXITOSAMENTE")
        print("="*70)
        print("\n📋 Ahora ejecuta:")
        print("   python manage.py createsuperuser")
        print("   python manage.py runserver")
        
        return True
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == '__main__':
    print("Este script agregará las columnas necesarias de Django a la tabla usuarios")
    print("\nColumnas a agregar:")
    print("   - is_superuser (para administradores)")
    print("   - is_staff (para acceso al admin)")
    print("   - is_active (para cuentas activas)")
    print("   - last_login (último inicio de sesión)")
    
    respuesta = input("\n¿Continuar? (si/no): ").lower()
    
    if respuesta in ['si', 's', 'yes', 'y']:
        if add_missing_columns():
            print("\n🎉 ¡Listo! Ahora puedes crear el superusuario")
        else:
            print("\n❌ Hubo un error. Revisa los mensajes arriba.")
    else:
        print("❌ Operación cancelada")