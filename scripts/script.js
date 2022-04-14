window.onload = () => {
  let tr = $("#insertContent");
  tr.hide();

  loadStuff(1);
  tr.each(function (index) {
    $(this)
      .delay(index * 500)
      .show(1000);
  });
};

function changeView(type) {
  let Table = document.getElementById("insertContent");
  Table.innerHTML = "";

  let dateTh = document.getElementById("dateTh");
  let timeTh = document.getElementById("timeTh");

  let changerArr = document.getElementById("changerArr");
  let changerDep = document.getElementById("changeDep");
  if (type === "prilety") {
    loadStuff(1);
    if (changerArr.className !== "active") {
      changerArr.classList.add("active");
      changerDep.classList.remove("active");
    } else {
      changerArr.classList.remove("active");
    }
    dateTh.innerHTML = "Datum Příletu";
    timeTh.innerHTML = "Čas Příletu";
  } else {
    if (changerDep.className !== "active") {
      changerArr.classList.remove("active");
      changerDep.classList.add("active");
    } else {
      changerDep.classList.remove("active");
    }
    loadStuff(0);
    dateTh.innerHTML = "Datum Odletu";
    timeTh.innerHTML = "Čas Odletu";
  }
}

/*
window.onresize = () => {
  let height = window.innerHeight - 74;
  let content = document.getElementById("toResize");

  content.style.height = height;
};
*/

function loadStuff(type) {
  let time = new Date();
  let minutes = time.getMinutes();
  if (minutes < 10) {
    minutes = "0" + `${minutes}`;
  }

  let dateString = `${time.getDate()}-${
    time.getMonth() + 1
  }-${time.getFullYear()}_${time.getHours()}-${minutes}`;

  for (let j = 1; j < 5; j++) {
    let arrivals = loadArrivals(dateString, j * 10, type);

    for (let i = 0; i < arrivals.length; i++) {
      let actualdate = new Date(arrivals[i]["time"]);
      let minutes = actualdate.getMinutes();

      if (minutes < 10) {
        minutes = "0" + `${minutes}`;
      }

      let time = `${actualdate.getHours()}:${minutes}`;
      let date = `${actualdate.getDate()}.${actualdate.getMonth() + 1}.`;

      let state = arrivals[i]["state"].split(" ");
      if (state[1] === undefined) {
        state[1] = "-";
      }
      let items = [
        {
          date: date,
          time: time,
          stateTime: state[1],
          state: state[0],
          destination: arrivals[i]["destination"],
          flynumber: arrivals[i]["flyNumber"],
        },
      ];
      const table = document.getElementById("insertContent");
      items.forEach((item) => {
        let row = table.insertRow();
        let date = row.insertCell(0);
        date.innerHTML = item.date;
        let time = row.insertCell(1);
        time.innerHTML = item.time;
        let state = row.insertCell(2);
        state.innerHTML = item.state;
        let stateTime = row.insertCell(3);
        stateTime.innerHTML = item.stateTime;
        let destination = row.insertCell(4);
        destination.innerHTML = item.destination;
        let flynumber = row.insertCell(5);
        flynumber.innerHTML = item.flynumber;
      });
    }
  }
}

function loadArrivals(dateString, offset, type) {
  if (type === 1) {
    type = "arrivals";
  } else {
    type = "departures";
  }
  let xmlHttp = new XMLHttpRequest();
  xmlHttp.open(
    "GET",
    `https://api.prg.aero/${type}?offset=${offset}&limit=10&from=${dateString}`,
    false
  ); // false for synchronous request
  xmlHttp.send(null);
  return JSON.parse(xmlHttp.response);
}
