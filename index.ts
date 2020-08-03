const https = require('https');
const fs = require('fs');

updateAllDydxAprs();
setInterval(updateAllDydxAprs, 86400 * 1000);

async function updateAllDydxAprs() {
    var epochNow = Math.floor((new Date()).getTime() / 1000);
    var epochOneYearAgo = epochNow - (86400 * 365);

    var dydxAprs = {};
    
    for (const currencyCode of ["DAI", "USDC"]) {
        try {
            var decoded = await getDydxAprs(currencyCode, epochOneYearAgo.toFixed(), epochNow.toFixed());
        } catch (err) {
            return console.error("Failed to get dYdX APRs for", currencyCode, ":", err);
        }

        for (var i = 0; i < decoded.length; i++) {
            var epoch = Date.parse(decoded[i].date);
            if (!dydxAprs[epoch]) dydxAprs[epoch] = {};
            dydxAprs[epoch][currencyCode] = decoded[i].value;
        }
    }

    fs.writeFile(process.env.DYDX_APRS_SAVE_PATH, JSON.stringify(dydxAprs), function(error) {
        if (error) return console.error("Failed to write dYdX APRs to file:", error);
        console.log("Successfully saved dYdX APRs to file");
    });
}

function getDydxAprs(currencyCode, startEpoch, endEpoch): Promise<any> {
    return new Promise((resolve, reject) => {
        https.get({
            host: 'api.loanscan.io',
            path: '/v1/interest-rates/historical?provider=dYdX&interestRateDomain=Supply&tokenSymbol=' + currencyCode + '&intervalType=day&startDateTimestamp=' + startEpoch + '&endDateTimestamp=' + endEpoch,
            headers: {
                'x-api-key': process.env.LOANSCAN_API_KEY
            }
        }, (resp) => {
            let data = '';

            // A chunk of data has been recieved
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received
            resp.on('end', () => {
                var decoded = JSON.parse(data);
                if (!decoded) return console.error("Failed to decode response from LoanScan");
                if (!Array.isArray(decoded)) return console.error("Invalid response from LoanScan:", decoded);
                resolve(decoded);
            });
        }).on("error", (err) => {
            reject("Error requesting data from LoanScan: " + err.message);
        });
    });
}
