This mean that if I stay at any web01 or web02 without both lb01 and lb02 so it still can request as normal but cannot auto refresh to web01 or web02.

# High Availability (HA) Load Balancer

## 1. Without LB-01 and LB-02

If both load balancers are powered off, we can still access either backend server directly, as long as that backend server is running.

### Browser → WEB-01

- **URL:** `http://192.168.56.20:3000`
- **Status:** Works if WEB-01 is running.

### Browser → WEB-02

- **URL:** `http://192.168.56.21:3000`
- **Status:** Works if WEB-02 is running.

### Browser → VIP

- **URL:** `http://192.168.56.100`
- **Status:** Normally unavailable if both load balancers are powered off.

**Explanation:** Direct access allows us to test each backend server independently. However, without an active load balancer, requests cannot normally reach the backend servers through the VIP.

---

## 2. With LB-01 and LB-02 Running

The intended architecture is:

```text
                    Browser
                       |
                       v
              VIP: 192.168.56.100
                       |
             +---------+---------+
             |                   |
             v                   v
          LB-01                LB-02
          Primary              Backup
             |
             v
       Active Load Balancer
             |
       +-----+-----+
       |           |
       v           v
    WEB-01       WEB-02
  192.168.56.20 192.168.56.21
     :3000         :3000
```

- **VIP (Virtual IP):** `192.168.56.100`
- **LB-01:** Primary load balancer.
- **LB-02:** Backup load balancer.
- **WEB-01:** First backend server.
- **WEB-02:** Second backend server.

The active load balancer forwards requests to healthy backend servers.

### Load Balancing with Round Robin

HAProxy is configured with:

```haproxy
balance roundrobin
```

Round-robin distributes eligible requests across healthy backend servers.

For example:

```text
Request 1 → WEB-01
Request 2 → WEB-02
Request 3 → WEB-01
Request 4 → WEB-02
```

The actual sequence can vary depending on server health and the requests received by HAProxy.

### Load Balancer Failover

Keepalived manages the VIP between LB-01 and LB-02.

- When LB-01 is healthy, it normally holds the VIP as the primary load balancer.
- If LB-01 fails, LB-02 can take over the VIP if failover is configured correctly.
- This helps keep the application accessible when one load balancer fails.

---

## 3. Sending Requests and Refreshing the Browser

We do not always need to refresh the browser to test load balancing.

If the application's **Send request** button sends a new API request, HAProxy can forward each request to a different healthy backend server.

Refreshing the browser also generates HTTP requests, but the selected backend depends on which requests pass through HAProxy.

To test load balancing, open:

`http://192.168.56.100`

Then click **Send request** several times and check whether the responses identify WEB-01 and WEB-02.

---

## 4. Testing the Backend Servers

### Test WEB-01 directly

```bash
curl -s http://192.168.56.20:3000/health
```

### Test WEB-02 directly

```bash
curl -s http://192.168.56.21:3000/health
```

### Test through the VIP

```bash
curl -s http://192.168.56.100/health
```

### Send multiple requests through the VIP

```bash
for i in {1..10}; do
  curl -s --max-time 5 http://192.168.56.100/health
  echo
  sleep 1
done
```

If both backend servers are healthy and configured correctly, responses should be distributed across WEB-01 and WEB-02.

---

## 5. Conclusion

- **Direct backend URLs** allow us to test WEB-01 and WEB-02 independently.
- **The VIP URL** allows us to test load balancing through the active load balancer.
- **HAProxy** distributes requests across healthy backend servers.
- **Keepalived** manages VIP failover between the load balancers.
- Both load balancers and both backend servers must be configured and tested to verify the complete high-availability architecture.