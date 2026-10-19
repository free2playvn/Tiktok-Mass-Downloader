' ==============================================================================
' TMD Studio Pro - Silent Desktop App Launcher
' Chạy ngầm server và mở trình duyệt không hiện màn hình đen dòng lệnh
' ==============================================================================
Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "cmd /c node server.js", 0, False
WScript.Sleep 1500
WshShell.Run "cmd /c start http://localhost:3000/studio/index.html", 0, False
Set WshShell = Nothing
