const near = require('near-api-js');
const fs = require('fs');

const nearConfig = {
    networkId: 'mainnet',
    nodeUrl: 'https://archival-rpc.mainnet.near.org',
    archiveNodeUrl: 'https://archival-rpc.mainnet.near.org',
    deps: {
        keyStore: new near.keyStores.InMemoryKeyStore(),
    },
};

function getRandomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

async function getValidators(hash, path) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "jsonrpc": "2.0",
        "id": "dontcare",
        "method": "EXPERIMENTAL_validators_ordered",
        "params": [
            hash
        ]
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("https://archival-rpc.mainnet.near.org", requestOptions)
        .then(response => response.text())
        .then(result => {

            fs.writeFileSync(`${path}/validators.json`, result);

        })
        .catch(error => console.log('error', error));
}



async function main() {

    const provider = new near.providers.JsonRpcProvider(nearConfig.archiveNodeUrl);


    let epochName = "i"
    let firstEpochBlock = 121708308;
    let lastEpochBlock = 121751507;

    const block0 = await provider.block({blockId: firstEpochBlock});
    fs.writeFileSync(`epochs/${epochName}/block-0-${block0.header.height}.json`, JSON.stringify(block0));

    const block1 = await provider.block({blockId: firstEpochBlock + 1});
    fs.writeFileSync(`epochs/${epochName}/block-1-${block1.header.height}.json`, JSON.stringify(block1));

    const block2 = await provider.block({blockId: firstEpochBlock + 2});
    fs.writeFileSync(`epochs/${epochName}/block-2-${block2.header.height}.json`, JSON.stringify(block2));

    const block3 = await provider.block({blockId: firstEpochBlock + 3});
    fs.writeFileSync(`epochs/${epochName}/block-3-${block3.header.height}.json`, JSON.stringify(block3));

    const block4 = await provider.block({blockId: firstEpochBlock + 4});
    fs.writeFileSync(`epochs/${epochName}/block-4-${block4.header.height}.json`, JSON.stringify(block4));

    const lastBlock = await provider.block({blockId: lastEpochBlock});
    fs.writeFileSync(`epochs/${epochName}/block-last-${lastBlock.header.height}.json`, JSON.stringify(lastBlock));


    await getValidators(block4.header.hash,`epochs/${epochName}`)

    let randomHeight = getRandomBetween(firstEpochBlock+5, lastEpochBlock -2);
    const random0 = await provider.block({blockId: randomHeight});
    fs.writeFileSync(`epochs/${epochName}/random-0-${random0.header.height}.json`, JSON.stringify(random0));

    const random1 = await provider.block({blockId: randomHeight + 1});
    fs.writeFileeSync(`epochs/${epochName}/random-1-${random1.header.height}.json`, JSON.stringify(random1));

    const random2 = await provider.block({blockId: randomHeight + 2});
    fs.writeFileSync(`epochs/${epochName}/random-2-${random2.header.height}.json`, JSON.stringify(random2));

    const random3 = await provider.block({blockId: randomHeight + 3});
    fs.writeFileSync(`epochs/${epochName}/random-3-${random3.header.height}.json`, JSON.stringify(random3));

    const random4 = await provider.block({blockId: randomHeight + 4});
    fs.writeFileSync(`epochs/${epochName}/random-4-${random4.header.height}.json`, JSON.stringify(random4));
}


main();
