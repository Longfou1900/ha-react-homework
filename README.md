# High Availability React.js Application

## Project Overview

This project demonstrates a highly available React.js application using four Vagrant virtual machines:

- **LB-01:** Primary load balancer (`192.168.56.10`)
- **LB-02:** Backup load balancer (`192.168.56.11`)
- **WEB-01:** React application server (`192.168.56.20`)
- **WEB-02:** React application server (`192.168.56.21`)
- **Virtual IP (VIP):** `192.168.56.100`

### Technologies

- Vagrant and VirtualBox
- Ubuntu Linux
- React.js and Node.js
- Express.js
- HAProxy
- Keepalived
- systemd
- Cloudflare Workers

---

## Task 1: Verify Network Connectivity

From the project root on your host machine, connect to `web-01`:

```bash
vagrant ssh web-01
```

Inside `web-01`, run:

```bash
ping -c 4 192.168.56.10
ping -c 4 192.168.56.21
exit
```

These tests check connectivity to `lb-01` and `web-02`.

---

## Task 2: Deploy the React Application

The deployment scripts install the required dependencies and deploy the application on both web servers.

### Deploy on WEB-01

Run on the host machine from the project root:

```bash
vagrant ssh web-01 -c 'bash /vagrant/scripts/deploy-react.sh'
```

### Deploy on WEB-02

```bash
vagrant ssh web-02 -c 'bash /vagrant/scripts/deploy-react.sh'
```

### Verify Both Web Servers

```bash
curl http://192.168.56.20:3000/health
curl http://192.168.56.21:3000/health
```

Both endpoints should return a successful health response if the application servers are running correctly.

---

## Task 3: Configure HAProxy

### Configure LB-01

```bash
vagrant ssh lb-01
sudo apt-get update
sudo apt-get install -y haproxy
sudo cp /vagrant/haproxy/haproxy.cfg /etc/haproxy/haproxy.cfg
sudo haproxy -c -f /etc/haproxy/haproxy.cfg
sudo systemctl enable --now haproxy
exit
```

### Configure LB-02

```bash
vagrant ssh lb-02
sudo apt-get update
sudo apt-get install -y haproxy
sudo cp /vagrant/haproxy/haproxy.cfg /etc/haproxy/haproxy.cfg
sudo haproxy -c -f /etc/haproxy/haproxy.cfg
sudo systemctl enable --now haproxy
exit
```

The configuration must use the correct backend server addresses and ports.

---

## Task 4: Configure Keepalived

Keepalived manages the Virtual IP address `192.168.56.100` between the two load balancers.

### Configure LB-01

```bash
vagrant ssh lb-01
sudo apt-get install -y keepalived
sudo cp /vagrant/keepalived/lb01.conf /etc/keepalived/keepalived.conf
sudo systemctl enable --now keepalived
exit
```

### Configure LB-02

```bash
vagrant ssh lb-02
sudo apt-get install -y keepalived
sudo cp /vagrant/keepalived/lb02.conf /etc/keepalived/keepalived.conf
sudo systemctl enable --now keepalived
exit
```

---

## Task 5: Verify the Local HA Environment

From the host machine, run:

```bash
curl http://192.168.56.100/health
curl http://192.168.56.100/api/info
```

The VIP should respond through the active load balancer to a healthy backend server.

To test load balancing, send several requests:

```bash
for i in {1..10}; do
  curl -s http://192.168.56.100/api/info
  echo
done
```

With round-robin balancing, requests should be distributed between `WEB-01` and `WEB-02` while both servers are healthy. Exact behavior depends on your HAProxy configuration and session-persistence settings.

### HAProxy Statistics

Open this page from a machine that can access the lab network:

http://192.168.56.100:8404/haproxy-stats

Use the credentials configured in your HAProxy configuration file. Do not publish real passwords in this README.

---

## Task 6: Public Cloudflare Deployment

The React frontend is deployed to Cloudflare Workers:

**Website:** https://ha-react-homework.nunorton22.workers.dev/

### Public API Endpoints

- Application: https://ha-react-homework.nunorton22.workers.dev/
- API information: https://ha-react-homework.nunorton22.workers.dev/api/info
- Health check: https://ha-react-homework.nunorton22.workers.dev/health

The Worker serves the React build and handles the API endpoints.

**Important limitation:** The current public `/api/info` endpoint generates demonstration responses using the names `WEB-01` and `WEB-02`. It does not connect to the actual Vagrant VMs or HAProxy VIP. The local HA environment and the public Cloudflare demonstration are separate deployments.

### Deploy the Cloudflare Worker

From the host machine:

```bash
cd react-app
npx wrangler deploy
```

Wrangler must be authenticated with the Cloudflare account that owns the Worker.

### Verify the Public API

Open the API endpoint in a browser or run:

```bash
curl https://ha-react-homework.nunorton22.workers.dev/api/info
```

A successful response should contain a `server` field and a `timestamp` field.

---

## Project Structure

```text
devOps-lab/
├── haproxy/
├── keepalived/
├── react-app/
│   ├── src/
│   ├── public/
│   ├── build/
│   ├── server.js
│   ├── worker.js
│   ├── wrangler.jsonc
│   └── package.json
├── scripts/
├── systemd/
├── Vagrantfile
└── README.md
```

## Troubleshooting

### Check the web application service

```bash
vagrant ssh web-01 -c 'sudo systemctl status react-app --no-pager'
vagrant ssh web-02 -c 'sudo systemctl status react-app --no-pager'
```

### Check HAProxy

```bash
vagrant ssh lb-01 -c 'sudo systemctl status haproxy --no-pager'
vagrant ssh lb-02 -c 'sudo systemctl status haproxy --no-pager'
```

### Check Keepalived

```bash
vagrant ssh lb-01 -c 'sudo systemctl status keepalived --no-pager'
vagrant ssh lb-02 -c 'sudo systemctl status keepalived --no-pager'
```

### Check the public API

```bash
curl -i https://ha-react-homework.nunorton22.workers.dev/api/info
```

A `404` indicates the API route is not available in the deployed Worker. Check the Worker configuration and deployment logs.

---

## Project Status

- [ ] Verify network connectivity between all VMs.
- [ ] Verify both web servers and their health endpoints.
- [ ] Verify HAProxy distributes requests between the web servers.
- [ ] Verify Keepalived failover and VIP ownership.
- [ ] Verify the Cloudflare website and public API.
- [ ] Confirm that GitHub-triggered deployments work after pushing changes.
