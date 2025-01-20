"use strict";

class FileHandler {
  // テキストファイルを読み込む
  static readText(accept = ".txt") {
    return new Promise((resolve, reject) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = accept;
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) {
          return reject(new Error("No file selected"));
        }
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            content: e.target.result,
            file,
          });
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

  // JSONファイルを読み込む
  static readJson(accept = ".json") {
    return FileHandler.readText(accept).then((result) => {
      try {
        result.content = JSON.parse(result.content);
        return result;
      } catch (error) {
        throw new Error("Invalid JSON format: " + error.message);
      }
    });
  }

  // 任意のデータをダウンロードする
  static download(
    filename = "download",
    content,
    type = "application/octet-stream"
  ) {
    if (!content) {
      return console.error("Content is required to download a file.");
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

  // テキストファイルをダウンロードする
  static downloadText(filename, content) {
    if (typeof content !== "string") {
      console.error("Content must be a string.");
      return;
    }
    FileHandler.download(filename, content, "text/plain");
  }

  // JSONファイルをダウンロードする
  static downloadJson(filename, obj, prettyPrint = false) {
    try {
      const content = prettyPrint
        ? JSON.stringify(obj, null, 2)
        : JSON.stringify(obj);
      FileHandler.download(filename, content, "application/json");
    } catch (error) {
      console.error("Failed to serialize object to JSON:", error);
    }
  }
}
