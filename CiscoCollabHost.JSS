	; Webex script file versión v1.1
	; * Iniciados por David Prior en diciembre de 2025 para la versión 2025.2508.120 de Jaws.
	; * Versión 1.0 terminada el 30/01/2026
	; * Versión 1.1 terminada el 05/02/2026.
 ; - Corregido que cuando se activa el comando para borrar el texto del cuadro de edición de búsqueda de la pantalla principal de Webex y no hay texto en él,
; el foco quede en dicho cuadro de edición en lugar de en el objeto siguiente (botón "Conectar a un dispositivo" en mis pruebas).

	; Los controles que activan estos scripts se buscan de forma secuencial a través de La repetición de la pulsación de la tecla tabulador Por las diferentes ventanas Y cuadros de diálogo de la aplicación,
	; ya que Se ha intentado buscar los automation y de Por la jerarquía de objetos de la aplicación pero no se ha logrado localizar de esta forma,
	; y además, algunos objetos ni siquiera Tienen un automation ID Único o Con alguna etiqueta incorporada.
	
	; Estos scripts se han creado y probado en una Edición de Webex en español con un número de teléfono asociado en el que hay una cola de llamadas vinculada y que forma parte de un grupo de extensiones,
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
	Class_Webex = "Qt653QWindowIcon",
Class_Dialog = "Qt653QWindowToolSaveBits",
CancelDialogClass = "VectorButton",
EraseEntryClass = "WSvgPushButton",
EntryEditClass = "WLineEdit",	
;Automation ID's
AutomationID_MainWindowObject = "MainWindow.ConversationsForm.topLevelStack.mainAreasWidget.appl",
AutomationID_Keyboard = "Main_CallStripButton_Keypad",
AutomationID_ResultsList = "focusAnchorItem",
AutomationID_MuteButton = "Main_CallStripButton_Audio",
AutomationID_ResumeButton = "Main_CallStripButton_Resume",
AutomationID_TransferButton = "Main_CallStripButton_Transfer",
AutomationID_ClearSearch = "InputBoxContainer.clearSearchBoxButton",
; Control Names and Texts		
TransferNowButton = "ransfer",
CheckfirstButton = "onsult",
EraseEntryButton = "Borrar entrada",
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
		UserBufferAddText (cScBufferNewLine)		SayFormattedMessage(OT_User_Buffer, msgDiagWinName + WindowName)
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
	WindowTitle = GetWindowName (GetFocus ())
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
	WindowTitle = GetWindowName (GetFocus ())
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
		String TextControl,
		String sClassName,
		String sID,
		Int ValueComparison

	Let Counter = 0
	Let MaxCount = 9
	WindowTitle = GetWindowName (GetFocus ())
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
			SayString (msgErrConfBlock)
			BrailleMessage (msgErrConfBlock)
			Return
		EndIf
		; Si no es el de conferencia el que está abierto
		If sID == AutomationID_ResultsList || sClassName == EntryEditClass Then
			; Se detecta si el foco está en el cuadro de edición donde se escribe el numero a donde se va a transferir o en la lista de resultados de búsqueda.
			; Para ello, se recurre al nombre de la clase del primero o al automationID del segundo.
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
		While ValueComparison == 0 && Counter != MaxCount
			; Se lanza una búsqueda secuencial que se mantiene mientras ue no se encuentre parte de la etiqueta del botón Transferir ahora o se alcance el máximo de búsquedas permitidas
			SpeechOff ()
			Let Counter = Counter + 1
			TypeKey("Tab")
			Pause ()
			TextControl = GetControlName ()
			ValueComparison = StringContains(TextControl, TransferNowButton) 
		EndWhile
		If ValueComparison  != 0 Then
			; Si se ha encontrado algún control con parte de la etiqueta del botón Transferir ahora,
			SpeechOn ()
			TypeKey ("Space")
			SayString (msgActTransferring)
			BrailleMessage (msgActTransferring)
			Return
		Else
			SpeechOn ()
			SayString(msgErrTransferNotFound)
			BrailleMessage (msgErrTransferNotFound)
		EndIf
	Else
		; Si no hay en primer plano ningún diálogo con la clase de ventana típico en esta aplicación, y tampoco se está en alguna otra ventana o menú de los excluidos en la primera condición de este script
		TextControl = GetControlName ()
		If StringContains(TextControl, TransferButton) != 0 || StringContains(TextControl, ResumeButton) != 0 || StringContains(TextControl, OnHoldCallState) != 0 Then 
			; Si se encuentran los botones Transferir o Reanudar, o la etiqueta "espera" en el nombre de los objetos
			SpeechOn ()			
			SayString (msgErrHoldNoDest)
			BrailleMessage (msgErrHoldNoDest)
			SayString (GetControlName ())	
			Return
		EndIf
		ValueComparison = StringContains(TextControl, CompleteTransferButton) 		
		If ValueComparison != 0 Then
			; Si se detecta parte de la etiqueta del botón Completar transferencia en el nombre del objeto focalizado
			TypeKey ("space")		
			Pause ()
			SpeechOn ()
			Saystring (msgActCompleting)        
			BrailleMessage (msgActCompleting)
			Return
		Else
			SpeechOff ()
			; Como no se ha detectado, de momento, que la llamada esté en espera o que el botón Completar Transferencia esté focalizado, se va a buscar con F6 este último.
			TypeKey ("F6")		
			Pause ()
			TextControl = GetControlName ()
			ValueComparison = StringContains(TextControl, CompleteTransferButton) 
			MaxCount = 5
			; Y se compara el texto del objeto que tiene el foco con la etiqueta de Completar transferencia
			While ValueComparison == 0 && Counter != MaxCount
				; Mientras no se encuentre un objeto que coincida con parte de la etiqueta del botón Completar transferencia
				If StringContains(TextControl, TransferButton) != 0 || StringContains(TextControl, ResumeButton) != 0 || StringContains(TextControl, OnHoldCallState) != 0 Then 
					; Si se encuentran los botones Transferir o Reanudar, o la etiqueta "espera" en el nombre de los objetos
					SpeechOn ()
					SayString (msgErrHoldNoFocus)
					BrailleMessage (msgErrHoldNoFocus)
					SayString (GetControlName ())
					Return
				EndIf
				SpeechOff ()
				Let Counter = Counter + 1
				TypeKey("F6")
				Pause ()
				TextControl = GetControlName ()
				ValueComparison = StringContains(TextControl, CompleteTransferButton)
				; Se continúa rotando, obteniendo el nombre de los objetos y comparándolos con el texto común para los estados de silenciar
			EndWhile
			If ValueComparison != 0 Then
				; Si se detecta parte de la etiqueta del botón Completar transferencia en el nombre del objeto focalizado
				TypeKey ("space")		
				Pause ()
				SpeechOn ()
				Saystring (msgActCompleting)        
				BrailleMessage (msgActCompleting)
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
				SayString (msgErrCompleteNotFound)
				BrailleMessage (msgErrCompleteNotFound)
				SayString (GetControlName ())		
				Return
			EndIf
		
		EndIf ; Aquí ha terminado  la condición de si no se encuentra focalizado el botón Completar transferencia
	EndIf ; Aquí ha terminado la condición de si no hay algún diálogo abierto con su clase de ventana típica o alguno de los no exluidos en la primera condición
EndScript

Script ActivateEraseEntryButton ()
	Var
		String WindowClass, 
		String sID,
		Int Counter,
		Int MaxCount,
		string sClassName 

	Let Counter = 0
	Let MaxCount = 9

	WindowTitle = GetWindowName (GetFocus ())
	WindowClass = GetWindowClass (GetAppMainWindow(GetCurrentWindow ()))
	sClassName = GetObjectClassName(0)
	sID = GetObjectAutomationId(0)

	If WindowClass == Class_Webex Then
	; Si el nombre del tipo de  ventana es la genérica de la aplicación,
	; se comprueba que no está abierta una ventana con información del perfil de algún contacto
		If WindowTitle == ContactProfileTitle then
			SayString (msgerrProfBlock)
			BrailleMessage (msgerrProfBlock)
			Return
		EndIf
		; Si la ventana principal de Webex está en primer plano o una de lista de resultados de búsqueda,
		If WindowTitle == WebexWindowTitle || StringContains(WindowTitle, ResultsListViewTitle) != 0 then
			; se comprueba si ya se está sobre el botón de borrar la entrada de la búsqueda general del programa,
			If sID == AutomationID_ClearSearch then
				; y si es así se activa el botón.
				TypeKey ("Space")
				SayString (msgActErased)
				BrailleMessage (msgActErased)
				Return
			Else
				; Si no se está sobre el botón para borrar la entrada,
				; se va a buscar desde el cuadro de edición de búsqueda,
				; al que se llega pulsando Control + f
				SpeechOff ()
				TypeKey ("Control+F")
				TypeKey ("tab")
				Pause ()
				sID = GetObjectAutomationId(0)
		; Y si el siguiente objeto a él es uno de los de la ventana principal,
				; es porque no hay ninguna búsqueda desplegada,
				; y por tanto, ningún botón de borrar entrada disponible.
				If sID == AutomationID_MainWindowObject then
					SpeechOn ()
					SayString (msgErrTextEntryNoFound)
					BrailleMessage (msgErrTextEntryNoFound)
					SpeechOff ()
					TypeKey ("Control+F")
					SpeechON ()
					Return
				EndIf
				; Si el botón que se encuentra a continuación es el de borrar entrada se activa.
				If sID == AutomationID_ClearSearch then
					SpeechOn ()
					TypeKey ("Space")
					SayString (msgActErased)
					BrailleMessage (msgActErased)
					Return
				EndIf
				; Y si no lo es, se lanza una búsqueda secuancial
				; hasta que se encuentre un objeto de la ventana principal (no hay botón para borrar la entrada),
				; el botón borrar entrada, o se supere un cierto número de búsquedas. 
				While sID != AutomationID_MainWindowObject && sID != AutomationID_ClearSearch && Counter != MaxCount
					SpeechOff ()
					TypeKey("Tab")
					Pause ()
					sID = GetObjectAutomationId(0)
					Let Counter = Counter + 1
					SpeechOn ()
				EndWhile
				; Si se localiza el botón borrar entrada se activa.
				If sID == AutomationID_ClearSearch then
					SpeechOn ()
					TypeKey ("Space")
					SayString (msgActErased)
					BrailleMessage (msgActErased)
					Return
				EndIf
				; Y si se localiza un objeto de la ventana principal (se ha superado el área de búsqueda sin localizar el botón de borrar entrada),
				; o se alcanza el máximo de búsquedas secuenciales indicado, se informa de ello.
				If sID == AutomationID_MainWindowObject || Counter == MaxCount then
					SayString(msgErrEraseNotFound)
					BrailleMessage (msgErrEraseNotFound)
					Return
				EndIf
					
			EndIf; Fin de la condición de estar o no directamente sobre un botón de Cborrar entrada.
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

	WindowTitle = GetWindowName (GetFocus ())
	sID = GetObjectAutomationId(0)
	TextControl = GetControlName ()

	; Si el foco está en un objeto de la barra de control de una llamada o en el área de Vídeo y contenido,
	; es porque en primer plano hay una ventana de llamada en curso,
	; y por tanto el botón Teclado está disponible.
	If StringContains(WindowTitle, ControlBarTitle) != 0 || StringContains(WindowTitle, VideoPadTitle) != 0 then
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
		
EndScript
