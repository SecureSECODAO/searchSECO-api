export const abi = [
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "sender",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "string",
                name: "uniqueId",
                type: "string",
            },
        ],
        name: "PaymentProcessed",
        type: "event",
    },
    {
        inputs: [],
        name: "UPDATE_HASH_COST_MAPPING_PERMISSION_ID",
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
        inputs: [],
        name: "getHashCost",
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
        name: "giveMoneyz",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "_amount",
                type: "uint256",
            },
            {
                internalType: "string",
                name: "_uniqueId",
                type: "string",
            },
        ],
        name: "payForHashes",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "_newCost",
                type: "uint256",
            },
        ],
        name: "updateHashCost",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
];
