import csv

# Archivos
input_file = r"C:\xampp\htdocs\banco\archivosCSV\Barrios_por_comunas_en_la_ciudad_de_Pereira_20250918.csv"
output_file = r"C:\xampp\htdocs\banco\archivosCSV\barrios_sin_comuna.csv"

# Leer CSV y filtrar columnas
rows = []
with open(input_file, newline='', encoding='utf-8-sig') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        rows.append({
            'CODIGO DE LA COMUNA': row['CODIGO DE LA COMUNA'],
            'CODIGO DEL BARRIO': row['CODIGO DEL BARRIO'],
            'NOMBRE': row['NOMBRE']
        })

# Guardar CSV final
fieldnames = ['CODIGO DE LA COMUNA', 'CODIGO DEL BARRIO', 'NOMBRE']
with open(output_file, 'w', newline='', encoding='utf-8') as csvfile:
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(rows)

print(f"Archivo final guardado como '{output_file}'")
