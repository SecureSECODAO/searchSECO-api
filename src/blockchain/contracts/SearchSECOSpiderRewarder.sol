// SPDX-License-Identifier: MIT
/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

pragma solidity ^0.8.9;

import "./SignatureHelper.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

/// @title A contract reward SearchSECO Spider users for submitting new hashes
/// @author M WU
/// @notice This contract is used to reward users for submitting new hashes
contract SearchSECOSpiderRewarder is SignatureHelper, Ownable {
    /// @notice The number of hashes a user has submitted
    mapping(address => uint) public hashCount;

    /// @notice Rewards the user for submitting new hashes
    /// @param _toReward The address of the user to reward
    /// @param _hashCount The number of new hashes the user has submitted
    /// @param _nonce A nonce
    /// @param _proof The proof that the user received from the server
    function reward(
        address _toReward,
        uint _hashCount,
        uint _nonce,
        bytes calldata _proof
    ) public {
        // Validate the given proof
        require(
            verify(owner(), _toReward, _hashCount, _nonce, _proof),
            "Proof is not valid"
        );

        // Make sure that the hashCount is equal
        require(
            hashCount[_toReward] == _nonce,
            "Hash count does not match with nonce"
        );

        hashCount[_toReward] += _hashCount;

        // TODO: Reward the user
        // ...
    }
}
