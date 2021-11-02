//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.6;

contract TestDecoder {
    function decodeSignedInt256(bytes calldata data)
        public
        pure
        returns (int256 decodedData)
    {
        decodedData = abi.decode(data, (int256));
    }

    function decodeUnsignedInt256(bytes calldata data)
        public
        pure
        returns (uint256 decodedData)
    {
        decodedData = abi.decode(data, (uint256));
    }

    function decodeBool(bytes calldata data)
        public
        pure
        returns (bool decodedData)
    {
        decodedData = abi.decode(data, (bool));
    }

    function decodeBytes32(bytes calldata data)
        public
        pure
        returns (bytes32 decodedData)
    {
        decodedData = abi.decode(data, (bytes32));
    }

    function decodeAddress(bytes calldata data)
        public
        pure
        returns (address decodedData)
    {
        decodedData = abi.decode(data, (address));
    }

    function decodeBytes(bytes calldata data)
        public
        pure
        returns (bytes memory decodedData)
    {
        decodedData = abi.decode(data, (bytes));
    }

    function decodeString(bytes calldata data)
        public
        pure
        returns (string memory decodedData)
    {
        decodedData = abi.decode(data, (string));
    }
}
