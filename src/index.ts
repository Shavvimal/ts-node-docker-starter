type Result = "success" | "failure";
function verifyResult(result: Result) {
  if (result === "success") {
    console.log("Passed");
  } else {
    console.log("Failed");
  }
}

const main = () => {
  // Example main function
  verifyResult("success");
};

main();
