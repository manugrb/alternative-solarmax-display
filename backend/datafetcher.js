function getRawInverterData(){
    return fetch("http://192.168.179.95/shared/energycontrolfunctions.php", {
        "credentials": "include",
        "headers": {
                "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:142.0) Gecko/20100101 Firefox/142.0",
                "Accept": "*/*",
                "Accept-Language": "en-US,en;q=0.5",
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "X-Requested-With": "XMLHttpRequest"
        },
        "referrer": "http://192.168.179.95/home.php",
        "body": "getFullSwarmLiveDataJSON=true",
        "method": "POST",
        "mode": "cors"
    })
    .then(res => res.json())
    .then(body => {return body});
}

exports.getRawInverterData = getRawInverterData;

function getRawHistoricInverterData(){
        return fetch("http://192.168.179.95/shared/energycontrolfunctions.php", {
        "credentials": "include",
        "headers": {
                "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:142.0) Gecko/20100101 Firefox/142.0",
                "Accept": "*/*",
                "Accept-Language": "en-US,en;q=0.5",
                "Content-Type": "application/x-www-form-urlencoded",
                "Priority": "u=4"
         },
        "referrer": "http://192.168.179.95/energy_history.php",
        "body": "getHistoryData=2025-09-09",
         "method": "POST",
        "mode": "cors"
        });
}

exports.getRawHistoricInverterData = getRawHistoricInverterData;
