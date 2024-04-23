const fileInput = document.getElementById("file-input");
const fileNameSpan = document.getElementById("file-name");
const fileSizeSpan = document.getElementById("file-size");
const shareButton = document.getElementById("share-button");
const downloadList = document.getElementById("download-items");

fileInput.addEventListener("change", function () {
  const file = fileInput.files[0];
  fileNameSpan.textContent = file.name;
  fileSizeSpan.textContent = (file.size / 1024).toFixed(2) + " KB";
});

shareButton.addEventListener("click", function () {
  const file = fileInput.files[0];
  const reader = new FileReader();
  reader.onload = function (e) {
    const fileData = e.target.result;
    fetch("/api/upload", {
      method: "POST",
      body: fileData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message);
        // Update the download list after successful upload
        fetch("/api/files")
          .then((response) => response.json())
          .then((files) => {
            downloadList.innerHTML = ""; // Clear existing list
            files.forEach((file) => {
              const listItem = document.createElement("li");
              listItem.classList.add("download-item");
              const link = document.createElement("a");
              link.href = `/download/${file.name}`;
              link.textContent = file.name;
              listItem.appendChild(link);
              downloadList.appendChild(listItem);
            });
          });
      })
      .catch((error) => {
        console.error(error);
      });
  };
  reader.readAsArrayBuffer(file);
});

// Fetch available files on page load
fetch("/api/files")
  .then((response) => response.json())
  .then((files) => {
    files.forEach((file) => {
      const listItem = document.createElement("li");
      listItem.classList.add("download-item");
      const link = document.createElement("a");
      link.href = `/download/${file.name}`;
      link.textContent = file.name;
      listItem.appendChild(link);
      downloadList.appendChild(listItem);
    });
  });
