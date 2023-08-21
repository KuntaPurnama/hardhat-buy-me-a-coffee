//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract BuyMeACoffee {
    //Error 
    error BuyMeACoffee_TransferFailed();


    //Event to emit when memo is created
    event NewMemo( address indexed from,
        uint256 timeStamp,
        string name,
        string message);

    //Memo Struct
    struct Memo{
        address from;
        uint256 timeStamp;
        string name;
        string message;
    }

    //list of memos
    Memo[] memos;

    // Address  of contract  deployer
    address payable owner;

    constructor() {
        owner = payable(msg.sender);
    }

    /**
     * @dev buy me a coffee contract owner
     * @param _name name of coffee buyer
     * @param _message message from coffee buyer to deployer
     */
    function buyCoffee(string memory _name, string memory _message) public payable{
        require(msg.value > 0, "can't buy coffee with 0 eth");

        //add memo to storage
        memos.push(Memo(msg.sender, block.timestamp, _name, _message));

        //emit log event when memo is created
        emit NewMemo(msg.sender, block.timestamp, _name, _message);
    }

    /**
     * @dev withdraw to tips to deployer
     */
    function withdrawTips() public {
        require(msg.sender == owner, "You are not the owner");
        payable(owner).transfer(address(this).balance);
    }

    /**
     * @dev get and show memo on blockchain
     */
    function getMemo() public view returns(Memo[] memory){
        return memos;
    }
}