# Details about the machine
The machine which runs this is a windows machine. Specifically, a Windows 11 Home + WSL 2 running on Ubuntu 24. I've started a server on port 8000 in my WSL machine. T
The server is currently serving only the contents of this folder.


# Allowing other devices to connect
I tried to create a Firewall inbound rule from `Windows Defender Firewall with Advanced Security`, but I failed. 

Here are some of the commands I've used on Windows:

```
ipconfig # To find out the address of my machine - Appears underneath Wireless Lan Adapter WiFi

Get-NetFirewallHyperVVMSetting -PolicyStore ActiveStore | Select-Object Name, DefaultInboundAction # To find out whether the HyperV Firewall allows connections to WSL or not

Get-NetFirewallHyperVRule -Name "WSL-HTTP-8000"   # To see a rule I created

Remove-NetFirewallHyperVRule -Name "WSL-HTTP-8000" # To remove a rule I created

New-NetFirewallHyperVRule -Name "WSL-HTTP-8000" -DisplayName "WSL HTTP 8000" -Direction Inbound -VMCreatorId '{40E0AC32-46A5-438A-A0B2-2B479E8F2E90}' -Protocol TCP -LocalPorts 8000 -Action Allow -Enabled True # To create a new "Enabled" rule for WSL.

Set-NetFirewallHyperVVMSetting -Name '{40E0AC32-46A5-438A-A0B2-2B479E8F2E90}' -DefaultInboundAction Allow # To allow all devices on the network to connect to WSL. Probably not a good idea, so I've left it blocked.
```

In the end, what I had to do was:

1. Add to `C:\Users\crist\.wslconfig` 
```
[wsl2]
networkingMode=mirrored

[experimental]
hostAddressLoopback=true
```

2. Using the above windows commands, create a rule which allows TCP connections on port 8000.

This might be very useful if we decide that this should be run on another port.