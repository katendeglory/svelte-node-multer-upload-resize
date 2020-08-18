<script>
  import Resizer from "react-image-file-resizer";
  import axios from "axios";
  const resize = Resizer.imageFileResizer;

  let rawImgs;
  let resizedImgs;
  let description;
  let fullname;

  let resizeImage = (file) => {
    return new Promise((resolve, reject) => {
      resize(
        file,
        500,
        500,
        "JPEG",
        100,
        0,
        // (uri) => resolve(new File([uri], file.name)),
        (uri) => resolve(uri),
        "blob"
      );
    });
  };

  let resizeImages = async (files) => {
    let resized = [];
    for (let i = 0; i < files.length; i++) {
      resized.push(await resizeImage(files[i]));
    }
    return resized;
  };

  let onSubmit = async () => {
    resizedImgs = await resizeImages(rawImgs);

    let formData = new FormData();

    formData.append("description", description);
    formData.append("fullname", fullname);

    resizedImgs.forEach((resizedImg) => formData.append("images", resizedImg));

    axios
      .post("http://localhost:5001/upload", formData)
      .then((res) => {
        console.log(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };
</script>

<h1>Fill this form!</h1>

<input type="text" bind:value={fullname} placeholder="full name" />
<br />
<br />
<input type="text" bind:value={description} placeholder="description" />
<br />
<br />
<input type="file" bind:files={rawImgs} multiple />
<br />
<br />
<button on:click={onSubmit}>Submit</button>
