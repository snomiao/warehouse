#SingleInstance, force

return

~^s:: onSave()
!m:: main()

onSave()
{
    sleep 128
    Reload
}
windowClean()
{
    WinClose Export ahk_exe ManicTimeClient.exe
    WinClose Save As ahk_exe ManicTimeClient.exe
    WinClose Import and export ahk_exe ManicTimeClient.exe
}
main()
{
    windowClean()
    
    WinActivate ManicTime ahk_exe ManicTimeClient.exe
    
    WinWaitActive ManicTime ahk_exe ManicTimeClient.exe
    SendEvent {F10}{right}{enter}{down 2}{enter}
    
    WinWaitActive Import and export ahk_exe ManicTimeClient.exe
    SendEvent {Tab 4}{Down 2}{Tab}{Enter}
    
    WinWaitActive Save As ahk_exe ManicTimeClient.exe
    SetWorkingDir, %A_ScriptDir%/../../
    
    dataPath := A_WorkingDir "\data\" A_ComputerName "_ManicTimeData" ".csv"
    FileDelete, %dataPath%
    SendEvent {Text}%dataPath%
    SendEvent {Tab}c
    SendEvent {Tab}{Enter}
    
    WinWaitActive Export ahk_exe ManicTimeClient.exe
    SendEvent {Enter}
    
    WinWaitActive Import and export ahk_exe ManicTimeClient.exe
    SendEvent {Esc}
}
