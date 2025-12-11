import fs from "fs"
import path from "path"

let codesData = null
const codesPath = path.join(process.cwd(), "public/voting/codes.json")

function loadCodes() {
  if (codesData === null) {
    const content = fs.readFileSync(codesPath, "utf8")
    codesData = JSON.parse(content)
  }
  return codesData
}

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const { code } = req.body

  if (!code || typeof code !== "string") {
    return res.status(400).json({ error: "Code is required" })
  }

  const upperCode = code.toUpperCase()
  const data = loadCodes()
  const codeEntry = data.codes.find((c) => c.code === upperCode)

  if (!codeEntry) {
    return res.status(404).json({ error: "Code not found" })
  }

  codeEntry.used = true
  codesData = null // Reset cache so next read gets fresh data

  try {
    fs.writeFileSync(codesPath, JSON.stringify(data, null, 2))
    return res.status(200).json({ success: true, message: "Code marked as used" })
  } catch (error) {
    console.error("Error writing codes file:", error)
    return res.status(500).json({ error: "Failed to update code" })
  }
}
