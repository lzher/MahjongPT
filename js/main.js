function initPoints() {
    if(!('mjpoints' in localStorage)) {
        localStorage['mjpoints'] = JSON.stringify({
            "points": [25000, 25000, 25000, 25000],
            "players": ["玩家A", "玩家B", "玩家C", "玩家D"],
            "history": [[], [], [], []]
        });
    }

    updateView();

    quick_points = [300, 400, 500, 700, 800, 1000, 1300,
                    1500, 1600, 2000, 2400, 2600, 2900,
                    3200, 3900, 4000, 4800, 5200, 5800,
                    6400, 7700, 8000, 9600, 11600, 12000,
                    16000, 18000, 24000, 32000, 36000, 48000,
                    "+100"]
    for (i in quick_points) {
        point = quick_points[i];
        if (i % 4 == 0) {
            $("#quick_points").append(`<div class="row"><div class="col-md-12 btn-group" role="group"></div></div>`)
        }
        if (point == "+100") {
            quick_point_html = `<button type="button" class="btn btn-outline-primary" onclick="addPayPoints(100)">` + point + `</button>`;
        } else {
            quick_point_html = `<button type="button" class="btn btn-outline-secondary" onclick="setPayPoints(` + point + `)">` + point + `</button>`;
        }

        $("#quick_points div.row:last-child .btn-group").append(quick_point_html);
    }
}

function setPlayers() {
    data = JSON.parse(localStorage['mjpoints']);
    players = [$("#player1").val(), $("#player2").val(), $("#player3").val(), $("#player4").val()];
    data["players"] = players;
    localStorage['mjpoints'] = JSON.stringify(data);
    updateView();
}

function setPoints() {
    points = [$("#points1").val(), $("#points2").val(), $("#points3").val(), $("#points4").val()];
    if (confirm("确定要设置点棒数为 " + points + " 吗？")) {
        data = JSON.parse(localStorage['mjpoints']);
        data["points"] = points;
        localStorage['mjpoints'] = JSON.stringify(data);
        updateView();
    }
}

function resetPoints() {
    if (confirm("确定要重置点棒吗？")) {
        data = JSON.parse(localStorage['mjpoints']);
        points = [25000, 25000, 25000, 25000];
        data["points"] = points;
        localStorage['mjpoints'] = JSON.stringify(data);
        updateView();
    }
}

function payPoints() {
    data = JSON.parse(localStorage['mjpoints']);
    payer = parseInt($("input[name='payer']:checked").val()) - 1;
    receiver = parseInt($("input[name='receiver']:checked").val()) - 1;
    value = parseInt($("#pay_points").val())

    if (confirm(data["players"][payer] + " 向 " + data["players"][receiver] + " 支付 " + value + " 点？")) {
        data["points"][payer] -= value;
        data["points"][receiver] += value;

        localStorage['mjpoints'] = JSON.stringify(data);
        updateView();
    }
}

function recordHistory() {
    if (confirm("确定要记录历史 " + data["points"] + " 吗？")) {
        data = JSON.parse(localStorage['mjpoints']);
        for (i = 0; i < data["points"].length; ++i) {
            data["history"][i].push(data["points"][i]);
        }
        localStorage['mjpoints'] = JSON.stringify(data);
        updateView();
    }
}

function clearHistory() {
    if (confirm("确定要清空历史吗？")) {
        data = JSON.parse(localStorage['mjpoints']);
        data["history"] = [[], [], [], []];
        localStorage['mjpoints'] = JSON.stringify(data);
        updateView();
    }
}

function setPayPoints(point) {
    $("#pay_points").val(point);
}

function addPayPoints(point) {
    value = parseInt($("#pay_points").val());
    $("#pay_points").val(value + point);
}

function calcPt() {
    data = JSON.parse(localStorage['mjpoints']);
    results = data["history"];
    pt = [0.0, 0.0, 0.0, 0.0];
    matches = results[0].length;
    players = results.length;
    for (i = 0; i < matches; ++i) {
        for (j = 0; j < players; ++j) {
            rank = 0;
            match_points = results[j][i];
            for (k = 0; k < players; ++k) {
                if (j != k && match_points < results[k][i]) {
                    ++rank;
                }
            }
            match_points -= 30000;
            match_points /= 1000.0;
            pt[j] += match_points;
            if (rank == 0) {
                pt[j] += 50;
            } else if (rank == 1) {
                pt[j] += 10;
            } else if (rank == 2) {
                pt[j] += -10;
            } else if (rank == 3) {
                pt[j] += -30;
            } 
        }
    }
    pt_text = "pt计算结果：\n";
    for (i = 0; i < players; ++i) {
        pt_text += data["players"][i].padEnd(8, ' ') + ": ";
        pt_text += pt[i].toFixed(1);
        pt_text += "\n";
    }
    $("#show_pt").text(pt_text);
}

function updateView() {
    data = JSON.parse(localStorage['mjpoints']);
    for (i = 0; i < data["players"].length; ++i) {
        $("#player" + (i+1)).val(data["players"][i]);
        $("#payerlabel" + (i+1)).text(data["players"][i]);
        $("#receiverlabel" + (i+1)).text(data["players"][i]);
    }
    for (i = 0; i < data["points"].length; ++i) {
        $("#points" + (i+1)).val(data["points"][i]);
    }

    history_text = "";
    for (i = 0; i < data["history"].length; ++i) {
        history_text += data["players"][i].padEnd(8, ' ') + ": ";
        for (j = 0; j < data["history"][i].length; ++j) {
            history_text += data["history"][i][j].toString().padStart(8, ' ');
        }
        history_text += "\n";
    }
    $("#show_history").text(history_text);
}
