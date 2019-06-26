// ==UserScript==
// @name         bx: price coloring
// @author       Krittanon.w
// @match        https://bx.in.th/THB/*
// ==/UserScript==

(function() {
    // config
    var autoStyleListVolume = 400000; // more than 0 is auto level coloring
    var styleList = [
        {volume: 400000, color: "#CA92EC"},
        {volume: 200000, color: "#5C9DED"},
        {volume: 100000, color: "#ED5564"},
        {volume: 50000, color: "#F87F52"},
        {volume: 25000, color: "#FCCE54"},
    ];
    var intervalTime = 100 // // refresh interval time in ms

    if(autoStyleListVolume > 0) {
        let count = 0;
        for(let style of styleList){
            style.volume = autoStyleListVolume/(Math.pow(2,count++));
        }
    }

    // remove short table
    $('.tradetbls div.panel-content').each(function(){
        $(this).css("height", "1200px");
    });

    // remove scrollbar
    $('.scrollbar').each(function(){
        $(this).perfectScrollbar('destroy');
    });

    // scan tables
    setInterval(function(){
        let tables = $('.tradetbls .span4 table').toArray();
        for(let [tableIndex, table] of tables.entries()){
            // only sell and buy table
            if(tableIndex !== 0){
                const rows = $(table).children("tbody").children("tr").toArray();
                for(let [rowIndex, row] of rows.entries()){
                    // filter only text
                    // "12,000 THB 12 1,000 coin" -> "12000 THB 12 1000 coin" -> [12000, THB, 12, 1000, coin]
                    let text = row.outerText.replace(/,/g, '').split(/\t|\s/);

                    // voulme = rate * coin
                    let rate = text[text.length-3];
                    let coin = text[text.length-2];
                    let volume = parseFloat(rate * coin);

                    for(let [styleIndex, style] of styleList.entries()){
                        if(volume >= style.volume){
                            let cols = $(row).children("td").toArray();
                            for(let [colIndex, col] of cols.entries()){
                                $(col).attr("style",`background-color: ${style.color} !important`);
                            };
                            break;
                        }
                    }
                }
            }
        }
    }, intervalTime);
})()
