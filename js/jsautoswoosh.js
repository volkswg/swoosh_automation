// input_data = [{ fullname: "ss", idcard: "aa", email: "dd", phoneNo: "ee" }];

function setInputId(elem, id) {
  const radioParentClassName = ".SG0AAe";
  let radioBtnParent;

  switch (id) {
    case "taxInvoice":
      radioBtnParent = elem.querySelector(radioParentClassName);
      radioBtnParent.childNodes.forEach((childElem) => {
        const contentText = childElem.textContent;
        if (contentText.toLowerCase().match("yes")) {
          childElem.id = "taxInYes";
        } else if (contentText.toLowerCase().match("no")) {
          childElem.id = "taxInNo";
        }
      });
      break;
    case "valiramGroup":
      radioBtnParent = elem.querySelector(radioParentClassName);
      radioBtnParent.childNodes.forEach((childElem) => {
        const contentText = childElem.textContent;
        if (contentText.toLowerCase().match("disagree")) {
          childElem.id = "valiramDisagree";
        } else if (contentText.toLowerCase().match("agree")) {
          childElem.id = "valiramAgree";
        }
      });
      break;
    case "size":
      radioBtnParent = elem.querySelector(radioParentClassName);
      radioBtnParent.childNodes.forEach((childElem) => {
        const contentText = childElem.textContent;
        const sizeText = contentText.replace(/[^\d.-]/g, "").replace(/[.]/g, "");
        childElem.id = "shoeSize" + sizeText;
      });
      break;
    default:
      const selectedElem = elem.querySelector("input") || elem.querySelector("textarea");
      selectedElem.id = id;
      break;
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

const allInputParentClassname = ".o3Dpx";
form_list = document.querySelector(allInputParentClassname);
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
    // console.log(elem, input_type);
    setInputId(elem, input_type);
  }
  // log input type
});
