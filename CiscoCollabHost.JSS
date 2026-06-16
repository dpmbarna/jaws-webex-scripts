	; Webex script file versión v1.4
	; Iniciados por David Prior en diciembre de 2025 para la versión 2025.2508.120 de Jaws.
	; * Versión 1.0 terminada el 30/01/2026
	; * Versión 1.1 terminada el 05/02/2026: 
; se modifica el script ActivateEraseEntryButton para que cuando sea activado en la ventana principal de Webex no habiendo ningún texto en el cuadro de edición de búsqueda, el foco quede en este último y no en el objeto siguiente a él.
	; * Versión 1.2 terminada el 19/02/2026:
; se modifican los parámetros de la función GetwindowName en todos los scripts para que recoja correctamente el nombre de la ventana enfocada en cada momento
; ya que, como consecuencia de una actualización de Webex en esas fechas, varios scripts dejaron de funcionar correctamente,
; y se adapta parte del código del script ActivateKeyboardButton para que siga funcionando.
; * Versión 1.3 terminada el 29/05/2026:
; se cambian los códigos de tipos de ventana de la aplicación para adecuarlos a los de la actualización de Webex de esas fechas
; para que sigan funcionando correctamente varios scripts
; y se modifica la primera parte del script ActivateEraseEntryButton porque a partir de ahora
; el automationID de todos los objetos de la ventana principal de Webex es el mismo,
; y por tanto, ya no se puede usar este código para discriminar entre objetos y 
; hay que recurrir al texto del nombre del control para ello.
; Además, se añade un nuevo script para llevar el foco a la lista del historial de llamadas,
; cuando se está en la ventana principal de webex y no hay ningún menú desplegado en ese momento.
; * Versión 1.3.1 terminada el 03/06/2026:
; se revisa, se añaden  y se Corrigen algunos mensajes  informativos del script ActivateTransferNowButton,
; y se completa y mejora su argumentación para que quede más clara la función de cada bloque de comandos dentro del script.
;* Versión 1.4 terminada el 15/06/2026
; Se modifica el AutomationId del botón que despliega el teclado de marcación durante una llamada,
; para que el script ActivateKeyboardButton vuelva a funcionar después de la última actualización de Webex.
; También se modifica el script ActivateTransferNowButton para tratar de solucionar con una segunda búsqueda alternativa,
; que se activa pulsando dos veces rápidamente la tecla rápida del script,
; un problema que se produce algunas veces en la primera transferencia que se realiza en cada sesión de Webex cuando se pretende completar una trasferencia 
; habiendo descolgado ya la persona de destino en su dispositivo.
; En esta circunstancia, aunque el script funciona correctamente y detecta y supuestamente activa el botón completar transferencia, parece ser que Webex no ha actualizado aún su buffer de memoria,
; y tal activación no se produce, por lo que la llamada sigue sin ser transferida a pesar del mensaje lanzado por el script de confirmación, 
; y esta hay que transferirla buscando manualmente con shift + F6 dicho botón y activarlo con barra espaciadora. 
; Finalmente, se  añade en la ayuda de comandos de los scripts, la información referente a cómo completar una transferencia iniciada con el botón "Consultar Primero".

	; Los controles de Webex que activan estos scripts se buscan de forma secuencial a través de La repetición de la pulsación de la tecla tabulador Por las diferentes ventanas Y cuadros de diálogo de la aplicación,
	; ya que Se ha intentado buscar los automation y de Por la jerarquía de objetos de la aplicación pero no se ha logrado localizar de esta forma,
	; y además, algunos objetos ni siquiera Tienen un automation ID Único o Con alguna etiqueta incorporada.
	
	; Estos scripts se han creado y probado en una Edición actualizada a la última versión disponible de Webex en español con un número de teléfono asociado en el que hay una cola de llamadas vinculada y que forma parte de un grupo de extensiones,
	; en la que el dock de llamadas (la ventana de llamadas con funciones extendidas) está desactivado desde la configuración de la aplicación
	; porque de esta forma se facilita la captura por parte de Jaws de la información que aparece en primer plano o que se abre al contestar una llamada
	; (con el dock activado no se logra llevar el foco a esa ventana de ninguna forma ni Jaws consigue acceder a su información a no ser que se haga clic con el ratón sobre ella),
	; y en la que el área de la aplicación corespondiente a llamadas se ha seleccionado pulsando Control más 4.
	
	; El objetivo principal de estos scripts es facilitar la transferencia con consulta o la transferencia directa (ciega) con el Dock de llamadas desactivado,
	; ya que carecen de teclas rápidas los botones que activan estas funciones.
	; También pretenden facilitar la apertura del teclado en pantalla durante una llamada para la marcación de opciones en sistemas de respuesta automatizada,
	; y acceder al estado del silencio del micrófono (micrófono activado o silenciado), ya que la información del mismo no es actualizada correctamente en tiempo real por Jaws o la aplicación. 


include "HjConst.jsh"
include "CiscoCollabHost.jsm"
include "common.jsm"
include "UIA.jsh"

globals
int EnMemorias,
string RealWindowClass,
handle RealWindow,
string WindowTitle


Const
WebexWindowTitle = "Webex",
DialogTitle = "diálogo",
TransferDialogTitle = "transferir",
ConferenceDialogTitle = "Añadir",
SettingsTitle = "Configura",
HelpTitle = "Ayuda",
CiscoTitle = "Cisco",
MenuTitle = "Menú",
DiagnosticTitle = "Diagn",
ResultsListViewTitle = "Viendo lista",
ContactProfileTitle = "Perfil",
ControlBarTitle = "Barra",
VideoPadTitle = "Vídeo y ",
;classes
	Class_Webex = "Qt683QWindowIcon",
Class_Dialog = "Qt683QWindowToolSaveBits",
CancelDialogClass = "VectorButton",
EraseEntryClass = "WSvgPushButton",
EntryEditClass = "WLineEdit",
CallHistoryListClass = "CallHistoryItem",	
;Automation ID's
AutomationID_MainWindowObject = "SparkApp.MainWindow.ConversationsForm.topLevelStack.mainAreasWi",
AutomationID_Keyboard = "SparkApp.CallControlBar.Main_CallStripButton_Keypad",
AutomationID_ResultsList = "focusAnchorItem",
AutomationID_MuteButton = "Main_CallStripButton_Audio",
AutomationID_ResumeButton = "Main_CallStripButton_Resume",
AutomationID_TransferButton = "Main_CallStripButton_Transfer",
AutomationID_ClearSearch = "InputBoxContainer.clearSearchBoxButton",
AutomationID_CallHistoryList = "callHistoryView.",
; Control Names and Texts		
JoinDeviceButton = "Conectar",
TransferNowButton = "ransfer",
CheckfirstButton = "onsult",
EraseEntryButton = "orrar",
CancelTransferButton = "Cancel",
MuteButton = "ilenci",
ResumeButton = "eanuda",
TransferButton = "ransferir",
CompleteTransferButton = "ompletar transfer",
JoinButton = "ombina",
MuteOffButtonState = "Silenciar",
MuteOnButtonState = "Desactivar silencio",
OnHoldCallState = "espera"

Function AutoStartEvent ()
	LoadNonJCFOptions ()
		If GetVerbosity() == BEGINNER || GetVerbosity() == Intermediate && (!EnMemorias) then
		Let EnMemorias=1
		SayFormattedMessage (OT_Message, msgHelpIntro)
	EndIf
EndFunction


Script HotKeyHelp ()
	; Este script genera una ventana de ayuda en el Visor Virtual que detalla el uso de los scripts de Webex.
	; La información es dinámica, obteniendo las combinaciones de teclas directamente del sistema de JAWS
	; para asegurar que la ayuda siempre coincida con las asignaciones actuales del usuario.

	; Se invoca el Visor Virtual para presentar la información de forma accesible y navegable.
	If UserBufferIsActive ()
		UserBufferDeactivate()
	EndIf
	UserBufferClear()
	SayFormattedMessage(OT_User_Buffer, msgWebexScriptsHelp)
EndScript

Script GetTechnicalInfo ()
	Var
		String WindowName,
		String ClassMainWindow,
		String ClassWindow,
		string sClassName,
		string sID,
		String sName,
		String sType,
		String sTexto
		
	WindowName = GetWindowName (GetFocus ())
	WindowTitle = GetWindowName (GetAppMainWindow(GetCurrentWindow ()))
	ClassMainWindow = GetWindowClass (GetAppMainWindow(GetCurrentWindow ()))
	ClassWindow = GetWindowClass (GetFocus ())
	sClassName = GetObjectClassName(0)
	sID = GetObjectAutomationId(0)
	sName = GetControlName()
	sType = GetWindowType (GetFocus ())
	sTexto = GetWindowText (GetFocus (), 0)

	Pause()
	If IsSameScript () == 0 then
		SayString (msgDiagWinName + WindowName)
		SayString (msgMainWinName + WindowTitle)
	SayString(msgDiagMainClass + ClassMainWindow)
		SayString(msgDiagWinClass + ClassWindow)
		; Comprueba si el nombre de la clase del objeto es válido o está vacío.
		if StringIsBlank(sClassName) Then
			SayString(msgDiagErrNoClass)
		else
			SayString(msgDiagClassIs + sClassName)
		EndIf
				; Comprueba si el ID es válido o está vacío.
		if StringIsBlank(sID) Then
			SayString(msgDiagErrNoID)
		else
			SayString(msgDiagIDIs + sID)
		EndIf
		SayString(msgDiagPropName + sName)
		SayString(msgDiagWinType + sType)
		SayString(msgDiagWinText + sTexto)
	Else
		If UserBufferIsActive ()
			UserBufferDeactivate()
		EndIf
		UserBufferClear()
		SayFormattedMessage(OT_User_Buffer, msgTechnicalInfo)		
		UserBufferAddText (cScBufferNewLine)
		SayFormattedMessage(OT_User_Buffer, msgDiagWinName + WindowName)
		SayFormattedMessage(OT_User_Buffer, msgMainWinName + WindowTitle)
		SayFormattedMessage(OT_User_Buffer, msgDiagMainClass + ClassMainWindow)
		SayFormattedMessage(OT_User_Buffer, msgDiagWinClass + ClassWindow)
		SayFormattedMessage(OT_User_Buffer, msgDiagClassIs + sClassName)
		SayFormattedMessage(OT_User_Buffer, msgDiagIDIs + sID)
SayFormattedMessage(OT_User_Buffer, msgDiagPropName + sName)
	SayFormattedMessage(OT_User_Buffer, msgDiagWinType + sType)
		SayFormattedMessage(OT_User_Buffer, msgDiagWinText + sTexto)
		UserBufferAddText (cScBufferNewLine)
	SayFormattedMessage(OT_User_Buffer, msgBufferExit)
	EndIf
EndScript

Script CheckMuteStatus ()
	Var
		Int Counter,
		Int MaxCount,
		String TextControl,
		Int ValueComparison

	Let Counter = 0
	Let MaxCount = 9
	WindowTitle = GetWindowName (GetAppMainWindow(GetCurrentWindow ()))
	TextControl = GetControlName ()

	If StringContains(WindowTitle, WebexWindowTitle) != 0 || StringContains(WindowTitle, DiagnosticTitle) != 0 || StringContains(WindowTitle, CiscoTitle) != 0 || StringContains(WindowTitle, HelpTitle) != 0 || StringContains(WindowTitle, SettingsTitle) != 0 || StringContains(WindowTitle, MenuTitle) != 0 || StringIsBlank (WindowTitle) Then
		; Si en el título de la ventana enfocada aparece "Webex", Diagnóstico", "Configura", "Menú", "Ayuda", "Cisco",, no es la ventana de una llamada activa, por que si fuese así, el título sería el número del llamante, o el nombre del mismo si está entre los contactos registrados. 
		SayString (msgErrNoCallWindow)
		BrailleMessage (msgErrNoCallWindow)
		Return
	Else
		; Si el título de la ventana no es Webex
		If StringContains(WindowTitle, DialogTitle) != 0 || StringContains(WindowTitle, ResultsListViewTitle) != 0 Then
			; Si en el texto del título de la ventana aparece "diálogo" o "Viendo lista" significa que el diálogo de transferencia o algún 
			; otro (de combinar llamadas en conferencia, por ejemplo) está abierto, y que por tanto, no está disponible el botón Silenciar
			SayString (msgErrDialogBlock)
			BrailleMessage (msgErrDialogBlock)
			Return
		Else
			; Si el diálogo de transferencia o algún otro cuadro de diálogo no está abierto
			TextControl = GetControlName ()
			If StringContains(TextControl, TransferButton) != 0 || StringContains(TextControl, ResumeButton) != 0 || StringContains(TextControl, OnHoldCallState) != 0 Then 
				; Si se encuentran los botones Transferir o Reanudar, o la etiqueta "espera" en el nombre de los objetos
				SayString (msgErrCallOnHold)
				BrailleMessage (msgErrCallOnHold)
				SayString (GetControlName ())	
				Return
			Else
				SpeechOff ()
				; Como no se ha detectado, de momento, que la llamada esté en espera se va a buscar con F6 el botón Silenciar en alguno de sus estados
				TypeKey ("F6")		
				Pause ()
				TextControl = GetControlName ()
				ValueComparison = StringContains(TextControl, MuteButton) 
				; Y se compara el texto del objeto que tiene el foco con el de los estados del botón Silenciar
				While ValueComparison == 0 && Counter != MaxCount
					; Mientras no se encuentre un objeto que coincida con la parte común de las dos etiqetas del botón Silenciar (en español, "ilenci")
					If StringContains(TextControl, TransferButton) != 0 || StringContains(TextControl, ResumeButton) != 0 || StringContains(TextControl, OnHoldCallState) != 0 Then 
						; Si se encuentran los botones Transferir o Reanudar, o la etiqueta "espera" en el nombre de los objetos
						SpeechOn ()
						SayString (msgErrCallOnHold)
						BrailleMessage (msgErrCallOnHold)
						SayString (GetControlName ())
						Return
					EndIf
					SpeechOff ()
					Let Counter = Counter + 1
					TypeKey("F6")
					Pause ()
					TextControl = GetControlName ()
					ValueComparison = StringContains(TextControl, MuteButton)
					; Se continúa rotando, obteniendo el nombre de los objetos y comparándolos con el texto común para los estados de silenciar
				EndWhile
				If TextControl == MuteOffButtonState Then
					SpeechOn ()
					SayString (msgStatusMicOn)
					BrailleMessage (msgStatusMicOn)
					Return
				EndIf
				If TextControl == MuteOnButtonState Then
					SpeechOn ()
					SayString (msgStatusMicMuted)
					BrailleMessage (msgStatusMicMuted)
					Return
				EndIf
				If StringContains(TextControl, TransferButton) != 0 || StringContains(TextControl, ResumeButton) != 0 || StringContains(TextControl, OnHoldCallState) != 0 Then 
					; Si se encuentran los botones Transferir o Reanudar, o la etiqueta "espera" en el nombre de los objetos
					SpeechOn ()
					SayString (msgErrCallOnHold)
					BrailleMessage (msgErrCallOnHold)
					SayString (GetControlName ())
					Return
				EndIf
				If Counter == MaxCount Then
					SpeechOn ()
					SayString (msgErrMuteNotFound)
					BrailleMessage (msgErrMuteNotFound)
					SayString (GetControlName ())		
					Return
				EndIf
		
			EndIf ; Aquí ha terminado  la condición de si los botones Transferir o Reanudar no están disponibles o no aparece el texto "espera" en los objetos que se recorren
		EndIf ; Aquí ha terminado la condición de si no está abierto el diálogo de transferencia
	EndIf ; aquí ha terminado la condición de si el nombre de la ventana no es Webex (el foco no está en la ventana principal del programa)
EndScript

Script ActivateCheckFirstButton ()
	Var
		String WindowClass, 
		Int Counter,
		Int MaxCount,
		String TextControl,
		String sClassName,
		String sID,
		Int ValueComparison

	Let Counter = 0
	Let MaxCount = 9
	WindowTitle = GetWindowName (GetAppMainWindow(GetCurrentWindow ()))
	WindowClass = GetWindowClass (GetAppMainWindow(GetCurrentWindow ()))
	sClassName = GetObjectClassName(0) 
	sID = GetObjectAutomationId(0)
	TextControl = GetControlName ()
	ValueComparison = StringContains(TextControl, CheckFirstButton) 

	If WindowClass == Class_Webex Then
		Saystring (msgErrNoDialogTransfer)
		BrailleMessage (msgErrNoDialogTransfer)
		SayString (GetControlName ())
		BrailleMessage (GetControlName ())
		Return
	EndIf

	If WindowClass == Class_Dialog Then
		If StringContains(WindowTitle, ConferenceDialogTitle) != 0 Then
			SayString (msgErrConfBlock)
			BrailleMessage (msgErrConfBlock)
			Return
		EndIf
		If sID == AutomationID_ResultsList || sClassName == EntryEditClass Then
			SpeechOff ()
			TypeKey("Tab")
			TypeKey("Tab")
			Pause ()
			TextControl = GetControlName ()
			ValueComparison = StringContains(TextControl, CheckFirstButton) 
			SpeechOn ()
		EndIf

		If ValueComparison != 0 Then
			SpeechOn ()
			TypeKey ("Space")
			SayString (msgActConsulting)
			BrailleMessage (msgActConsulting)
			Return
		EndIf
		TextControl = GetControlName ()
		ValueComparison = StringContains(TextControl, CheckFirstButton) 
		While ValueComparison == 0 && Counter != MaxCount
			SpeechOff ()
			Let Counter = Counter + 1
			TypeKey("Tab")
			Pause ()
			TextControl = GetControlName ()
			ValueComparison = StringContains(TextControl, CheckFirstButton) 
		EndWhile
		If ValueComparison  != 0 Then
			SpeechOn ()
			TypeKey ("Space")
			SayString (msgActConsulting)
			BrailleMessage (msgActConsulting)
			Return
		EndIf
		SpeechOn ()
		SayString(msgErrConsultNotFound)
		BrailleMessage (msgErrConsultNotFound)
	Else
		SayString (msgErrNoDialogGeneric)
		BrailleMessage (msgErrNoDialogGeneric)
	EndIf
EndScript

Script ActivateTransferNowButton ()
	Var
		String WindowClass, 
		Int Counter,
		Int MaxCount,
		Int iFound,
		String TextControl,
		String sClassName,
		String sID,
		Int ValueComparison

	;	WindowTitle = GetWindowName (GetFocus ()) ;Descartada por actualización de Webex de 17 de febrero de 2026
	WindowTitle = GetWindowName (GetAppMainWindow(GetCurrentWindow ()))
	WindowClass = GetWindowClass (GetAppMainWindow(GetCurrentWindow ()))
	sClassName = GetObjectClassName(0) 
	sID = GetObjectAutomationId(0)
	TextControl = GetControlName ()
	ValueComparison = StringContains(TextControl, TransferNowButton) 

	If StringContains(WindowTitle, WebexWindowTitle) != 0 || StringContains(WindowTitle, DiagnosticTitle) != 0 || StringContains(WindowTitle, CiscoTitle) != 0 || StringContains(WindowTitle, HelpTitle) != 0 || StringContains(WindowTitle, SettingsTitle) != 0 || StringContains(WindowTitle, MenuTitle) != 0 || StringIsBlank (WindowTitle) Then
		; Si en el título de la ventana enfocada aparece "Webex", Diagnóstico", "Configura", "Menú", "Ayuda", "Cisco",, no es la ventana de una llamada activa, por que si fuese así, el título sería el número del llamante, o el nombre del mismo si está entre los contactos registrados. 
		SayString (msgErrNoCallWindow)
		BrailleMessage (msgErrNoCallWindow)
		Return
	EndIf

	If WindowClass == Class_Dialog Then
		; Si hay un cuadro de diálogo en primer plano con el nombre de la clase de ventana que suelen tener los cuadros de diálogo en Webex (se han excluido varios por su 
		; título en la condición anterior).
		If StringContains(WindowTitle, ConferenceDialogTitle) != 0 Then
		; Si es el de conferencia se informa de ello y de que no tiene botón para transferir ahora.
			SayString (msgErrConfBlock)
			BrailleMessage (msgErrConfBlock)
			Return
		EndIf
		; Si no es el de conferencia el que está abierto
		; *** PARTE PARA ACTIVAR EL BOTÓN TRASFERIR AHORA DURANTE UNA TRANSFERENCIA *** 
		If sID == AutomationID_ResultsList || sClassName == EntryEditClass Then
			; Se detecta si el foco está en el cuadro de edición donde se escribe el numero a donde se va a transferir o en la lista de resultados de búsqueda.
			; Para ello, se recurre al nombre de la clase del primero o al automationID del segundo,
			; y si es así se avanza rápidamente con tabulador ahsta la posición habitual del botón Transferir ahora. 
			SpeechOff ()
			TypeKey("Tab")
			TypeKey("Tab")
			TypeKey("Tab")
			Pause ()
			TextControl = GetControlName ()
			ValueComparison = StringContains(TextControl, TransferNowButton) 
			; Y se evalúa si en el nombre del control está parte de la etiqueta del botón Transferir ahora
			SpeechOn ()
		EndIf
		If ValueComparison != 0 Then
			; Si se localiza parte de la etiqueta del botón Transferir ahora 
			SpeechOn ()
			TypeKey ("Space")
			SayString (msgActTransferring)
			BrailleMessage (msgActTransferring)
			Return
		EndIf
		; Si por el motivo que sea no se está sobre el botón Transferir ahora porque no se localiza parte de su etiqueta en los nombres de los controles focalizados hasta ese momento,
		TextControl = GetControlName ()
		ValueComparison = StringContains(TextControl, TransferNowButton) 
		Let Counter = 0
		Let MaxCount = 9
		Let iFound = 0
		While iFound == 0 && Counter < MaxCount
			; Se lanza una búsqueda secuencial que se mantiene mientras que no se encuentre parte de la etiqueta del botón Transferir ahora o se alcance el máximo de búsquedas permitidas
			SpeechOff ()
			TypeKey("Tab")
			Pause ()
			TextControl = GetControlName ()
			ValueComparison = StringContains(TextControl, TransferNowButton) 
			If ValueComparison != 0 Then
			 Let iFound = 1; Se ha localizado el botón transferir ahora en esta búsqueda secuencial 
			EndIf
			
			Let Counter = Counter + 1
		EndWhile
		If iFound == 1 Then
			; Si se ha encontrado algún control con parte de la etiqueta del botón Transferir ahora,
		; se acttiva y se anuncia
			SpeechOn ()
			TypeKey ("Space")
			SayString (msgActTransferring)
			BrailleMessage (msgActTransferring)
			Return
		Else
		; Si no se encuentra, se anuncia.
			SpeechOn ()
			SayString(msgErrTransferNotFound)
			BrailleMessage (msgErrTransferNotFound)
		EndIf
	Else
	; *** PARTE PARA COMPLETAR UNA TRANSFERENCIA EN CURSO ***
		; Si no hay en primer plano ningún diálogo con la clase de ventana típico en esta aplicación, y tampoco se está en alguna otra ventana o menú de los excluidos en la primera condición de este script
		TextControl = GetControlName ()
		If StringContains(TextControl, TransferButton) != 0 || StringContains(TextControl, ResumeButton) != 0 || StringContains(TextControl, OnHoldCallState) != 0 Then 
			; Si se encuentran los botones Transferir o Reanudar, o la etiqueta "espera" en el nombre de los objetos,
			; es porque hay una llamada en espera pero no hay ninguna llamada de destino en primer plano,
			; y se informa de ello, por tanto.
			SpeechOn ()			
			SayString (msgErrHoldNoDest)
			BrailleMessage (msgErrHoldNoDest)
			SayString (GetControlName ())	
			BrailleMessage (GetControlName ())	
			Return
		EndIf
		ValueComparison = StringContains(TextControl, CompleteTransferButton) 		
		If ValueComparison != 0 Then
			; Si se detecta parte de la etiqueta del botón Completar transferencia en el nombre del objeto focalizado,
			; se activa este y se informa de que se está completando la transferencia, si las teclas rápidas se han pulsado sólo una vez.
			; así que se evalúa cómo se ha pulsado la tecla rápida
			If IsSameScript () == 0 Then
				; 1. Si se ha hecho una pulsación simple
				TypeKey ("space")		
				Pause ()
				SpeechOn ()
				; SayString ("Directamente sobre botón") (mensaje usado para depurar fallos del script)
				SayString (msgActCompleting)        
				BrailleMessage (msgActCompleting)
				Return
			Else
				; 2. Si se ha hecho una pulsación doble, para tratar de buscar de nuevo el cotón completar transferencia
				; de otra forma teóricamente definitiva
				Let Counter = 0
				Let MaxCount = 5 ; Límite de seguridad para no entrar en bucle infinito
        Let iFound = 0
				SpeechOff ()
				While iFound == 0 && Counter < MaxCount
					TypeKey ("Shift+F6") ; Se retrocede un elemento en la interfaz
					Pause ()
					TextControl = GetControlName () ; Se comprueba donde está el foco realmente
					If StringContains(TextControl, CompleteTransferButton) != 0 Then
						Let iFound = 1 ; Se ha localizado el botón completar transferencia en esta búsqueda alternativa
					EndIf
            
					Let Counter = Counter + 1
				EndWhile
        
				SpeechOn ()
        				; Si ha encontrado el botón completar transferencia de forma dinámica, lo activa independientemente de los pasos que haya tomado
				If iFound == 1 Then
					TypeKey ("space")
					Saystring (msgActCompleting)       
					BrailleMessage (msgActCompleting)
				Return
				Else
					; Si algo ha fallado en la búsqueda alternativa, se informa de que no se ha localizado el botón
					SayString (msgErrCompleteNotFound) ; Usando tu constante de "No encontrado"
					BrailleMessage (msgErrCompleteNotFound) ; Usando tu constante de "No encontrado"
					Return
				EndIf ; Fin de la condición de que se haya encontrado el botón completar transferencia tras la búsqueda alternativa lanzada con doble pulsación de la tecla rápida
			EndIf; Fin de la condición de que se haya pulsado una o dos veces la cecla rápida

		Else
;			SpeechOff ()
			; Como no se ha detectado, de momento, que la llamada esté en espera o que el botón Completar Transferencia esté focalizado, se va a buscar con F6 este último de forma secuencial.
			;TypeKey ("F6")		
			;Pause ()
			;TextControl = GetControlName ()
			;ValueComparison = StringContains(TextControl, CompleteTransferButton) 
			Let Counter = 0
			Let MaxCount = 5
			Let iFound = 0

			While iFound == 0 && Counter != MaxCount

				SpeechOff ()
				TypeKey("F6")
				Pause ()
				TextControl = GetControlName ()
				ValueComparison = StringContains(TextControl, CompleteTransferButton)
				; Mientras no se encuentre un objeto que coincida con parte de la etiqueta del botón Completar transferencia
				If StringContains(TextControl, TransferButton) != 0 || StringContains(TextControl, ResumeButton) != 0 || StringContains(TextControl, OnHoldCallState) != 0 Then 
					; Si durante la búsqueda secuencial se encuentran los botones Transferir o Reanudar, o la etiqueta "espera" en el nombre de los objetos,
					; es porque hay una llamada en espera pero no hay ninguna de destino focalizada,
					; y por tanto, no se puede completar la transferencia.
					SpeechOn ()
					SayString (msgErrHoldNoFocus)
					BrailleMessage (msgErrHoldNoFocus)
					SayString (GetControlName ())
										BrailleMessage (GetControlName ())
					Return
				EndIf
				; Si no se han encontrado las etiquetas mencionadas, se continúa rotando, obteniendo el nombre de los objetos y comparándolos con el texto del botón completar transferencia.
				If ValueComparison != 0 Then
					Let iFound = 1
				EndIf
				Let Counter = Counter + 1
			EndWhile
			If IFound == 1 Then
				; Si se detecta parte de la etiqueta del botón Completar transferencia en el nombre del objeto focalizado,
				; se activa y se informa de ello, si la tecla rápida se ha pulsado sólo una vez.
				; así que se evalúa cómo se ha pulsado la tecla rápida
				If IsSameScript () == 0 Then
					; 1. Si se ha hecho una pulsación simple
					TypeKey ("space")		
					Pause ()
					SpeechOn ()
					; SayString ("Activado tras secuencial") (mensaje usado para depurar fallos del script)
					SayString (msgActCompleting)        
					BrailleMessage (msgActCompleting)
					Return
				Else
					; 2. Si se ha hecho una pulsación doble, para tratar de buscar de nuevo el cotón completar transferencia
					; de otra forma teóricamente definitiva
					Let Counter = 0
					Let MaxCount = 5 ; Límite de seguridad para no entrar en bucle infinito
			Let iFound = 0
					SpeechOff ()
					While iFound == 0 && Counter < MaxCount
						TypeKey ("Shift+F6") ; Se retrocede un elemento en la interfaz
						Pause ()
						TextControl = GetControlName () ; Se comprueba donde está el foco realmente
						If StringContains(TextControl, CompleteTransferButton) != 0 Then
							Let iFound = 1 ; Se ha localizado el botón completar transferencia en esta búsqueda alternativa
						EndIf
            
						Let Counter = Counter + 1
					EndWhile
        
					SpeechOn ()
							; Si ha encontrado el botón completar transferencia de forma dinámica, lo activa independientemente de los pasos que haya tomado
					If iFound == 1 Then
						TypeKey ("space")
						Saystring (msgActCompleting)       
						BrailleMessage (msgActCompleting)
					Return
					Else
						; Si algo ha fallado en la búsqueda alternativa, se informa de que no se ha localizado el botón
						SayString (msgErrCompleteNotFound) ; Usando tu constante de "No encontrado"
						BrailleMessage (msgErrCompleteNotFound) ; Usando tu constante de "No encontrado"
						Return
					EndIf ; Fin de la condición de que se haya encontrado el botón completar transferencia tras la búsqueda alternativa lanzada con doble pulsación de la tecla rápida
				EndIf; Fin de la condición de que se haya pulsado una o dos veces la cecla rápida
			EndIf ; fin de la condición de que se haya encontrado el botón completar transferencia en la búsqueda secuencial habitual  
			If StringContains(TextControl, TransferButton) != 0 || StringContains(TextControl, ResumeButton) != 0 || StringContains(TextControl, OnHoldCallState) != 0 Then 
				; Si se encuentran los botones Transferir o Reanudar, o la etiqueta "espera" en el nombre de los objetos,
				; es porque hay una llamada en espera pero no hay ninguna de destino focalizada,
				; y por tanto, no se puede completar la transferencia.
				SpeechOn ()
				SayString (msgErrHoldNoFocus)
				BrailleMessage (msgErrHoldNoFocus)
								SayString (GetControlName ())
				BrailleMessage (GetControlName ())
				Return
			EndIf
			If Counter == MaxCount || IFound == 0 Then
			; si se llega al límite de búsquedas o no se ha localizado la etiqueta del botón completar transferencia durante las mismas, es porque no se ha encontrado el botón de completar transferencia,
			; y se informa de ello.
				SpeechOn ()
				SayString (msgErrCompleteNotFound)
				BrailleMessage (msgErrCompleteNotFound)
				SayString (GetControlName ())		
				BrailleMessage (GetControlName ())		
				Return
			EndIf
		
		EndIf ; Aquí ha terminado  la condición de si no se encuentra focalizado el botón Completar transferencia
	EndIf ; Aquí ha terminado la condición de si no hay algún diálogo abierto con su clase de ventana típica o alguno de los no exluidos en la primera condición
EndScript

Script ActivateEraseEntryButton ()
	Var
		String WindowClass, 
		String sName,
		Int Counter,
		Int MaxCount,
		string sClassName,
		Int ValueComparison 

	Let Counter = 0
	Let MaxCount = 9

	WindowTitle = GetWindowName (GetAppMainWindow(GetCurrentWindow ()))
	WindowClass = GetWindowClass (GetAppMainWindow(GetCurrentWindow ()))
	sClassName = GetObjectClassName(0)
	sName = GetControlName()

		If WindowClass == Class_Webex Then
		; Si el nombre del tipo de  ventana es la genérica de la aplicación,
	; se comprueba que no está abierta una ventana con información del perfil de algún contacto
		If WindowTitle == ContactProfileTitle then
			SayString (msgerrProfBlock)
			BrailleMessage (msgerrProfBlock)
			Return
		EndIf
		; Si la ventana principal de Webex está en primer plano o una de lista de resultados de búsqueda,
		If WindowTitle == WebexWindowTitle || StringIsBlank (WindowTitle) || StringContains(WindowTitle, ResultsListViewTitle) != 0 then
			; se comprueba si ya se está sobre el botón de borrar la búsqueda de la ventana general del programa,
			If StringContains (sName, EraseEntryButton) != 0 Then
							; y si es así se activa el botón.
				TypeKey ("Space")
				SayString (msgActErased)
				BrailleMessage (msgActErased)
				Return
			Else
				; Si no se está sobre el botón para borrar la búsqueda,
				; se va a buscar desde el cuadro de edición de búsqueda,
				; al que se llega pulsando Control + f
				SpeechOff ()
				TypeKey ("Control+F")
				TypeKey ("tab")
				Pause ()
				sName = GetControlName()
				; Y si el siguiente objeto a él es el botón "Conectar a un dispositivo",
				; es porque no hay ninguna búsqueda desplegada,
				; y por tanto, ningún botón para borrarla disponible.
				If StringContains(sName, JoinDeviceButton) != 0 Then
					SpeechOn ()
					SayString (msgErrTextEntryNoFound)
					BrailleMessage (msgErrTextEntryNoFound)
					TypeKey ("Control+F")
					Return
				EndIf
				; Si el botón que se encuentra a continuación es el de borrar búsqueda se activa.
				If StringContains (sName, EraseEntryButton) != 0 Then
					SpeechOn ()
					TypeKey ("Space")
					SayString (msgActErased)
					BrailleMessage (msgActErased)
					Return
				EndIf
				; Y si no lo es, se lanza una búsqueda secuencial
				; hasta que se encuentre el botón Conectar a un dispositivo" (no hay botón para borrar la entrada),
				; el botón borrar búsqueda, o se supere un cierto número de búsquedas. 
				While StringContains (sName, EraseEntryButton) == 0 && StringContains (sName, JoinDeviceButton) == 0 && Counter != MaxCount
					SpeechOff ()
					TypeKey("Tab")
					Pause ()
					sName = GetControlName()
					Let Counter = Counter + 1
					SpeechOn ()
				EndWhile
				; Si se localiza el botón borrar búsqueda se activa.
				If StringContains (sName, EraseEntryButton) != 0 then
					SpeechOn ()
					TypeKey ("Space")
					SayString (msgActErased)
					BrailleMessage (msgActErased)
					Return
				EndIf
				; Y si se localiza el botón "Conectar a un dispositivo" (se ha superado el área de búsqueda sin localizar el botón de borrarla),
				; o se alcanza el máximo de búsquedas secuenciales indicado, se informa de ello.
				If StringContains (sName, JoinDeviceButton) != 0 || Counter == MaxCount then
					SayString(msgErrEraseNotFound)
					BrailleMessage (msgErrEraseNotFound)
					Return
				EndIf
					
			EndIf; Fin de la condición de estar o no directamente sobre un botón de Cborrar búsqueda.
		EndIf ; Fin de la condición de estar en la ventana principal de Webex o en una de resultados de búsqueda.
	EndIf ; Fin de la condición de que se esté en una ventana con el nombre de clase genérico del programa.
	
	; Si se está en una ventana con el nombre de clase típico de ciertos diálogos de Webex, como el de  transferencia o conferencia.	
	If WindowClass == Class_Dialog Then
		; Si el control actual ya es el botón de borrado, identificado por su clase específica WSvgPushButton, lo activa inmediatamente.
		If SClassName == EraseEntryClass Then
			SpeechOn ()
			TypeKey ("Space")
			SayString (msgActErased)
			BrailleMessage (msgActErased)
			Return
		EndIf
		; Si no está sobre el botón, lanza la búsqueda secuencial con Tabulador mientras no coincida la clase de control o se agoten los intentos.
		While sClassName != EraseEntryClass && Counter != MaxCount
			SpeechOff ()
			TypeKey("Tab")
			Pause ()
			Let Counter = Counter + 1
			sClassName = GetObjectClassName(0)
		EndWhile
		If sClassName == EraseEntryClass Then
			; Si tras el bucle la clase coincide con la del botón de borrar, se ejecuta la acción.
			SpeechOn ()
			TypeKey ("Space")
			SayString (msgActErased)
			BrailleMessage (msgActErased)
			Return
		EndIf
		SpeechOn ()       
		SayString(msgErrEraseNotFound)
		BrailleMessage (msgErrEraseNotFound)
		Return
	Else
		; Si la ventana enfocada no se identifica como un diálogo de Webex.
		SayString (msgErrNoDialogErase)
		BrailleMessage (msgErrNoDialogErase)
	EndIf
	

EndScript



Script ActivateCancelButton ()
	Var
		String WindowClass, 
		Int Counter,
		Int MaxCount,
		String TextControl,
		String sClassName 

	Let Counter = 0
	Let MaxCount = 9

	WindowClass = GetWindowClass (GetAppMainWindow(GetCurrentWindow ()))
	sClassName = GetObjectClassName(0)
	If WindowClass == Class_Dialog Then
		; Verifica si el objeto enfocado actualmente es el botón Cancelar mediante su clase única VectorButton.
		If sClassName == CancelDialogClass Then
			SpeechOn ()
			TypeKey ("Space")
			SayString (msgActCancelled)
			BrailleMessage (msgActCancelled)
			Return
		EndIf
		; Inicia la búsqueda inversa (Shift + Tab) para localizar el botón Cancelar, que suele estar al final o principio del orden de tabulación.
		While sClassName != CancelDialogClass && Counter != MaxCount
			SpeechOff ()
			TypeKey("Shift + Tab")
			Pause ()
			Let Counter = Counter + 1
			sClassName = GetObjectClassName(0)
		EndWhile
		If sClassName == CancelDialogClass Then
			; Si se ha localizado el botón con la clase VectorButton, se pulsa espacio.
			SpeechOn ()
			TypeKey ("Space")
			SayString (msgActCancelled)
			BrailleMessage (msgActCancelled)
			Return
		EndIf
		SpeechOn ()       
		SayString(msgErrCancelNotFound)
		BrailleMessage (msgErrCancelNotFound)
	Else
		; Si no hay focalizado ningún cuadro de diálogo válido.
		SayString (msgErrNoDialogCancel)
		BrailleMessage (msgErrNoDialogCancel)
	EndIf
EndScript


Script ActivateKeyboardButton ()
	Var
		String sID,
		String TextControl,
		Int Counter,
		Int MaxCount

	Let Counter = 0
	Let MaxCount = 18

	WindowTitle = GetWindowName (GetAppMainWindow(GetCurrentWindow ()))
	sID = GetObjectAutomationId(0)
	TextControl = GetControlName ()
	If StringContains(WindowTitle, WebexWindowTitle) != 0 || StringContains(WindowTitle, DiagnosticTitle) != 0 || StringContains(WindowTitle, CiscoTitle) != 0 || StringContains(WindowTitle, HelpTitle) != 0 || StringContains(WindowTitle, SettingsTitle) != 0 || StringContains(WindowTitle, MenuTitle) != 0 || StringIsBlank (WindowTitle) Then
		; Si en el título de la ventana enfocada aparece "Webex", Diagnóstico", "Configura", "Menú", "Ayuda", "Cisco",, no es la ventana de una llamada activa, por que si fuese así, el título sería el número del llamante, o el nombre del mismo si está entre los contactos registrados. 
		SayString (msgErrNoCallWindow)
		BrailleMessage (msgErrNoCallWindow)
		Return
	Else
		; Si el título de la ventana no es Webex
		If StringContains(WindowTitle, DialogTitle) != 0 || StringContains(WindowTitle, ResultsListViewTitle) != 0 Then
			; Si en el texto del título de la ventana aparece "diálogo" o "Viendo lista" significa que el diálogo de transferencia o algún 
			; otro (de combinar llamadas en conferencia, por ejemplo) está abierto, y que por tanto, no está disponible el botón que despliega el teclado
			SayString (msgErrKeyboardDialogBlock)
			BrailleMessage (msgErrKeyboardDialogBlock)
			Return
		Else
			; Si el diálogo de transferencia o algún otro cuadro de diálogo no está abierto
			; Se comprueba si se está sobre el botón Silenciar o Desactivar silencio,
			; y si es así, se tabula 4veces para avanzar rápidamente hasta el botón del teclado
			If StringContains (TextControl, MuteButton) != 0 Then
				SpeechOff ()
				TypeKey("Tab")
				TypeKey("Tab")
				TypeKey("Tab")
				TypeKey("Tab")
				Pause ()
				sID = GetObjectAutomationId(0)
				TextControl = GetControlName ()
				SpeechOn ()
			EndIf

			; se comprueba si ya se está sobre el botón para abrir el teclado
			If sID == AutomationID_Keyboard then
				; y si es así se activa el botón.
				TypeKey ("Space")
				SayString (msgActKeyboard)
				BrailleMessage (msgActKeyboard)
				Return
			Else
				; Si no se está sobre el botón para abrir el teclado,
				; se lanza una búsqueda secuencial con tabulador
				; hasta que se encuentre o se supere un cierto número de búsquedas. 
				While sID != AutomationID_Keyboard && Counter != MaxCount
					SpeechOff ()
					TypeKey("Tab")
					Pause ()
					sID = GetObjectAutomationId(0)
					TextControl = GetControlName ()
					Let Counter = Counter + 1
					SpeechOn ()
					If Counter == 9 then
						SayString (msgSearchingKeyboard)
						BrailleMessage (msgSearchingKeyboard)
					EndIf
					; Se comprueba si se está sobre el botón Silenciar o Desactivar silencio,
					; y si es así, se tabula 4veces para avanzar rápidamente hasta el botón del teclado
					If StringContains (TextControl, MuteButton) != 0 Then
						SpeechOff ()
						TypeKey("Tab")
						TypeKey("Tab")
						TypeKey("Tab")
						TypeKey("Tab")
						Pause ()
						sID = GetObjectAutomationId(0)
						TextControl = GetControlName ()
						SpeechOn ()
					EndIf

				EndWhile
				; Si se localiza el botón que abre el teclado se activa.
				If sID == AutomationID_Keyboard then
					SpeechOn ()
					TypeKey ("Space")
					SayString (msgActKeyboard)
					BrailleMessage (msgActKeyboard)
					Return
				EndIf
				; Si se alcanza el máximo de búsquedas secuenciales prefijado,
				; es porque algo ha pasado y no se ha podido localizar el botón del teclado
				If Counter == MaxCount then
					SayString(msgErrKeyboardNotFound)
					BrailleMessage (msgErrKeyboardNotFound)
					Return
				EndIf
					
			EndIf  ; Fin de la condición de estar o no directamente sobre el botón para abrir el teclado de marcación
		EndIf ; Fin de la condición de que se esté en una ventana de llamada
	EndIf ; Fin de la condición que la ventana de Webex u otras que no son de llamadas estén abiertas.  
EndScript


Script GetHistorialList ()
Var
		string sID,
		String sClassObject,
		Int Counter,
		Int MaxCount

	Let Counter = 0
	Let MaxCount = 18

	sClassObject = GetObjectClassName(0)	
	sID = GetObjectAutomationId(0)

	; Como todos los objetos de la ventanan principal de Webex han pasado a tener el mismo AutomationID a partir de la actualización de mayo de 2026,
	; excepto los relativos al historial de llamadas, que comparten un mismo prefijo,
	; por ese código de los objetos se puede detectar si se está en la ventana principal o no.
			If StringContains (sID, AutomationID_MainWindowObject) != 0 || StringContains (sID, AutomationID_CallHistoryList) != 0 Then
		;Si se está sobre un objeto de la ventana principal, se lleva el foco al cuadro de búsqueda y de ahí se retrocede directamente hasta la lista del historial
		SpeechOff ()
		TypeKey ("Control+F")
		TypeKey ("shift + tab")
		TypeKey ("shift + tab")
		TypeKey ("shift + tab")
		TypeKey ("shift + tab")
		TypeKey ("shift + tab")
		Pause ()
		SpeechOn ()				
		sClassObject = GetObjectClassName(0)	
			If StringContains (sClassObject, CallHistoryListClass) != 0 Then
			; Si todo ha ido bien se habrá alcanzado la lista del historial, y si es así (se sabe por parte del nombre de su clase) se anuncia
			SayString (msgGetCallHistoryList)
			BrailleMessage (msgGetCallHistoryList)
			Return
		Else
			; Si no se está sobre el historial de llamadas (la distibución de los objetos de la ventana principal no es la misma que en el programa que se ha usado para hacer estos scripts),
			; se lanza una búsqueda secuencial con tabulador
			; hasta que se encuentre o se supere un cierto número de búsquedas. 
			While StringContains (sClassObject, CallHistoryListClass) == 0 && Counter != MaxCount
				SpeechOff ()
				TypeKey("Tab")
				Pause ()
				sClassObject = GetObjectClassName(0)	
				Let Counter = Counter + 1
				SpeechOn ()
				If Counter == 9 then
					SayString (msgSearchingCallHistoryList)
					BrailleMessage (msgSearchingCallHistoryList)
				EndIf
			EndWhile
			; Si se localiza la lista del historial se anuncia.
			If StringContains (sClassObject, CallHistoryListClass) != 0 Then
				SpeechOn ()
				SayString (msgGetCallHistoryList)
				BrailleMessage (msgGetCallHistoryList)
				Return
			EndIf
			; Si se alcanza el máximo de búsquedas secuenciales prefijado,
			; es porque algo ha pasado y no se ha podido localizar el historial de llamadas.
			If Counter == MaxCount then
				SayString(msgErrCallHistoryListNotFound)
				BrailleMessage (msgErrCallHistoryListNotFound)
				Return
			EndIf
		EndIf ; Fin de la condición de estar el foco sobre la lista del historial de llamadas. 
	Else
		; Si el objeto que tiene el foco no es uno de la ventana principal o hay algún menú desplegado en ese momento,
		; no se puede acceder a la lista del historial de llamadas, y por tanto, se informa de ello. 
		SayString (msgNoCallHistoryListWindow)
		BrailleMessage (msgNoCallHistoryListWindow)
		Return
	EndIf ; Fin de la condición de estar en un objeto de la ventana principal

EndScript
