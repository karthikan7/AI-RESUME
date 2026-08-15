const fs = require("fs")
const path = require("path")

function createSamplePdf() {
    const pdfPath = path.join(__dirname, "test_resume.pdf")
    const pdfContent = `%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>endobj
4 0 obj<</Length 110>>stream
BT /F1 12 Tf 72 720 Td (Karthik AN - Senior React Developer 4 years experience Node.js Express MongoDB) Tj ET
endstream
endobj
5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000290 00000 n 
0000000450 00000 n 
trailer<</Size 6/Root 1 0 R>>
startxref
520
%%EOF`
    fs.writeFileSync(pdfPath, pdfContent)
    return pdfPath
}

async function testLiveRenderUpload() {
    console.log("=== TESTING LIVE RENDER ENDPOINT WITH FILE UPLOAD ===")
    const pdfPath = createSamplePdf()
    const baseUrl = "https://ai-resume-1-v6jj.onrender.com"

    let cookieHeader = ""
    console.log("[1/3] Registering / logging in to live Render backend...")
    
    const regEmail = "testuser" + Date.now() + "@gmail.com"
    const regRes = await fetch(`${baseUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: "user" + Date.now(),
            email: regEmail,
            password: "Password123!"
        })
    })

    const setCookie = regRes.headers.get("set-cookie")
    if (setCookie) {
        cookieHeader = setCookie
        console.log("   Registration success! Cookie received.")
    } else {
        console.log("   Registration response:", regRes.status, await regRes.text())
        return
    }

    // Step 2: Build multipart form data with PDF file
    console.log("\n[2/3] Preparing PDF file upload blob...")
    const fileBytes = fs.readFileSync(pdfPath)
    const pdfBlob = new Blob([fileBytes], { type: "application/pdf" })

    const formData = new FormData()
    formData.append("jobDescription", "Senior React Developer with Node.js and MongoDB experience.")
    formData.append("selfDescription", "")
    formData.append("resume", pdfBlob, "test_resume.pdf")

    // Step 3: POST /api/interview/ to live Render backend
    console.log("\n[3/3] Sending POST /api/interview/ to live Render server...")
    const reportRes = await fetch(`${baseUrl}/api/interview/`, {
        method: "POST",
        headers: {
            Cookie: cookieHeader
        },
        body: formData
    })

    const responseText = await reportRes.text()
    console.log("\n--- LIVE RENDER SERVER RESPONSE ---")
    console.log("HTTP Status Code:", reportRes.status)
    console.log("Response Body:", responseText)

    if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath)
}

testLiveRenderUpload().catch(err => console.error("TEST ERROR:", err))
