import csv

# Rutas absolutas
input_file = r"C:\xampp\htdocs\banco\archivosCSV\barrios_manizales.csv"
output_file = r"C:\xampp\htdocs\banco\archivosCSV\barrios_manizales2.csv"

# Leer CSV
rows = []
with open(input_file, newline='', encoding='utf-8-sig') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        rows.append(row)

# Ordenar por id_comuna y luego id_barrio
rows.sort(key=lambda x: (int(x['id_comuna']), int(x['id_barrio'])))

# Cambiar IDs
new_id_comuna = 11
current_comuna = None

for row in rows:
    # Si cambia la comuna original, se incrementa el nuevo id_comuna
    if current_comuna != row['id_comuna']:
        current_comuna = row['id_comuna']
        row['id_comuna'] = str(new_id_comuna)
        new_id_comuna += 1
    else:
        row['id_comuna'] = str(new_id_comuna - 1)

# Guardar CSV final
fieldnames = ['id_barrio', 'nombre', 'id_comuna']
with open(output_file, 'w', newline='', encoding='utf-8') as csvfile:
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(rows)

print(f"Archivo final guardado como '{output_file}'")