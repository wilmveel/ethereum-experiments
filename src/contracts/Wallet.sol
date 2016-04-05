contract Wallet {

    address user;
    address owner;

    function Wallet() {
        owner = msg.sender;
    }

    function refund() {
        msg.sender.send(1 ether);
    }

    function kill() {
        if (msg.sender == owner) suicide(owner);
    }
}