# Scripts de JAWS para Cisco Webex (Versión 1.0)

**Autor:** David Prior  
**Versión:** 1.0 (Enero 2026)  
**Compatibilidad:** JAWS 2025.2508.120 o superior.

## Descripción
Este paquete de scripts mejora la accesibilidad de la aplicación de escritorio **Cisco Webex** para usuarios del lector de pantalla JAWS. 

El objetivo es facilitar tareas críticas como transferencias y gestión de audio mediante una navegación inteligente. Dado que muchos controles de Webex carecen de *Automation IDs* únicos, estos scripts implementan una búsqueda secuencial de controles basada en la detección de clases de ventana y simulación de teclado.

## Requisitos Previos y Operativa
Para que los scripts funcionen correctamente, es fundamental seguir estas indicaciones:

1.  **Configuración de Webex:** El "Dock de llamadas" debe estar **DESACTIVADO** en la configuración de la aplicación. Con el dock activo, JAWS no puede acceder correctamente a la jerarquía de objetos.
2.  **Selección de Área:** Se debe estar en el área de llamadas de Webex (por defecto pulsando `Control + 4`).
3.  **Uso de Transferencias (IMPORTANTE):** Antes de ejecutar los comandos de transferencia de estos scripts, el usuario debe **abrir primero el diálogo de transferencia** nativo de Webex (por defecto mediante la combinación `Alt + T`). Una vez abierto el diálogo y escrito el destino, se podrán usar los comandos rápidos descritos abajo.

## Lista de Comandos

### Ayuda y Diagnóstico
* **Shift + Insert + F1:** Ayuda dinámica. Muestra esta lista de comandos en el Visor Virtual.
* **Shift + Insert + Z:** Información técnica. Muestra clase de ventana, Automation ID y propiedades del control (Diagnóstico).

### Gestión de Llamadas
* **Shift + Control + S:** Estado del micrófono (Silenciado / Activo).
* **Shift + Control + K:** Abrir Teclado de Marcación (Keypad) durante una llamada (útil para sistemas IVR).
* **Shift + Control + T:** Ejecutar "Transferir ahora" (una vez abierto el diálogo con `Alt + T`).
* **Shift + Control + G:** Ejecutar "Consultar primero" (una vez abierto el diálogo con `Alt + T`).
* **Shift + Control + Q:** Cancelar operación o cerrar cuadro de diálogo actual.

### Edición
* **Shift + Control + Z:** Borrar entrada. Limpia rápidamente cuadros de edición o búsqueda.

## Instalación y Ubicación de Archivos

Para instalar los scripts, copia los archivos del repositorio (`.JSS`, `.jsm`, `.jkm`, `.jsd`, `.jsb`) en las carpetas de configuración de JAWS, en:
* **Carpeta de Usuario:** `C:\Users\[TuUsuario]\AppData\Roaming\Freedom Scientific\JAWS\2025\Settings\esn` (o `enu` para inglés).

copia también los archivos del repositorio `.jkm`, `.jsd`, `.jsb` en las carpetas de configuración de JAWS, en: 
* **Carpetas de Sistema (All Users):** `C:\Users\All Users\Freedom Scientific\JAWS\2025\Scripts\` y `C:\Users\All Users\Freedom Scientific\JAWS\2025\Scripts\esn\` (o `enu` para inglés).

## Notas Técnicas
* **Metodología:** Los scripts utilizan bucles de búsqueda con `Tab` o `F6` para saltar entre controles, ya que la referencia directa por ID no ha dado resultados.
* **Mensajería:** Todos los textos de voz y Braille están centralizados en `CiscoCollabHost.jsm` para facilitar su traducción a otros idiomas.
