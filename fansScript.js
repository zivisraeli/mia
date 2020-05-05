// =============================================================================
// Adding listerner to the radio button to enable/disable the dog breed field
// =============================================================================
let radioBtns = document.querySelectorAll('[type="radio"]');
radioBtns.forEach((btn) => {
  btn.addEventListener('click', (event) => {
    let enable = event.target.value === 'Yes' ? true : false;
    enableBreedField(enable);
  });
});

// =============================================================================
// When the field is blurred I give it a color similar to the disabled field #adadaa.
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

// =============================================================================
// Confirmation related functionality
// ============================================================================= 
let form = document.querySelector('form');
let formConfirmBtn = document.getElementById("form-confirm-btn");
let modalSection = document.getElementById("modal-section");
let modalEditBtn = document.getElementById("modal-edit-btn");

modalEditBtn.onclick = function () {
  modalSection.style.display = "none";
}

formConfirmBtn.onclick = function () {
  let isValidForm = form.reportValidity();
  if (isValidForm) {

    // Name
    let nameInput = document.getElementById("name-input");
    let nameDisplay = document.getElementById("name-display");
    nameDisplay.innerHTML = nameInput.value;

    // Email
    let emailInput = document.getElementById("email-input");
    let emailDisplay = document.getElementById("email-display");
    emailDisplay.innerHTML = emailInput.value;

    // Phone
    let telInput = document.getElementById("tel-input");
    let telDisplay = document.getElementById("tel-display");
    telDisplay.innerHTML = telInput.value;

    // Owner
    let ownerStr = "No";
    let ownerYes = document.getElementById("owner-yes");
    if (ownerYes.checked === true) {
      ownerStr = "Yes";
    }
    let ownerDisplay = document.getElementById("owner-display");
    ownerDisplay.innerHTML = ownerStr;

    // Breed
    let breedInput = document.getElementById("dog-breed-input");
    let breedDisplay = document.getElementById("dog-breed-display");
    breedDisplay.innerHTML = breedInput.value;

    // Comment
    let commentInput = document.getElementById("comment-input");
    let commentDisplay = document.getElementById("comment-display");
    commentDisplay.innerHTML = commentInput.value;

    modalSection.style.display = "block";
  }
}


// =============================================================================
// Initial function invocations
// =============================================================================

// Initially the breedLabel is blurred and the input field is disabled.
enableBreedField(false);
