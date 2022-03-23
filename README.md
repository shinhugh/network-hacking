# network-hacking
Various configuration files and scripts used for ethical network hacking from a Linux box.

![Login page](https://github.com/shinhugh/network-hacking/blob/master/screenshots/login_0.png?raw=true)
![Login page](https://github.com/shinhugh/network-hacking/blob/master/screenshots/login_1.png?raw=true)
![Hacked page](https://github.com/shinhugh/network-hacking/blob/master/screenshots/hacked.png?raw=true)

## Required hardware
- a network interface capable of access point (AP) mode<br>I am using the [Panda Wireless PAU06](https://www.pandawireless.com/panda300mbpsant.htm).

## Required commands (packages)
Many of these will likely already exist in a typical Linux environment.
- sysctl
- ip
- nmcli
- iptables
- hostapd
- dnsmasq
- node
- npm

## Brief summary of key tools and corresponding files

### iptables
`iptables` is used to configure the system-wide firewall.
The `init.sh` script sets up the appropriate firewall configuration for all of the hacking scenarios that are provided by this repository.
Root privileges are likely required to successfully run the script (use `sudo`).

### hostapd
`hostapd` (host access point daemon) changes a compatible network interface into an access point to host a local network.
To start the network, run:
```
hostapd [configuration file]
```
Root privileges are likely required (use `sudo`).

### dnsmasq
`dnsmasq` is a DNS and DHCP server.
To start the server, run:
```
dnsmasq -d -C [configuration file]
```
Root privileges are likely required (use `sudo`).

### node.js
`node` is used to host a web server.
Before running the server, make sure to install all dependencies for that server by running:
```
cd [directory that contains package.json for server]
npm i
```
To start the server, run:
```
node [script file]
```
Root privileges are likely required for `node` (use `sudo`).

## Notes
- I personally use Arch Linux and have not tested this on any other Linux distribution. Due to Arch Linux being so lightweight and minimal, I did not run into too many issues or conflicts. If you are on a different distribution, it is possible that your environment already contains alternatives to some of the services and commands listed above, potentially causing conflicts. There is no reason that these specific packages have to be used though; as long as each functional part is fulfilled somehow, the "hacking" should work. If you already have an alternative to a package used here, you may find it easier to configure that to behave the same as my setup does.