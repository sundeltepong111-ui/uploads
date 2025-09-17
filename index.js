<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <title>Upload & Share File</title>
</head>
<body>
  <h1>Upload File ke Supabase</h1>
  <input type="file" id="fileInput">
  <button id="uploadBtn">Upload</button>
  <div id="result"></div>

  <script>
    document.getElementById("uploadBtn").onclick = async () => {
      const file = document.getElementById("fileInput").files[0];
      if (!file) return alert("Pilih file dulu!");

      const reader = new FileReader();
      reader.onload = async () => {
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: file.name, file: reader.result }),
        });
        const json = await res.json();
        if (json.success) {
          document.getElementById("result").innerHTML =
            `<p>✅ Upload sukses!<br>🔗 <a href="${json.url}" target="_blank">${json.url}</a></p>`;
        } else {
          alert("Upload gagal: " + json.error);
        }
      };
      reader.readAsDataURL(file);
    };
  </script>
</body>
</html>