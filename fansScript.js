

let radioBtns = document.querySelectorAll('[type="radio"]');
radioBtns.forEach((btn) => {
  btn.addEventListener('click', (event) => {
    let enable = event.target.value === 'Yes' ? true : false;
    enableBreedField(enable);
  });
});

// =============================================================================
// Initially the breedLabel is blurred and the input field is disabled.
// When it's blurred I give it a color similar to the disabled field #adadaa.
// =============================================================================
enableBreedField = (value) => {
  let breedLabel = document.querySelector('#dog-breed-label');
  let breedInput = document.querySelector('#dog-breed-input');

  if (value === true) {
    breedLabel.style.color = "black";
    breedLabel.style.textShadow = "none";
    breedInput.disabled = false;
  } else {
    breedLabel.style.color = "transparent";
    breedLabel.style.textShadow = "0 0 3px #adadaa";
    breedInput.disabled = true;
  }
}

enableBreedField(false);

/*let anchor = '';
let pageName = window.location.pathname;
if (pageName.includes("index.html")) {
    anchor = document.querySelector('nav a#index');
} else if (pageName.includes("selfies.html")) {
    anchor = document.querySelector('nav a#selfies');
} else if (pageName.includes("fans.html")) {
    anchor = document.querySelector('nav a#fans');
}
anchor.style.color = 'red';*/