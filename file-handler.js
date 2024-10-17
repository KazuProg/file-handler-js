class FileHandler {
  static readText(accept = ".txt") {
    return new Promise((resolve, reject) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = accept;
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) {
          reject(new Error("No file selected"));
          return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve(e.target.result);
        };
        reader.onerror = () => {
          reject(new Error("Failed to read the file"));
        };
        reader.readAsText(file);
      };
      input.oncancel = () => {
        reject(new Error("File selection was canceled"));
      };
      input.click();
    });
  }

  static readJson(accept = ".json") {
    return FileHandler.readText(accept).then((text) => {
      try {
        return JSON.parse(text);
      } catch (error) {
        throw new Error("Invalid JSON format: " + error.message);
      }
    });
  }

  static download(
    filename = "download",
    content,
    type = "application/octet-stream"
  ) {
    if (!content) {
      console.error("Content is required to download a file.");
      return;
    }
    try {
      const blob = new Blob([content], { type });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (error) {
      console.error("File download failed:", error);
    }
  }

  static downloadText(filename, content) {
    FileHandler.download(filename, content, "text/plain");
  }

  static downloadJson(filename, obj, prettyPrint = false) {
    const content = prettyPrint
      ? JSON.stringify(obj, null, 2)
      : JSON.stringify(obj);
    FileHandler.download(filename, content, "application/json");
  }
}
