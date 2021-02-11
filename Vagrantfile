$install_centos7 = <<-INSTALL
yum -y install epel-release
yum -y install R
INSTALL

$install_centos8 = <<-INSTALL
dnf -y install epel-release dnf-plugins-core
dnf config-manager --set-enabled powertools
dnf -y install R
INSTALL

$isoplotr = <<-INSTALL
Rscript -e "utils::install.packages(pkgs='IsoplotRgui', repos='https://cloud.r-project.org')"
INSTALL

$systemd = <<-SYSTEMD
cat > /etc/systemd/system/isoplotr.service <<EOF
[Unit]
Description=IsoplotR
After=network.target

[Service]
Type=simple
User=root
ExecStart=/usr/bin/Rscript -e 'IsoplotRgui::daemon(8080, host="0.0.0.0")'
Restart=always

[Install]
WantedBy=multi-user.target
EOF
systemctl daemon-reload
systemctl enable isoplotr
systemctl start isoplotr
SYSTEMD

$update = <<-UPDATE
echo Rscript -e "utils::update.packages(ask=FALSE,repos='https://cloud.r-project.org')" > /usr/local/sbin/updateIsoplotR.sh
echo systemctl restart isoplotr >> /usr/local/sbin/updateIsoplotR.sh
echo '0 0 * * 0 /usr/local/sbin/updateIsoplotR.sh | /usr/bin/logger' | crontab -
UPDATE

Vagrant.configure("2") do |config|
  config.vm.box = "generic/centos7"
  config.vm.network "forwarded_port", guest: 8080, host: 3838, host_ip: "127.0.0.1"
  config.vm.provision "shell" do |s|
    s.name = "Install R"
    s.inline = $install_centos7
  end
  config.vm.provision "shell" do |s|
    s.name = "Install IsoplotRgui R package"
    s.inline = $isoplotr
  end
  config.vm.provision "shell" do |s|
    s.name = "Set up SystemD service"
    s.inline = $systemd
  end
  config.vm.provision "shell" do |s|
    s.name = "Set up autoupdating"
    s.inline = $update
  end
  config.vm.provision "shell" do |s|
    s.name = "Status"
    s.inline = "systemctl status isoplotr"
  end
  config.vm.provision "shell" do |s|
    s.name = "iptables"
    # pretty brutal...
    s.inline = "iptables --flush"
  end
end
