// script.js
const form = document.getElementById('form');

form.addEventListener('submit', submitForm);

async function submitForm(e) {
  e.preventDefault();
  const memo = document.getElementById('memo');
  console.log('memo=', memo.value);

  const ulMode = document.getElementById('ulMode');
  const files = document.getElementById('files');
  const formData = new FormData();

  //formData.append('ulMode', ulMode.value);
  formData.append('memo', memo.value);

  var selected = $("#ulModeDiv input[type='radio']:checked");
  if (selected.length > 0) {
    formData.append('ulMode', selected.val());
    console.log(selected.val());
  }

  for (let i = 0; i < files.files.length; i++) {
    formData.append('files', files.files[i]);
    console.log(files.files[i].lastModified);
  }
  //console.dir(formData);

  try {
    const response = await fetch('/data/upload', {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    $('#result').text(json.res);
    $('#files').val('');
  } catch (error) {
    console.error(error.message);
  }
}
