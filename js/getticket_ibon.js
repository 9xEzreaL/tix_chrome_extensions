

$(()=>{
    window.alert = function() { console.log('Alert blocked.'); };

    function compareTime(){
    // start time
        chrome.storage.local.get([
        "tixcraft_date",
        "tixcraft_time",
        ],(result) => {
        var date1 = result.tixcraft_date + "T" + result.tixcraft_time;
        const endDate = new Date(date1);
        const startDate = new Date()
        let difference = endDate.getTime() - startDate.getTime();
        async function exampleFunction() {
            console.log('Code before sleep');
            await sleep(difference);
            console.log('Code after sleep');
        }

        exampleFunction();
        console.log(`The timeout is set for ${difference} milliseconds.`);
    })}

    // 1 step -> 定時功能
    compareTime()

    if (window.location.href.indexOf("/ActivityInfo/Details/")>0){
    // 2 step -> 進入立即購票選日期
        chrome.storage.local.get([
        "tixcraft_date_index", // index
        "tixcraft_date", // 啟動日期
        "tixcraft_time", // 啟動時間
        ],(result) => {})
    }


})