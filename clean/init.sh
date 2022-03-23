#!/bin/bash

# Enable packet forwarding
sysctl net.ipv4.ip_forward=1

# Prevent NetworkManager from managing interface
nmcli device set wlp7s0f1u3 managed no

# Flush addresses and set static IP address
ip addr flush dev wlp7s0f1u3
ip addr add 10.0.0.1/24 dev wlp7s0f1u3
ip addr add fc00::1/7 dev wlp7s0f1u3

# Clear all tables
iptables -t filter -F
iptables -t nat -F
iptables -t mangle -F
iptables -t raw -F

# Set default policies
iptables -t filter -P INPUT DROP
iptables -t filter -P FORWARD DROP
iptables -t filter -P OUTPUT ACCEPT

# Allow all incoming traffic from localhost
iptables -t filter -A INPUT -i lo -j ACCEPT

# Allow incoming packets for established connections
iptables -t filter -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT

# Enable NAT
iptables -t filter -A FORWARD -i wlp7s0f1u3 -o wlp5s0 -j ACCEPT
iptables -t filter -A FORWARD -i wlp5s0 -o wlp7s0f1u3 -j ACCEPT
iptables -t nat -A POSTROUTING -o wlp5s0 -j MASQUERADE

# Allow ICMP
iptables -t filter -A INPUT -p icmp -i wlp7s0f1u3 -j ACCEPT

# Allow DHCP
iptables -t filter -A INPUT -p udp --dport 67 -i wlp7s0f1u3 -j ACCEPT

# Allow DNS
iptables -t filter -A INPUT -p udp --dport 53 -i wlp7s0f1u3 -j ACCEPT
iptables -t filter -A INPUT -p tcp --dport 53 -i wlp7s0f1u3 -j ACCEPT
