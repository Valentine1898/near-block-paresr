const near = require('near-api-js');
const fs = require('fs');

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

// Підключення до архівної ноди
    const provider = new near.providers.JsonRpcProvider(nearConfig.archiveNodeUrl);

// Отримання висоти останнього блоку
    const status = await provider.status();

    console.log(status)
    const lastBlockHeight = status.sync_info.latest_block_height;


    var epoch = undefined;
    for (let i = lastBlockHeight; i > 0; i -= 1) {

        try {
            const block = await provider.block({blockId: i});
            console.log(block.header.height);

            if (epoch !== undefined && epoch !== block.header.epoch_id) {
                console.log("Found epoch blocks")
                const blockJson = JSON.stringify(block);
                fs.writeFileSync(`blocks/block-${block.header.height}-last-${block.header.epoch_id}.json`, blockJson);

                const nextBlock = await provider.block({blockId: i + 1});
                const nextBlockJson = JSON.stringify(nextBlock);
                fs.writeFileSync(`blocks/block-${nextBlock.header.height}-first-${nextBlock.header.epoch_id}.json`, nextBlockJson);

                i = i - 43000;
            }
            epoch = block.header.epoch_id;
        } catch (e) {
            console.error(e);
        }


    }
}

main();
