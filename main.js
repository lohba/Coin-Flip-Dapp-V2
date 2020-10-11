var web3 = new Web3(Web3.givenProvider);
var contractInstance;
var address;

$(document).ready(function () {
  window.ethereum.enable().then(function (accounts) {
    contractInstance = new web3.eth.Contract(
      abi,
      //"0xdBE87Bd65e30974ffEE7a37eDE7dd5E99DDC7B66",
      "0x72a6ff7054ebff348b4a207dac48857c6a588862",
      { from: accounts[0] }
    );
    console.log(contractInstance);
    address = accounts[0];
    //getBalance();
  });
  $("#bet_button").click(flip); //inputData
  //$("#fund_contract").click(fundContract);
});

function flip() {
  $("#result").html("Good Luck!");
  if ($("#bet_input").val() < 0.1) {
    alert("Bet Amount is 0.1 ETH");
    return;
  }

  var bet = false;
  var radioValue = $("input[name='sides']:checked").val();
  if (!radioValue) {
    alert("Choose a side pls");
    return;
  }

  if (radioValue) {
    if (radioValue == "heads") {
      bet = true;
    }
  }

  var betValue = $("#bet_input").val();
  var config = {
    value: web3.utils.toWei(betValue.toString(), "ether"),
    gas: 100000,
  };

  contractInstance.methods
    .flipCoin(bet)
    .send(config)
    .on("transactionHash", function (hash) {
      console.log(hash);
    })
    .on("confirmation", function (confirmationNr) {
      console.log(confirmationNr);
    })
    .on("receipt", function (receipt) {
      console.log(receipt);
      getBalance();
      getResult();
    });
}

// Display result on Front End
function getResult() {
  contractInstance.methods
    .getLastFlip(address)
    .call()
    .then(function (result) {
      console.log(result);
      if (result) {
        $("#result").html("You won!");
      } else {
        $("#result").html("You lost!");
      }
    });
}

function getBalance() {
  contractInstance.methods
    .getBalance()
    .call()
    .then(function (result) {
      result = web3.utils.fromWei(result, "ether");
      console.log("Balance: " + result);
      //$("#balance").html(result);
    });
}
//contractInstance.methods.createBet(coinSide).send(config);
// .on("transactionHash", function (hash) {
//   console.log(hash);
// })
// .on("confirmation", function (confirmationNr) {
//   console.log(confirmationNr);
// })
// .on("receipt", function (receipt) {
//   console.log(receipt);

//$("#bet_button").click(fetchAndDisplay);

//Heads or Tails option
//   $("#heads").click(function () {
//     optionChosen = 0;
//     console.log(optionChosen);
//   });
//   $("#tails").click(function () {
//     optionChosen = 1;
//     console.log(optionChosen);
//   });
// });

//function inputData() {
// var name = $("#name_input").val();
// var age = $("#age_input").val();
// var height = $("#height_input").val();
// var coinside = $("#heads").click(function () {
//   coinside = 0;
//   return coinside;
// });
// var coinside = $("#tails").click(function () {
//   coinside = 1;
//   return coinside;
// });

// function headsOrTails() {
//   //$("#tails_button").click();
//   var playerChoice = $("#tails").val();
//   var playerChoice = $("#heads").val();
//   //var coinside = $("input[name=coinside]:checked").val();
//   console.log(playerChoice);
