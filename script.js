document.addEventListener("DOMContentLoaded", function () {
  const uploadForm = document.getElementById("uploadForm");
  const fileInput = document.getElementById("fileInput");
  const linkContainer = document.getElementById("linkContainer");
  const openLinkButton = document.getElementById("openLinkButton");
  const linkPage = document.getElementById("linkPage");
  const downloadLink = document.getElementById("downloadLink");

  // Event listener for form submission
  uploadForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    // Send file data to the server
    fetch("/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.text())
      .then((data) => {
        // Hide the upload form
        uploadForm.style.display = "none";
        // Display the link container
        linkContainer.style.display = "block";
        // Display the generated link
        const fileLink = window.location.origin + "/" + data;
        downloadLink.href = fileLink;
        downloadLink.textContent = fileLink;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });

  // Event listener for opening the generated link
  openLinkButton.addEventListener("click", function () {
    linkPage.style.display = "flex";
  });

  // Close the link page when clicking outside the link container
  linkPage.addEventListener("click", function (event) {
    if (event.target === linkPage) {
      linkPage.style.display = "none";
    }
  });
});
