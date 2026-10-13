Awesome! All four virtual machines (`lb-01`, `lb-02`, `web-01`, and `web-02`) are successfully up and running.

---

### Step 1: Verify Network Connectivity (Task 1)

Let's verify that your VMs can communicate with each other over the private network. Run this in your terminal:

```bash
vagrant ssh web-01

```

Once inside `web-01`, run the required ping tests to verify connectivity to the primary load balancer and the second web server:

```bash
ping -c 4 192.168.56.10
ping -c 4 192.168.56.21
exit

```

---

### Step 2: Deploy the React App on Web Servers (Task 2)

Now, let's deploy your Node.js/React application on both `web-01` and `web-02` using your automated shell scripts.

#### 1. Deploy on `web-01` (`192.168.56.20`)

Run these commands in your host terminal:

```bash
vagrant ssh web-01
cd /vagrant/scripts
sudo ./setup-web.sh
sudo ./deploy-react.sh
exit

```

#### 2. Deploy on `web-02` (`192.168.56.21`)

Run these commands in your host terminal:

```bash
vagrant ssh web-02
cd /vagrant/scripts
sudo ./setup-web.sh
sudo ./deploy-react.sh
exit

```

Once completed, verify the applications are running locally on port 30:

```bash
curl http://192.168.56.20:3000/health
curl http://192.168.56.21:3000/health

```

---

### Step 3: Configure HAProxy Load Balancing (Task 3)

SSH into both load balancer nodes (`lb-01` and `lb-02`) to install and configure HAProxy:

1. **On `lb-01` (`192.168.56.10`)**:
```bash
vagrant ssh lb-01
sudo apt-get update && sudo apt-get install -y haproxy
sudo cp /vagrant/haproxy/haproxy.cfg /etc/haproxy/haproxy.cfg
sudo haproxy -c -f /etc/haproxy/haproxy.cfg
sudo systemctl enable --now haproxy
exit

```


2. **On `lb-02` (`192.168.56.11`)**:
```bash
vagrant ssh lb-02
sudo apt-get update && sudo apt-get install -y haproxy
sudo cp /vagrant/haproxy/haproxy.cfg /etc/haproxy/haproxy.cfg
sudo haproxy -c -f /etc/haproxy/haproxy.cfg
sudo systemctl enable --now haproxy
exit

```



---

### Step 4: Configure Keepalived High Availability (Task 4)

Install and configure Keepalived on both load balancers to manage the Virtual IP (`192.168.56.100`):

1. **On `lb-01` (`192.168.56.10`)**:
```bash
vagrant ssh lb-01
sudo apt-get install -y keepalived
sudo cp /vagrant/keepalived/lb01.conf /etc/keepalived/keepalived.conf
sudo systemctl enable --now keepalived
exit

```


2. **On `lb-02` (`192.168.56.11`)**:
```bash
vagrant ssh lb-02
sudo apt-get install -y keepalived
sudo cp /vagrant/keepalived/lb02.conf /etc/keepalived/keepalived.conf
sudo systemctl enable --now keepalived
exit

```



---

### Step 5: Final Verification

From your host machine, test access to the Virtual IP:

```bash
curl http://192.168.56.100

```

You should see requests load-balancing back and forth between **WEB-01** and **WEB-02**!

Let me know which step you'd like to execute first or if you encounter any errors along the way.














===========================================================
EXTRA:

Option 1: Use the existing credentials
Open this URL:
http://192.168.56.100:8404/haproxy-stats
Enter:
Username: admin
Password: SecurePassword123!


Option 2: Change the password to vagrant
If your lab instructions require the password to be vagrant, edit the HAProxy configuration on lb-01:
sudo nano /etc/haproxy/haproxy.cfg


Find:
stats auth admin:SecurePassword123!


Change it to:
stats auth admin:vagrant


Save with Ctrl+O, press Enter, then Ctrl+X.
Validate the configuration before restarting:
sudo haproxy -c -f /etc/haproxy/haproxy.cfg


If valid, restart HAProxy:
sudo systemctl restart haproxy


Then try logging in again with admin / vagrant.
Important: If lb-02 also runs HAProxy, update its configuration too so both load balancers use the same stats credentials. For a real production environment, use a stronger password rather than vagrant.
