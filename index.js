import websockify from "@maximegris/node-websockify"
import chalk from "chalk"
import getPort from "get-port"
import express from "express"

import { dirname, join } from "path"
import { fileURLToPath } from "url"
import open from "open"

const __dirname = dirname(fileURLToPath(import.meta.url))
const VNC_FOLDER = join(__dirname, "noVNC")

const [addr, _port, password] = process.argv.slice(2)
const port = parseInt(_port ?? "5900")

console.log(`starting vnc viewer`)

getPort().then(async (vncProxyPort) => {
  websockify(
    { source: `localhost:${vncProxyPort}`, target: `${addr}:${port}` },

    // @ts-ignore the types for this are wrong
    { onDisconnected: () => process.exit(0) },
  )
  console.log("")

  const websitePort = await getPort()
  const app = express()
  app.use(express.static(VNC_FOLDER))
  app.listen(websitePort)

  /**
   * @type { Record<string, string> }
   */
  const params = {
    host: "localhost",
    port: vncProxyPort.toString(),
    autoconnect: "false",
    resize: "scale",
    quality: "5",
    compression: "5",
  }
  if (password) params.password = Buffer.from(password, "base64").toString()

  const websiteURL = new URL(`http://localhost:${websitePort}`)
  websiteURL.pathname = "/vnc.html"

  for (const [key, value] of Object.entries(params)) {
    websiteURL.searchParams.append(key, value)
  }

  open(websiteURL.toString())

  console.log(chalk.bold(`localhost:${vncProxyPort} => ${addr}:${port}`))
})
