import "./Ownable.sol";
import "./provableAPI.sol";
pragma solidity 0.5.12;

contract Coinflip is Ownable, usingProvable {
    uint256 public latestNumber;
    uint256 constant NUM_RANDOM_BYTES_REQUESTED = 1;

    event LogNewProvableQuery(string description);
    event generatedRandomNumber(uint256 randomNumber);

    // constructor() public {
    //     update();
    // }
    
    mapping(address => bool) public bettings;
    mapping(bytes32 => Bet) public waiting;
    mapping(address => uint) private playerBalances;
   
    uint256 public balance;

      struct Bet {
        address player;
        uint256 betValue;
        bool heads;
        bool won;
    }

    // function update() public payable {
    //     uint256 QUERY_EXECUTION_DELAY = 0;
    //     uint256 GAS_FOR_CALLBACK = 200000;
    //     bytes32 queryId = provable_newRandomDSQuery(
    //         QUERY_EXECUTION_DELAY,
    //         NUM_RANDOM_BYTES_REQUESTED,
    //         GAS_FOR_CALLBACK
    //     );
    //     waiting[queryId] = newBet;
    //     emit LogNewProvableQuery(
    //         "Provable query was sent, standing by for the answer..."
    //     );
    // }

    // Old Random Function
    // function random() public view returns (bool) {
    //     return (now % 2 != 0);
    // }

    function flipCoin(bool bet) public payable {
        require(msg.value <= balance);
        Bet memory newBet;
        newBet.heads = bet;
        //player pays fee for calling oracle
        newBet.betValue = msg.value - provable_getPrice("RANDOM");
        newBet.player = msg.sender;
        // Random Function
        uint256 QUERY_EXECUTION_DELAY = 0;
        uint256 GAS_FOR_CALLBACK = 200000;
        bytes32 queryId = provable_newRandomDSQuery(
            QUERY_EXECUTION_DELAY,
            NUM_RANDOM_BYTES_REQUESTED,
            GAS_FOR_CALLBACK
        );
        waiting[queryId] = newBet;

        //bool headsOrTails = random();
        // if (headsOrTails == bet) {
        //     balance = balance - (msg.value);
        //     msg.sender.transfer((msg.value * 2));
        //     bettings[msg.sender] = true;
        // } else {
        //     balance = balance + msg.value;
        //     bettings[msg.sender] = false;
        // }
    }

    function __callback(
        bytes32 _queryId,
        string memory _result,
        bytes memory _proof
    ) public {
        require(msg.sender == provable_cbAddress());
        bool result = (uint256(keccak256(abi.encodePacked(_result))) % 2) != 0;
        if(result = waiting[_queryId].heads){
            waiting[_queryId].won = true;
            balance = balance - (waiting[_queryId].betValue);
            playerBalances[]
        }
        emit generatedRandomNumber(randomNumber);
    }

    function deposit() public payable {
        balance += msg.value;
    }

    function getLastFlip(address player) public view returns (bool) {
        return bettings[player];
    }

    function getBalance() public view returns (uint256) {
        return balance;
    }

    function withdrawAll() public onlyOwner returns (uint256) {
        uint256 toTransfer = balance;
        balance = 0;
        msg.sender.transfer(toTransfer);
        return toTransfer;
    }
}
