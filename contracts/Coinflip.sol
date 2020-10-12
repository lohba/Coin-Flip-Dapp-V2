import "./Ownable.sol";
import "./provableAPI.sol";
pragma solidity 0.5.12;

contract Coinflip is Ownable, usingProvable {
    uint256 public latestNumber;
    uint256 constant NUM_RANDOM_BYTES_REQUESTED = 1;

    event LogNewProvableQuery(string description);
    event generatedRandomNumber(uint256 randomNumber);

    constructor() public {
        update();
    }

    function __callback(
        bytes32 _queryId,
        string memory _result,
        bytes memory _proof
    ) public {
        require(msg.sender == provable_cbAddress());
        uint256 randomNumber = uint256(keccak256(abi.encodePacked(_result))) %
            2;
        latestNumber = randomNumber;
        emit generatedRandomNumber(randomNumber);
    }

    function update() public payable {
        uint256 QUERY_EXECUTION_DELAY = 0;
        uint256 GAS_FOR_CALLBACK = 200000;
        bytes32 queryId = provable_newRandomDSQuery(
            QUERY_EXECUTION_DELAY,
            NUM_RANDOM_BYTES_REQUESTED,
            GAS_FOR_CALLBACK
        );
        emit LogNewProvableQuery(
            "Provable query was sent, standing by for the answer..."
        );
    }

    struct Bet {
        address player;
        uint256 betValue;
    }

    mapping(address => bool) public bettings;
    mapping(uint256 => Bet) public waiting;
    uint256 public balance;

    function random() public view returns (bool) {
        return (now % 2 != 0);
    }

    function flipCoin(bool bet) public payable {
        bool headsOrTails = random();
        if (headsOrTails == bet) {
            balance = balance - (msg.value);
            msg.sender.transfer((msg.value * 2));
            bettings[msg.sender] = true;
        } else {
            balance = balance + msg.value;
            bettings[msg.sender] = false;
        }
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
