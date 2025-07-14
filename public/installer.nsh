!macro customInstall
  WriteRegStr HKLM "Software\Associação" "Install_Dir" "$INSTDIR"
  CreateDirectory "$SMPROGRAMS\Associação"
  CreateShortcut "$SMPROGRAMS\Associação\Uninstall.lnk" "$INSTDIR\Uninstall.exe"
!macroend

!macro customUnInstall
  DeleteRegKey HKLM "Software\Associação"
  RMDir /r "$SMPROGRAMS\Associação"
!macroend
