<h3 align="center">nvnc</h3>
<p align="center">a simple & fast web-based vnc viewer</p>

---

#### synopsys
this uses websockify and novnc to set up a local vnc proxy & viewer for a given address, because the realVNC viewer is slow and i don't like it.

this script just requires the vnc target address, opens the viewer in the default browser and exits when the page is closed.

#### setup

```bash
git clone --recursive https://github.com/vaaski/nvnc
cd nvnc
npm ci
```
#### usage

```bash
npm start -- host [port] [base64_password]
```

#### example
```bash
npm start -- localhost 5900 aHVudGVyMg==
```