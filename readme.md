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

