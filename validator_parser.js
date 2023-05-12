const near = require('near-api-js');
const fs = require('fs');
const {BlockHeight} = require("@near-js/types/lib/provider/protocol");

// Параметри з'єднання з архівною нодою
const nearConfig = {
    networkId: 'mainnet',
    nodeUrl: 'https://archival-rpc.mainnet.near.org',
    archiveNodeUrl: 'https://archival-rpc.mainnet.near.org',
    deps: {
        keyStore: new near.keyStores.InMemoryKeyStore(),
    },
};

async function main() {

    const provider = new near.providers.JsonRpcProvider(nearConfig.archiveNodeUrl);


    const blocksFolder = './blocks';
    const fs = require('fs');

    fs.readdir(blocksFolder, async (err, files) => {
        for (const file of files) {
            console.log(file);

            if (file === ".DS_Store")
                continue
            let validators = file.split("-")[0];
            if (validators === "validators")
                continue;
            let block = file.split("-")[2];
            let blockID = file.split("-")[1];
            let epochId = file.split("-")[3].replace(".json", "");

            console.log(epochId)

            if (block === "first" ) {
                try {

                    var myHeaders = new Headers();
                    myHeaders.append("Content-Type", "application/json");

                    var raw = JSON.stringify({
                        "jsonrpc": "2.0",
                        "id": "dontcare",
                        "method": "validators",
                        "params": [
                            epochId
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
                        .then(result =>  {
                            console.log(result);
                            fs.writeFileSync(`validators/validators-${epochId}.json`, result);

                        })
                        .catch(error => console.log('error', error));

                } catch (e) {
                    console.error(e)
                }
            }

        }
    });
}

main();
