import browser from "webextension-polyfill";

document.body.style.border = "5px solid red";

document.body.addEventListener("click", async function () {
  const resp = await browser.runtime.sendMessage({
    message: "hello",
  });

  console.log(resp);
});
