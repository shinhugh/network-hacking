# network-hacking
Various configuration files and scripts used for ethical network hacking from a Linux box.

## Required commands (packages)
Most of these will likely already exist in a typical Linux environment.
- sysctl
- ip
- iptables
- nmcli
- dnsmasq
- hostapd

## Brief summary of key tools and corresponding files

### iptables
`iptables` is used to configure the system-wide firewall.
The `init.sh` script sets up the appropriate firewall configuration for all of the hacking scenarios that are provided by this repository.
Root privileges are likely required to successfully run the script (use `sudo`).

### hostapd
`hostapd` (host access point daemon) changes a compatible network interface into an access point to host a local network.
- `hostapd/open.conf` provides the configuration for an unencrypted network.
- `hostapd/encrypted.conf` provides the configuration for a password-protected network.
To start the network, run:
```
hostapd [configuration file]
```
Root privileges are likely required (use `sudo`).

### dnsmasq
`dnsmasq` is a DNS and DHCP server.
- `dnsmasq/clean.conf` provides the configuration for a clean untampered network.
To start the server, run:
```
dnsmasq -d -C [configuration file]
```
Root privileges are likely required (use `sudo`).
