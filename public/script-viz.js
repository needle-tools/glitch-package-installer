google.charts.load('current', {packages: ['corechart', 'bar']});
google.charts.setOnLoadCallback(drawDualY);

function fetchAndDraw() {
	fetch("https://package-installer.glitch.me//public/stats/098f6bcd4621d373cade4e832627b4f6")
  .then(data => data.json())
  .then(data => {
    drawDualY(data.downloads);
    drawText(data.downloads);
  });
}

fetchAndDraw();

function drawDualY(jsonData) {
      var data = new google.visualization.DataTable();
      data.addColumn('string', 'Package');
      data.addColumn('number', 'Downloads');
      

			var arr = new Array();
      let i = 0;
      let totalDownloads = 0;
      for(let key in jsonData) {
        let dl = jsonData[key].downloads;
      	arr.push([key, dl]);
        totalDownloads += dl;
      }

			console.log(arr);
      
      data.addRows(arr);

      var options = {
        chart: {
          title: 'Package Downloads via Installer',
          subtitle: 'via https://package-installer.glitch.me/ – Download Count: ' + totalDownloads,
        },
        series: {
          0: {axis: 'MotivationLevel'},
        },
        axes: {
          y: {
            MotivationLevel: {label: 'Downloads'},
          }
        },
         hAxis: {title: "Packages" , slantedText:true, slantedTextAngle:90 },
      };

      var materialChart = new google.charts.Bar(document.getElementById('chart_div'));
      materialChart.draw(data, options);
    }

function drawText(jsonData) {
  let elem = document.getElementById('chart_text');
  
    var arr = new Array();
    let i = 0;
    for(let key in jsonData) {
      arr.push({key: key, downloads: jsonData[key].downloads});
    }
  
  arr.sort((a,b) => a.downloads < b.downloads ? 1 : -1);
  
  let list = document.createElement('ol');
  for(let key in arr) {
    
    let newElem = document.createElement('li');
    newElem.appendChild(document.createTextNode(arr[key].key + ": " + arr[key].downloads));
    list.appendChild(newElem);
  }
  elem.appendChild(list);
}