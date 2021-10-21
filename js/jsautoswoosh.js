// input_data = [{ fullname: "ss", idcard: "aa", email: "dd", phoneNo: "ee" }];

function setInputId(elem, id) {
  if (id === "taxInvoice") {
    const radioBtnParent = elem.querySelector(
      ".freebirdFormviewerComponentsQuestionRadioChoicesContainer"
    );
    radioBtnParent.childNodes.forEach((childElem) => {
      // console.log(childElem);
      const contentText = childElem.textContent;

      if (contentText.toLowerCase().match("yes")) {
        childElem.id = "taxInYes";
      } else if (contentText.toLowerCase().match("no")) {
        childElem.id = "taxInNo";
      }
    });
  } else if (id === "valiramGroup") {
    const radioBtnParent = elem.querySelector(
      ".freebirdFormviewerComponentsQuestionRadioChoicesContainer"
    );
    radioBtnParent.childNodes.forEach((childElem) => {
      const contentText = childElem.textContent;

      if (contentText.toLowerCase().match("disagree")) {
        childElem.id = "valiramDisagree";
      } else if (contentText.toLowerCase().match("agree")) {
        childElem.id = "valiramAgree";
      }
    });
  } else if (id === "size") {
    console.log(elem);
    const radioBtnParent = elem.querySelector(
      ".freebirdFormviewerComponentsQuestionRadioChoicesContainer"
    );

    radioBtnParent.childNodes.forEach((childElem) => {
      const contentText = childElem.textContent;
      const sizeText = contentText.replace(/[^\d.-]/g, "").replace(/[.]/g, "");
      // console.log(sizeText);
      childElem.id = "shoeSize" + sizeText;
      // if (contentText.toLowerCase().match("disagree")) {
      //   childElem.id = "valiramDisagree";
      // } else if (contentText.toLowerCase().match("agree")) {
      //   childElem.id = "valiramAgree";
      // }
    });
  } else {
    const selectedElem = elem.querySelector("input") || elem.querySelector("textarea");
    selectedElem.id = id;
  }
}

evaluation_list = [
  { taxInvoice: ["tax", "invoice"] },
  { fullname: ["Name", "Surname"] },
  { idcard: ["ID Card"] },
  { email: ["Email", "E-mail", "ที่อยู่อีเมล"] },
  { phoneNo: ["Phone Number", "Mobile"] },
  { address: ["Address"] },
  { postcode: ["Postal code", "Postcode"] },
  { valiramGroup: ["Valiram Group"] },
  { size: ["Shoe Size", "Size"] },
  // { province: ["Province"] },
];

form_list = document.querySelector(".freebirdFormviewerViewItemList");
c_nodes = form_list.childNodes;

c_nodes.forEach((elem) => {
  const evaluate_text = elem.textContent.toLowerCase();
  console.log(evaluate_text);

  let is_found = false;
  let input_type = "";
  for (let e_eval of evaluation_list) {
    if (is_found) {
      break;
    }
    // console.log(e_eval);
    const key = Object.keys(e_eval);
    const needle = e_eval[key];
    // console.log(needle);
    for (let e_needle of needle) {
      //   console.log(e_needle);
      // check match with pattern text
      const is_match = evaluate_text.match(e_needle.toLowerCase());
      if (is_match !== null) {
        is_found = true;
        input_type = key[0];
        // console.log(input_type);
        break;
      }
    }
  }
  if (input_type.length > 0) {
    console.log(elem);
    setInputId(elem, input_type);
  }
  // log input type
});
