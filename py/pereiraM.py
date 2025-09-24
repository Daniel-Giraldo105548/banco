import csv

# Archivos
input_file = r"C:\xampp\htdocs\banco\archivosCSV\barrios_final_p.csv"
output_file = r"C:\xampp\htdocs\banco\archivosCSV\barrios_final_bereira.csv"

# Leer CSV
rows = []
with open(input_file, newline='', encoding='utf-8-sig') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        rows.append(row)

# Ordenar filas por id_comuna ascendente y luego id_barrio ascendente
rows.sort(key=lambda x: (int(x['id_comuna']), int(x['id_barrio'])))

# Guardar CSV final con nuevo orden de columnas
fieldnames = ['id_barrio', 'nombre', 'id_comuna']  # <-- Nuevo orden
with open(output_file, 'w', newline='', encoding='utf-8') as csvfile:
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(rows)

print(f"Archivo final guardado como '{output_file}'")
