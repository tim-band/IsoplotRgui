## Setting up your own online mirror using *Vagrant*

This is a simplified version of the [CRAN](CRAN.md) method using Vagrant.
Once you have installed Vagrant:

```sh
vagrant up
```

And wait for it to install. After that you should have an IsoplotR
running on `localhost:3838`.

Now you can expose that on port 80 with a reverse proxy or server
such as nginx, if you like.

### Install *nginx*, if required

On Ubuntu, this is simply

```sh
sudo apt-get install nginx
```

Equivalent instructions for CentOS can be found [here](CentOS.md).

### Create a systemd service for *IsoplotR*

You need to have this source code downloaded onto your host machine.
In the following example it is stored at `/path/to/your/isoplotr/source`;
please replace it with wherever you put it.

Copy following into a new file `/etc/systemd/system/isoplotr.service`:

```
[Unit]
Description=IsoplotR
After=network.target

[Service]
Type=simple
User=root
ExecStart=env -C /path/to/your/isoplotr/source vagrant up
ExecStop=env -C /path/to/your/isoplotr/source vagrant halt
Restart=always

[Install]
WantedBy=multi-user.target
```

Then to make **IsoplotR** start on system boot type:

```sh
sudo systemctl enable isoplotr
```

Of course you can use other `systemctl` commands such as `start`, `stop`
and `restart` (to control whether it is running), and `disable` (to stop it
from running automatically on boot).

You can view the logs from this process at any time using:

```sh
sudo journalctl -u isoplotr
```

(more information  below).

### Expose *IsoplotR* with *nginx*

Ubuntu encourages you to put your configuration files in the
directory `/etc/nginx/sites-enabled`. If this directory is present
(and to be sure, you can check for a line saying `include
/etc/nginx/sites-enabled/*;` in the file `/etc/nginx/nginx.conf`) then
you need to add a file called `/etc/nginx/sites-enabled/default` with
the following contents:

```
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    root /var/www/html;

    index index.html;

    server_name _;

    location /isoplotr/ {
        proxy_pass http://127.0.0.1:3838/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

If you already have a file called `/etc/nginx/sites-enabled/default`,
you will need to copy just the `location {...}` block into the
appropriate `server {...}` block in the existing file.

### Restart nginx

If you need to start isoplotr now, call:

```sh
sudo systemctl start isoplotr
```

You can restart nginx to take the changes to its configuration we
made above with:

```sh
sudo systemctl restart nginx
```

and **IsoplotR** will be available on `http://localhost/isoplotr`

You should now be able to browse to [http://localhost/isoplotr].
Once you have configured your firewall you should be able
to browse to `/isoplotr` on your machine from another machine.

### Maintenance

You can view the logs from the various processes mentioned here
as follows:

Process | command for accessing logs
-----|-----
cron (including the update script) | `journalctl -eu cron`
systemD | `journalctl -e _PID=1`
IsoplotRgui | `journalctl -eu isoplotr`
nginx | `journalctl -eu nginx`
nginx detail | logs are written into the `/var/log/nginx` directory

`journalctl` has many interesting options; for example `-r` to see
the most recent messages first, `-k` to see messages only from this
boot, or `-f` to show messages as they come in. The `-e` option
we have been using scrolls to the end of the log so that you are
looking at the most recent entries immediately.
