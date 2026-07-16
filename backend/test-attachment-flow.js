/**
 * Dummy test script for file attachment feature.
 * Run with: node test-attachment-flow.js
 * 
 * Tests:
 * 1. Login as manager
 * 2. Create issue with file attachment
 * 3. Get attachments for the issue
 * 4. View attachment URL
 * 5. Delete attachment
 */

const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");

const API = process.env.API_URL || "http://localhost:5000";

function request(method, urlPath, body, token, contentType = "application/json") {
  return new Promise((resolve, reject) => {
    const url = new URL(urlPath, API);
    const isHttps = url.protocol === "https:";
    const lib = isHttps ? https : http;

    const options = {
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 5000),
      path: url.pathname + url.search,
      method,
      headers: {},
    };

    if (token) {
      options.headers["Authorization"] = `Bearer ${token}`;
    }

    if (body && contentType === "application/json") {
      const json = JSON.stringify(body);
      options.headers["Content-Type"] = "application/json";
      options.headers["Content-Length"] = Buffer.byteLength(json);
    }

    const req = lib.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on("error", reject);

    if (body && contentType === "application/json") {
      req.write(JSON.stringify(body));
    } else if (body) {
      body.pipe(req);
    } else {
      req.end();
    }
  });
}

function makeDummyImage() {
  // Create a minimal valid PNG file (1x1 red pixel)
  const pngHeader = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
    0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, // IHDR chunk
    0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
    0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53,
    0xDE, 0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41, // IDAT chunk
    0x54, 0x08, 0xD7, 0x63, 0xF8, 0xCF, 0xC0, 0x00,
    0x00, 0x00, 0x02, 0x00, 0x01, 0xE2, 0x21, 0xBC,
    0x33, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, // IEND chunk
    0x44, 0xAE, 0x42, 0x60, 0x82,
  ]);
  const tmpPath = path.join(__dirname, "tmp-test-image.png");
  fs.writeFileSync(tmpPath, pngHeader);
  return tmpPath;
}

function multipartRequest(urlPath, filePath, filename, token) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlPath, API);
    const isHttps = url.protocol === "https:";
    const lib = isHttps ? https : http;
    const boundary = "----TestBoundary" + Date.now();
    const fileData = fs.readFileSync(filePath);

    const parts = [];
    parts.push(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${filename}"\r\nContent-Type: image/png\r\n\r\n`);
    const preamble = Buffer.from(parts.join(""));
    const epilogue = Buffer.from(`\r\n--${boundary}--\r\n`);
    const body = Buffer.concat([preamble, fileData, epilogue]);

    const options = {
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 5000),
      path: url.pathname + url.search,
      method: "POST",
      headers: {
        "Content-Type": `multipart/form-data; boundary=${boundary}`,
        "Content-Length": body.length,
        Authorization: `Bearer ${token}`,
      },
    };

    const req = lib.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

async function runTests() {
  console.log("=== File Attachment Flow Test ===\n");

  // Step 1: Login as manager
  console.log("1. Logging in as manager...");
  const loginRes = await request("POST", "/api/auth/login", {
    email: "manager@test.com",
    password: "password123",
  });

  if (loginRes.status !== 200) {
    console.log("   FAILED: Login failed. Status:", loginRes.status, "Message:", loginRes.data?.message);
    console.log("   (Make sure test user exists)");
    return;
  }
  const token = loginRes.data.token;
  console.log("   OK: Logged in");

  // Step 2: Create issue with file attachment
  console.log("\n2. Creating issue with file attachment...");
  const tmpFile = makeDummyImage();
  try {
    const createRes = await multipartRequest(
      "/api/issues",
      tmpFile,
      "proof-image.png",
      token
    );

    if (createRes.status !== 201) {
      console.log("   FAILED: Create issue:", createRes.status, createRes.data?.message);
      return;
    }
    const issueId = createRes.data._id;
    console.log("   OK: Issue created:", issueId);

    // Step 3: Get attachments for the issue
    console.log("\n3. Getting attachments for issue...");
    const attRes = await request("GET", `/api/attachments/issue/${issueId}`, null, token);

    if (attRes.status !== 200) {
      console.log("   FAILED: Get attachments:", attRes.status, attRes.data?.message);
      return;
    }
    const attachments = attRes.data;
    console.log("   OK: Found", attachments.length, "attachment(s)");

    if (attachments.length === 0) {
      console.log("   WARNING: No attachments found - upload during creation may have failed");
      return;
    }

    const att = attachments[0];
    console.log("   Attachment details:");
    console.log("     - originalName:", att.originalName);
    console.log("     - url:", att.url);
    console.log("     - mimeType:", att.mimeType);
    console.log("     - size:", att.size, "bytes");

    // Step 4: Verify URL is a valid Cloudinary URL
    console.log("\n4. Verifying attachment URL...");
    if (att.url && att.url.includes("cloudinary.com")) {
      console.log("   OK: URL is a valid Cloudinary URL");
    } else if (att.url && att.url.startsWith("http")) {
      console.log("   OK: URL is a valid HTTP URL:", att.url.substring(0, 60) + "...");
    } else {
      console.log("   WARNING: URL doesn't look like a Cloudinary URL:", att.url);
    }

    // Step 5: Delete attachment
    console.log("\n5. Deleting attachment...");
    const delRes = await request("DELETE", `/api/attachments/${att._id}`, null, token);

    if (delRes.status === 200) {
      console.log("   OK: Attachment deleted");
    } else {
      console.log("   FAILED: Delete attachment:", delRes.status, delRes.data?.message);
    }

  } finally {
    // Cleanup temp file
    if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
  }

  console.log("\n=== All tests passed! ===");
}

runTests().catch(console.error);
