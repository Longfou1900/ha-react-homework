# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  # config.vm.box = "ubuntu/noble64"
  config.vm.box = "bento/ubuntu-24.04"

  # Load Balancer 01 (Primary - MASTER)
  config.vm.define "lb-01" do |lb|
    lb.vm.hostname = "lb-01"
    lb.vm.network "private_network", ip: "192.168.56.10"
    lb.vm.provider "virtualbox" do |v|
      v.name = "lb-01"
      v.memory = 512
      v.cpus = 1
    end
  end

  # Load Balancer 02 (Secondary - BACKUP)
  config.vm.define "lb-02" do |lb|
    lb.vm.hostname = "lb-02"
    lb.vm.network "private_network", ip: "192.168.56.11"
    lb.vm.provider "virtualbox" do |v|
      v.name = "lb-02"
      v.memory = 512
      v.cpus = 1
    end
  end

  # Web Server 01
  config.vm.define "web-01" do |web|
    web.vm.hostname = "web-01"
    web.vm.network "private_network", ip: "192.168.56.20"
    web.vm.provider "virtualbox" do |v|
      v.name = "web-01"
      v.memory = 1024
      v.cpus = 1
    end
  end

  # Web Server 02
  config.vm.define "web-02" do |web|
    web.vm.hostname = "web-02"
    web.vm.network "private_network", ip: "192.168.56.21"
    web.vm.provider "virtualbox" do |v|
      v.name = "web-02"
      v.memory = 1024
      v.cpus = 1
    end
  end
end