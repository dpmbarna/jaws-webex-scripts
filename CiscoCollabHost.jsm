;Webex message file

Messages
@msgConfigName
Webex
@@
	; --- Mensajes personalizados para los scripts de David Prior ---
@msgHelpIntro
Para conocer los comandos de Jaws específicos para Webex pulsa %KeyFor(HotKeyHelp).
@@
@msgWebexScriptsHelp
Guía de Comandos Webex
Ayuda de Scripts para Webex

REQUISITOS OPERATIVOS:
- La ventana de llamadas debe estar seleccionada (Control + 4).
- El Dock de llamadas debe estar DESACTIVADO.

COMANDOS PARA EL DIÁLOGO DE TRANSFERENCIA:
- Para activar el botón Transferir ahora (Realiza la transferencia directa o ciega) pulsa %KeyFor(ActivateTransferNowButton).
- Para activar el botón Consultar primero (Permite hablar con el destino antes de transferir) pulsa %KeyFor(ActivateCheckfirstButton).

COMANDOS PARA DIÁLOGOS DE TRANSFERENCIA Y CONFERENCIA, Y PARA LA BÚSQUEDA EN LA VENTANA PRINCIPAL DE WEBEX:
- Para activar el botón Borrar entrada (Limpia el cuadro de edición del número) pulsa %KeyFor(ActivateEraseEntryButton).
Este comando también se puede usar para borrar la entrada de una búsqueda o marcaje en la ventana principal del programa,
a cuyo cuadro de edición se puede acceder pulsando Control + f.
- Para activar el botón Cancelar (Aborta la operación actual y cierra el diálogo) pulsa %KeyFor(ActivateCancelButton).

OTROS COMANDOS ÚTILES DURANTE UNA LLAMADA:
- Para conocer el estado del Micrófono (Informa si está silenciado o activo) pulsa %KeyFor(CheckMuteStatus).
Si quieres alternar su estado, Webex dispone de tecla rápida propia para ello 
(por defecto Control + m).
- Para desplegar el teclado de marcación (para marcar opciones numéricas o códigos en sistemas de respuesta automatizada) pulsa %KeyFor(ActivateKeyboardButton).
Ten en cuenta que es necesario volver a plegar el teclado de marcación pulsando Escape para poder transferir la llamada. 

COMANDO PARA OBTENER INFORMACIÓN TÉCNICA DEL OBJETO Y VENTANA QUE TIENEN EL FOCO (ÚTIL PARA AMPLIAR/MODIFICAR LOS SCRIPTS):
- Para conocer diferentes códigos de identificación del objeto enfocado y de la ventana en la que se encuentra, 
como el nombre de su ventana, su Control ID, su Automation ID, el nombre de su tipo de clase,  o su nombre y contenido 
pulsa %KeyFor(GetTechnicalInfo).
Si lo pulsas una vez anunciará verbalmente la información;
si lo pulsas dos veces rápidamente la mostrará en el visor virtual 


Pulsa Escape para cerrar esta ventana
@@
@msgBufferExit
Pulsa Escape para cerrar esta ventana
@@
	; Mensajes de Diagnóstico (GetTechnicalInfo)
@msgTechnicalInfo
INFORMACIÓN TÉCNICA DEL CONTROL / OBJETO Y VENTANA ENFOCADOS:
@@
@msgDiagWinName
El nombre de la ventana es: 
@@
@msgDiagWinClass
La Clase de ventana del foco es:	
@@
@msgDiagMainClass
La Clase de ventana principal es:  
@@
@msgDiagErrNoClass
Error: No se encontró una Clase de Control para este control.
@@
	@msgDiagClassIs
La Clase de Control es: 
@@
@msgDiagErrNoID
Error: No se encontró un Automation ID para este control.
@@
@msgDiagIDIs
El Automation ID es:	
@@
@msgDiagPropName
Propiedad Nombre: 
@@
@msgDiagWinType
Tipo de ventana: 
@@
@msgDiagWinText
Texto de la ventana: 
@@
	; Mensajes de Estado del Micrófono (CheckMuteStatus)
@msgErrMuteNotFound
No se ha localizado el botón Silenciar.
@@
@msgErrCallOnHold
La llamada está en espera y no se puede silenciar el micrófono en este momento
@@
@msgErrDialogBlock
Hay algún cuadro de diálogo enfocado ahora y el botón Silenciar no está disponible de momento
@@
@msgStatusMicOn
El micrófono está activo
@@
@msgStatusMicMuted
El micrófono está silenciado
@@
	; Mensajes de Acciones (Transferir, Consultar, Borrar, Cancelar)
@msgActConsulting
Consultando
@@
@msgActTransferring
Transfiriendo
@@
@msgActCompleting
Completando transferencia
@@
@msgActErased
Borrado
@@
@msgActCancelled
Cancelada
@@
@msgActKeyboard
Abriendo el teclado de marcación
@@
@msgSearchingKeyboard
Buscando el teclado
@@
	; Mensajes de acciones frustradas
@msgErrNoCallWindow
No está en primer plano una ventana de llamada
@@
@msgErrNoDialogTransfer
No está abierto el diálogo de transferencia o ha cambiado su clase de ventana
@@
@msgErrConfBlock
Está abierto el diálogo de conferencia y no incluye ningún botón para transferencia directa
@@
@msgErrProfBlock
Está en primer plano una ventana de perfil de contacto y no hay ninguna entrada de texto a borrar en ella
@@
@msgErrTextEntryNoFound
No hay texto a borrar en el cuadro de edición para la entrada de texto
@@
@msgErrConsultNotFound
No se encontró el botón Consultar primero
@@
@msgErrNoDialogGeneric
No hay focalizado ningún cuadro de diálogo o ha cambiado su clase de ventana
@@
@msgErrTransferNotFound
No se encontró el botón Transferir ahora
@@
@msgErrHoldNoDest
Hay una llamada en espera pero no hay ninguna llamada de destino en primer plano
@@
@msgErrHoldNoFocus
Hay una llamada en espera y no hay ningúna llamada de destino focalizada
@@
@msgErrCompleteNotFound
No se ha localizado el botón Completar Transferencia
@@
@msgErrEraseNotFound
No se encontró el botón Borrar entrada
@@
@msgErrNoDialogErase
No hay focalizado ningún cuadro de diálogo que incluya el botón Borrar entrada o ha cambiado su clase de ventana
@@
@msgErrCancelNotFound
No se encontró el botón Cancelar
@@
@msgErrNoDialogCancel
No hay focalizado ningún cuadro de diálogo que incluya el botón Cancelar o ha cambiado su clase de ventana
@@
@msgErrKeyboardNotFound
No se ha localizado el botón que abre el teclado de marcación
@@
EndMessages