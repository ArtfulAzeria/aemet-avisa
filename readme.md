# @aemet-avisa.bot.azeria.dev

Este es el código fuente con el cual está construido este bot para [BlueSky](https://bsky.app/). Puedes encontrar su cuenta en [@aemet-avisa.bot.azeria.dev](https://bsky.app/profile/did:plc:74vcrrzbpvefn46bocozy527).

## ¿Cómo funciona?
La aplicación realiza las siguientes tareas, en este orden:
1. Se conecta a la web oficial de [avisos de la AEMET](https://www.aemet.es/es/eltiempo/prediccion/avisos).
2. Extrae el mapa de la web.
3. Retoca el estilo del mapa para darle colores oscuros.
4. Extrae los datos con los que se construye el mapa de avisos del [feed RSS de avisos](https://www.aemet.es/es/rss_info/avisos/esp) oficial de AEMET.
5. Trata estos datos, descartando la información innecesaria y formateándolo de forma que sea fácil de entender para un humano.
6. Publica en BlueSky un post con la imagen del mapa y el texto a partir de los datos.

> [!NOTE]
> Dado que no necesita estar escuchando continuamente, no hay motivo para crear un servicio sin interrupciones, levantar un servidor, o un contenedor. 
>
> La aplicación se ejecuta en unos segundos, acaba su proceso, y no crea conexiones innecesarias que puedan involucrar un riesgo de seguridad. 
>
> Para el funcionamiento repetitivo cada hora, la aplicación es ejecutada desde cron en el servidor invocando el archivo [deploy.sh](deploy.sh).

## ¿Cuál es el formato del mensaje?
El texto siempre se formatea de la siguiente forma:

```md
🔴 Avisos rojos en:
Comunidades, Autónomas, En, Aviso y Rojo.

🟠 Avisos naranjas en:
Comunidades, Autónomas, En, Aviso y Naranja.

🟡 Avisos amarillos en:
Comunidades, Autónomas, En, Aviso y Amarillo.

Para más información acude a aemet.es
```

Si no existen avisos de un tipo (rojo/naranja/amarillo) se salta por completo esa línea. Es decir, si no hay alerta roja en nigun lugar, **no se escribirá**:
```
🔴 Avisos rojos en:

🟠 Avisos naranjas en:
Comunidades, Autónomas, En, Aviso y Naranja.

🟡 Avisos amarillos en:
Comunidades, Autónomas, En, Aviso y Amarillo.

Para más información acude a aemet.es
```

Sino que hará:

```
🟠 Avisos naranjas en:
Comunidades, Autónomas, En, Aviso y Naranja.

🟡 Avisos amarillos en:
Comunidades, Autónomas, En, Aviso y Amarillo.

Para más información acude a aemet.es
```

Al final de los 3 tipos de alerta, siempre se escribe adicionalmente la línea indicando que se puede obtener más información en la web oficial de avisos de la AEMET, con un [enlace a la misma](https://www.aemet.es/es/eltiempo/prediccion/avisos).

Este formateo es construido en [Main.ts](src/Main.ts), bajo el método buildMessage().

Además de esto, el mensaje de texto siempre es acompañado por una imagen. La imagen se extrae al invocar el archivo [scrap.ts](src/scrap.ts) desde Main.ts, y no se guarda de forma local, sino que es completamente tratada en memoria.

## ¿Cómo se extraen los datos?
Se llama al RSS de avisos usando la URI (almacenada en immutable.ts). Se usa el RSS completo que tiene el como primer item del XML el archivo .tar.gz de descarga completa, aunque realmente este se ingora a efectos de crear el mensaje porque carece de información relavante.

Luego el XML es transformado a un objeto [aemetGeneralAlert.ts](src/interface/aemetGeneralAlert.ts) ([ver interfaces](src/interface/)) para poder manipularlo fácilmente.

## ¿Cómo lo ejecuto?
1. Clona el proyecto.
2. Instala las dependencias necesarias (para ser ejecutado en un entorno de servidor linux headless, [revisa la documentación](buildMessage)).
3. Crear tu propio archivo package-lock.json.
4. Crea tu archivo `.env` (ver [sample.env](sample.env)).
5. Después usa `npx tsc` para generar los archivos `.js` en la carpeta `dist` y ejecuta `node dist/src/Main.js` para correr la aplicación.

## Tratamiento de datos
Bajo el directorio [utils](src/utils/) hay 2 archivos de extracción de datos.
- [geo.basic.json_data-extractor.py](src/utils/geo.basic.json_data-extractor.py)
- [poly.json_data-extractor.ts](src/utils/poly.json_data-extractor.ts)

Generan respectivamente los archivos `geo.basic.json` y `poly.json` en el directorio `resources`.

### geo.basic.json

Almacena los datos de todas las zonas de aviso formateados tal que:

```json
{
    "code": "610401",
    "zone": "Valle del Almanzora y Los Vélez",
    "prov": "Almería",
    "comm": "Andalucía",
    "seab": "0"
},
```

| key    | value                                     |
|--------|-------------------------------------------|
| `code` | Código que identifica la zona de aviso    |
| `zone` | Nombre de la zona de aviso                |
| `prov` | Provincia                                 |
| `comm` | Comunidad autónoma                        |
| `seab` | Sea boolean: si tiene costa (1) o no (0)  |

> [!IMPORTANT]
> El `code` puede tener un código puramente numérico con 6 dígitos, o un código alfanumérico con 6 dígitos y terminado en C.
>
> Los acabados en C son códigos de zona de aviso reservados para zonas costeras, y corresponden a la zona en tierra con el mismo código pero sin la letra C, como ejemplo de esto:
>
> ```json
> {
>     "code": "610403",
>     "zone": "Poniente y Almería Capital",
>     "prov": "Almería",
>     "comm": "Andalucía",
>     "seab": "1"
> },
> {
>     "code": "610403C",
>     "zone": "Poniente y Almería Capital",
>     "prov": "Almería",
>     "comm": "Andalucía",
>     "seab": "1"
> },
> ´´´
>

### poly.json
Guarda los datos de los polígonos de cada zona de aviso (para dibujar la zona en un mapa), tal que:

```json
"610401": {
    "polygons": [
      "37.92,-2.21 37.89,-2.17 37.9,-2.12 37.88,-2.1 37.88,-2.06 37.87,-2.02 37.87,-1.97 37.84,-1.99 37.78,-2.01 37.73,-1.99 37.67,-2.01 37.59,-1.95 37.46,-1.84 37.43,-1.81 37.39,-1.84 37.36,-1.9 37.3,-1.95 37.27,-1.89 37.22,-1.89 37.19,-1.92 37.21,-1.96 37.23,-1.98 37.19,-2.02 37.16,-2.03 37.18,-2.11 37.21,-2.13 37.24,-2.2 37.21,-2.27 37.25,-2.27 37.27,-2.3 37.26,-2.34 37.26,-2.4 37.23,-2.42 37.21,-2.5 37.22,-2.55 37.24,-2.55 37.24,-2.62 37.23,-2.66 37.29,-2.66 37.34,-2.64 37.39,-2.63 37.43,-2.58 37.45,-2.57 37.51,-2.46 37.52,-2.36 37.61,-2.37 37.62,-2.31 37.7,-2.32 37.78,-2.28 37.81,-2.3 37.89,-2.29 37.92,-2.21"
    ]
},
```

| key        | value                                               |
|------------|-----------------------------------------------------|
| `code`     | Código que identifica la zona de aviso              |
| `polygons` | Los polígonos con el que dibujar la zona en un mapa |

> [!IMPORTANT]
> Aunque no es habitual, una misma zona puede estar compuesta por varios polígonos, por eso el dato se trata como array.

### geo.json

Finalmente, con el archivo [geo.json_data-generator.py](src/utils/geo.json_data-generator.py) unificamos los 2 anteriores archivos en uno solo llamado [geo.json](resources/geo.json) formateado tal que:

```json
{
    "code": "610401",
    "zone": "Valle del Almanzora y Los Vélez",
    "prov": "Almería",
    "comm": "Andalucía",
    "seab": "0",
    "polygons": [
        "37.92,-2.21 37.89,-2.17 37.9,-2.12 37.88,-2.1 37.88,-2.06 37.87,-2.02 37.87,-1.97 37.84,-1.99 37.78,-2.01 37.73,-1.99 37.67,-2.01 37.59,-1.95 37.46,-1.84 37.43,-1.81 37.39,-1.84 37.36,-1.9 37.3,-1.95 37.27,-1.89 37.22,-1.89 37.19,-1.92 37.21,-1.96 37.23,-1.98 37.19,-2.02 37.16,-2.03 37.18,-2.11 37.21,-2.13 37.24,-2.2 37.21,-2.27 37.25,-2.27 37.27,-2.3 37.26,-2.34 37.26,-2.4 37.23,-2.42 37.21,-2.5 37.22,-2.55 37.24,-2.55 37.24,-2.62 37.23,-2.66 37.29,-2.66 37.34,-2.64 37.39,-2.63 37.43,-2.58 37.45,-2.57 37.51,-2.46 37.52,-2.36 37.61,-2.37 37.62,-2.31 37.7,-2.32 37.78,-2.28 37.81,-2.3 37.89,-2.29 37.92,-2.21"
    ]
},
```

Donde se usa el mismo formato que en geo.basic.json, pero añadiendo el valor de polygons correspondiente. Esta fusión se hace gracias al elemento común de ambas listas, el código.

| key        | value                                               |
|------------|-----------------------------------------------------|
| `code`     | Código que identifica la zona de aviso              |
| `zone`     | Nombre de la zona de aviso                          |
| `prov`     | Provincia                                           |
| `comm`     | Comunidad autónoma                                  |
| `seab`     | Sea boolean: si tiene costa (1) o no (0)            |
| `polygons` | Los polígonos con el que dibujar la zona en un mapa |
