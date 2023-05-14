export const abi = [
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "previousOwner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "OwnershipTransferred",
        type: "event",
    },
    {
        inputs: [],
        name: "UPDATE_HASH_REWARD_PERMISSION_ID",
        outputs: [
            {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "bytes32",
                name: "_messageHash",
                type: "bytes32",
            },
        ],
        name: "getEthSignedMessageHash",
        outputs: [
            {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
            },
        ],
        stateMutability: "pure",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_user",
                type: "address",
            },
        ],
        name: "getHashCount",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getHashReward",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_toReward",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "_hashCount",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "_nonce",
                type: "uint256",
            },
        ],
        name: "getMessageHash",
        outputs: [
            {
                internalType: "bytes32",
                name: "",
                type: "bytes32",
            },
        ],
        stateMutability: "pure",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_toReward",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "_hashCount",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "_nonce",
                type: "uint256",
            },
        ],
        name: "getPackedMessage",
        outputs: [
            {
                internalType: "bytes",
                name: "",
                type: "bytes",
            },
        ],
        stateMutability: "pure",
        type: "function",
    },
    {
        inputs: [],
        name: "owner",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "bytes32",
                name: "_ethSignedMessageHash",
                type: "bytes32",
            },
            {
                internalType: "bytes",
                name: "_signature",
                type: "bytes",
            },
        ],
        name: "recoverSigner",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "pure",
        type: "function",
    },
    {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_toReward",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "_hashCount",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "_nonce",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "_repFrac",
                type: "uint256",
            },
            {
                internalType: "bytes",
                name: "_proof",
                type: "bytes",
            },
        ],
        name: "reward",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "_hashReward",
                type: "uint256",
            },
        ],
        name: "setHashReward",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "bytes",
                name: "sig",
                type: "bytes",
            },
        ],
        name: "splitSignature",
        outputs: [
            {
                internalType: "bytes32",
                name: "r",
                type: "bytes32",
            },
            {
                internalType: "bytes32",
                name: "s",
                type: "bytes32",
            },
            {
                internalType: "uint8",
                name: "v",
                type: "uint8",
            },
        ],
        stateMutability: "pure",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_signer",
                type: "address",
            },
            {
                internalType: "address",
                name: "_toReward",
                type: "address",
            },
            {
                internalType: "uint256",
                name: "_hashCount",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "_nonce",
                type: "uint256",
            },
            {
                internalType: "bytes",
                name: "signature",
                type: "bytes",
            },
        ],
        name: "verify",
        outputs: [
            {
                internalType: "bool",
                name: "",
                type: "bool",
            },
        ],
        stateMutability: "pure",
        type: "function",
    },
];
