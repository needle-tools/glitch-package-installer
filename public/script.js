function copyToClipboard(str) {
  const el = document.createElement('textarea');
  el.value = str;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
}

function myCopy(theForm) {
  let form = theForm.parentElement;
  let formData = new FormData(form);
  let search = new URLSearchParams(formData);

  // compact json representation of manifest for query URL parameter (works without but looks nicer)
  if(search.has("manifest")) {
    // console.log(search.get("manifest"));
    
    let parsedManifest = "";
    try {
      parsedManifest = JSON.parse(search.get("manifest"));
      search.set("manifest", JSON.stringify(parsedManifest));
    }
    catch(e) {
      console.log(e);
      alert(e);
      return;
    }    
  }

  let queryString = search.toString();
  let absoluteUrl = new URL(form.action, document.baseURI).href;
  queryString = absoluteUrl + "?" + queryString;
  copyToClipboard(queryString);

  console.log("Copied the text: " + queryString);
}