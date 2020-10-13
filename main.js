var web3 = new Web3(Web3.givenProvider);
var contractInstance;
var address;

$(document).ready(function () {
  window.ethereum.enable().then(function (accounts) {
    contractInstance = new web3.eth.Contract(
      abi,
      //"0xdBE87Bd65e30974ffEE7a37eDE7dd5E99DDC7B66",
      "0x8aa3E3d5E2930e28b2851cc34cE34948117eb8EE",
      { from: accounts[0] }
    );
    console.log(contractInstance);
    address = accounts[0];
    //getBalance();
    checkAdmin()
  });

  //Click Events 
  $("#bet_button").click(flip); 
  $('#fund_contract_button').click(fundContract);
  $('#withdraw_funds_button').click(widthdrawFunds);
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

function fundContract() {
  var val = $('#funding_input').val();
  var config = {
    value:web3.utils.toWei(val.toString(), "ether")
  }
  contractInstance.methods.deposit().send(config).on("transactionHash", function(hash) {
    console.log(hash);//hash
  })
  .on("receipt", function (receipt) {
    console.log("receipt");
    getBalance();
})
}

function widthdrawFunds() {
  contractInstance.methods.withdrawAll().send({from: address})
    .on("receipt", function(receipt){
      alert("Balance withdrawn!")
      getBalance();
    })
}

function checkAdmin() {
  contractInstance.methods.checkAdmin().call({from: address}).then(function(result){
    if(result){
      $('#admin').show();
      $('#ownerAddress_output').html(address);
    } else{
        $('#admin').hide()
      }
  })
}