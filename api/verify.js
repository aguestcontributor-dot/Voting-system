import codesData from "../public/voting/codes.json" assert { type: "json" }

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const { code } = req.body

  if (!code || typeof code !== "string") {
    return res.status(400).json({ error: "Code is required" })
  }

  const upperCode = code.toUpperCase()
  const codeEntry = codesData.codes.find((c) => c.code === upperCode)

  if (!codeEntry) {
    return res.status(200).json({
      valid: false,
      message: "Code not found. Please check and try again.",
    })
  }

  if (codeEntry.used) {
    return res.status(200).json({
      valid: false,
      message: "This code has already been used.",
    })
  }

  return res.status(200).json({ valid: true })
}
