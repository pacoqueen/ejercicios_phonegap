# Módulo 3: Localización

Aplicación para geolocalizar el móvil, mostrar un mapa y guardar lugares favoritos.

## Paso 1

Obtener las coordenadas de la posición del móvil.

## Paso 2

Dibujar un mapa según las coordenadas del paso anterior. La porción del mapa a dibujar se descargará de [mapbox](http://www.mapbox.com/) usando la biblioteca [leaflet](http://leafletjs.com/examples/quick-start/). `leaflet.js` debe extraerse en `www/js`, mientras que `leaflet.css` y el directorio `images` deben estar en `www/css`.

Para acceder a los mapas es necesario registrarse en Mapbox y generar un _Access Token_ que se usa en la función `dibujaCoordenadas` de `www/js/maps.js`. El _Access Token_ debe guardarse en el fichero `www/js/config.js` —no incluido en el repositorio—, que contendría:

```
var config = {
    MAPBOX_APIKEY: 'pk.eyTUACCESSTOKENAQUItuaccesstokenaquiTUACCESSTOKENAQUItuaccesstokenaqui.Mlajkshdan'
}
```

## Paso 3

---

![Captura de pantalla](www/img/Screenshot_2017-09-15-15-15-30.png)

Servir la aplicación desde el ordenador con
```
phonegap serve
```
Y lanzarla en el móvil con [PhoneGap Developer App](http://docs.phonegap.com/getting-started/2-install-mobile-app/).

